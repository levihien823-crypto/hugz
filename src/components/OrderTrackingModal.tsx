import React, { useState, useEffect } from 'react';
import { PlacedOrder } from '../types';
import { 
  X, 
  Package, 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Copy, 
  Check, 
  MessageCircle, 
  ShoppingBag,
  Ban,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { 
  cancelOrderInLocalStorage, 
  sendCancellationToGoogleSheet 
} from '../utils/orderService';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;
}

const CANCEL_REASONS = [
  'Đổi ý, không có nhu cầu mua nữa',
  'Muốn thay đổi địa chỉ hoặc số điện thoại nhận hàng',
  'Muốn đổi mẫu, phân loại hoặc số lượng sản phẩm',
  'Đặt trùng đơn / vô tình bấm đặt nhiều lần',
  'Thời gian giao hàng không phù hợp',
  'Lý do khác',
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'cancelled'>('all');

  // Cancel flow states
  const [orderToCancel, setOrderToCancel] = useState<PlacedOrder | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(CANCEL_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState<boolean>(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  const loadOrders = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('hugz_customer_orders') || '[]');
      if (Array.isArray(saved)) {
        setOrders(saved);
      }
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadOrders();
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

  const handleOpenCancelModal = (order: PlacedOrder) => {
    setOrderToCancel(order);
    setSelectedReason(CANCEL_REASONS[0]);
    setCustomReason('');
  };

  const handleCloseCancelModal = () => {
    if (isCancelling) return;
    setOrderToCancel(null);
    setSelectedReason(CANCEL_REASONS[0]);
    setCustomReason('');
  };

  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;

    setIsCancelling(true);
    const finalReason = 
      selectedReason === 'Lý do khác' 
        ? (customReason.trim() || 'Lý do khác') 
        : selectedReason;

    try {
      // 1. Cập nhật localStorage
      const result = cancelOrderInLocalStorage(orderToCancel.orderId, finalReason);
      
      if (result.success && result.order) {
        // Cập nhật state danh sách đơn tại chỗ
        setOrders((prev) => 
          prev.map((o) => (o.orderId === orderToCancel.orderId ? result.order! : o))
        );

        // 2. Gửi thông báo hủy đơn tới Google Sheets
        sendCancellationToGoogleSheet(orderToCancel, finalReason).catch((err) => {
          console.error('Lỗi đồng bộ hủy đơn lên Google Sheet:', err);
        });

        // 3. Thông báo cho người dùng
        setActionSuccessNotice(`Đã hủy thành công đơn hàng ${orderToCancel.orderId}!`);
        setTimeout(() => setActionSuccessNotice(null), 5000);
      } else {
        alert(result.message || 'Không thể hủy đơn hàng vào lúc này.');
      }
    } catch (err) {
      console.error('Lỗi khi hủy đơn:', err);
      alert('Có lỗi xảy ra trong quá trình hủy đơn. Vui lòng thử lại!');
    } finally {
      setIsCancelling(false);
      setOrderToCancel(null);
    }
  };

  // Counts for filters
  const activeCount = orders.filter((o) => o.status !== 'cancelled').length;
  const cancelledCount = orders.filter((o) => o.status === 'cancelled').length;

  const filteredOrders = orders.filter((o) => {
    // 1. Tab filter
    if (activeFilter === 'active' && o.status === 'cancelled') return false;
    if (activeFilter === 'cancelled' && o.status !== 'cancelled') return false;

    // 2. Search query filter
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
      case 'cancelled':
        return {
          label: 'Đã hủy đơn hàng',
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: Ban,
        };
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
              <h3 className="font-display text-base sm:text-lg font-bold text-[#201b12] leading-tight">
                Lịch sử đặt hàng trực tiếp
              </h3>
              <p className="text-xs text-[#797862]">
                Theo dõi và quản lý các đơn hàng bạn đã đặt tại HUGZ
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

        {/* Global Success Notification banner */}
        {actionSuccessNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessNotice}</span>
            </div>
            <button
              onClick={() => setActionSuccessNotice(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Filter Tabs & Search Bar */}
        {orders.length > 0 && (
          <div className="p-4 bg-white/70 border-b border-[#cac7ae]/30 shrink-0 space-y-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#201b12] text-white shadow-2xs'
                    : 'bg-white border border-[#cac7ae]/50 text-[#797862] hover:text-[#201b12] hover:bg-[#faf5ee]'
                }`}
              >
                Tất cả ({orders.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFilter === 'active'
                    ? 'bg-[#626200] text-white shadow-2xs'
                    : 'bg-white border border-[#cac7ae]/50 text-[#797862] hover:text-[#201b12] hover:bg-[#faf5ee]'
                }`}
              >
                Đang xử lý ({activeCount})
              </button>

              {cancelledCount > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeFilter === 'cancelled'
                      ? 'bg-rose-700 text-white shadow-2xs'
                      : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Đã hủy ({cancelledCount})
                </button>
              )}
            </div>

            {/* Search Input */}
            {orders.length > 1 && (
              <div className="relative">
                <Search className="w-4 h-4 text-[#797862] absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo Mã đơn (HUGZ-...) hoặc Số điện thoại..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12] text-[#201b12]"
                />
              </div>
            )}
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
                Khi bạn đặt mua sản phẩm trực tiếp trên website HUGZ, mã đơn và thông tin liên hệ sẽ hiển thị tại đây để bạn tiện theo dõi hoặc hủy đơn nếu muốn.
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
              Không tìm thấy đơn hàng nào khớp với bộ lọc hiện tại.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const StatusIcon = statusBadge.icon;
              const isCancelled = order.status === 'cancelled';
              const canCancel = order.status === 'pending_confirmation' || order.status === 'confirmed';

              return (
                <div 
                  key={order.orderId}
                  className={`bg-white rounded-2xl border p-4 sm:p-5 space-y-3.5 shadow-xs transition-all ${
                    isCancelled 
                      ? 'border-rose-200/80 bg-stone-50/50 opacity-90' 
                      : 'border-[#cac7ae]/50'
                  }`}
                >
                  {/* Top card bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#f4eee6]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#797862]">Đơn:</span>
                      <strong className={`text-sm font-black font-mono tracking-wider ${isCancelled ? 'line-through text-[#797862]' : 'text-[#201b12]'}`}>
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

                  {/* Cancellation Reason Alert banner if cancelled */}
                  {isCancelled && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                      <div className="space-y-0.5">
                        <div className="font-bold text-rose-900">
                          Đơn hàng này đã bị hủy
                        </div>
                        {order.cancelReason && (
                          <div className="text-[11px] text-rose-700">
                            Lý do: <strong>{order.cancelReason}</strong>
                          </div>
                        )}
                        {order.cancelledAt && (
                          <div className="text-[10px] text-rose-500">
                            Thời gian hủy: {formatDate(order.cancelledAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

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
                        <strong>Ghi chú đơn:</strong> {order.customer.note}
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
                        <span className={`text-xs font-bold shrink-0 ${isCancelled ? 'text-[#797862] line-through' : 'text-[#b62506]'}`}>
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#f4eee6]">
                    <div className="text-xs">
                      <span className="text-[#797862]">Tổng thanh toán: </span>
                      <strong className={`text-sm font-black ${isCancelled ? 'text-[#797862] line-through' : 'text-[#b62506]'}`}>
                        {formatPrice(order.grandTotal)}
                      </strong>
                    </div>

                    <div className="flex items-center flex-wrap gap-2">
                      {/* NÚT HỦY ĐƠN HÀNG TRỰC TIẾP */}
                      {canCancel && (
                        <button
                          type="button"
                          onClick={() => handleOpenCancelModal(order)}
                          className="px-3 py-1.5 rounded-lg border border-rose-300 hover:border-rose-400 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          title="Hủy đơn hàng này"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Hủy đơn</span>
                        </button>
                      )}

                      {/* Nút liên hệ */}
                      <a
                        href="https://www.facebook.com/thehugzlife"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat Facebook</span>
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
            * HUGZ cam kết liên hệ xác nhận và bảo vệ quyền lợi người mua tối đa.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#201b12] text-white font-bold hover:bg-black transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* ==================== MODAL XÁC NHẬN HỦY ĐƠN HÀNG ==================== */}
        {orderToCancel && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div 
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full border border-[#cac7ae]/50 shadow-2xl space-y-4 animate-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Ban className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-[#201b12] text-base">
                      Xác nhận hủy đơn hàng
                    </h4>
                    <p className="text-xs text-[#797862] font-mono">
                      Mã đơn: <strong className="text-[#201b12]">{orderToCancel.orderId}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseCancelModal}
                  disabled={isCancelling}
                  className="p-1 rounded-full text-[#797862] hover:bg-[#f8ecdd] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Warning box */}
              <div className="p-3 rounded-xl bg-[#fff8f2] border border-[#cac7ae]/40 text-xs text-[#484834]">
                Bạn có chắc chắn muốn hủy đơn hàng này không? Sau khi hủy, hệ thống sẽ tự động cập nhật thông tin và ngừng xử lý giao hàng cho đơn này.
              </div>

              {/* Reasons list */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#201b12]">
                  Vui lòng chọn lý do hủy đơn:
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {CANCEL_REASONS.map((reason) => (
                    <label 
                      key={reason}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedReason === reason 
                          ? 'border-[#201b12] bg-[#fdf2e3]/60 font-semibold text-[#201b12]' 
                          : 'border-[#cac7ae]/40 hover:bg-[#faf6ef] text-[#484834]'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="cancel_reason" 
                        value={reason} 
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="accent-[#201b12] w-3.5 h-3.5"
                      />
                      <span className="flex-1">{reason}</span>
                    </label>
                  ))}
                </div>

                {selectedReason === 'Lý do khác' && (
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Nhập lý do cụ thể của bạn (không bắt buộc)..."
                    rows={2}
                    className="w-full mt-2 p-2.5 text-xs rounded-xl border border-[#cac7ae]/60 focus:outline-none focus:border-[#201b12] bg-[#faf6ef] text-[#201b12]"
                  />
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseCancelModal}
                  disabled={isCancelling}
                  className="px-4 py-2.5 rounded-xl border border-[#cac7ae]/60 hover:bg-[#faf5ee] text-xs font-bold text-[#484834] transition-colors cursor-pointer"
                >
                  Giữ lại đơn
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Ban className="w-3.5 h-3.5" />
                      <span>Xác nhận hủy đơn</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
