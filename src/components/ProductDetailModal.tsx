import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, RotateCcw, ExternalLink } from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../utils/analytics';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : 'Mặc định'
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-[#cac7ae]/40 p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#f8ecdd] hover:bg-[#f2e7d8] text-[#201b12] transition-colors cursor-pointer z-10"
          aria-label="Đóng chi tiết"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Left: Image Showcase */}
          <div className="md:col-span-6 flex flex-col gap-3">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#faf6ef] border border-[#cac7ae]/40 flex items-center justify-center p-2">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase shadow-sm z-10">
                  {product.badge}
                </span>
              )}
            </div>
            
            {/* Guarantees small bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-[#484834] pt-1">
              <div className="p-2 rounded-lg bg-[#fdf2e3] flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#626200]" />
                <span>100% Chính hãng</span>
              </div>
              <div className="p-2 rounded-lg bg-[#fdf2e3] flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#626200]" />
                <span>Đổi trả 7 ngày</span>
              </div>
              <div className="p-2 rounded-lg bg-[#fdf2e3] flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#626200]" />
                <span>Hỏa tốc 2 giờ</span>
              </div>
            </div>
          </div>

          {/* Right: Info & Purchase */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Category tag & Rating */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-[#f8ecdd] text-xs font-semibold text-[#6b5d41]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#E5A800] font-bold">
                  <Star className="w-4 h-4 fill-[#E5A800]" />
                  <span>{product.rating.toFixed(1)}</span>
                  <span className="text-[#484834] font-normal">
                    ({product.reviewsCount} đánh giá • {product.soldCount.includes('đã bán') ? product.soldCount : `${product.soldCount} đã bán`})
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#201b12] tracking-tight">
                  <span className="bg-[#d0011b] text-white text-xs font-black px-2 py-0.5 rounded mr-2 shrink-0 inline-block align-middle">
                    Shopee Mall
                  </span>
                  {product.title}
                </h2>
                {product.subtitle && (
                  <p className="text-sm text-[#484834] mt-0.5">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 p-3 rounded-xl bg-[#fdf2e3]/80 border border-[#cac7ae]/30">
                <span className="font-display text-2xl sm:text-3xl font-bold text-[#b62506]">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-[#797862] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded ml-auto">
                  Tiết kiệm {formatPrice(product.originalPrice - product.price)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[#484834] leading-relaxed">
                {product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#201b12] uppercase">
                    Phân loại / Họa tiết: <span className="font-normal text-[#626200]">{selectedVariant}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                          selectedVariant === v
                            ? 'bg-[#201b12] text-white border-[#201b12] shadow-xs'
                            : 'bg-white text-[#484834] border-[#cac7ae] hover:border-[#201b12]'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs font-bold text-[#201b12] uppercase">Số lượng:</span>
                <div className="flex items-center border border-[#cac7ae] rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#f8ecdd] text-[#201b12] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-[#201b12]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center hover:bg-[#f8ecdd] text-[#201b12] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Specifications */}
              {(product.dimensions || product.material) && (
                <div className="text-xs text-[#484834] space-y-1 pt-2 border-t border-[#f8ecdd]">
                  {product.dimensions && (
                    <p>• <strong>Kích thước:</strong> {product.dimensions}</p>
                  )}
                  {product.material && (
                    <p>• <strong>Chất liệu:</strong> {product.material}</p>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-6 mt-4 border-t border-[#cac7ae]/30">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 px-4 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Đã thêm vào giỏ hàng!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Thêm vào giỏ hàng ({formatPrice(product.price * quantity)})</span>
                  </>
                )}
              </button>

              {/* 2 Đường dẫn liên kết Shopee & TikTok */}
              <div className="pt-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-[#cac7ae]/30"></div>
                  <span className="text-[11px] font-semibold text-[#797862] uppercase tracking-wider">
                    Hoặc đặt mua nhanh qua sàn
                  </span>
                  <div className="h-px flex-1 bg-[#cac7ae]/30"></div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={buildTrackedUrl(product.shopeeUrl || 'https://shopee.vn/hugzvietnam', 'shopee', product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackMarketplaceClick('Shopee', product.title, product.shopeeUrl || '', product.price)}
                    className="py-2.5 px-3 rounded-xl bg-[#EE4D2D] hover:bg-[#d83f21] text-white font-display text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                  >
                    <span>Link Shopee</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                  </a>

                  <a
                    href={buildTrackedUrl(product.tiktokUrl || 'https://www.tiktok.com/@hugzvietnam', 'tiktok', product.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackMarketplaceClick('TikTok', product.title, product.tiktokUrl || '', product.price)}
                    className="py-2.5 px-3 rounded-xl bg-[#111111] hover:bg-black text-white font-display text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                  >
                    <span>Link TikTok</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
