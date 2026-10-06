import React from 'react';
import { NavTab } from '../types';
import { 
  Heart, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  Smile, 
  ArrowRight, 
  Users, 
  Eye, 
  Globe, 
  Award, 
  Compass, 
  Layers, 
  Palette, 
  Sun,
  Package,
  ShoppingBag,
  Luggage,
  CheckCircle2
} from 'lucide-react';

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div className="w-full py-8 sm:py-12">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. BANNER ĐẦU TRANG (HERO SECTION) */}
        {/* ========================================================================= */}
        <section className="relative rounded-3xl bg-gradient-to-br from-[#fffdfa] via-[#fdf6ec] to-[#f8ecdd] border border-[#cac7ae]/40 shadow-sm p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#f4f34d]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-[#EE4D2D]/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f34d] text-xs font-bold text-[#201b12] uppercase tracking-wide mb-5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#626200]" />
                <span>ABOUT HUGZ LIFESTYLE</span>
              </div>

              {/* Slogan Chính */}
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#201b12] uppercase tracking-tight leading-snug mb-3">
                “Making hugz a happy source in children's lives”
              </h1>
              <p className="font-display text-sm sm:text-base font-bold text-[#626200] italic mb-6">
                (Trao gửi nguồn niềm vui ấm áp vào cuộc sống của bé)
              </p>

              {/* Thông điệp dẫn dắt */}
              <div className="inline-block px-4 py-2 rounded-xl bg-white/80 border border-[#cac7ae]/40 shadow-xs mb-5">
                <p className="font-display text-base sm:text-lg font-bold text-[#201b12]">
                  hugz – Thắp sáng năng lượng sống, ôm trọn niềm vui tự nhiên.
                </p>
              </div>

              {/* Mô tả ngắn */}
              <p className="text-sm sm:text-base text-[#484834] leading-relaxed mb-8">
                hugz không chỉ là một thương hiệu sản phẩm cho trẻ em, mà còn là người bảo vệ dịu dàng trong lòng cha mẹ. Chúng tôi thắp sáng đời sống thường nhật thông qua những thiết kế sáng tạo, biến từng khoảnh khắc nhỏ bé trở nên rạng rỡ, tràn ngập sắc màu và niềm vui.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectTab('san-pham')}
                  className="px-6 py-3.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Khám phá sản phẩm HUGZ</span>
                </button>
                <button
                  onClick={() => onSelectTab('kenh-mua-hang')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#fdf2e3] text-[#201b12] font-display text-xs sm:text-sm font-semibold border border-[#cac7ae]/50 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Kênh mua hàng chính hãng</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Photo Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-white group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy-dhihuBqQ01UYv1jcruTXfOV6ao2npzNhy6RRyjhOACGn-8_MYA6srFMCki7uz9l2C7TYzFkWzKVm62iiOx0SDCdPPMQElkpQTFsRxI4PIi6GDEmyU054gRCm2pbb3DccT2hHBOaD4sUD3MDb_HDyqSYsCjnv6iZznREKrHlL0aHBy3fcWrWKEnJoc0i6_nBTCTSLqurLG_ZuLMZFXWokOg4rgLN95ci6unGj5oyjG1XrdJdrRrEjdhgoi-vVLdUY-g"
                  alt="HUGZ Warm Moments"
                  className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="px-2.5 py-1 rounded bg-[#f4f34d] text-[#201b12] text-[11px] font-bold uppercase w-fit mb-2">
                    Warm & Gentle Hug
                  </span>
                  <p className="font-display text-lg font-bold">
                    Cái ôm chở che dịu dàng cho từng bước trưởng thành của con
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CÂU CHUYỆN THƯƠNG HIỆU (OUR STORY) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#cac7ae]/40 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-md border border-[#cac7ae]/30 bg-[#f8ecdd]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdqMkHhcCAIa3wYCd98S5T0i2qRPjXBucRbar_wp9ui3iHOYOtZCJ7qWY1tTzEapPHF573OKg4UjKxgOp56EIWwaXdXtDX37y2lB25ppON6A5efSDJbE0h3bCKgR5bqs9CWz7v71srBtfbn5tiyzCGCrwM514DlvaW5l3NxFNkm-rpd_BbR3_A0HrwzpEqdKdR3qnxav2wZU1pGZDYA1TC7zxnFszYkeCs1ynKSXh4ar_8-I5VAjuLOFR4luq5fnQ93OE"
                  alt="Câu chuyện thương hiệu HUGZ"
                  className="w-full h-80 object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] uppercase mb-3">
                <Sun className="w-3.5 h-3.5" />
                <span>OUR STORY</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12] mb-3">
                Khởi đầu từ những quan sát giản đơn
              </h2>
              <div className="w-12 h-1 bg-[#f4f34d] rounded-full mb-6"></div>

              <blockquote className="text-sm sm:text-base text-[#484834] leading-relaxed space-y-4">
                <p>
                  <strong>“hugz bắt đầu từ một nhận thức tinh tế:</strong> Những món đồ nhỏ bé chúng ta sử dụng mỗi ngày hiếm khi thực sự được 'nhìn thấy'.”
                </p>
                <p>
                  Chúng tôi muốn thay đổi điều đó bằng cách thổi hồn cảm xúc vào từng chi tiết. Từ lý do sắc hồng được gọi là <em>'Strawberry Pudding'</em>, những đường kẻ sọc vẽ tay cho đến các hình minh họa động vật ngẫu hứng...
                </p>
                <p className="p-4 rounded-xl bg-[#fdf2e3] border-l-4 border-[#626200] text-[#201b12] font-medium text-sm leading-relaxed">
                  hugz đưa các vật dụng quen thuộc thoát khỏi dáng vẻ 'ẩn mình' để trở thành những điều đẹp đẽ, đáng yêu xứng đáng được trân trọng mỗi ngày.
                </p>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. Ý NGHĨA TÊN GỌI & DNA THƯƠNG HIỆU (BRAND DNA) */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-b from-[#fdf6ec] to-[#f8ecdd] rounded-3xl p-8 sm:p-12 border border-[#cac7ae]/40 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d] text-xs font-bold text-[#201b12] uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>BRAND DNA & IDENTITY</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12]">
              Ý Nghĩa Tên Gọi: hug(•)z
            </h2>
            <p className="text-sm text-[#484834] mt-2">
              Từng ký tự được tạo tác để gửi gắm triết lý sống an lành và đầy tình yêu thương.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Letter H */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/30 shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#EE4D2D]/10 text-[#EE4D2D] font-display text-3xl font-black flex items-center justify-center mb-5">
                  H
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-1">
                  Hug (Warmth)
                </h3>
                <span className="text-xs font-bold text-[#EE4D2D] uppercase block mb-3">
                  Sự ấm áp & Ôm ấp trọn vẹn
                </span>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  Là vòng tay ấm của người thân yêu, che chở và nâng niu từng bước chân thơ bé trong ngôi nhà bình yên.
                </p>
              </div>
            </div>

            {/* Symbol ( ) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-[#f4f34d] shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform relative">
              <div className="absolute top-4 right-4">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#f4f34d] text-[#201b12] uppercase">
                  Tâm điểm
                </span>
              </div>
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#f4f34d] text-[#201b12] font-display text-3xl font-black flex items-center justify-center mb-5">
                  (•)
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-1">
                  Unconditional Inclusion
                </h3>
                <span className="text-xs font-bold text-[#626200] uppercase block mb-3">
                  Bao dung vô điều kiện
                </span>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  Chiếc kén tròn yêu thương không phân biệt, ôm trọn và tôn trọng mọi cá tính độc đáo của các thiên thần nhỏ.
                </p>
              </div>
            </div>

            {/* Letter Z */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/30 shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-transform">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#626200]/10 text-[#626200] font-display text-3xl font-black flex items-center justify-center mb-5">
                  Z
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-1">
                  Zen (Natural)
                </h3>
                <span className="text-xs font-bold text-[#626200] uppercase block mb-3">
                  Tự nhiên & Giản dị
                </span>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  Trở về với sự mộc mạc nguyên bản, tinh giản chi tiết thừa để nuôi dưỡng tâm hồn trẻ thơ trong sự an yên.
                </p>
              </div>
            </div>
          </div>

          {/* Quote Strip */}
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/40 text-center max-w-3xl mx-auto shadow-xs">
            <p className="font-display text-base sm:text-lg font-bold text-[#201b12] italic leading-relaxed">
              “hugz không muốn trở thành một thương hiệu xa cách hay quá cao vời. Chúng tôi đơn giản là một người bạn đồng hành hiện diện mỗi ngày – âm thầm mang lại nụ cười cho cả bạn và con.”
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. TRIẾT LÝ THIẾT KẾ & GIÁ TRỊ CỐT LÕI (OUR VALUES) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#cac7ae]/40 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] uppercase mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>CORE VALUES</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12]">
              Triết Lý Thiết Kế & Giá Trị Cốt Lõi
            </h2>
            <p className="text-sm text-[#484834] mt-2 leading-relaxed">
              Bốn trụ cột định hình mọi sản phẩm ra đời dưới mái nhà HUGZ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Value 1 */}
            <div className="bg-[#fdf2e3] p-7 rounded-2xl border border-[#cac7ae]/40 flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0 shadow-xs">
                <Leaf className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#626200] uppercase tracking-wider block mb-1">
                  TRỤ CỘT 01
                </span>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Tự nhiên & Chân thật (Zen)
                </h3>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  Đơn giản nhưng không đơn điệu. Thiết kế tốt tự lên tiếng mà không cần logo phô trương. Mọi đường nét đều tôn vinh nét đẹp công năng tự nhiên.
                </p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-[#fdf2e3] p-7 rounded-2xl border border-[#cac7ae]/40 flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#626200] uppercase tracking-wider block mb-1">
                  TRỤ CỘT 02
                </span>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Sáng tạo không ngừng (Innovation)
                </h3>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  Hợp tác cùng các nghệ sĩ minh họa quốc tế để mang lại sự mới mẻ qua mỗi mùa. Mỗi bộ sưu tập là một câu chuyện cảm xúc hoàn toàn mới.
                </p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-[#fdf2e3] p-7 rounded-2xl border border-[#cac7ae]/40 flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0 shadow-xs">
                <Palette className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#626200] uppercase tracking-wider block mb-1">
                  TRỤ CỘT 03
                </span>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Ngôn ngữ màu sắc cảm xúc (Vitality)
                </h3>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed mb-3">
                  Mỗi gam màu mang một câu chuyện riêng như <em>Beach Sunbath, Garden Fields, Coconut Half-Sweet, Snowy Vanilla...</em> giúp khơi dậy dũng khí khám phá và niềm vui tự nhiên.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fce7d2] text-[#8e4210]">Beach Sunbath</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#e3eed4] text-[#345c1a]">Garden Fields</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1e8dd] text-[#635541]">Coconut Half-Sweet</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef9e7] text-[#71641a]">Snowy Vanilla</span>
                </div>
              </div>
            </div>

            {/* Value 4 */}
            <div className="bg-[#fdf2e3] p-7 rounded-2xl border border-[#cac7ae]/40 flex gap-5">
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-[#201b12]" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#626200] uppercase tracking-wider block mb-1">
                  TRỤ CỘT 04
                </span>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  An toàn tuyệt đối (Safety & Trust)
                </h3>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  An toàn không chỉ là tiêu chuẩn kỹ thuật mà là nền tảng sự an tâm của gia đình. Chất liệu thân thiện, kiểm định nghiêm ngặt đạt các chứng nhận quốc tế cho làn da nhạy cảm.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HỆ SINH THÁI SẢN PHẨM & THẾ MẠNH (WHAT WE OFFER) */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-br from-[#f8ecdd] via-[#fdf2e3] to-white rounded-3xl p-8 sm:p-12 border border-[#cac7ae]/40 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d] text-xs font-bold text-[#201b12] uppercase mb-3">
              <Package className="w-3.5 h-3.5" />
              <span>PRODUCT ECOSYSTEM</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12]">
              Hệ Sinh Thái Sản Phẩm & Thế Mạnh
            </h2>
            <p className="text-sm text-[#484834] mt-2">
              hugz kiến tạo giải pháp toàn diện cho phong cách sống gia đình hiện đại.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-5">
                  <Luggage className="w-6 h-6 text-[#201b12]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Giải Pháp Sắp Xếp & Lưu Trữ Thông Minh
                </h3>
                <p className="text-xs text-[#484834] leading-relaxed mb-4">
                  Các dòng túi lưu trữ du lịch phân loại toàn diện:
                </p>
                <ul className="space-y-2 text-xs text-[#484834]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Bộ set 7 món xếp gọn vali du lịch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Túi đựng mỹ phẩm & vệ sinh chống thấm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Túi đựng tài liệu, passport & phụ kiện</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Túi ăn trưa giữ nhiệt & túi giặt kháng mùi</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Category 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-5">
                  <Sun className="w-6 h-6 text-[#201b12]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Phong Cách Sống Ngoài Trời (Outdoor Lifestyle)
                </h3>
                <p className="text-xs text-[#484834] leading-relaxed mb-4">
                  Cùng con năng động khám phá thế giới xung quanh:
                </p>
                <ul className="space-y-2 text-xs text-[#484834]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Ba lô trẻ em siêu nhẹ chống gù lưng</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mũ chống nắng UPF50+ thoáng khí</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Thảm dã ngoại gấp gọn chống ẩm picnic</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Khăn tắm biển sợi cotton thấm hút nhanh</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Category 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#cac7ae]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-5">
                  <Heart className="w-6 h-6 text-[#201b12]" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12] mb-2">
                  Phụ Kiện & Đời Sống Gia Đình
                </h3>
                <p className="text-xs text-[#484834] leading-relaxed mb-4">
                  Chăm chút tỉ mỉ cho từng thói quen thường nhật:
                </p>
                <ul className="space-y-2 text-xs text-[#484834]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Khăn tắm 100% cotton kháng khuẩn</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Áo choàng tắm lông tuyết fleece siêu mềm</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Mũ len, khăn quàng mùa đông ấm áp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Tất cotton dệt kim dịu nhẹ cho bé</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. SỨC ẢNH HƯỞNG & CON SỐ ẤN TƯỢNG (OUR IMPACT) */}
        {/* ========================================================================= */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-[#cac7ae]/40 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>OUR IMPACT</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#201b12]">
              Sức Ảnh Hưởng & Con Số Ấn Tượng
            </h2>
            <p className="text-sm text-[#484834] mt-2">
              Sự tin yêu của hàng triệu gia đình là minh chứng vững chắc cho chất lượng HUGZ.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            
            {/* Stat 1 */}
            <div className="bg-[#fdf2e3] rounded-2xl p-5 sm:p-6 text-center border border-[#cac7ae]/30">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#201b12] mb-1">
                1.000.000+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#484834]">
                Gia đình tin tưởng sử dụng
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-[#fdf2e3] rounded-2xl p-5 sm:p-6 text-center border border-[#cac7ae]/30">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#EE4D2D] mb-1">
                300.000.000+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#484834]">
                Lượt hiển thị nội dung hàng năm
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-[#fdf2e3] rounded-2xl p-5 sm:p-6 text-center border border-[#cac7ae]/30">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#626200] mb-1">
                15+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#484834]">
                Quốc gia & khu vực phân phối
              </p>
            </div>

            {/* Stat 4 */}
            <div className="bg-[#fdf2e3] rounded-2xl p-5 sm:p-6 text-center border border-[#cac7ae]/30">
              <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-black text-[#201b12] mb-1">
                1.000+
              </div>
              <p className="text-xs sm:text-sm font-semibold text-[#484834]">
                KOLs & Creator đồng hành
              </p>
            </div>

          </div>

          {/* Top Platform Badge Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#fef5e7] via-[#fff9e6] to-[#fef5e7] border border-[#cac7ae]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-md text-xs font-black text-white bg-[#EE4D2D] tracking-wider shrink-0">
                TOP BEST-SELLER
              </span>
              <p className="font-display text-sm sm:text-base font-bold text-[#201b12]">
                Top bán chạy hàng đầu trên các nền tảng Tmall & Douyin cho các dòng túi lưu trữ và đồ dùng du lịch gia đình.
              </p>
            </div>
            <span className="text-xs font-bold text-[#626200] shrink-0">
              ★ 4.9/5.0 Đánh giá tích cực
            </span>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. THÔNG ĐIỆP KẾT (CALL TO ACTION / OUTRO) */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-[#201b12] text-white p-8 sm:p-14 lg:p-16 relative overflow-hidden text-center shadow-lg">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#f4f34d]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#EE4D2D]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f34d] text-xs font-bold text-[#201b12] uppercase mb-4">
              <Smile className="w-3.5 h-3.5" />
              <span>JOIN THE HUGZ FAMILY</span>
            </div>

            {/* Slogan */}
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4 text-[#f4f34d]">
              “Đánh thức năng lượng sống, tận hưởng niềm vui tự nhiên.”
            </h2>

            {/* Lời ngỏ */}
            <p className="text-sm sm:text-base text-[#cac7ae] leading-relaxed mb-8 max-w-xl mx-auto">
              Hãy cùng hugz biến từng chi tiết nhỏ thường ngày trở nên dịu dàng, thẩm mỹ và tràn ngập niềm vui!
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => onSelectTab('san-pham')}
                className="px-8 py-3.5 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Khám phá sản phẩm ngay</span>
              </button>
              <button
                onClick={() => onSelectTab('kenh-mua-hang')}
                className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-display text-sm font-semibold border border-white/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Ghé Shopee & TikTok Mall</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
