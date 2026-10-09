import React, { useState } from 'react';
import { NavTab } from '../types';
import { ArrowRight, CheckCircle2, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { trackMarketplaceClick } from '../utils/analytics';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onShowToast: (msg: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onShowToast }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      onShowToast('Vui lòng nhập địa chỉ email hợp lệ');
      return;
    }
    setSubscribed(true);
    onShowToast('Cảm ơn bạn đã đăng ký nhận bản tin HUGZ!');
    setEmail('');
  };

  return (
    <footer id="main-footer" className="w-full bg-[#fdf2e3] border-t border-[#cac7ae]/30 mt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-1">
              <span className="font-display text-3xl font-extrabold tracking-tight text-[#201b12]">
                hug
                <span className="text-[#484834] font-normal text-2xl">(</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f4f34d] mx-0.5"></span>
                <span className="text-[#484834] font-normal text-2xl">)</span>
                z
              </span>
            </div>
            <p className="text-sm text-[#484834] leading-relaxed max-w-sm">
              Giải pháp lưu trữ thông minh và tối giản cho không gian sống hiện đại. Khơi gợi sự an yên, trật tự và ấm áp trong từng góc nhỏ gia đình bạn.
            </p>
            <div className="flex flex-col gap-2 text-xs text-[#484834] pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#626200]" />
                <span>Hotline CSKH: <strong className="text-[#201b12] text-sm">1900 6868</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#626200]" />
                <span>Email hỗ trợ: <strong className="text-[#201b12]">cskh@hugzhome.vn</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#626200]" />
                <span>Giờ làm việc: 08:30 - 18:00 (Thứ 2 - Thứ 7)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-display text-base font-bold text-[#201b12]">Khám phá HUGZ</h3>
            <ul className="flex flex-col gap-2.5 text-sm text-[#484834]">
              <li>
                <button
                  onClick={() => onSelectTab('san-pham')}
                  className="hover:text-[#201b12] transition-colors cursor-pointer text-left"
                >
                  Tất cả sản phẩm tiện ích
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('bo-suu-tap')}
                  className="hover:text-[#201b12] transition-colors cursor-pointer text-left"
                >
                  Bộ sưu tập Chăn Sữa & Du Lịch 7 Món
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ve-chung-toi')}
                  className="hover:text-[#201b12] transition-colors cursor-pointer text-left"
                >
                  Câu chuyện thương hiệu & Chất liệu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lien-he')}
                  className="hover:text-[#201b12] transition-colors cursor-pointer text-left"
                >
                  Chính sách bảo hành & Đổi trả 7 ngày
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('kenh-mua-hang')}
                  className="hover:text-[#201b12] transition-colors cursor-pointer text-left"
                >
                  Hướng dẫn áp dụng mã giảm giá 20%
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Marketplace Channels */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="font-display text-base font-bold text-[#201b12]">Kênh mua hàng chính hãng</h3>
            <p className="text-sm text-[#484834] leading-relaxed">
              Trải nghiệm mua sắm nhanh chóng với nhiều ưu đãi độc quyền tại các sàn thương mại điện tử.
            </p>
            <div className="flex flex-col gap-2.5 pt-1">
              <a
                href="https://s.shopee.vn/9pbeimilNQ"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMarketplaceClick('Shopee', 'Footer - Shopee Mall HUGZ Official', 'https://s.shopee.vn/9pbeimilNQ')}
                className="p-3 rounded-xl bg-[#f8ecdd] flex items-center justify-between hover:bg-[#f2e7d8] transition-colors group shadow-xs border border-[#cac7ae]/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-white bg-[#EE4D2D]">SHOPEE</span>
                  <span className="text-xs font-semibold text-[#201b12]">Shopee Mall HUGZ Official</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#484834] group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="https://www.tiktok.com/@hugzvietnam"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackMarketplaceClick('TikTok', 'Footer - TikTok Shop Official VN', 'https://www.tiktok.com/@hugzvietnam')}
                className="p-3 rounded-xl bg-[#f8ecdd] flex items-center justify-between hover:bg-[#f2e7d8] transition-colors group shadow-xs border border-[#cac7ae]/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-white bg-[#111111]">TIKTOK</span>
                  <span className="text-xs font-semibold text-[#201b12]">TikTok Shop Official VN</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#484834] group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Col 4: Newsletter */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <h3 className="font-display text-base font-bold text-[#201b12]">Bản tin không gian</h3>
            <p className="text-xs text-[#484834] leading-relaxed">
              Nhận cảm hứng sắp xếp nhà cửa và voucher độc quyền.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="h-10 px-3 rounded-lg bg-white flex items-center border border-[#cac7ae]/50 focus-within:border-[#201b12] transition-colors shadow-xs">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email của bạn..."
                  className="w-full bg-transparent text-xs text-[#201b12] placeholder:text-[#797862] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-[#ece1d2] hover:bg-[#f1ddba] text-[#201b12] text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã nhận thông tin!</span>
                  </>
                ) : (
                  <span>Đăng ký nhận tin</span>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Subfooter */}
        <div className="mt-12 pt-6 border-t border-[#cac7ae]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#484834]">
          <p>© 2025 HUGZ Lifestyle & Utility Storage. Bảo lưu mọi quyền.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('lien-he')} className="hover:text-[#201b12] transition-colors cursor-pointer">
              Điều khoản dịch vụ
            </button>
            <span>•</span>
            <button onClick={() => onSelectTab('lien-he')} className="hover:text-[#201b12] transition-colors cursor-pointer">
              Chính sách bảo mật
            </button>
            <span>•</span>
            <span className="flex items-center gap-1 text-[#626200] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sản phẩm đạt chuẩn an toàn
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
