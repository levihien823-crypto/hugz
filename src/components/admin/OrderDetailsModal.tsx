import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Package, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  FileText, 
  Clock, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { PlacedOrder } from '../../types';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: PlacedOrder | null;
  onStatusChange: (orderId: string, newStatus: PlacedOrder['status']) => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  order,
  onStatusChange
}) => {
  if (!isOpen || !order) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  const getStatusInfo = (status: PlacedOrder['status']) => {
    switch (status) {
      case 'pending_confirmation':
        return {
          label: 'Chờ xác nhận',
          color: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock
        };
      case 'confirmed':
        return {
          label: 'Đã xác nhận (Đang chuẩn bị)',
          color: 'bg-blue-100 text-blue-900 border-blue-300',
          icon: Package
        };
      case 'shipping':
        return {
          label: 'Đang giao hàng',
          color: 'bg-purple-100 text-purple-900 border-purple-300',
          icon: Truck
        };
      case 'completed':
        return {
          label: 'Đã hoàn thành',
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: CheckCircle2
        };
      case 'cancelled':
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-900 border-red-300',
          icon: XCircle
        };
      default:
        return {
          label: 'Đang xử lý',
          color: 'bg-stone-100 text-stone-800 border-stone-200',
          icon: Clock
        };
    }
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  const cleanPhone = order.customer.phone.replace(/[^0-9]/g, '');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden my-6 print:border-none print:shadow-none"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-stone-50/80 border-b border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    Chi Tiết Đơn Hàng #{order.orderId}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusInfo.label}
                  </span>
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Đặt lúc: {formatDate(order.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Quick Status Action Bar */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
              <div className="text-xs text-stone-700">
                <span className="font-semibold block text-stone-900">Cập nhật trạng thái đơn hàng:</span>
                Chọn trạng thái mới để cập nhật cho khách tra cứu
              </div>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.orderId, e.target.value as PlacedOrder['status'])}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm cursor-pointer"
              >
                <option value="pending_confirmation">🕒 Chờ xác nhận</option>
                <option value="confirmed">📦 Đã xác nhận (Đang chuẩn bị)</option>
                <option value="shipping">🚚 Đang giao hàng</option>
                <option value="completed">✅ Đã hoàn thành (Giao thành công)</option>
                <option value="cancelled">❌ Đã hủy</option>
              </select>
            </div>

            {/* Khách hàng & Địa chỉ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Người nhận hàng
                </h4>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <p className="text-sm font-bold text-stone-900">{order.customer.fullName}</p>
                  <p className="flex items-center gap-1.5 text-stone-600">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold text-amber-700">{order.customer.phone}</span>
                  </p>
                  <div className="flex gap-2 pt-1 print:hidden">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-semibold text-stone-700 inline-flex items-center gap-1 transition-colors"
                    >
                      <Phone className="w-3 h-3 text-emerald-600" />
                      Gọi điện
                    </a>
                    <a
                      href={`https://zalo.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg text-[11px] font-semibold text-blue-700 inline-flex items-center gap-1 transition-colors"
                    >
                      <MessageSquare className="w-3 h-3 text-blue-600" />
                      Nhắn Zalo
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-200/80 bg-stone-50/50 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Địa chỉ giao hàng
                </h4>
                <div className="text-xs text-stone-700 space-y-1">
                  <p className="leading-relaxed font-medium">{order.customer.address}</p>
                  {order.customer.note && (
                    <div className="mt-2 p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 text-[11px]">
                      <span className="font-bold">Ghi chú của khách:</span> {order.customer.note}
                    </div>
                  )}
                  <p className="pt-1 text-stone-500 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Phương thức: <strong className="text-stone-800">{order.customer.paymentMethod === 'cod' ? 'Thanh toán tiền mặt khi nhận (COD)' : 'Chuyển khoản ngân hàng'}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Danh sách sản phẩm trong đơn */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Danh sách sản phẩm ({order.items.length})
              </h4>
              <div className="rounded-2xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center gap-3 bg-white hover:bg-stone-50/50 transition-colors">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-14 h-14 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=HUGZ';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </p>
                      {item.color && (
                        <p className="text-[11px] text-stone-500">
                          Phân loại: <span className="font-medium text-stone-700">{item.color}</span>
                        </p>
                      )}
                      <p className="text-[11px] text-stone-400">
                        {formatPrice(item.product.price)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bảng tính tổng tiền */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Tổng tiền hàng:</span>
                <span className="font-medium">{formatPrice(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Voucher giảm giá {order.couponCode ? `(${order.couponCode})` : ''}:</span>
                  <span className="font-bold">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">{formatPrice(order.shippingFee)}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
                <span>Tổng thanh toán:</span>
                <span className="text-base text-amber-700">{formatPrice(order.grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between print:hidden">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              In đơn hàng
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-md transition-all"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
