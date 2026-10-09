import React from 'react';
import { Product } from '../types';
import { Star, ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../utils/analytics';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetail,
  onAddToCart,
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
      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-[#cac7ae]/40 group hover:-translate-y-1"
    >
      <div>
        {/* Thumbnail with Badge & Quick Actions */}
        <div 
          onClick={() => onOpenDetail(product)}
          className="relative w-full h-60 sm:h-64 rounded-xl overflow-hidden bg-[#f8ecdd] mb-3 cursor-pointer"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase shadow-sm ${getBadgeBg()}`}>
              {product.badge}
            </span>
          )}

          {/* Hover overlay with quick view */}
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
        <div className="flex items-center gap-1.5 text-xs mb-1">
          <div className="flex items-center text-[#E5A800] font-bold">
            <Star className="w-3.5 h-3.5 fill-[#E5A800] text-[#E5A800]" />
            <span className="ml-1">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[#484834]">
            ({product.reviewsCount} đánh giá • {product.soldCount.includes('đã bán') ? product.soldCount : `${product.soldCount} đã bán`})
          </span>
        </div>

        {/* Title & Description */}
        <h3 
          onClick={() => onOpenDetail(product)}
          className="font-display text-base font-bold text-[#201b12] mb-1 tracking-tight group-hover:text-[#626200] transition-colors cursor-pointer line-clamp-1"
        >
          <span className="bg-[#d0011b] text-white text-[10px] font-black px-1.5 py-0.5 rounded mr-1.5 shrink-0 inline-block align-middle">
            Mall
          </span>
          {product.title}
        </h3>
        <p className="text-xs text-[#484834] mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-xl font-bold text-[#b62506]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#797862] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-auto">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="pt-3 border-t border-[#f8ecdd] space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddToCart(product)}
            className="py-2.5 px-2.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Thêm giỏ</span>
          </button>
          <button
            onClick={() => onOpenDetail(product)}
            className="py-2.5 px-2.5 rounded-xl bg-[#fdf2e3] hover:bg-[#f1ddba] text-[#201b12] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border border-[#cac7ae]/40 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Chi tiết</span>
          </button>
        </div>

        {/* 2 Đường dẫn Shopee & TikTok có gắn tự động tham số theo dõi UTM */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <a
            href={buildTrackedUrl(product.shopeeUrl || 'https://shopee.vn/hugzvietnam', 'shopee', product.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackMarketplaceClick('Shopee', product.title, product.shopeeUrl || '', product.price);
            }}
            className="py-1.5 px-2 rounded-lg bg-[#EE4D2D]/10 hover:bg-[#EE4D2D] hover:text-white text-[#EE4D2D] text-[11px] font-bold transition-all flex items-center justify-center gap-1 text-center"
            title="Đường dẫn Shopee"
          >
            <span>Shopee</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href={buildTrackedUrl(product.tiktokUrl || 'https://www.tiktok.com/@hugzvietnam', 'tiktok', product.id)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              trackMarketplaceClick('TikTok', product.title, product.tiktokUrl || '', product.price);
            }}
            className="py-1.5 px-2 rounded-lg bg-black/5 hover:bg-black hover:text-white text-[#201b12] text-[11px] font-bold transition-all flex items-center justify-center gap-1 text-center"
            title="Đường dẫn TikTok"
          >
            <span>TikTok</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
