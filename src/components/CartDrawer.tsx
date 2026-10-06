import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, ExternalLink } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, variant: string, quantity: number) => void;
  onRemoveItem: (productId: string, variant: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [couponCode, setCouponCode] = useState('HUGZSHOPEE20');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = Math.round(rawSubtotal * (discountPercent / 100));
  const shippingFee = rawSubtotal > 300000 || items.length === 0 ? 0 : 20000;
  const grandTotal = Math.max(0, rawSubtotal - discountAmount + shippingFee);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'HUGZSHOPEE20' || code === 'HUGZ20') {
      setDiscountPercent(20);
      setCouponApplied(true);
      setCouponError('');
    } else if (code === 'TIKTOKHUGZ30' || code === 'HUGZ30') {
      setDiscountPercent(30);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Mã không hợp lệ hoặc đã hết hạn');
      setDiscountPercent(0);
      setCouponApplied(false);
    }
  };

  const handleSimulateCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      onCheckoutSuccess();
      onClearCart();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#cac7ae]/40 flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-[#cac7ae]/30 flex items-center justify-between bg-[#fff8f2]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#626200]" />
              <h2 className="font-display text-lg font-bold text-[#201b12]">
                Giỏ hàng của bạn ({items.reduce((acc, item) => acc + item.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#484834] hover:bg-[#f8ecdd] hover:text-[#201b12] transition-colors cursor-pointer"
              aria-label="Đóng giỏ hàng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#fdf2e3] flex items-center justify-center text-[#797862]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-display font-bold text-base text-[#201b12]">
                  Giỏ hàng của bạn đang trống
                </h3>
                <p className="text-xs text-[#484834] max-w-xs">
                  Hãy dạo quanh bộ sưu tập chăn sữa và túi tiện ích để chọn những món đồ xinh xắn cho tổ ấm nhé!
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Khám phá sản phẩm ngay
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.variant}`}
                  className="flex gap-3 p-3 rounded-xl bg-[#fdf2e3]/60 border border-[#cac7ae]/30 relative group"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-lg object-cover bg-white shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-display text-xs font-bold text-[#201b12] uppercase line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.variant)}
                          className="text-[#797862] hover:text-[#b62506] transition-colors p-1 cursor-pointer"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[#6b5d41] block">
                        Phân loại: {item.variant}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-[#b62506]">
                        {formatPrice(item.product.price)}
                      </span>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#cac7ae] rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.variant, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#f8ecdd] text-[#201b12] text-xs transition-colors cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#201b12]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.variant, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-[#f8ecdd] text-[#201b12] text-xs transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-[#cac7ae]/40 bg-[#fff8f2] space-y-4">
              
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-[#797862] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Mã voucher (HUGZSHOPEE20)..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-lg border border-[#cac7ae] uppercase font-semibold focus:outline-none focus:border-[#201b12]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-lg bg-[#ece1d2] hover:bg-[#f1ddba] text-[#201b12] text-xs font-bold transition-colors cursor-pointer"
                  >
                    Áp dụng
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Đã áp dụng giảm {discountPercent}% thành công!
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-[#b62506]">{couponError}</p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#484834] pt-2 border-t border-[#cac7ae]/30">
                <div className="flex justify-between">
                  <span>Tạm tính ({items.length} món):</span>
                  <span className="font-semibold text-[#201b12]">{formatPrice(rawSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Giảm giá voucher:</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-semibold">MIỄN PHÍ</span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#201b12] pt-2 border-t border-[#cac7ae]/20">
                  <span>Tổng thanh toán:</span>
                  <span className="text-base text-[#b62506]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleSimulateCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-3.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isCheckingOut ? (
                    <span>Đang khởi tạo đơn hàng...</span>
                  ) : (
                    <>
                      <span>Đặt hàng trực tiếp ({formatPrice(grandTotal)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* 2 Đường dẫn Shopee & TikTok */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="https://s.shopee.vn/9pbeimilNQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-[#EE4D2D]/10 hover:bg-[#EE4D2D] hover:text-white text-[#EE4D2D] text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Link Shopee</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://www.tiktok.com/@hugzvietnam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-black/5 hover:bg-black hover:text-white text-[#201b12] text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-center"
                  >
                    <span>Link TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
