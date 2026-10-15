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
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "HUGZ Webhook is active and ready to receive orders!"
  })).setMimeType(ContentService.MimeType.JSON);
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

    // 3. Chuẩn bị dòng dữ liệu ghi vào Google Sheets
    var rowData = [
      data.orderId || "CHƯA CÓ MÃ",
      data.createdAt || new Date().toLocaleString("vi-VN"),
      data.fullName || "",
      "'" + (data.phone || ""), // Thêm dấu ' để Excel/Sheet không làm mất số 0 đầu số điện thoại
      data.contactMethod || "Nhắn tin qua Zalo",
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
