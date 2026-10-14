import React, { useState, useEffect } from 'react';
import { PlacedOrder } from '../types';
import { 
  X, 
  Package, 
  Search, 
  Phone, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Copy, 
  Check, 
  MessageCircle, 
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Settings,
  FileSpreadsheet,
  Send,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { getStoredWebhookUrl, setStoredWebhookUrl, sendOrderToGoogleSheet } from '../utils/orderService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;
}

const APPS_SCRIPT_CODE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Tự động tạo dòng tiêu đề đẹp nếu trang tính còn mới
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Mã Đơn Hàng",
        "Thời Gian Đặt",
        "Họ Tên Khách",
        "Số Điện Thoại",
        "Kênh Liên Hệ",
        "Khung Giờ",
        "Địa Chỉ Giao Hàng",
        "Tỉnh / TP",
        "Phương Thức TT",
        "Chi Tiết Sản Phẩm",
        "Tổng Tiền",
        "Ghi Chú",
        "Mã Giảm Giá",
        "Trạng Thái"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setBackground("#201b12");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
    }
    
    // Ghi dữ liệu đơn hàng vào dòng tiếp theo
    sheet.appendRow([
      data.orderId || "",
      data.createdAt || "",
      data.fullName || "",
      "'" + (data.phone || ""),
      data.contactMethod || "",
      data.contactTime || "",
      data.fullAddress || data.address || "",
      data.province || "",
      data.paymentMethod || "",
      data.itemsText || "",
      data.grandTotal || "",
      data.note || "",
      data.couponCode || "",
      data.status || "Chờ liên hệ xác nhận"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}`;

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Admin Google Sheet Webhook state
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [webhookInput, setWebhookInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = JSON.parse(localStorage.getItem('hugz_customer_orders') || '[]');
        if (Array.isArray(saved)) {
          setOrders(saved);
        }
      } catch {
        setOrders([]);
      }
      setWebhookInput(getStoredWebhookUrl());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const handleCopy = (orderId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(orderId).then(() => {
        setCopiedId(orderId);
        setTimeout(() => setCopiedId(null), 3000);
      });
    }
  };

  const handleSaveWebhook = () => {
    setStoredWebhookUrl(webhookInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestWebhook = async () => {
    if (!webhookInput.trim()) {
      setTestResult('Vui lòng dán link Webhook trước khi thử nghiệm!');
      return;
    }
    // Lưu trước khi test
    setStoredWebhookUrl(webhookInput);
    setIsTesting(true);
    setTestResult(null);

    const dummyOrder: PlacedOrder = {
      orderId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: 'Nguyễn Văn Test (HUGZ Admin)',
        phone: '0987654321',
        contactMethod: 'zalo',
        contactTime: 'anytime',
        province: 'Hà Nội',
        district: 'Ba Đình',
        address: 'Số 1 Kim Mã, P. Kim Mã',
        note: 'Đơn hàng kiểm tra kết nối Google Sheets tự động',
        paymentMethod: 'cod',
      },
      items: [
        {
          product: {
            id: 'test-item',
            title: 'Bộ chăn ga lụa Hugz Living Cao Cấp',
            price: 590000,
            originalPrice: 790000,
            category: 'bedding',
            categorySlug: 'bedding',
            image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=400',
            rating: 5,
            reviewsCount: 99,
            soldCount: '1.2k',
            description: 'Đơn hàng thử nghiệm',
            features: ['Vải lụa cao cấp'],
            shopeeUrl: '#',
            tiktokUrl: '#',
            isNew: true,
          },
          quantity: 1,
          variant: 'Màu Be - 1m8 x 2m',
        },
      ],
      subtotal: 590000,
      discount: 0,
      shippingFee: 0,
      grandTotal: 590000,
      status: 'pending_confirmation',
    };

    try {
      await sendOrderToGoogleSheet(dummyOrder);
      setTestResult('✅ Đã bắn đơn thử nghiệm thành công! Hãy mở Google Sheets của bạn để kiểm tra dòng mới nhé.');
    } catch {
      setTestResult('❌ Gửi không thành công. Hãy đảm bảo bạn đã triển khai Apps Script ở chế độ "Bất kỳ ai (Anyone)".');
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyScript = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(APPS_SCRIPT_CODE).then(() => {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 3000);
      });
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      o.orderId.toLowerCase().includes(q) ||
      o.customer.phone.toLowerCase().includes(q) ||
      o.customer.fullName.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status: PlacedOrder['status']) => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Đã xác nhận đơn',
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: CheckCircle2,
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: Truck,
        };
      case 'completed':
        return {
          label: 'Giao hàng thành công',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle2,
        };
      case 'pending_confirmation':
      default:
        return {
          label: 'Chờ liên hệ xác nhận',
          color: 'bg-blue-50 text-[#0068FF] border-blue-200',
          icon: Clock,
        };
    }
  };

  const currentWebhook = getStoredWebhookUrl();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#fff8f2] rounded-3xl shadow-2xl border border-[#cac7ae]/50 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-[#cac7ae]/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#fdf2e3] flex items-center justify-center text-[#626200]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#201b12] leading-tight">
                  Quản lý & Tra cứu đơn hàng
                </h3>
              </div>
              <p className="text-xs text-[#797862]">
                Xem danh sách đơn đặt trực tiếp trên website HUGZ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAdminSettings(!showAdminSettings)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                showAdminSettings 
                  ? 'bg-[#201b12] text-white border-black' 
                  : currentWebhook 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-[#f4f34d] text-[#201b12] border-[#cac7ae] hover:bg-[#eae944]'
              }`}
              title="Cấu hình Google Sheet nhận đơn"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentWebhook ? 'Google Sheet: Đã bật' : 'Cài đặt Google Sheet'}
              </span>
              <Settings className="w-3.5 h-3.5 ml-0.5 opacity-70" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-[#f8ecdd] text-[#797862] hover:text-[#201b12] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Settings Panel (Collapsible) */}
        {showAdminSettings && (
          <div className="p-4 sm:p-5 bg-[#fcf8f0] border-b border-[#cac7ae]/40 shrink-0 space-y-3.5 animate-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <h4 className="font-bold text-xs sm:text-sm text-[#201b12]">
                  Cấu hình Tự động gửi đơn về Google Sheets
                </h4>
              </div>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                currentWebhook 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {currentWebhook ? '🟢 Đang hoạt động' : '🟡 Chưa gắn Webhook'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#484834] block">
                Link Webhook Google Apps Script (Web App URL):
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-[#cac7ae] focus:outline-none focus:border-[#201b12] font-mono"
                />
                <button
                  onClick={handleSaveWebhook}
                  className="px-4 py-2 rounded-xl bg-[#201b12] hover:bg-black text-white text-xs font-bold transition-all shrink-0 cursor-pointer"
                >
                  {savedSuccess ? 'Đã lưu ✓' : 'Lưu'}
                </button>
                <button
                  onClick={handleTestWebhook}
                  disabled={isTesting}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Gửi thử 1 đơn hàng mẫu kiểm tra"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isTesting ? 'Đang gửi...' : 'Bắn đơn test'}</span>
                </button>
              </div>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-xl bg-white border border-[#cac7ae]/50 text-xs text-[#201b12]">
                {testResult}
              </div>
            )}

            {/* Guide Accordion */}
            <div className="border border-[#cac7ae]/40 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setShowScriptGuide(!showScriptGuide)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left text-xs font-bold text-[#626200] hover:bg-[#faf6ef] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Xem cách lấy Link Webhook Google Sheets (Chỉ mất 1 phút)</span>
                </div>
                {showScriptGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showScriptGuide && (
                <div className="p-3.5 border-t border-[#cac7ae]/30 space-y-3 text-xs text-[#484834] bg-[#fffdfa]">
                  <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                    <li>Mở file <strong>Google Trang tính (Google Sheets)</strong> của bạn.</li>
                    <li>Trên thanh menu chọn: <strong>Tiện ích mở rộng (Extensions)</strong> &rarr; <strong>Apps Script</strong>.</li>
                    <li>Xóa code cũ, dán đoạn mã bên dưới vào rồi bấm <strong>Lưu (Ctrl+S)</strong>.</li>
                    <li>Bấm nút <strong>Triển khai (Deploy)</strong> &rarr; <strong>Triển khai mới (New deployment)</strong> &rarr; chọn loại <strong>Ứng dụng web (Web app)</strong>.</li>
                    <li>Ở mục <em>Ai có quyền truy cập (Who has access)</em>, chọn <strong>Bất kỳ ai (Anyone)</strong> &rarr; bấm <strong>Triển khai (Deploy)</strong>.</li>
                    <li>Sao chép <strong>URL ứng dụng web (Web App URL)</strong> và dán vào ô bên trên!</li>
                  </ol>

                  <div className="pt-2">
                    <div className="flex items-center justify-between pb-1.5">
                      <span className="font-bold text-[11px] text-[#201b12]">Mã Google Apps Script:</span>
                      <button
                        onClick={handleCopyScript}
                        className="px-2.5 py-1 rounded-lg bg-[#201b12] text-white hover:bg-black text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript ? 'Đã sao chép!' : 'Sao chép mã'}</span>
                      </button>
                    </div>
                    <pre className="p-2.5 rounded-lg bg-[#201b12] text-[#f4f34d] font-mono text-[10px] overflow-x-auto max-h-36">
                      {APPS_SCRIPT_CODE}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Bar if multiple orders */}
        {orders.length > 1 && (
          <div className="p-4 bg-white/60 border-b border-[#cac7ae]/30 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#797862] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo Mã đơn hàng (VD: HUGZ-123456) hoặc Số điện thoại..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12] text-[#201b12]"
              />
            </div>
          </div>
        )}

        {/* Order List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {orders.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-full bg-[#fdf2e3] flex items-center justify-center text-[#797862]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-display font-bold text-base text-[#201b12]">
                Chưa có đơn hàng nào được ghi nhận
              </h4>
              <p className="text-xs text-[#797862] max-w-sm">
                Khi khách hàng đặt mua sản phẩm trực tiếp trên website, đơn sẽ vừa được lưu tại đây vừa tự động đồng bộ về Google Sheets của bạn.
              </p>
              {onContinueShopping && (
                <button
                  onClick={() => {
                    onClose();
                    onContinueShopping();
                  }}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Khám phá sản phẩm HUGZ
                </button>
              )}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#797862]">
              Không tìm thấy đơn hàng nào khớp với từ khóa "{searchQuery}"
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const StatusIcon = statusBadge.icon;
              return (
                <div 
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-[#cac7ae]/50 p-4 sm:p-5 space-y-3.5 shadow-xs"
                >
                  {/* Top card bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f4eee6]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#797862]">Đơn:</span>
                      <strong className="text-sm font-black text-[#201b12] font-mono tracking-wider">
                        {order.orderId}
                      </strong>
                      <button
                        onClick={() => handleCopy(order.orderId)}
                        className="p-1 text-[#626200] hover:text-[#201b12] transition-colors cursor-pointer"
                        title="Sao chép mã đơn"
                      >
                        {copiedId === order.orderId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadge.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span>{statusBadge.label}</span>
                      </span>
                      <span className="text-[11px] text-[#797862]">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Customer summary */}
                  <div className="p-3 rounded-xl bg-[#faf6ef] text-xs space-y-1 text-[#484834]">
                    <div className="flex justify-between flex-wrap gap-1">
                      <span><strong>Người nhận:</strong> {order.customer.fullName} ({order.customer.phone})</span>
                      <span className="text-[#626200] font-semibold">
                        {order.customer.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Chuyển khoản VietQR'}
                      </span>
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong> {order.customer.address}, {order.customer.district ? `${order.customer.district}, ` : ''}{order.customer.province}
                    </div>
                    {order.customer.note && (
                      <div className="text-[#797862] text-[11px]">
                        <strong>Ghi chú:</strong> {order.customer.note}
                      </div>
                    )}
                  </div>

                  {/* Items list */}
                  <div className="space-y-2 pt-1 divide-y divide-[#f4eee6]">
                    {order.items.map((item) => (
                      <div key={`${item.product.id}-${item.variant || ''}`} className="flex items-center gap-3 pt-2 first:pt-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.title} 
                          className="w-11 h-11 rounded-lg object-contain bg-[#faf6ef] border border-[#cac7ae]/30 shrink-0 p-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#201b12] truncate">
                            {item.product.title}
                          </h5>
                          <span className="text-[10px] text-[#797862] block">
                            Phân loại: {item.variant || 'Mặc định'} • Số lượng: {item.quantity}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-[#b62506] shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#f4eee6]">
                    <div className="text-xs">
                      <span className="text-[#797862]">Tổng thanh toán: </span>
                      <strong className="text-sm font-black text-[#b62506]">
                        {formatPrice(order.grandTotal)}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://zalo.me/0987654321?text=${encodeURIComponent(`Xin chào HUGZ, tôi muốn kiểm tra đơn hàng mã ${order.orderId}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#0068FF]/10 hover:bg-[#0068FF] text-[#0068FF] hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Hỏi qua Zalo</span>
                      </a>
                      <a
                        href="tel:0987654321"
                        className="px-3 py-1.5 rounded-lg bg-[#201b12]/5 hover:bg-[#201b12] text-[#201b12] hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi Hotline</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#cac7ae]/40 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[#797862] text-[11px]">
            * HUGZ sẽ liên hệ xác nhận đơn hàng theo khung giờ và kênh liên hệ bạn đã chọn.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#201b12] text-white font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
