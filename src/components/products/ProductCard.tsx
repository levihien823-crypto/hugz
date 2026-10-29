import React from 'react';
import { Product } from '../../types';
import { Star, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../../utils/analytics';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onBuyNowDirect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart,
  onBuyNowDirect,
}) => {
  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const getBadgeBg = () => {
    if (product.badgeColor === 'tertiary') return 'bg-[#b62506] text-white';
    if (product.badgeColor === 'secondary') return 'bg-[#f1ddba] text-[#241a05]';
    return 'bg-[#f4f34d] text-[#201b12]';
  };

  return (
    <article 
      id={`product-card-${product.id}`}
      className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#cac7ae]/40 group hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail with Badge & Quick Actions */}
        <div 
          onClick={() => onOpenDetail(product)}
          className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-[#faf6ef] mb-2 sm:mb-3 cursor-pointer flex items-center justify-center border border-[#ece8df] p-1 group"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-md sm:rounded-lg"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-1.5 left-1.5 sm:top-2 sm:left-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase shadow-2xs z-10 ${getBadgeBg()}`}>
              {product.badge}
            </span>
          )}

          {/* Hover overlay with quick view on desktop */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(product);
              }}
              className="p-2.5 rounded-full bg-white/95 text-[#201b12] hover:bg-[#f4f34d] hover:scale-110 transition-all shadow-md cursor-pointer"
              title="Xem nhanh chi tiết"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="p-2.5 rounded-full bg-white/95 text-[#201b12] hover:bg-[#f4f34d] hover:scale-110 transition-all shadow-md cursor-pointer"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rating & Sold Info */}
        <div className="flex items-center gap-1 text-[11px] sm:text-xs mb-1 flex-wrap">
          <div className="flex items-center text-[#E5A800] font-bold">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#E5A800] text-[#E5A800]" />
            <span className="ml-0.5">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[#484834] truncate text-[10px] sm:text-xs">
            ({product.soldCount.includes('đã bán') ? product.soldCount : `${product.soldCount} đã bán`})
          </span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetail(product)}
          className="font-display text-xs sm:text-base font-bold text-[#201b12] mb-2 sm:mb-3 tracking-tight group-hover:text-[#626200] transition-colors cursor-pointer line-clamp-2 leading-snug min-h-[2.4rem] sm:min-h-[2.75rem]"
        >
          <span className="bg-[#d0011b] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded mr-1 shrink-0 inline-block align-middle">
            Mall
          </span>
          {product.title}
        </h3>

        {/* Pricing */}
        <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2 sm:mb-4 flex-wrap">
          <span className="font-display text-sm sm:text-xl font-black text-[#b62506]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-[10px] sm:text-xs text-[#797862] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-[9px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1 sm:px-1.5 py-0.5 rounded ml-auto">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-2 sm:pt-3 border-t border-[#f8ecdd] space-y-1.5 sm:space-y-2">
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          {onBuyNowDirect ? (
            <button
              onClick={() => onBuyNowDirect(product)}
              className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
              title="Đặt mua trực tiếp trên website"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#201b12]" />
              <span>Mua ngay</span>
            </button>
          ) : (
            <button
              onClick={() => onAddToCart(product)}
              className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Thêm giỏ</span>
            </button>
          )}

          <button
            onClick={() => onAddToCart(product)}
            className="py-2 sm:py-2.5 px-1.5 sm:px-2 rounded-lg sm:rounded-xl bg-[#fdf2e3] hover:bg-[#f1ddba] text-[#201b12] text-[11px] sm:text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-[#cac7ae]/40 cursor-pointer"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#626200]" />
            <span>Thêm giỏ</span>
          </button>
        </div>

        {/* 2 Đường dẫn Shopee & TikTok */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
          <a
            href={buildTrackedUrl(product.shopeeUrl || 'https://shopee.vn/hugzvietnam', 'shopee', product.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackMarketplaceClick('Shopee', product.title, product.shopeeUrl || '', product.price);
            }}
            className="py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-md sm:rounded-lg bg-[#EE4D2D]/10 hover:bg-[#EE4D2D] hover:text-white text-[#EE4D2D] text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 text-center"
            title="Đường dẫn Shopee"
          >
            <span>Shopee</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </a>
          <a
            href={buildTrackedUrl(product.tiktokUrl || 'https://www.tiktok.com/@hugzvietnam', 'tiktok', product.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackMarketplaceClick('TikTok', product.title, product.tiktokUrl || '', product.price);
            }}
            className="py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-md sm:rounded-lg bg-black/5 hover:bg-black hover:text-white text-[#201b12] text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 text-center"
            title="Đường dẫn TikTok"
          >
            <span>TikTok</span>
            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
