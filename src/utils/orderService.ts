import { PlacedOrder } from '../types';

// Webhook URL mặc định hoặc từ biến môi trường / localStorage
const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL = 
  metaEnv?.VITE_GOOGLE_SHEET_WEBHOOK_URL || 
  'https://script.google.com/macros/s/AKfycbwsm6wqesfl_n0QaZEAh8Xzmmeve4Ja7xZxbGO-F91U4rtd-OChhLPOvbkZiaYbrnXJ/exec';

export const getStoredWebhookUrl = (): string => {
  if (typeof window === 'undefined') return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
  return localStorage.getItem('hugz_google_sheet_webhook') || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
};

export const setStoredWebhookUrl = (url: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('hugz_google_sheet_webhook', url.trim());
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const formatVietnamTime = (isoString: string): string => {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return isoString;
  }
};

/**
 * Gửi dữ liệu đơn hàng về Google Sheets thông qua Google Apps Script Webhook.
 * Sử dụng text/plain và mode: 'no-cors' để tránh lỗi CORS do chuyển hướng 302 của Google Apps Script.
 */
export const sendOrderToGoogleSheet = async (order: PlacedOrder): Promise<{ success: boolean; message: string }> => {
  const webhookUrl = getStoredWebhookUrl();

  if (!webhookUrl) {
    console.warn('[OrderService] Chưa cấu hình Google Sheet Webhook URL. Đơn hàng được lưu trên trình duyệt.');
    return {
      success: false,
      message: 'Chưa cấu hình Google Sheet Webhook URL',
    };
  }

  // Tóm tắt danh sách sản phẩm thành chuỗi dễ đọc trên Excel/Google Sheet
  const itemsText = order.items
    .map((item, idx) => {
      const variantInfo = item.variant ? ` (${item.variant})` : '';
      return `${idx + 1}. ${item.product.title}${variantInfo} x ${item.quantity} [${formatPrice(item.product.price * item.quantity)}]`;
    })
    .join('\n');

  const contactMethodLabel = 
    order.customer.contactMethod === 'sms' ? 'Gửi tin nhắn SMS' : 'Nhắn tin SMS xác nhận';

  const contactTimeLabel =
    order.customer.contactTime === 'morning' ? 'Buổi sáng (08:00 - 12:00)' :
    order.customer.contactTime === 'afternoon' ? 'Buổi chiều (13:30 - 17:30)' :
    order.customer.contactTime === 'evening' ? 'Buổi tối (18:00 - 21:00)' : 'Bất kỳ lúc nào';

  const paymentMethodLabel =
    order.customer.paymentMethod === 'banking' ? 'Chuyển khoản VietQR' : 'Thanh toán tiền mặt (COD)';

  const payload = {
    orderId: order.orderId,
    createdAt: formatVietnamTime(order.createdAt),
    fullName: order.customer.fullName,
    phone: order.customer.phone,
    contactMethod: contactMethodLabel,
    contactTime: contactTimeLabel,
    address: order.customer.address,
    district: order.customer.district || '',
    province: order.customer.province,
    fullAddress: `${order.customer.address}${order.customer.district ? `, ${order.customer.district}` : ''}, ${order.customer.province}`,
    email: order.customer.email || '',
    paymentMethod: paymentMethodLabel,
    itemsText: itemsText,
    totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
    note: order.customer.note || 'Không có',
    couponCode: order.couponCode || 'Không áp dụng',
    subtotal: formatPrice(order.subtotal),
    discount: formatPrice(order.discount),
    shippingFee: order.shippingFee === 0 ? 'Miễn phí (Freeship)' : formatPrice(order.shippingFee),
    grandTotal: formatPrice(order.grandTotal),
    rawTotal: order.grandTotal,
    status: 'Chờ liên hệ xác nhận',
  };

  try {
    // Gửi bằng fetch với mode 'no-cors' và Content-Type: 'text/plain'
    // Đây là chuẩn tối ưu nhất cho Google Apps Script vì Script luôn trả về redirect 302
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log('[OrderService] Đã gửi thông tin đơn hàng tới Google Sheet thành công:', order.orderId);
    return {
      success: true,
      message: 'Đã gửi đơn hàng đến Google Sheet',
    };
  } catch (error) {
    console.error('[OrderService] Lỗi khi gửi đơn hàng tới Google Sheet:', error);
    return {
      success: false,
      message: 'Không thể kết nối đến Google Sheet',
    };
  }
};

/**
 * Cập nhật trạng thái hủy đơn trong localStorage
 */
