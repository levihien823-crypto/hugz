import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { 
  X, Star, ShieldCheck, Truck, RotateCcw, Box, ExternalLink, 
  Heart, Share2, ZoomIn, Check, Sparkles, Wind, 
  MessageCircle, ArrowRight, ChevronRight, Layers, Award,
  ShoppingBag, Plus, Minus
} from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../utils/analytics';
import { PRODUCTS } from '../data/products';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, quantity: number, variant: string) => void;
  onBuyNowDirect?: (product: Product, quantity: number, variant: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
  onAddToCart,
  onBuyNowDirect,
}) => {
  if (!product) return null;

  // Active gallery index
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Selected Variant (from product.variants)
  const availableVariants = product.variants && product.variants.length > 0
    ? product.variants
    : ['Tiêu chuẩn HUGZ'];
  const [selectedVariant, setSelectedVariant] = useState(availableVariants[0]);

  // Build gallery items dynamically from product
  const galleryItems = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [
        {
          id: '1',
          url: product.image,
          title: product.title,
          desc: product.subtitle || 'Ảnh sản phẩm chính hãng HUGZ Living',
          badge: 'Ảnh chính hãng'
        }
      ];

  // Current active image
  const activeImage = galleryItems[activeImageIndex] || galleryItems[0];

  // Dynamic price calculation
  const currentPrice = product.price;
  const currentOriginalPrice = product.originalPrice || Math.round(currentPrice * 1.35);

  // Check favorite in localStorage
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem('hugz_favorites') || '[]');
      setIsFavorite(favs.includes(product.id));
    } catch {
      // ignore
    }
  }, [product.id]);

  const toggleFavorite = () => {
    try {
      const favs: string[] = JSON.parse(localStorage.getItem('hugz_favorites') || '[]');
      let updated: string[];
      if (favs.includes(product.id)) {
        updated = favs.filter(id => id !== product.id);
        setIsFavorite(false);
        triggerToast('Đã bỏ lưu sản phẩm khỏi mục yêu thích');
      } else {
        updated = [...favs, product.id];
        setIsFavorite(true);
        triggerToast('Đã lưu sản phẩm vào mục yêu thích ❤️');
      }
      localStorage.setItem('hugz_favorites', JSON.stringify(updated));
    } catch {
      setIsFavorite(!isFavorite);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    triggerToast('Đã sao chép liên kết trang sản phẩm!');
  };

  const triggerToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  // Cross-sell products (exclude current product)
  const crossSellProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl my-auto bg-[#fff8f2] text-[#201b12] rounded-3xl shadow-2xl border border-[#cac7ae]/50 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Desktop Top Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#fff8f2]/95 backdrop-blur-md border-b border-[#cac7ae]/40">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs text-[#797862] font-medium overflow-hidden">
            <span className="hover:text-[#201b12] cursor-pointer" onClick={onClose}>Trang chủ</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="hover:text-[#201b12] cursor-pointer" onClick={onClose}>{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[#201b12] font-bold truncate max-w-[280px] sm:max-w-md">
              {product.title}
            </span>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white/80 hover:bg-white text-[#797862] hover:text-[#201b12] border border-[#cac7ae]/40 transition-colors cursor-pointer"
              title="Chia sẻ sản phẩm"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                isFavorite 
                  ? 'bg-red-50 text-red-500 border-red-200' 
                  : 'bg-white/80 hover:bg-white text-[#797862] hover:text-[#201b12] border-[#cac7ae]/40'
              }`}
              title={isFavorite ? "Đã yêu thích" : "Lưu vào yêu thích"}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] transition-colors cursor-pointer ml-1"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable PDP Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8 custom-scrollbar">
          
          {/* MAIN HERO SECTION: 2-COLUMN DESKTOP LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: GALLERY & THUMBNAILS (7 COLUMNS ON DESKTOP) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Main Showcase Image Frame */}
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#cac7ae]/50 shadow-sm flex items-center justify-center p-3 group">
                <img
                  src={activeImage.url}
                  alt={activeImage.title}
                  className="w-full h-full object-contain transition-all duration-300 group-hover:scale-102"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.badge ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black uppercase tracking-wider shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      <span>{product.badge}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black uppercase tracking-wider shadow-md">
                      <Award className="w-3.5 h-3.5" />
                      <span>Chính Hãng HUGZ</span>
                    </div>
                  )}
                  {product.isNew && (
                    <div className="px-3 py-1 rounded-full bg-[#201b12] text-white text-[11px] font-bold uppercase tracking-wider shadow-md w-fit">
                      Mới ra mắt
                    </div>
                  )}
                </div>

                {/* Zoom Trigger Button */}
                <button
                  onClick={() => setIsZoomOpen(true)}
                  className="absolute bottom-4 right-4 p-3 rounded-2xl bg-white/90 hover:bg-white text-[#201b12] shadow-lg border border-[#cac7ae]/40 backdrop-blur-md transition-all hover:scale-105 cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                >
                  <ZoomIn className="w-4 h-4 text-[#626200]" />
                  <span>Phóng to</span>
                </button>

                {/* Image Caption Overlay */}
                {activeImage.badge && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-[#201b12]/80 backdrop-blur-md text-white text-xs font-medium">
                    <span className="font-semibold text-[#f4f34d]">{activeImage.badge}</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row if multiple images */}
              {galleryItems.length > 1 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#797862] uppercase tracking-wider px-1">
                    <span>Góc nhìn chi tiết ({galleryItems.length} hình ảnh):</span>
                    <span className="text-[#626200] font-normal lowercase">chạm để xem chi tiết</span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-3">
                    {galleryItems.map((item, idx) => {
                      const isActive = idx === activeImageIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative aspect-square rounded-2xl overflow-hidden bg-white border-2 p-1 transition-all cursor-pointer group flex flex-col items-center justify-center ${
                            isActive 
                              ? 'border-[#201b12] ring-2 ring-[#f4f34d] shadow-md scale-102' 
                              : 'border-[#cac7ae]/50 hover:border-[#201b12]/60 opacity-80 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover rounded-xl"
                          />
                          {isActive && (
                            <div className="absolute inset-0 bg-[#201b12]/10 rounded-xl" />
                          )}
                          <span className="absolute bottom-1 inset-x-1 text-[9px] font-bold text-center bg-black/70 text-white rounded px-0.5 truncate py-0.5">
                            {item.badge || `Ảnh ${idx + 1}`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: BUYING ZONE & DIRECT OUTBOUND CTAS (5 COLUMNS ON DESKTOP) */}
            <div className="lg:col-span-5 space-y-5 flex flex-col">
              
              {/* Product Header */}
              <div className="space-y-2">
                {/* Brand & Mall Badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#d0011b] text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                    Shopee Mall
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#000000] text-white text-[11px] font-black tracking-wider uppercase shadow-xs">
                    TikTok Shop
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f4f34d]/60 text-[#201b12] text-xs font-bold">
                    HUGZ Living
                  </span>
                </div>

                <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[#201b12] leading-snug">
                  {product.title}
                </h1>

                {product.subtitle && (
                  <p className="text-sm text-[#797862] leading-relaxed">
                    {product.subtitle}
                  </p>
                )}

                {/* Rating & Sold count */}
                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1 font-bold text-[#E5A800]">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#E5A800] text-[#E5A800]" />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-black text-[#201b12]">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[#cac7ae]">|</span>
                  <span className="text-[#797862] font-semibold">
                    {product.reviewsCount} Đánh giá
                  </span>
                  <span className="text-[#cac7ae]">|</span>
                  <span className="text-[#626200] font-bold bg-[#fdf2e3] px-2 py-0.5 rounded-md">
                    {product.soldCount.includes('đã bán') ? product.soldCount : `${product.soldCount} đã bán`}
                  </span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#cac7ae]/50 shadow-xs flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-3xl font-black text-[#EE4D2D]">
                    {formatPrice(currentPrice)}
                  </span>
                  {currentOriginalPrice > currentPrice && (
                    <span className="text-sm text-[#797862] line-through">
                      {formatPrice(currentOriginalPrice)}
                    </span>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {currentOriginalPrice > currentPrice && (
                    <span className="px-2.5 py-1 rounded-full bg-red-100 text-[#b62506] text-xs font-black">
                      TIẾT KIỆM {formatPrice(currentOriginalPrice - currentPrice)}
                    </span>
                  )}
                  <span className="text-[10px] text-[#797862] mt-0.5 font-medium">
                    Giá chính hãng HUGZ
                  </span>
                </div>
              </div>

              {/* PRODUCT VARIANTS SELECTION */}
              {availableVariants.length > 0 && (
                <div className="space-y-2.5 p-4 rounded-2xl bg-white/70 border border-[#cac7ae]/40">
                  <div className="flex items-center justify-between text-xs font-bold text-[#201b12] uppercase tracking-wider">
                    <span>Phân loại / Mẫu mã:</span>
                    <span className="text-[#626200] normal-case font-bold">{selectedVariant}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {availableVariants.map((v) => {
                      const isSelected = selectedVariant === v;
                      return (
                        <button
                          key={v}
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                            isSelected 
                              ? 'border-[#201b12] bg-[#201b12] text-white shadow-xs' 
                              : 'border-[#cac7ae]/60 bg-white text-[#201b12] hover:border-[#201b12]/50'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#f4f34d]" />}
                          <span>{v}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PRODUCT SPECIFICATIONS HIGHLIGHT */}
              {(product.dimensions || product.material) && (
                <div className="p-3.5 rounded-2xl bg-[#fdf2e3] border border-[#cac7ae]/40 text-xs text-[#484834] space-y-1">
                  {product.dimensions && (
                    <div><strong>Kích thước:</strong> {product.dimensions}</div>
                  )}
                  {product.material && (
                    <div><strong>Chất liệu:</strong> {product.material}</div>
                  )}
                </div>
              )}

              {/* DIRECT WEBSITE ORDER SECTION */}
              <div className="p-4 rounded-2xl bg-white border-2 border-[#f4f34d] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#201b12] uppercase tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-[#626200]" />
                    <span>Đặt mua trực tiếp trên Website</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-[#1877F2] bg-[#eef7ff] px-2 py-0.5 rounded-full">
                    Xác nhận qua SMS / Zalo
                  </span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-[#484834] font-medium">Số lượng mua:</span>
                  <div className="flex items-center border border-[#cac7ae]/60 rounded-xl bg-[#faf6ef] p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#201b12] hover:bg-white transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-[#201b12]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#201b12] hover:bg-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (onAddToCart) {
                        onAddToCart(product, quantity, selectedVariant);
                        setToastText(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
                        setTimeout(() => setToastText(null), 3000);
                      }
                    }}
                    className="py-3 px-3 rounded-xl bg-white hover:bg-[#f8ecdd] border border-[#cac7ae] text-[#201b12] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#626200]" />
                    <span>Thêm vào giỏ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onBuyNowDirect) {
                        onBuyNowDirect(product, quantity, selectedVariant);
                      } else if (onAddToCart) {
                        onAddToCart(product, quantity, selectedVariant);
                      }
                    }}
                    className="py-3 px-3 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#201b12]" />
                    <span>Mua ngay</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#797862] text-center italic">
                  * Thông tin đơn hàng và mã vận đơn sẽ được gửi xác nhận qua SMS hoặc qua Zalo sớm nhất.
                </p>
              </div>

              {/* OUTBOUND MARKETPLACE CTAS */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1 bg-[#cac7ae]/40"></div>
                  <span className="text-[11px] font-bold text-[#797862] uppercase tracking-wider">
                    Hoặc đặt qua sàn thương mại điện tử
                  </span>
                  <div className="h-px flex-1 bg-[#cac7ae]/40"></div>
                </div>

                {/* 🟠 SHOPEE OUTBOUND BUTTON */}
                <a
                  href={buildTrackedUrl(product.shopeeUrl || 'https://shopee.vn/hugzvietnam', 'shopee', product.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackMarketplaceClick('Shopee', product.title, product.shopeeUrl || '', currentPrice)}
                  className="w-full py-4 px-5 rounded-2xl bg-[#EE4D2D] hover:bg-[#d73f20] text-white font-display shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-lg">
                      S
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold tracking-tight">Mua chính hãng tại Shopee</span>
                        <span className="px-1.5 py-0.5 rounded bg-white text-[#EE4D2D] text-[10px] font-black uppercase">
                          Mall
                        </span>
                      </div>
                      <p className="text-xs text-white/90 font-medium">
                        Freeship Xtra • Voucher 20k - 50k toàn sàn
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* ⚫ TIKTOK SHOP OUTBOUND BUTTON */}
                <a
                  href={buildTrackedUrl(product.tiktokUrl || 'https://www.tiktok.com/@hugzvietnam', 'tiktok', product.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackMarketplaceClick('TikTok', product.title, product.tiktokUrl || '', currentPrice)}
                  className="w-full py-4 px-5 rounded-2xl bg-[#111111] hover:bg-black text-white font-display shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-lg">
                      ♪
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-extrabold tracking-tight">Mua tại TikTok Shop</span>
                        <span className="px-1.5 py-0.5 rounded bg-[#FE2C55] text-white text-[10px] font-black uppercase">
                          Live Deal
                        </span>
                      </div>
                      <p className="text-xs text-white/80 font-medium">
                        Ưu đãi Live độc quyền • Freeship toàn quốc
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Secondary Actions: Facebook Chat & Wishlist */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <a
                    href="https://www.facebook.com/thehugzlife"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-white hover:bg-[#f8ecdd] border border-[#cac7ae]/50 text-[#1877F2] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#1877F2]" />
                    <span>Chat Facebook Fanpage</span>
                  </a>

                  <button
                    onClick={toggleFavorite}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isFavorite 
                        ? 'bg-red-50 text-red-600 border-red-200' 
                        : 'bg-white hover:bg-[#f8ecdd] border-[#cac7ae]/50 text-[#201b12]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-[#797862]'}`} />
                    <span>{isFavorite ? 'Đã yêu thích' : 'Lưu vào yêu thích'}</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* 4. HỘP CAM KẾT MUA SẮM AN TÂM (4 PILLARS) */}
          <div className="p-6 rounded-3xl bg-white border border-[#cac7ae]/40 shadow-xs">
            <h3 className="font-display text-base font-bold text-[#201b12] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#626200]" />
              <span>4 Cam kết mua sắm an tâm từ HUGZ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#cac7ae]/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0">
                  <RotateCcw className="w-5 h-5 text-[#201b12]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#201b12]">Đổi trả 7 ngày</div>
                  <div className="text-[11px] text-[#797862] mt-0.5 leading-snug">
                    Miễn phí đổi hàng nếu lỗi sản xuất hoặc không vừa ý
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#cac7ae]/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#201b12] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#201b12]">100% Chính hãng</div>
                  <div className="text-[11px] text-[#797862] mt-0.5 leading-snug">
                    Nguyên tem mác HUGZ Living, đền 200% nếu phát hiện giả
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#cac7ae]/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0">
                  <Truck className="w-5 h-5 text-[#201b12]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#201b12]">Giao nhanh 2h</div>
                  <div className="text-[11px] text-[#797862] mt-0.5 leading-snug">
                    Hỗ trợ hỏa tốc nội thành Hà Nội & TP. Hồ Chí Minh
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#fff8f2] border border-[#cac7ae]/30 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#201b12] text-white flex items-center justify-center shrink-0">
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-[#201b12]">Hộp Kraft Eco</div>
                  <div className="text-[11px] text-[#797862] mt-0.5 leading-snug">
                    Đóng gói hộp giấy bảo vệ môi trường, chỉn chu lịch sự
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. TECH SPECS & CARE GUIDE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Tech Specs Table (7 Columns) */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-[#cac7ae]/40 space-y-4 shadow-xs">
              <h3 className="font-display text-base font-bold text-[#201b12] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#626200]" />
                <span>Chi tiết tính năng & Thông số</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="text-[#484834] leading-relaxed mb-3">
                  {product.description}
                </div>

                {product.features && product.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#cac7ae]/30">
                    <span className="font-bold text-[#201b12] block">Điểm nổi bật:</span>
                    {product.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-[#484834]">
                        <Check className="w-3.5 h-3.5 text-[#626200] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Care Guide with Visual Icons (5 Columns) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#fdf2e3] border border-[#cac7ae]/40 space-y-4">
              <h3 className="font-display text-base font-bold text-[#201b12] flex items-center gap-2">
                <Wind className="w-4 h-4 text-[#626200]" />
                <span>Hướng dẫn bảo quản & Sử dụng</span>
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-white border border-[#cac7ae]/30 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-[#f4f34d]/60 flex items-center justify-center font-bold">
                    🧼
                  </div>
                  <div className="font-bold text-[#201b12]">Vệ sinh đúng cách</div>
                  <div className="text-[11px] text-[#797862] leading-snug">
                    Dùng khăn ẩm lau sạch bụi hoặc giũ nhẹ
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#cac7ae]/30 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center font-bold">
                    🍃
                  </div>
                  <div className="font-bold text-[#201b12]">Nơi khô thoáng</div>
                  <div className="text-[11px] text-[#797862] leading-snug">
                    Bảo quản ở nơi khô ráo, tránh ẩm mốc
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#cac7ae]/30 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-bold">
                    🚫
                  </div>
                  <div className="font-bold text-[#201b12]">Không giặt tẩy mạnh</div>
                  <div className="text-[11px] text-[#797862] leading-snug">
                    Tránh hóa chất tẩy rửa mạnh để bền màu
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-[#cac7ae]/30 space-y-1">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center font-bold">
                    ☀️
                  </div>
                  <div className="font-bold text-[#201b12]">Tránh nắng gắt</div>
                  <div className="text-[11px] text-[#797862] leading-snug">
                    Không phơi trực tiếp dưới nắng gắt quá lâu
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. SOCIAL PROOF & FEEDBACK REVIEW GRID */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#cac7ae]/40 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#cac7ae]/30">
              <div>
                <h3 className="font-display text-xl font-extrabold text-[#201b12]">
                  Đánh giá từ khách hàng đã mua
                </h3>
                <p className="text-xs text-[#797862] mt-0.5">
                  Đánh giá 5 sao từ gian hàng chính hãng Shopee Mall & TikTok Shop
                </p>
              </div>

              <div className="flex items-center gap-3 bg-[#fff8f2] px-4 py-2.5 rounded-2xl border border-[#cac7ae]/30">
                <div className="font-display text-2xl font-black text-[#201b12]">{product.rating.toFixed(1)}</div>
                <div className="flex flex-col">
                  <div className="flex text-[#E5A800]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#E5A800]" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#797862] font-semibold">{product.soldCount}</span>
                </div>
              </div>
            </div>

            {/* Verified Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: 'rev-1',
                  author: 'Ngọc Mai',
                  rating: 5,
                  date: '2 ngày trước',
                  comment: 'Hàng nhận được rất đẹp, vải dày dặn và đường kim mũi chỉ chắc chắn. Đóng gói cẩn thận 10 điểm!',
                  source: 'Shopee'
                },
                {
                  id: 'rev-2',
                  author: 'Hoàng Yến',
                  rating: 5,
                  date: '5 ngày trước',
                  comment: 'Săn sale trên TikTok Shop được giá hời. Sản phẩm chuẩn chỉ như hình mẫu, rất ưng ý.',
                  source: 'TikTok'
                },
                {
                  id: 'rev-3',
                  author: 'Thanh Thảo',
                  rating: 5,
                  date: '1 tuần trước',
                  comment: 'Màu sắc nhã nhặn đúng gu HUGZ. Đựng đồ cực kỳ gọn gàng tiện lợi.',
                  source: 'Shopee'
                }
              ].map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-[#fff8f2] border border-[#cac7ae]/30 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-[#201b12]">{rev.author}</div>
                        <div className="text-[10px] text-[#797862]">{rev.date}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rev.source === 'Shopee' ? 'bg-[#EE4D2D]/10 text-[#EE4D2D]' : 'bg-black text-white'
                      }`}>
                        {rev.source}
                      </span>
                    </div>

                    <div className="flex text-[#E5A800]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E5A800]" />
                      ))}
                    </div>

                    <p className="text-xs text-[#484834] leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. CROSS-SELL: SẢN PHẨM GỢI Ý MUA CÙNG */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-extrabold text-[#201b12]">
                  Sản phẩm gợi ý mua cùng BST
                </h3>
                <p className="text-xs text-[#797862] mt-0.5">
                  Đồng bộ phong cách sống ấm áp cho gia đình bạn
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {crossSellProducts.map((item) => (
                <div 
                  key={item.id}
                  className="rounded-2xl bg-white border border-[#cac7ae]/40 p-3 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-2">
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-[#faf6ef] p-2">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                      />
                      {item.badge && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#f4f34d] text-[#201b12] text-[10px] font-bold uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-xs text-[#201b12] line-clamp-2 leading-snug">
                        {item.title}
                      </h4>
                      <div className="text-[11px] text-[#797862] mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#cac7ae]/30 flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-black text-[#EE4D2D]">
                      {formatPrice(item.price)}
                    </span>

                    {onSelectProduct ? (
                      <button
                        onClick={() => onSelectProduct(item)}
                        className="px-3 py-1.5 rounded-lg bg-[#201b12] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Xem chi tiết</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <a
                        href={buildTrackedUrl(item.shopeeUrl, 'shopee', item.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#EE4D2D] text-white text-xs font-bold transition-colors"
                      >
                        Xem sàn
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FULLSCREEN ZOOM LIGHTBOX MODAL */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-[#f4f34d] text-sm font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Đóng phóng to</span>
              <X className="w-6 h-6" />
            </button>
            <img 
              src={activeImage.url} 
              alt={activeImage.title} 
              className="max-h-[80vh] w-auto object-contain rounded-2xl shadow-2xl" 
            />
            <div className="mt-4 text-center text-white">
              <h4 className="text-base font-bold text-[#f4f34d]">{activeImage.title}</h4>
              <p className="text-xs text-white/80 mt-1">{activeImage.desc}</p>
            </div>
          </div>
        </div>
      )}

      {/* IN-MODAL FEEDBACK TOAST */}
      {toastText && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2 rounded-full bg-[#201b12] text-white text-xs font-bold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#f4f34d]" />
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
};
