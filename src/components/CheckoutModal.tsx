import React, { useState } from 'react';
import { CartItem, PlacedOrder, CustomerOrderInfo } from '../types';
import { 
  X, 
  CheckCircle2, 
  Phone, 
  User, 
  MapPin, 
  Mail, 
  FileText, 
  CreditCard, 
  Banknote, 
  QrCode, 
  ShieldCheck, 
  Copy, 
  Check, 
  ShoppingBag, 
  Truck, 
  Sparkles,
  MessageCircle,
  Building,
  ArrowRight
} from 'lucide-react';
import { trackPurchase } from '../utils/analytics';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  shippingFee: number;
  grandTotal: number;
  onOrderSuccess: (order: PlacedOrder) => void;
  onViewOrdersHistory?: () => void;
}

const VIETNAM_PROVINCES = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  subtotal,
  discountAmount,
  couponCode,
  shippingFee,
  grandTotal,
  onOrderSuccess,
  onViewOrdersHistory,
}) => {
  const [formData, setFormData] = useState<CustomerOrderInfo>({
    fullName: '',
    phone: '',
    email: '',
    province: 'Hà Nội',
    district: '',
    address: '',
    note: '',
    paymentMethod: 'cod',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState(false);
  const [copiedBankNumber, setCopiedBankNumber] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Vui lòng nhập họ và tên người nhận';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên quá ngắn';
    }

    const cleanPhone = formData.phone.replace(/[\s.-]/g, '');
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!cleanPhone) {
      newErrors.phone = 'Vui lòng nhập số điện thoại nhận hàng / Zalo';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (cần 10 chữ số, ví dụ 0912345678)';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ nhận hàng chi tiết';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Vui lòng ghi rõ số nhà, tên đường, phường/xã';
    }

    if (!formData.province) {
      newErrors.province = 'Vui lòng chọn Tỉnh / Thành phố';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = `HUGZ-${randomNum}`;

    const newOrder: PlacedOrder = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: { ...formData },
      items: [...items],
      subtotal,
      discount: discountAmount,
      couponCode,
      shippingFee,
      grandTotal,
      status: 'pending_confirmation',
    };

    setTimeout(() => {
      // 1. Lưu vào localStorage để tra cứu lịch sử đơn hàng
      try {
        const savedOrders = JSON.parse(localStorage.getItem('hugz_customer_orders') || '[]');
        savedOrders.unshift(newOrder);
        localStorage.setItem('hugz_customer_orders', JSON.stringify(savedOrders));
      } catch (err) {
        console.error('Save order error:', err);
      }

      // 2. Bắn sự kiện GA4 E-commerce purchase
      trackPurchase(orderId, items, grandTotal);

      // 3. Callback thông báo thành công cho App
      onOrderSuccess(newOrder);

      // 4. Cập nhật state hiển thị màn hình hoàn tất
      setIsSubmitting(false);
      setPlacedOrder(newOrder);
    }, 600);
  };

  const handleCopy = (text: string, type: 'order' | 'bank') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        if (type === 'order') {
          setCopiedOrderId(true);
          setTimeout(() => setCopiedOrderId(false), 3000);
        } else {
          setCopiedBankNumber(true);
          setTimeout(() => setCopiedBankNumber(false), 3000);
        }
      });
    }
  };

  const bankAccountInfo = {
    bankName: 'MB Bank (Ngân hàng Quân Đội)',
    accountNumber: '888868689999',
    accountName: 'HUGZ LIVING VIETNAM',
  };

  const qrUrl = placedOrder 
    ? `https://img.vietqr.io/image/MB-888868689999-compact2.png?amount=${placedOrder.grandTotal}&addInfo=${placedOrder.orderId}%20${placedOrder.customer.phone.replace(/[\s.-]/g, '')}&accountName=HUGZ%20LIVING%20VIETNAM`
    : '';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in">
      <div 
        className="relative w-full max-w-4xl bg-[#fff8f2] rounded-3xl shadow-2xl border border-[#cac7ae]/50 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-white border-b border-[#cac7ae]/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#fdf2e3] flex items-center justify-center text-[#626200]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base sm:text-lg font-bold text-[#201b12] leading-tight">
                  {placedOrder ? 'Đã Tiếp Nhận Đơn Hàng' : 'Đặt Hàng Trực Tiếp Trên Website'}
                </h3>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-[#f4f34d] text-[10px] font-black text-[#201b12]">
                  Chính hãng HUGZ
                </span>
              </div>
              <p className="text-xs text-[#797862]">
                {placedOrder 
                  ? 'HUGZ sẽ gửi thông báo xác nhận đơn qua Zalo/SMS cho bạn' 
                  : 'Điền thông tin nhận hàng — HUGZ sẽ gửi xác nhận đơn qua Zalo / Tin nhắn'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#f8ecdd] text-[#797862] hover:text-[#201b12] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Process Guide Bar */}
        <div className="bg-[#faf5ee] px-6 py-2.5 border-b border-[#cac7ae]/30 text-xs hidden sm:flex items-center justify-between">
          <div className={`flex items-center gap-2 font-bold ${!placedOrder ? 'text-[#201b12]' : 'text-emerald-700'}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${!placedOrder ? 'bg-[#201b12] text-white' : 'bg-emerald-600 text-white'}`}>
              {!placedOrder ? '1' : '✓'}
            </span>
            <span>1. Điền thông tin nhận hàng</span>
          </div>
          <span className="text-[#cac7ae]">→</span>
          <div className={`flex items-center gap-2 font-bold ${placedOrder ? 'text-[#626200]' : 'text-[#797862]'}`}>
            <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${placedOrder ? 'bg-[#626200] text-white' : 'bg-[#cac7ae]/50 text-[#797862]'}`}>
              2
            </span>
            <span>2. HUGZ gửi xác nhận qua Zalo/SMS</span>
          </div>
          <span className="text-[#cac7ae]">→</span>
          <div className="flex items-center gap-2 font-bold text-[#797862]">
            <span className="w-5 h-5 rounded-full text-[11px] bg-[#cac7ae]/50 text-[#797862] flex items-center justify-center">
              3
            </span>
            <span>3. Giao tận nơi & Đồng kiểm (COD)</span>
          </div>
        </div>

        {/* Content Body */}
        {placedOrder ? (
          /* ==================== MÀN HÌNH ĐẶT HÀNG THÀNH CÔNG ==================== */
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Success Hero */}
            <div className="text-center max-w-lg mx-auto space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#eaf7ee] text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12]">
                Đặt Hàng Thành Công!
              </h2>
              <p className="text-xs sm:text-sm text-[#484834]">
                Cảm ơn <strong>{placedOrder.customer.fullName}</strong> đã đặt mua sản phẩm tại HUGZ Living.
              </p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#cac7ae]/60 shadow-2xs">
                <span className="text-xs text-[#797862]">Mã đơn hàng:</span>
                <strong className="text-sm font-black text-[#201b12] font-mono tracking-wider">
                  {placedOrder.orderId}
                </strong>
                <button
                  onClick={() => handleCopy(placedOrder.orderId, 'order')}
                  className="p-1 text-[#626200] hover:text-[#201b12] transition-colors cursor-pointer"
                  title="Sao chép mã đơn hàng"
                >
                  {copiedOrderId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Notification Banner: Xác nhận qua Zalo/Tin nhắn */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#eef7ff] border border-[#bcdbf7] flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#0068FF] flex items-center justify-center text-white shrink-0 mt-0.5">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm text-[#201b12] leading-relaxed">
                <strong className="font-bold text-[#0068FF] text-sm block mb-1">
                  💬 Xác nhận đơn hàng qua Zalo / Tin nhắn SMS:
                </strong>
                HUGZ đã tiếp nhận thông tin đơn hàng của bạn. Chúng tôi sẽ 
                <strong> gửi tin nhắn xác nhận chi tiết đơn hàng và mã vận đơn theo dõi tới số điện thoại/Zalo {placedOrder.customer.phone}</strong> trong vòng 15 - 30 phút. Bạn không phải lo bị làm phiền bởi cuộc gọi rác!
              </div>
            </div>

            {/* Banking Details (nếu chọn Chuyển khoản) */}
            {placedOrder.customer.paymentMethod === 'banking' && (
              <div className="p-5 rounded-2xl bg-white border border-[#cac7ae]/50 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f4eee6]">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-[#626200]" />
                    <h4 className="font-bold text-sm text-[#201b12]">
                      Quét mã VietQR chuyển khoản đơn hàng
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Đã tạo mã QR theo đơn
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-5 flex flex-col items-center">
                    <div className="p-2.5 rounded-2xl bg-[#faf6ef] border border-[#cac7ae]/40 shadow-xs">
                      <img 
                        src={qrUrl} 
                        alt="VietQR HUGZ" 
                        className="w-44 h-44 object-contain rounded-xl"
                      />
                    </div>
                    <span className="text-[11px] text-[#797862] mt-1.5 text-center">
                      Mở app ngân hàng bất kỳ để quét mã tự động điền STK & số tiền
                    </span>
                  </div>

                  <div className="sm:col-span-7 space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-[#fdf8f2] border border-[#cac7ae]/30 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#797862]">Ngân hàng:</span>
                        <strong className="text-[#201b12]">{bankAccountInfo.bankName}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#797862]">Số tài khoản:</span>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-sm font-black text-[#201b12] font-mono tracking-wider">
                            {bankAccountInfo.accountNumber}
                          </strong>
                          <button
                            onClick={() => handleCopy(bankAccountInfo.accountNumber, 'bank')}
                            className="p-1 text-[#626200] hover:text-[#201b12] cursor-pointer"
                            title="Sao chép STK"
                          >
                            {copiedBankNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#797862]">Chủ tài khoản:</span>
                        <strong className="text-[#201b12] uppercase">{bankAccountInfo.accountName}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#797862]">Số tiền:</span>
                        <strong className="text-sm font-black text-[#b62506]">{formatPrice(placedOrder.grandTotal)}</strong>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#797862]">Nội dung CK:</span>
                        <strong className="text-xs font-mono font-bold text-[#626200]">
                          {placedOrder.orderId}
                        </strong>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#797862] italic">
                      * Sau khi chuyển khoản, HUGZ sẽ tự động đối soát bill và gửi xác nhận đóng gói cho bạn qua Zalo/SMS.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary Recap */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#cac7ae]/40 space-y-3 text-xs">
              <div className="font-bold text-[#201b12] flex items-center justify-between pb-2 border-b border-[#f4eee6]">
                <span>Thông tin nhận hàng của bạn</span>
                <span className="text-[#626200] font-semibold">
                  {placedOrder.customer.paymentMethod === 'cod' 
                    ? '💵 Thanh toán khi nhận hàng (Đồng kiểm COD)' 
                    : '💳 Chuyển khoản ngân hàng VietQR'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[#484834]">
                <div><strong>Người nhận:</strong> {placedOrder.customer.fullName}</div>
                <div><strong>Số điện thoại / Zalo:</strong> {placedOrder.customer.phone}</div>
                {placedOrder.customer.email && (
                  <div><strong>Email:</strong> {placedOrder.customer.email}</div>
                )}
                <div className="sm:col-span-2">
                  <strong>Địa chỉ giao:</strong> {placedOrder.customer.address}, {placedOrder.customer.district ? `${placedOrder.customer.district}, ` : ''}{placedOrder.customer.province}
                </div>
                {placedOrder.customer.note && (
                  <div className="sm:col-span-2 text-[#797862]">
                    <strong>Ghi chú:</strong> {placedOrder.customer.note}
                  </div>
                )}
              </div>

              {/* Items in order */}
              <div className="pt-2 border-t border-[#f4eee6] space-y-2">
                <span className="text-[11px] font-bold text-[#797862] uppercase tracking-wider block">
                  Sản phẩm đã chọn ({placedOrder.items.reduce((acc, i) => acc + i.quantity, 0)} món) • Tổng tiền: {formatPrice(placedOrder.grandTotal)}
                </span>
                <div className="flex flex-wrap gap-2">
                  {placedOrder.items.map((item) => (
                    <div key={`${item.product.id}-${item.variant}`} className="inline-flex items-center gap-2 p-1.5 rounded-lg bg-[#faf6ef] border border-[#cac7ae]/30 text-[11px]">
                      <img src={item.product.image} alt={item.product.title} className="w-6 h-6 rounded object-contain bg-white" />
                      <span className="font-medium text-[#201b12] truncate max-w-[160px]">{item.product.title}</span>
                      <span className="text-[#797862]">({item.variant} x{item.quantity})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-[#797862]">
                <Truck className="w-4 h-4 text-[#626200]" />
                <span>Thời gian giao dự kiến: 2 - 4 ngày làm việc</span>
              </div>

              <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto">
                <a
                  href={`https://zalo.me/0987654321?text=${encodeURIComponent(`Xin chào HUGZ, tôi vừa đặt đơn hàng mã ${placedOrder.orderId} trên website và muốn theo dõi đơn.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#fdf2e3] border border-[#cac7ae]/50 text-xs font-bold text-[#0068FF] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Zalo CSKH</span>
                </a>

                {onViewOrdersHistory && (
                  <button
                    onClick={() => {
                      onClose();
                      onViewOrdersHistory();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#fdf2e3] hover:bg-[#f3ddb8] text-xs font-bold text-[#201b12] transition-colors cursor-pointer border border-[#cac7ae]/40"
                  >
                    Xem lịch sử đơn
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-[#201b12] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer text-center"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ==================== FORM ĐIỀN THÔNG TIN ĐẶT HÀNG ==================== */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6">
            
            {/* Top notification banner */}
            <div className="p-3.5 rounded-xl bg-[#fdf2e3] border border-[#cac7ae]/40 flex items-start sm:items-center gap-2.5 text-xs text-[#201b12]">
              <ShieldCheck className="w-5 h-5 text-[#626200] shrink-0 mt-0.5 sm:mt-0" />
              <div className="leading-relaxed">
                <strong>Đặt hàng trực tiếp tiện lợi:</strong> Quý khách chỉ cần điền thông tin nhận hàng bên dưới. HUGZ sẽ gửi tin nhắn xác nhận đơn qua Zalo/SMS và đóng gói giao tận tay bạn nhanh chóng!
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: FORM FIELDS (7 COLUMNS) */}
              <div className="lg:col-span-7 space-y-4">
                <h4 className="font-display text-sm font-bold text-[#201b12] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#cac7ae]/30">
                  <User className="w-4 h-4 text-[#626200]" />
                  <span>1. Thông tin người nhận hàng</span>
                </h4>

                {/* Họ tên & Số điện thoại */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                      Họ và tên người nhận <span className="text-[#b62506]">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors({ ...errors, fullName: '' });
                        }}
                        placeholder="Ví dụ: Nguyễn Minh Anh"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border ${
                          errors.fullName ? 'border-[#b62506] ring-1 ring-[#b62506]/30' : 'border-[#cac7ae]/60'
                        } focus:outline-none focus:border-[#201b12] text-[#201b12]`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="text-[10px] text-[#b62506] mt-1 font-semibold">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                      Số điện thoại nhận hàng / Zalo <span className="text-[#b62506]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (errors.phone) setErrors({ ...errors, phone: '' });
                        }}
                        placeholder="Ví dụ: 0912 345 678"
                        className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border ${
                          errors.phone ? 'border-[#b62506] ring-1 ring-[#b62506]/30' : 'border-[#cac7ae]/60'
                        } focus:outline-none focus:border-[#201b12] text-[#201b12]`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-[#b62506] mt-1 font-semibold">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Email (tùy chọn) */}
                <div>
                  <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                    Email nhận thông tin đơn hàng (Tùy chọn)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Ví dụ: minhanh@gmail.com"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/60 focus:outline-none focus:border-[#201b12] text-[#201b12]"
                    />
                  </div>
                </div>

                {/* Tỉnh / Thành phố & Quận Huyện */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                      Tỉnh / Thành phố <span className="text-[#b62506]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                      <select
                        value={formData.province}
                        onChange={(e) => {
                          setFormData({ ...formData, province: e.target.value });
                          if (errors.province) setErrors({ ...errors, province: '' });
                        }}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/60 focus:outline-none focus:border-[#201b12] text-[#201b12] appearance-none cursor-pointer"
                      >
                        {VIETNAM_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>{prov}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                      Quận / Huyện (Tùy chọn)
                    </label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={formData.district || ''}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="Ví dụ: Quận Cầu Giấy / Quận 1"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/60 focus:outline-none focus:border-[#201b12] text-[#201b12]"
                      />
                    </div>
                  </div>
                </div>

                {/* Địa chỉ chi tiết */}
                <div>
                  <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                    Địa chỉ nhận hàng cụ thể <span className="text-[#b62506]">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    placeholder="Số nhà, tên ngõ/tòa nhà, tên đường, phường/xã..."
                    className={`w-full px-3 py-2 text-xs rounded-xl bg-white border ${
                      errors.address ? 'border-[#b62506] ring-1 ring-[#b62506]/30' : 'border-[#cac7ae]/60'
                    } focus:outline-none focus:border-[#201b12] text-[#201b12]`}
                  />
                  {errors.address && (
                    <p className="text-[10px] text-[#b62506] mt-1 font-semibold">{errors.address}</p>
                  )}
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-[11px] font-bold text-[#201b12] mb-1">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-[#797862] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder="Ví dụ: Giao giờ hành chính, gửi kèm thiệp cảm ơn..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/60 focus:outline-none focus:border-[#201b12] text-[#201b12]"
                    />
                  </div>
                </div>

                {/* 2. Phương thức thanh toán */}
                <div className="pt-2 space-y-2">
                  <h4 className="font-display text-sm font-bold text-[#201b12] uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-[#cac7ae]/30">
                    <CreditCard className="w-4 h-4 text-[#626200]" />
                    <span>2. Hình thức thanh toán</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Option 1: COD */}
                    <label
                      onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        formData.paymentMethod === 'cod'
                          ? 'border-[#201b12] bg-[#fffbf2] shadow-xs ring-1 ring-[#201b12]/20'
                          : 'border-[#cac7ae]/40 bg-white hover:border-[#cac7ae]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-emerald-700" />
                          <span className="font-bold text-xs text-[#201b12]">Tiền mặt khi nhận (COD)</span>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'cod'}
                          onChange={() => {}}
                          className="accent-[#201b12]"
                        />
                      </div>
                      <p className="text-[10px] text-[#797862] leading-relaxed">
                        Đồng kiểm hàng chuẩn đẹp tận tay rồi mới thanh toán cho shipper.
                      </p>
                    </label>

                    {/* Option 2: Banking VietQR */}
                    <label
                      onClick={() => setFormData({ ...formData, paymentMethod: 'banking' })}
                      className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                        formData.paymentMethod === 'banking'
                          ? 'border-[#201b12] bg-[#fffbf2] shadow-xs ring-1 ring-[#201b12]/20'
                          : 'border-[#cac7ae]/40 bg-white hover:border-[#cac7ae]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-[#626200]" />
                          <span className="font-bold text-xs text-[#201b12]">Chuyển khoản VietQR</span>
                        </div>
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={formData.paymentMethod === 'banking'}
                          onChange={() => {}}
                          className="accent-[#201b12]"
                        />
                      </div>
                      <p className="text-[10px] text-[#797862] leading-relaxed">
                        Tự động sinh mã VietQR theo số tiền, xử lý đơn hàng nhanh ưu tiên.
                      </p>
                    </label>
                  </div>
                </div>

              </div>

              {/* RIGHT: ORDER SUMMARY (5 COLUMNS) */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-[#cac7ae]/50 p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#f4eee6]">
                  <h4 className="font-display text-xs font-bold text-[#201b12] uppercase tracking-wider">
                    Đơn hàng của bạn ({items.reduce((acc, i) => acc + i.quantity, 0)} món)
                  </h4>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-[11px] text-[#626200] hover:underline font-semibold cursor-pointer"
                  >
                    Sửa giỏ hàng
                  </button>
                </div>

                {/* Items preview list */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1 divide-y divide-[#f4eee6]">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.variant}`} className="flex items-center gap-3 pt-2 first:pt-0">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-lg object-contain bg-[#faf6ef] border border-[#cac7ae]/30 shrink-0 p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="text-[11px] font-bold text-[#201b12] truncate">
                          {item.product.title}
                        </h5>
                        <p className="text-[10px] text-[#797862]">
                          Phân loại: {item.variant} • SL: {item.quantity}
                        </p>
                        <p className="text-xs font-bold text-[#b62506]">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1.5 text-xs text-[#484834] pt-3 border-t border-[#cac7ae]/30">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="font-semibold text-[#201b12]">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Mã giảm giá ({couponCode}):</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                          MIỄN PHÍ TOÀN QUỐC
                        </span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-black text-[#201b12] pt-2 border-t border-[#cac7ae]/20">
                    <span>Tổng thanh toán:</span>
                    <span className="text-base text-[#b62506]">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Đang gửi thông tin đơn hàng...</span>
                  ) : (
                    <>
                      <span>Xác Nhận Đặt Hàng ({formatPrice(grandTotal)})</span>
                      <CheckCircle2 className="w-4 h-4 text-[#201b12]" />
                    </>
                  )}
                </button>

                {/* Transparency Commitment */}
                <div className="p-2.5 rounded-xl bg-[#faf6ef] border border-[#cac7ae]/30 space-y-1 text-[10px] text-[#797862] text-center">
                  <p className="font-semibold text-[#201b12]">
                    🛡️ Cam kết an tâm tại HUGZ
                  </p>
                  <p>
                    Thông tin đơn hàng và mã vận đơn sẽ được gửi xác nhận qua Zalo/Tin nhắn trước khi bưu tá giao tới.
                  </p>
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