export const cancelOrderInLocalStorage = (
  orderId: string, 
  reason: string
): { success: boolean; order?: PlacedOrder; message: string } => {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Window không xác định' };
  }

  try {
    const raw = localStorage.getItem('hugz_customer_orders');
    const orders: PlacedOrder[] = raw ? JSON.parse(raw) : [];
    const index = orders.findIndex((o) => o.orderId.toUpperCase() === orderId.toUpperCase());

    if (index === -1) {
      return { success: false, message: 'Không tìm thấy đơn hàng' };
    }

    const currentOrder = orders[index];
    if (currentOrder.status === 'shipping' || currentOrder.status === 'completed') {
      return { 
        success: false, 
        message: 'Đơn hàng đang giao hoặc đã hoàn tất, không thể tự hủy trên web. Vui lòng nhắn tin Fanpage Facebook HUGZ để được hỗ trợ nhanh nhất.' 
      };
    }

    const updatedOrder: PlacedOrder = {
      ...currentOrder,
      status: 'cancelled',
      cancelReason: reason,
      cancelledAt: new Date().toISOString(),
    };

    orders[index] = updatedOrder;
    localStorage.setItem('hugz_customer_orders', JSON.stringify(orders));

    // Bắn event để các component lắng nghe cập nhật nếu cần
    window.dispatchEvent(new CustomEvent('hugz_orders_updated', { detail: updatedOrder }));

    return {
      success: true,
      order: updatedOrder,
      message: 'Đã hủy đơn hàng thành công',
    };
  } catch (err) {
    console.error('[OrderService] Lỗi khi hủy đơn trong localStorage:', err);
    return { success: false, message: 'Có lỗi xảy ra khi lưu trạng thái hủy' };
  }
};

/**
 * Gửi thông báo hủy đơn hàng về Google Sheets
 */
export const sendCancellationToGoogleSheet = async (
  order: PlacedOrder,
  reason: string
): Promise<{ success: boolean; message: string }> => {
  const webhookUrl = getStoredWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: 'Chưa cấu hình Google Sheet Webhook URL' };
  }

  const payload = {
    action: 'CANCEL_ORDER',
    isCancel: true,
    orderId: order.orderId,
    createdAt: formatVietnamTime(order.createdAt),
    cancelledAt: formatVietnamTime(new Date().toISOString()),
    fullName: order.customer.fullName,
    phone: order.customer.phone,
    address: order.customer.address,
    province: order.customer.province,
    fullAddress: `${order.customer.address}${order.customer.district ? `, ${order.customer.district}` : ''}, ${order.customer.province}`,
    cancelReason: reason,
    note: `[ĐÃ HỦY ĐƠN]: Khách yêu cầu hủy đơn vào ${formatVietnamTime(new Date().toISOString())}. Lý do: ${reason}`,
    status: `ĐÃ HỦY ĐƠN: ${reason}`,
    grandTotal: formatPrice(order.grandTotal),
    rawTotal: order.grandTotal,
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log('[OrderService] Đã gửi thông báo hủy đơn tới Google Sheet:', order.orderId);
    return { success: true, message: 'Đã đồng bộ trạng thái hủy đơn lên Google Sheet' };
  } catch (error) {
    console.error('[OrderService] Lỗi gửi thông báo hủy đơn:', error);
    return { success: false, message: 'Không thể kết nối đến Google Sheet' };
  }
};

/**
 * Tải danh sách đơn hàng từ Google Sheet (thông qua Webhook doGet)
 */
export const fetchOrdersFromGoogleSheet = async (): Promise<{ success: boolean; orders?: PlacedOrder[]; message: string }> => {
  const webhookUrl = getStoredWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: 'Chưa cấu hình URL Webhook Google Sheet' };
  }

  try {
    const res = await fetch(webhookUrl, { method: 'GET', cache: 'no-cache' });
    if (!res.ok) {
      return { success: false, message: `Lỗi kết nối Webhook (${res.status})` };
    }
    const data = await res.json();
    if (data.status === 'success' && Array.isArray(data.orders)) {
      return { 
        success: true, 
        orders: data.orders, 
        message: `Đã nạp thành công ${data.orders.length} đơn hàng từ Google Sheet!` 
      };
    }
    return { 
      success: false, 
      message: data.message || 'Phiên bản Webhook hiện tại chưa hỗ trợ API trả về danh sách đơn. Bạn có thể mở trực tiếp file Google Sheets để xem.' 
    };
  } catch (err: any) {
    return { 
      success: false, 
      message: 'Không thể tải trực tiếp qua Webhook GET (cần cập nhật file Google Apps Script). Bạn có thể mở trực tiếp Google Sheets để xem toàn bộ đơn.' 
    };
  }
};

