/**
 * GOOGLE APPS SCRIPT - HỆ THỐNG NHẬN ĐƠN HÀNG TỰ ĐỘNG CHO HUGZ
 * 
 * Hướng dẫn cài đặt:
 * 1. Mở file Google Sheets (Trang tính) bạn muốn lưu đơn hàng.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa hết mã cũ trong file Mã.gs (Code.gs) và dán toàn bộ đoạn mã dưới đây vào.
 * 4. Bấm biểu tượng Đĩa mềm (Lưu / Save - Ctrl+S).
 * 5. Bấm nút xanh "Triển khai" (Deploy) ở góc trên bên phải -> chọn "Triển khai mới" (New deployment).
 *    - Chọn loại: Ứng dụng web (Web app).
 *    - Mô tả: Nhận đơn hàng Hugz
 *    - Thực thi dưới tên (Execute as): "Tôi" (Me - levihien823@gmail.com)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone) -> RẤT QUAN TRỌNG!
 * 6. Bấm "Triển khai" (Deploy).
 *    - Nếu Google hiện popup "Cần có quyền" (Authorization required) -> Bấm "Xem lại quyền"
 *    - Chọn tài khoản Google của bạn -> Bấm "Nâng cao" (Advanced) ở góc dưới
 *    - Bấm "Đi tới... (không an toàn)" -> Bấm "Cho phép" (Allow).
 * 7. Copy đường link "URL của ứng dụng web" (kết thúc bằng /exec) gửi lại cho mình nhé!
 */

