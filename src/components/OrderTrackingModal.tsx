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
  ShoppingBag
} from 'lucide-react';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping?: () => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const [orders, setOrders] = useState<PlacedOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
                Theo dõi các yêu cầu mua sắm bạn đã gửi tại HUGZ
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
                Khi bạn đặt mua sản phẩm trực tiếp trên website HUGZ, mã đơn và thông tin liên hệ sẽ hiển thị tại đây để bạn tiện theo dõi.
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
