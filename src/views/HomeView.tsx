import React from 'react';
import { Product, NavTab } from '../types';
import { ProductCard } from '../components/ProductCard';
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
  ExternalLink 
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
    { id: 'all', label: 'Tất cả sản phẩm' },
    { id: 'bo-suu-tap-moi', label: 'Bộ sưu tập mới' },
    { id: 'tui-du-lich', label: 'Túi du lịch 7 món' },
    { id: 'tui-ca-nhan', label: 'Túi đựng đồ cá nhân' },
    { id: 'tui-deo-cheo', label: 'Túi đeo chéo & tài liệu' },
    { id: 'tui-my-pham', label: 'Túi đựng mỹ phẩm' },
    { id: 'tui-laptop', label: 'Túi chống sốc Laptop' },
    { id: 'khan-cotton', label: 'Khăn khô & Khăn bông Cotton' },
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
            <div className="lg:col-span-6 flex flex-col gap-5 z-10">
              <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#ece1d2] shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4f34d]"></span>
                <span className="text-[11px] uppercase tracking-wider text-[#201b12] font-bold">
                  HUGZ COLLECTION 2025
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#201b12] leading-[1.1] tracking-tight">
                  GỌI TÊN MÀU SẮC
                </h1>
                <span className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#626200] leading-[1.15] tracking-tight">
                  ĐỂ CẢM XÚC CÓ HÌNH HÀI
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#484834] max-w-xl leading-relaxed">
                Một cái ôm ấm áp cho không gian sống của bạn — Những vật dụng hằng ngày được nâng niu bằng sắc màu, hình khối hữu cơ và tính tiện ích tối đa cho từng khoảnh khắc gia đình.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#san-pham-hugz"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-base font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Khám phá bộ sưu tập</span>
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
              <div className="pt-4 flex items-center gap-6 sm:gap-8 flex-wrap">
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">50.000+</span>
                  <span className="text-xs text-[#484834]">Tổ ấm yêu chuộng</span>
                </div>
                <div className="h-8 w-px bg-[#cac7ae]/50"></div>
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">4.9 / 5.0 ★</span>
                  <span className="text-xs text-[#484834]">Đánh giá chính hãng</span>
                </div>
                <div className="h-8 w-px bg-[#cac7ae]/50"></div>
                <div className="flex flex-col">
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#201b12]">100% Cotton</span>
                  <span className="text-xs text-[#484834]">Thân thiện môi trường</span>
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

      {/* Categories Bento Visual Grid (6 Cards) */}
      <section className="w-full py-16" id="danh-muc">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f4f34d]"></span>
                <span className="text-xs uppercase tracking-wider text-[#484834] font-bold">
                  HUGZ Categories
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201b12]">
                Hệ Sinh Thái Lưu Trữ & Phong Cách
              </h2>
            </div>
            <p className="text-sm text-[#484834] max-w-md">
              Mỗi sản phẩm đều mang dáng hình của sự tiện lợi: gọn ghẽ, chống thấm, họa tiết độc quyền tràn ngập năng lượng tích cực.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1: Túi Vải Đựng Đồ */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf2FdMK4P2POWLK1TH5qB8Pugi8xIdG_iF3cWMQap56ESDyR1Nsg4GEnJQrjMr2pGPIZA9jDvInWFf_q6nzlgTefwmu3K-YkN1UMQJNNpJyXDF1lmcqbOLQBPeC-binjzmbT61AN0o6sFb7bAx-YGDz-5Bwvl1-CnLUd00THBfSYpYNQtbIyjWxoG6GYrKbc-gtChnXeytVAEXf-2qRVRzZHiuSrVowhJIRIqycLtwZJmvbiHFHWUMOFJotmoPBIb2_gs"
                  alt="Túi Vải Đựng Đồ HUGZ gọn gàng"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold shadow-xs">
                  Tổ chức tủ áo & Vali
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Vải Đựng Đồ
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Set túi xếp gọn cho vali và tủ quần áo, họa tiết lượn sóng pastel dịu mắt cùng quai xách chắc chắn.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">3 kích cỡ • Chống ẩm</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 2: Túi Đựng Mỹ Phẩm */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2SCWg5n9_vRLQmzaz6_1wjBlJOBv-kxu9ninWEf2MDUevFAigWHPATpcRDOpiVA5RaPWPHdu_kBdCQriRBoyphPbIWhyeCTRYSkh39MB-ukL6gWDbyXOULfCbuV9mQ4QDMonCXHSjiupupZBXr0S91Gx8diaspympcoXJc4CwmkBWCNxtguyhSYJ9rJwReW8QSMscVDVBSqGyveOZDu1TvjZHuD2YHX9dSkPEJabhI3Gz0G4hzQBq4NgIUvHfRsaChBM"
                  alt="Túi Đựng Mỹ Phẩm HUGZ kẻ caro vintage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f1ddba] text-[#241a05] text-xs font-bold shadow-xs">
                  Bestseller Makeup
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Đựng Mỹ Phẩm
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Hộp mỹ phẩm chống thấm kẻ sọc, caro trẻ trung với thêu hình thú ngộ nghĩnh, khóa kéo mượt mà.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">Chống nước • Miệng mở rộng</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 3: Túi Laptop & Phụ Kiện */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBmavsxuc8T1CH0TFMx2nS65ScoWtLNP-n_OTryHJ1duvGFXZNQyl9-qujIdfy5i3NGHLOfhhycbWemLksiGfsJxqGAtAbBZi2n_77cEw1KAKltww8mkutJd5s62uZRWiQgjJ4T1XoRyJCGps7SgXnRcip9KCLyw0g3ydi0yIvOqgRMTNAzPImzQUKEMCydsQM6y8MvcHixNngL8mfmgKnjP9j97XqMCcKCdEywiNk4txwHi5dqRbDk5Rd0vdOXpA6Q6Y"
                  alt="Túi đựng Laptop HUGZ kèm túi đựng phụ kiện"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold shadow-xs">
                  Bảo vệ Laptop & iPad
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Laptop & Phụ Kiện
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Lớp lót chống sốc dày dặn, họa tiết chấm bi hồng và kẻ nâu sang trọng tặng kèm túi đựng củ sạc nhỏ.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">Fit 13-15.6 inch • Quai đeo</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 4: Túi Đi Biển Hugz */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR0PAAWstMOpjO6nrpFY2A1J4TIX3yeGHtKmAh2JHxKSGizdOdp9ati5xtIssMRE90UtrfZ84Ylzwthd3S87L3AmZ_VCUJPLgyWHU6fohnCzGpZElKmWlAa_sgfbZnJ_5dpadCt6onNg4z7sKEKSjrybHh6WEbVFyJCc9WD-uwDXcByaOR_bo6aeeqoW5UwtwRyptiIf7rEneNW51KA7E_V6lJuGktshG7Uo1pB4Fp0RaI4zev6kEIZntP6xmgJEOtSg8"
                  alt="Túi Đi Biển Hugz chất liệu lưới thông thoáng"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#ece1d2] text-[#201b12] text-xs font-bold shadow-xs">
                  Du lịch & Dã ngoại
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Đi Biển Hugz
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Cấu trúc lưới thoát cát và nước thông minh phối cùng túi lót kín đáo, màu sắc rực rỡ dưới nắng hè.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">Lưới thoát khí • Quai vai êm</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 5: Túi Trang Sức Sandwich */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHYPI2raE1uC0txcufOF4C1ib09gaGD-j2ZCd_RIIUTHtb_t4lEzBYQnYHPLYQSnsRHGbZelaQT9Nhu2_yzRylCNkGLB-JosZJnSbqkdH9g0w6mLY87T_QFMO7s9PLjeU5L45NPrqtlgjdD53u_QzRsqSPEBWpyyKif7VxLN-l4-pfmySLRoptX0cDNg9OrBzieHkupXT1awihufWHl3LnGn3m_RZW71LlTXAnFnRMWkRhVsIeHhnQsyG_WlEn9SyMcJo"
                  alt="Túi Trang Sức Sandwich HUGZ mở đa tầng"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f1ddba] text-[#241a05] text-xs font-bold shadow-xs">
                  Thiết kế sáng tạo
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Trang Sức Sandwich
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Thiết kế gập sandwich nhiều ngăn thông minh giữ nhẫn, bông tai, dây chuyền không bị xô lệch trầy xước.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">Đa tầng • Chống rối dây</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

            {/* Card 6: Túi Du Lịch Gấp Gọn */}
            <article 
              onClick={() => onSelectTab('san-pham')}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-[#cac7ae]/40 cursor-pointer"
            >
              <div className="relative h-60 overflow-hidden bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUCENKHQbPMSIA5cFtkedCWYblUHQKIfJGffg-QrCS1gi1zp8H9hBLdlmn7lzuSpDMIc2_JeAHeiWs57hitK4-WAes4JxF-Y0nutVcM7kY8gFd413yG4_ebuWtr7pPPq_dHiKtnwvoSt-nQewgS2PNQ6DJ5Cwx899VMP8ogogEbX3DU_Eo2tNLTbbRdElSpEyJmlc64fLUe_qc9psHzQ6POjUOul0xk1I2WTLdbkWK_gnfM3SF7ESjOtdai-KsokKXpsk"
                  alt="Túi Du Lịch Gấp Gọn HUGZ tối ưu thể tích"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold shadow-xs">
                  Hành lý thông minh
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                    Túi Du Lịch Gấp Gọn
                  </h3>
                  <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                    Set 3 hộp vải xếp tầng + túi rút phụ, tối ưu hóa đến 50% không gian vali với hoa văn kẻ ô retro.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#6b5d41] font-semibold">Gấp siêu mỏng • Thoáng khí</span>
                  <span className="font-bold text-[#201b12] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Khám phá →
                  </span>
                </div>
              </div>
            </article>

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