function doGet(e) {
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();
    var data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        count: 0,
        orders: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var orders = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      if (!row[0]) continue;
      
      var rawStatus = String(row[16] || "").toLowerCase();
      var mappedStatus = "pending_confirmation";
      if (rawStatus.includes("hủy") || rawStatus.includes("cancel")) {
        mappedStatus = "cancelled";
      } else if (rawStatus.includes("hoàn tất") || rawStatus.includes("thành công") || rawStatus.includes("completed")) {
        mappedStatus = "completed";
      } else if (rawStatus.includes("đang giao") || rawStatus.includes("shipping")) {
        mappedStatus = "shipping";
      } else if (rawStatus.includes("đã xác nhận") || rawStatus.includes("confirmed")) {
        mappedStatus = "confirmed";
      }

      var rawTotal = String(row[14] || "").replace(/[^0-9]/g, "");
      var totalNum = parseInt(rawTotal, 10) || 0;

      orders.push({
        orderId: String(row[0]),
        createdAt: String(row[1]),
        customer: {
          fullName: String(row[2] || ""),
          phone: String(row[3] || "").replace(/^'/, ""),
          contactMethod: String(row[4] || ""),
          contactTime: String(row[5] || ""),
          address: String(row[6] || ""),
          province: String(row[7] || ""),
          paymentMethod: String(row[8] || "").toLowerCase().includes("chuyển khoản") || String(row[8] || "").toLowerCase().includes("vietqr") ? "banking" : "cod",
          note: String(row[15] || "")
        },
        items: [
          {
            product: {
              id: "item-" + i,
              title: String(row[9] || "Sản phẩm đặt mua"),
              price: totalNum,
              image: "/images/products/hugz-mini-pouch.jpg",
              category: "Đơn hàng Web"
            },
            quantity: parseInt(row[10], 10) || 1
          }
        ],
        subtotal: totalNum,
        discount: 0,
        shippingFee: 0,
        grandTotal: totalNum,
        status: mappedStatus
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      count: orders.length,
      orders: orders.reverse() // Đơn mới nhất lên đầu
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Đợi tối đa 10 giây nếu nhiều người cùng bấm đặt hàng
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // 1. Kiểm tra và tự động tạo dòng Tiêu đề nếu trang tính chưa có
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Mã Đơn Hàng",
        "Thời Gian Đặt",
        "Họ Và Tên",
        "Số Điện Thoại",
        "Kênh Liên Hệ",
        "Khung Giờ Liên Hệ",
        "Địa Chỉ Giao Hàng",
        "Tỉnh / Thành Phố",
        "Hình Thức Thanh Toán",
        "Danh Sách Sản Phẩm",
        "Số Lượng Món",
        "Tạm Tính",
        "Giảm Giá (Voucher)",
        "Phí Vận Chuyển",
        "Tổng Thanh Toán",
        "Ghi Chú Khách Hàng",
        "Trạng Thái"
      ];
      sheet.appendRow(headers);

      // Định dạng dòng tiêu đề: In đậm, nền màu be sang trọng, cố định dòng
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F3EDE2");
      headerRange.setFontColor("#201B12");
      sheet.setFrozenRows(1);
    }

    // 2. Phân tích dữ liệu JSON gửi từ website
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // 3. Xử lý yêu cầu HỦY ĐƠN HÀNG (Nếu khách hủy đơn từ website)
    if (data.action === "CANCEL_ORDER" || data.isCancel) {
      var values = sheet.getDataRange().getValues();
      var foundRowIndex = -1;

      // Tìm dòng có Mã Đơn Hàng tương ứng (cột A, index 0)
      for (var r = 1; r < values.length; r++) {
        if (values[r][0] && values[r][0].toString().trim() === data.orderId.toString().trim()) {
          foundRowIndex = r + 1; // 1-based index trong Google Sheets
          break;
        }
      }

      if (foundRowIndex > 0) {
        // Cập nhật trạng thái tại cột 17 (Trạng Thái)
        var statusCell = sheet.getRange(foundRowIndex, 17);
        statusCell.setValue("❌ ĐÃ HỦY ĐƠN (" + (data.cancelReason || "Khách tự hủy") + ")");
        statusCell.setBackground("#FEE2E2");
        statusCell.setFontColor("#991B1B");

        // Cập nhật ghi chú tại cột 16 (Ghi Chú)
        var noteCell = sheet.getRange(foundRowIndex, 16);
        var oldNote = noteCell.getValue() || "";
        noteCell.setValue(oldNote + (oldNote ? " | " : "") + "[HỦY ĐƠN LÚC " + (data.cancelledAt || new Date().toLocaleString("vi-VN")) + "]: " + (data.cancelReason || "Khách bấm hủy"));

        return ContentService.createTextOutput(JSON.stringify({
          result: "success",
          orderId: data.orderId,
          message: "Đã cập nhật trạng thái hủy đơn thành công trên Google Sheet!"
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        // Nếu không tìm thấy dòng đơn cũ, thêm 1 dòng thông báo hủy mới
        sheet.appendRow([
          data.orderId,
          data.cancelledAt || new Date().toLocaleString("vi-VN"),
          data.fullName || "",
          "'" + (data.phone || ""),
          "Website",
          "-",
          data.fullAddress || data.address || "",
          data.province || "",
          "-",
          "YÊU CẦU HỦY ĐƠN TỪ WEB",
          0,
          "-",
          "-",
          "-",
          data.grandTotal || "",
          "Lý do hủy: " + (data.cancelReason || "Khách tự hủy trên web"),
          "❌ ĐÃ HỦY ĐƠN"
        ]);
        var lastRow = sheet.getLastRow();
        var cancelRange = sheet.getRange(lastRow, 1, 1, 17);
        cancelRange.setBackground("#FEF2F2");

        return ContentService.createTextOutput(JSON.stringify({
          result: "success",
          orderId: data.orderId,
          message: "Đã ghi nhận yêu cầu hủy đơn mới vào Google Sheet!"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 4. Chuẩn bị dòng dữ liệu ghi vào Google Sheets khi có ĐƠN HÀNG MỚI
    var rowData = [
      data.orderId || "CHƯA CÓ MÃ",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.fullName || "",
      "'" + (data.phone || ""), // Thêm dấu ' để Excel/Sheet không làm mất số 0 đầu số điện thoại
      data.contactMethod || "Nhắn tin qua SMS",
      data.contactTime || "Bất kỳ lúc nào",
      data.fullAddress || data.address || "",
      data.province || "",
      data.paymentMethod || "COD",
      data.itemsText || "",
      data.totalItems || 1,
      data.subtotal || "",
      data.discount || "0 ₫",
      data.shippingFee || "Miễn phí",
      data.grandTotal || "",
      data.note || "",
      data.status || "Chờ liên hệ xác nhận"
    ];

    sheet.appendRow(rowData);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      orderId: data.orderId,
      message: "Đơn hàng đã được lưu thành công vào Google Sheet!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
