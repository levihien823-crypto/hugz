import React, { useState } from 'react';
import { NavTab } from '../../types';
import { ArrowRight, CheckCircle2, Mail, Clock, ShieldCheck, User } from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../../utils/analytics';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onShowToast: (msg: string) => void;
  onOpenOrderTracking?: () => void;
  isLoggedIn?: boolean;
  onOpenLogin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onSelectTab, 
  onShowToast, 
  onOpenOrderTracking,
  isLoggedIn = false,
  onOpenLogin
}) => {
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
                <Mail className="w-4 h-4 text-[#626200]" />
                <span>Email hỗ trợ: <strong className="text-[#201b12]">cskh@hugzhome.vn</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#626200]" />
                <span>Giờ làm việc: 08:30 - 18:00 (Thứ 2 - Thứ 7)</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-[#797862] uppercase tracking-wider block mb-2">
                Kết nối cùng HUGZ:
              </span>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.facebook.com/thehugzlife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#cac7ae]/40 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs group cursor-pointer"
                  title="Facebook @thehugzlife"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </a>
                <a
                  href="https://www.tiktok.com/@thehugzlife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-white hover:bg-black text-black hover:text-white border border-[#cac7ae]/40 text-xs font-bold flex items-center gap-2 transition-all shadow-2xs group cursor-pointer"
                  title="TikTok @thehugzlife"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
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
              {onOpenOrderTracking && (
                <li>
                  <button
                    onClick={onOpenOrderTracking}
                    className="hover:text-[#201b12] text-[#626200] font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>Tra cứu đơn hàng trực tiếp</span>
                    <span className="text-[9px] bg-[#f4f34d] px-1.5 py-0.2 rounded font-bold text-[#201b12]">Mới</span>
                  </button>
                </li>
              )}
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
                href={buildTrackedUrl("https://s.shopee.vn/9pbeimilNQ", 'shopee', 'footer_shopee_mall')}
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
                href={buildTrackedUrl("https://www.tiktok.com/@hugzvietnam", 'tiktok', 'footer_tiktok_shop')}
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
              <a
                href="https://www.facebook.com/thehugzlife"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-[#f8ecdd] flex items-center justify-between hover:bg-[#f2e7d8] transition-colors group shadow-xs border border-[#cac7ae]/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold text-white bg-[#1877F2]">FACEBOOK</span>
                  <span className="text-xs font-semibold text-[#201b12]">The Hugz Life Fanpage</span>
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
            <span>•</span>
            <button
              onClick={() => {
                if (onOpenLogin) {
                  onOpenLogin();
                } else {
                  onSelectTab('quan-tri');
                  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                }
              }}
              className="hover:text-amber-700 text-[#484834] transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              title={isLoggedIn ? 'Trang Quản trị sản phẩm' : 'Đăng nhập hệ thống'}
            >
              <User className="w-3.5 h-3.5 text-amber-600" />
              <span>{isLoggedIn ? 'Quản trị' : 'Đăng nhập'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
