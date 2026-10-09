import React from 'react';
import { Product, NavTab } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ECOSYSTEM_PILLARS, CATEGORIES } from '../data/products';
import { 
  ArrowDown, 
  Sparkles, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  Package, 
  Leaf, 
  Droplets, 
  Heart, 
  Maximize2,
  Eye,
  ExternalLink,
  CheckCircle2,
  Layers,
  Utensils,
  FileText,
  Bookmark,
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectTab: (tab: NavTab) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onCopyVoucher: (code: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  onOpenDetail,
  onAddToCart,
  onSelectTab,
  selectedCategory,
  onSelectCategory,
  onCopyVoucher,
}) => {
  const categoryPills = [
    { id: 'all', label: 'Tất cả sản phẩm (16)' },
    { id: 'thuc-pham-an-uong', label: '01. Thực phẩm & Ăn uống' },
    { id: 'vat-dung-nho', label: '02. Vật dụng nhỏ' },
    { id: 'tai-lieu', label: '03. Túi đựng tài liệu' },
    { id: 'do-ca-nhan', label: '04. Túi đựng đồ cá nhân' },
    { id: 'phan-loai-san-pham', label: '05. Lưu trữ theo phân loại' },
  ];

  // Best sellers list (9 items)
  const bestSellers = products.filter((p) => p.isBestSeller || p.rating >= 4.9);

  // New arrivals collection items
  const newArrivals = products.filter((p) => p.isNew);

  return (
    <div className="flex flex-col w-full">
      
      {/* Hero Section Lifestyle */}
      <section className="w-full relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-[#fff8f2] via-[#fff8f2] to-[#fdf2e3]/40">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#f4f34d]/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-[#f1ddba]/30 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 flex flex-col gap-6 z-10">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#fdf2e3] border border-[#cac7ae]/60 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4f34d] border border-[#626200]/30 shrink-0"></span>
                <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#201b12]">
                  PHONG CÁCH SỐNG GIA ĐÌNH HIỆN ĐẠI
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="font-display text-3xl sm:text-4xl lg:text-[44px] font-black text-[#201b12] leading-[1.18] tracking-tight uppercase">
                  <span className="block">HỆ SINH THÁI</span>
                  <span className="block text-[#626200]">SẢN PHẨM TOÀN DIỆN</span>
                </h1>
                <p className="font-display text-base sm:text-lg lg:text-xl font-bold text-[#484834] leading-snug">
                  Giải pháp sắp xếp & lưu trữ thông minh cho tổ ấm hiện đại
                </p>
              </div>

              <p className="text-sm sm:text-base text-[#5c5443] max-w-xl leading-relaxed">
                Biến việc sắp xếp và bảo quản đồ đạc thành một phần của phong cách sống thẩm mỹ mỗi ngày. HUGZ kiến tạo 5 nhóm giải pháp lưu trữ toàn diện, giải quyết triệt để từng nhu cầu thiết thực: từ gian bếp gia đình, góc làm đẹp, bàn làm việc cho tới hành lý trên những chuyến du hành xa.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#danh-muc"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#201b12] hover:bg-black text-white font-display text-sm sm:text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Khám phá 5 nhóm giải pháp</span>
                  <ArrowDown className="w-4 h-4" />
                </a>
                <a
                  href="#kenh-mua-hang"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-[#201b12] font-display text-sm font-semibold shadow-xs hover:bg-[#f8ecdd] transition-all border border-[#cac7ae]/40 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-[#b62506]"></span>
                  <span>Mua trên Shopee & TikTok</span>
                </a>
              </div>

              {/* Highlight Micro Badges */}
              <div className="pt-3 flex items-center gap-6 sm:gap-8 flex-wrap">
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">5 Nhóm</span>
                  <span className="text-xs text-[#484834]">Giải pháp lưu trữ</span>
                </div>
                <div className="h-8 w-px bg-[#cac7ae]/50"></div>
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">16 Sản phẩm</span>
                  <span className="text-xs text-[#484834]">Chính hãng Shopee Mall</span>
                </div>
                <div className="h-8 w-px bg-[#cac7ae]/50"></div>
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">100% Kháng nước</span>
                  <span className="text-xs text-[#484834]">Bền bỉ & Tiện ích</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Bento */}
            <div className="lg:col-span-6 grid grid-cols-12 gap-4 relative">
              {/* Main Hero Image (Chăn sữa) */}
              <div 
                onClick={() => {
                  const chan = products.find((p) => p.id === 'chan-sua-hugz');
                  if (chan) onOpenDetail(chan);
                }}
                className="col-span-7 relative group rounded-2xl overflow-hidden shadow-xl bg-[#f8ecdd] cursor-pointer"
              >
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-dhihuBqQ01UYv1jcruTXfOV6ao2npzNhy6RRyjhOACGn-8_MYA6srFMCki7uz9l2C7TYzFkWzKVm62iiOx0SDCdPPMQElkpQTFsRxI4PIi6GDEmyU054gRCm2pbb3DccT2hHBOaD4sUD3MDb_HDyqSYsCjnv6iZznREKrHlL0aHBy3fcWrWKEnJoc0i6_nBTCTSLqurLG_ZuLMZFXWokOg4rgLN95ci6unGj5oyjG1XrdJdrRrEjdhgoi-vVLdUY-g"
                  alt="Chăn sữa HUGZ cao cấp vỗ về cảm xúc"
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4 text-white">
                  <span className="inline-block self-start px-2 py-0.5 rounded bg-[#f4f34d] text-[11px] font-bold text-[#201b12] uppercase mb-1">
                    Cảm hứng thu đông
                  </span>
                  <h3 className="font-display text-xl font-bold leading-tight">Chăn Sữa HUGZ</h3>
                  <p className="text-xs text-white/90">A warm refuge for kids with love</p>
                </div>
              </div>

              {/* Secondary Hero Image (Túi tote 2 lớp tháo rời) */}
              <div className="col-span-5 flex flex-col gap-4">
                <div 
                  onClick={() => {
                    const tote = products.find((p) => p.id === 'tui-tote-2-lop');
                    if (tote) onOpenDetail(tote);
                  }}
                  className="relative group rounded-2xl overflow-hidden shadow-lg bg-[#f8ecdd] flex-1 cursor-pointer"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzQyMo-pW6X7h5LVZU19A5Qu-qunTUBOXFCPpOihfcRCEqnXW7svwrtSNMq6WNqw1vl189DAEutO9wdBZhwHCWctms1LY56YLtvB9X-_A9y-mbiqDNHbBNIeHkh7erDg8ZBhy8uYmVNR33S7-JJbsFHDa-TEkr-x9GZDadjLOFagwHZ5YNP0WzTkmWj2vVWIYXiZOhtVT-st5WolKxromi0krrxnyhhwi-PGlEnJVXNn1ErKloFw4ke17x6PMbD8g9OPY"
                    alt="Túi tote tháo rời linh hoạt rực rỡ ngoài trời"
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-3 text-white">
                    <span className="font-display text-sm font-bold leading-tight">Túi Tote 2 Lớp</span>
                    <span className="text-[11px] text-[#f4f34d]">Tháo rời linh hoạt</span>
                  </div>
                </div>

                {/* Warm Comfort Quote Tag */}
                <div className="p-4 rounded-2xl bg-[#f1ddba]/70 shadow-xs flex flex-col justify-between border border-[#cac7ae]/40">
                  <div className="flex items-center gap-1.5 text-[#241a05]">
                    <span className="font-display text-base font-bold">hug</span>
                    <span className="text-xs font-bold text-[#484834]">(</span>
                    <span className="w-2 h-2 rounded-full bg-[#626200]"></span>
                    <span className="text-xs font-bold text-[#484834]">)</span>
                    <span className="font-display text-base font-bold">z</span>
                  </div>
                  <p className="text-xs text-[#241a05] font-medium mt-1 leading-snug">
                    "Đem lại sự thảnh thơi thông qua những sắc màu rạng rỡ và ngăn nắp."
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Quick Category Bar */}
      <section className="w-full py-5 bg-[#fdf2e3] border-y border-[#cac7ae]/30 sticky top-20 z-30 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 scrollbar-none">
            <span className="font-display text-sm font-bold text-[#201b12] whitespace-nowrap mr-1">
              Danh mục:
            </span>
            {categoryPills.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    if (cat.id !== 'all') {
                      onSelectTab('san-pham');
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? 'bg-[#201b12] text-white shadow-md'
                      : 'bg-white text-[#201b12] hover:bg-[#f2e7d8] border border-[#cac7ae]/40'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* KHÁM PHÁ 5 NHÓM GIẢI PHÁP LƯU TRỮ */}
      <section className="w-full py-16 sm:py-24 bg-gradient-to-b from-[#fff8f2] via-[#fdf6ec]/50 to-[#fff8f2]" id="danh-muc">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Ecosystem Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 border-b border-[#cac7ae]/40 pb-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ece1d2] text-xs font-bold uppercase text-[#201b12] mb-3.5 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4f34d]"></span>
                <span>5 NHÓM GIẢI PHÁP TIỆN ÍCH</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#201b12] uppercase tracking-tight">
                Chi Tiết 5 Nhóm Giải Pháp Lưu Trữ HUGZ
              </h2>
              <p className="font-display text-base sm:text-xl font-bold text-[#626200] mt-1.5">
                Phân loại thông minh theo từng không gian & thói quen sinh hoạt
              </p>
              <p className="text-xs sm:text-sm text-[#484834] mt-3 leading-relaxed">
                Mỗi nhóm sản phẩm được thiết kế tối ưu cho từng mục đích cụ thể: từ gian bếp gia đình, bàn trang điểm, góc làm việc tới hành lý trên những chuyến du hành xa.
              </p>
            </div>

            {/* Quick Stats & Action */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-[#201b12] bg-white px-4 py-2.5 rounded-xl border border-[#cac7ae]/40 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
                <span>5 Nhóm • 16 Giải Pháp Lưu Trữ</span>
              </div>
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectTab('san-pham');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#201b12] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer group"
              >
                <span>Xem trọn bộ danh mục</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 5 Pillars Layout */}
          <div className="space-y-6">
            
            {/* Row 1: 3 Pillars (01. Thực phẩm, 02. Vật dụng nhỏ, 03. Tài liệu) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ECOSYSTEM_PILLARS.slice(0, 3).map((pillar) => {
                const pillarProducts = products.filter((p) => p.categorySlug === pillar.id);

                return (
                  <article
                    key={pillar.id}
                    className="group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 hover:border-[#626200]/50"
                  >
                    {/* Top visual banner with photo */}
                    <div className="relative h-64 overflow-hidden bg-[#f8ecdd]">
                      <img
                        src={pillar.image}
                        alt={pillar.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      {/* Pillar Number Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black tracking-wider shadow-sm">
                          {pillar.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#201b12] text-[11px] font-bold">
                          {pillar.productCount} sản phẩm
                        </span>
                      </div>

                      {/* Number Watermark */}
                      <div className="absolute top-2 right-4 text-white/30 font-display font-black text-5xl select-none">
                        {pillar.pillarNumber}
                      </div>

                      {/* Tagline on image */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-xs font-medium drop-shadow-sm line-clamp-1">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div className="space-y-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626200]">
                            {pillar.subtitle}
                          </span>
                          <h3 className="font-display text-lg sm:text-xl font-bold text-[#201b12] group-hover:text-[#626200] transition-colors mt-0.5">
                            {pillar.name}
                          </h3>
                        </div>

                        <p className="text-xs text-[#484834] leading-relaxed">
                          {pillar.desc}
                        </p>

                        {/* Key benefits list */}
                        <div className="space-y-1.5 pt-2 border-t border-[#f1ddba]/40">
                          {pillar.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#201b12] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Products in this pillar */}
                      <div className="pt-3 border-t border-[#cac7ae]/30 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#797862] block mb-2">
                            Sản phẩm nổi bật trong nhóm:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pillarProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDetail(p);
                                }}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#fdf2e3] hover:bg-[#f4f34d] text-[#201b12] transition-colors border border-[#cac7ae]/40 truncate max-w-full text-left cursor-pointer"
                                title={p.title}
                              >
                                • {p.title.split(',')[0].slice(0, 32)}...
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectCategory(pillar.id);
                            onSelectTab('san-pham');
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#fdf2e3] hover:bg-[#201b12] text-[#201b12] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <span>Xem toàn bộ nhóm này ({pillar.productCount})</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Row 2: 2 Pillars (04. Túi đựng đồ cá nhân, 05. Lưu trữ theo phân loại sản phẩm) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Pillar 04: Túi đựng đồ cá nhân (Col 5) */}
              {(() => {
                const pillar = ECOSYSTEM_PILLARS[3];
                const pillarProducts = products.filter((p) => p.categorySlug === pillar.id);

                return (
                  <article
                    key={pillar.id}
                    className="lg:col-span-5 group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 hover:border-[#626200]/50"
                  >
                    <div className="relative h-72 overflow-hidden bg-[#f8ecdd]">
                      <img
                        src={pillar.image}
                        alt={pillar.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black tracking-wider shadow-sm">
                          {pillar.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#201b12] text-[11px] font-bold">
                          {pillar.productCount} sản phẩm
                        </span>
                      </div>

                      <div className="absolute top-2 right-4 text-white/30 font-display font-black text-5xl select-none">
                        {pillar.pillarNumber}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-xs font-medium drop-shadow-sm">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div className="space-y-3">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626200]">
                            {pillar.subtitle}
                          </span>
                          <h3 className="font-display text-xl font-bold text-[#201b12] group-hover:text-[#626200] transition-colors mt-0.5">
                            {pillar.name}
                          </h3>
                        </div>

                        <p className="text-xs text-[#484834] leading-relaxed">
                          {pillar.desc}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-[#f1ddba]/40">
                          {pillar.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#201b12] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#cac7ae]/30 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#797862] block mb-2">
                            Sản phẩm tâm điểm:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {pillarProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDetail(p);
                                }}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#fdf2e3] hover:bg-[#f4f34d] text-[#201b12] transition-colors border border-[#cac7ae]/40 truncate max-w-full text-left cursor-pointer"
                                title={p.title}
                              >
                                • {p.title.split(',')[0].slice(0, 36)}...
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectCategory(pillar.id);
                            onSelectTab('san-pham');
                          }}
                          className="w-full py-2.5 rounded-xl bg-[#fdf2e3] hover:bg-[#201b12] text-[#201b12] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                        >
                          <span>Xem toàn bộ nhóm này ({pillar.productCount})</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })()}

              {/* Pillar 05: Lưu trữ theo phân loại sản phẩm (Col 7 - Lớn nhất với 6 sản phẩm) */}
              {(() => {
                const pillar = ECOSYSTEM_PILLARS[4];
                const pillarProducts = products.filter((p) => p.categorySlug === pillar.id);

                return (
                  <article
                    key={pillar.id}
                    className="lg:col-span-7 group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 hover:border-[#626200]/50"
                  >
                    <div className="relative h-72 overflow-hidden bg-[#f8ecdd]">
                      <img
                        src={pillar.image}
                        alt={pillar.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black tracking-wider shadow-sm">
                          {pillar.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#201b12] text-[11px] font-bold">
                          {pillar.productCount} sản phẩm
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-[#201b12] text-white text-[11px] font-bold">
                          TỐI ƯU VALI 60%
                        </span>
                      </div>

                      <div className="absolute top-2 right-4 text-white/30 font-display font-black text-5xl select-none">
                        {pillar.pillarNumber}
                      </div>

                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-xs font-medium drop-shadow-sm">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-5">
                      <div className="space-y-4">
                        <div>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-[#626200]">
                            {pillar.subtitle}
                          </span>
                          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#201b12] group-hover:text-[#626200] transition-colors mt-0.5">
                            {pillar.name}
                          </h3>
                        </div>

                        <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                          {pillar.desc}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-[#f1ddba]/40">
                          {pillar.highlights.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-[#201b12] font-semibold bg-[#fff8f2] p-2 rounded-lg border border-[#cac7ae]/30">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e] shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#cac7ae]/30 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#797862] block mb-2">
                            6 giải pháp phân loại thông minh:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {pillarProducts.map((p) => (
                              <button
                                key={p.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDetail(p);
                                }}
                                className="flex items-center gap-2 p-2 rounded-xl bg-[#fdf2e3] hover:bg-[#f4f34d] text-[#201b12] transition-colors border border-[#cac7ae]/40 text-left cursor-pointer group/item"
                              >
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-9 h-9 rounded-lg object-cover shrink-0 border border-white"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-[#201b12] truncate">
                                    {p.title}
                                  </p>
                                  <p className="text-[10px] text-[#626200] font-semibold truncate">
                                    {p.subtitle || p.badge}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onSelectCategory(pillar.id);
                            onSelectTab('san-pham');
                          }}
                          className="w-full py-3 rounded-xl bg-[#201b12] hover:bg-black text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                        >
                          <span>Xem toàn bộ 6 sản phẩm phân loại du lịch & gia đình</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })()}

            </div>

          </div>
        </div>
      </section>

      {/* Best Sellers Grid & Bộ Đôi Outbound Buttons */}
      <section className="w-full py-16 bg-[#fdf2e3]/60" id="bo-suu-tap-moi">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW ARRIVALS • BỘ SƯU TẬP TIỆN ÍCH HẰNG NGÀY</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201b12]">
                Trọn Bộ Sưu Tập Tiện Ích Du Lịch & Đời Sống HUGZ
              </h2>
            </div>
            <p className="text-sm text-[#484834] max-w-md">
              Thiết kế họa tiết độc quyền mang đậm tinh thần “a warm refuge for kids with love”. Sắp xếp cuộc sống ngăn nắp, đầy sắc màu và niềm vui thảnh thơi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newArrivals.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Featured Horizontal Card: Túi Đựng Tài Liệu Mini */}
          {products.find((p) => p.id === 'tui-dung-tai-lieu-mini') && (
            <div className="mt-8">
              {(() => {
                const item = products.find((p) => p.id === 'tui-dung-tai-lieu-mini')!;
                return (
                  <article className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow border border-[#cac7ae]/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-5 relative h-64 sm:h-72 rounded-xl overflow-hidden bg-[#f8ecdd] group">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase shadow-sm">
                        DÙNG NGAY LẤY NGAY
                      </span>
                    </div>
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-[#E5A800] mb-1 font-bold">
                          <span>★ 5.0</span>
                          <span className="text-[#484834] font-normal">
                            ({item.reviewsCount} đánh giá • {item.soldCount} đã bán)
                          </span>
                        </div>
                        <h3 className="font-display text-xl sm:text-2xl font-bold text-[#201b12] uppercase tracking-tight mb-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#484834] leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="flex items-baseline gap-3 mb-6">
                          <span className="font-display text-2xl sm:text-3xl font-bold text-[#b62506]">
                            {new Intl.NumberFormat('vi-VN').format(item.price)}₫
                          </span>
                          <span className="text-sm text-[#797862] line-through">
                            {new Intl.NumberFormat('vi-VN').format(item.originalPrice)}₫
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                            Tiết kiệm 22%
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2.5 pt-4 border-t border-[#cac7ae]/30">
                        <div className="flex flex-wrap sm:flex-nowrap gap-3">
                          <button
                            onClick={() => onAddToCart(item)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>Thêm vào giỏ hàng</span>
                          </button>
                          <button
                            onClick={() => onOpenDetail(item)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white hover:bg-[#fdf2e3] text-[#201b12] font-display text-xs sm:text-sm font-semibold border border-[#cac7ae]/50 shadow-xs transition-all cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Xem chi tiết sản phẩm</span>
                          </button>
                        </div>

                        {/* 2 Đường dẫn liên kết Shopee & TikTok */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <a
                            href={item.shopeeUrl || 'https://s.shopee.vn/9pbeimilNQ'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-4 rounded-xl bg-[#EE4D2D] hover:bg-[#d83f21] text-white font-display text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                          >
                            <span>Link Shopee</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                          </a>
                          <a
                            href={item.tiktokUrl || 'https://www.tiktok.com/@hugzvietnam'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2.5 px-4 rounded-xl bg-[#111111] hover:bg-black text-white font-display text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all text-center"
                          >
                            <span>Link TikTok</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-90" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })()}
            </div>
          )}

        </div>
      </section>

      {/* Bestsellers Section (All 9 items) */}
      <section className="w-full py-16" id="san-pham-hugz">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d]/80 text-[#201b12] text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4 text-[#626200]" />
                <span>Bestsellers • Yêu Thích Nhất</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201b12]">
                Sản Phẩm Được Mua Nhiều Nhất
              </h2>
            </div>
            <p className="text-sm text-[#484834] max-w-sm">
              Nhấp nút sàn để đi thẳng đến gian hàng chính hãng nhận mã freeship & tích điểm thành viên.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Spotlight: Dòng Chăm Sóc Cá Nhân & Daily Care */}
      <section className="w-full py-16 bg-[#fdf2e3]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#f8ecdd] rounded-3xl p-6 lg:p-12 relative overflow-hidden shadow-lg border border-[#cac7ae]/40">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#f4f34d]/20 blur-2xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Text Info */}
              <div className="lg:col-span-6 flex flex-col gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#201b12] text-xs font-bold self-start shadow-xs">
                  <span className="text-[#626200] font-bold">HUGZ</span> • PREMIUM DAILY CARE
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201b12] leading-tight">
                  Khăn Bông & Khăn Khô 100% Thuần Tự Nhiên
                </h2>

                <p className="text-base text-[#484834] leading-relaxed">
                  Bộ giải pháp vệ sinh và chăm sóc cá nhân tinh khiết chuẩn Nhật Bản dành riêng cho làn da nhạy cảm của mẹ, bé và các bước skincare chuyên sâu hằng ngày.
                </p>

                {/* Feature Bullet List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white shadow-xs">
                    <Leaf className="w-5 h-5 text-[#626200] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#201b12]">100% Plant-based Rayon</h4>
                      <p className="text-[11px] text-[#484834]">Chiết xuất sợi tự nhiên tự phân hủy</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white shadow-xs">
                    <Droplets className="w-5 h-5 text-[#626200] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#201b12]">Thấm Hút Tối Đa</h4>
                      <p className="text-[11px] text-[#484834]">Không đổ xơ lông, không bám bụi vải</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white shadow-xs">
                    <Heart className="w-5 h-5 text-[#626200] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#201b12]">Êm Mịn Dịu Lành</h4>
                      <p className="text-[11px] text-[#484834]">An toàn cho trẻ sơ sinh và da mụn</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white shadow-xs">
                    <Maximize2 className="w-5 h-5 text-[#626200] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#201b12]">Kích Thước Tiêu Chuẩn</h4>
                      <p className="text-[11px] text-[#484834]">Bản to 200mm x 200mm tiện lợi</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onSelectCategory('khan-cotton');
                      onSelectTab('san-pham');
                    }}
                    className="px-5 py-3 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Mua combo tiết kiệm 30%
                  </button>
                  <span className="text-xs text-[#484834]">Đã bán hơn 20.000 gói toàn quốc</span>
                </div>
              </div>

              {/* Imagery Showcase */}
              <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-[#cac7ae]/40">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5U04j2MZwo0VG9Yxqqh7NzPFnWTCzR9DnfSg4i8aStqGlKgcB6RQfPJlErCultwAbLP76sL-lGpYOVtNk1Id124QJO9SHbcN5igN1BYTMvFSBcHXPLhi-OAZnZQxRNfBk9sB81sRZ8WDGIJuHfn4Ju-ppSMQZ1hVrE3_Aixpmj5rI7Sx-W1RIf3KWuxzYRZ0GPs5wfXt0xrepau0FL6zCyXAZ6sSxcc2EbtNITtSHQDzd77YhzCMiEnTHYub5HVQm-Bw"
                    alt="Khăn lau mặt Cotton 100% 60 tờ HUGZ Daizy Daily"
                    className="w-full h-56 sm:h-64 object-cover rounded-xl"
                  />
                  <div className="p-2 text-center">
                    <span className="text-xs font-bold text-[#201b12] block">Khăn Lau Mặt Tím (60 pcs)</span>
                    <span className="text-[11px] text-[#484834]">Skincare & Rửa mặt dịu êm</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden shadow-md bg-white p-2 border border-[#cac7ae]/40">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS7CYlJxUoHUst0FchmoRk-n1u-6Kja5nBwvOyCLJFGU3EokVzeeBH_a5oTvYoZ6-EoCnPmdqAiezqWolyyM0hEuoqMsBVUiOwGdae4_pR8_ty_JCg5fAqBQiJlDf9_WQrYZuq17ZzVJpHcfMOCPj8eQ85hVkbTZG3pZ_0LTplxm_LEmEGO1l5Uzeb1IZ0_Tf3dHCwyz7IfVESLpyws-0Gz6Q86ETEx7XwvqXfdTPYXf_Xd9MvH4PeF4YVk9WbpNxujNc"
                    alt="Khăn khô đa năng Daizy Daily 200 tờ"
                    className="w-full h-56 sm:h-64 object-cover rounded-xl"
                  />
                  <div className="p-2 text-center">
                    <span className="text-xs font-bold text-[#201b12] block">Khăn Khô Xanh Mint (200 pcs)</span>
                    <span className="text-[11px] text-[#484834]">Mẹ & Bé vệ sinh tiện lợi</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Cam Kết Thương Hiệu (Value Proposition Strip) */}
      <section className="w-full py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#cac7ae]/40">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d]/60 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#201b12]">100% Chính Hãng</h4>
                <p className="text-xs text-[#484834] mt-0.5">Thiết kế độc quyền từ thương hiệu HUGZ</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d]/60 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#201b12]">Đổi Trả 7 Ngày</h4>
                <p className="text-xs text-[#484834] mt-0.5">Miễn phí 100% nếu có lỗi từ nhà sản xuất</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d]/60 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#201b12]">Hỏa Tốc 2 Giờ</h4>
                <p className="text-xs text-[#484834] mt-0.5">Giao nhanh nội thành Hà Nội & TP.HCM</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d]/60 flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-[#201b12]">Đóng Gói Chỉn Chu</h4>
                <p className="text-xs text-[#484834] mt-0.5">Bao bì hộp kraft cao cấp bảo vệ môi trường</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Kênh Mua Hàng Chính Hãng & Direct Outbound Hub */}
      <section className="w-full py-16" id="kenh-mua-hang">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#f2e7d8] via-white to-[#fdf2e3] rounded-3xl p-6 sm:p-10 lg:p-14 shadow-md text-center flex flex-col items-center border border-[#cac7ae]/40">
            
            <span className="px-4 py-1.5 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold mb-3 uppercase tracking-wider">
              Official Marketplace Hub
            </span>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201b12] max-w-2xl leading-tight mb-3">
              Mua Sắm Dễ Dàng Với Trọn Vẹn Ưu Đãi
            </h2>

            <p className="text-sm sm:text-base text-[#484834] max-w-xl mb-8 leading-relaxed">
              Trải nghiệm mua sắm nhanh chóng, nhận voucher độc quyền 20% cùng chính sách bảo đảm chính hãng từ Shopee Mall và TikTok Shop của HUGZ.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl text-left">
              
              {/* Shopee Hub Card */}
              <a
                href="https://s.shopee.vn/9pbeimilNQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-[#cac7ae]/40 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-xs font-black text-white bg-[#EE4D2D] tracking-wider">
                      SHOPEE MALL
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#EE4D2D] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] mb-1">
                    Shopee Mall HUGZ Official
                  </h3>
                  <p className="text-xs text-[#484834] mb-4 leading-relaxed">
                    Voucher hoàn xu 15%, freeship Extra toàn quốc cho mọi đơn hàng từ 150.000₫.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#f8ecdd]">
                  <span className="text-xs text-[#EE4D2D] font-bold">MÃ: HUGZSHOPEE20</span>
                  <span className="text-xs font-bold text-[#201b12]">Ghé thăm gian hàng →</span>
                </div>
              </a>

              {/* TikTok Hub Card */}
              <a
                href="https://www.tiktok.com/@hugzvietnam"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-[#cac7ae]/40 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded text-xs font-black text-white bg-[#111111] tracking-wider">
                      TIKTOK SHOP
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#201b12] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] mb-1">
                    TikTok Shop HUGZ VN
                  </h3>
                  <p className="text-xs text-[#484834] mb-4 leading-relaxed">
                    Xem Livestream hàng ngày lúc 12:00 & 20:00 nhận quà tặng bất ngờ và voucher sốc.
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#f8ecdd]">
                  <span className="text-xs text-[#201b12] font-bold">LIVE VOUCHER 30%</span>
                  <span className="text-xs font-bold text-[#201b12]">Xem live mua ngay →</span>
                </div>
              </a>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
