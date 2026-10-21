import React, { useState } from 'react';
import { NavTab } from '../../types';
import { Search, ShoppingBag, Menu, X, Copy, Check, Sparkles, ArrowRight, Package } from 'lucide-react';
import { AnnouncementMarquee } from './AnnouncementMarquee';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onCopyVoucher: (code: string) => void;
  hasCopiedVoucher: boolean;
  onOpenOrderTracking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onCopyVoucher,
  hasCopiedVoucher,
  onOpenOrderTracking
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'trang-chu', label: 'Trang chủ' },
    { id: 've-chung-toi', label: 'Về chúng tôi' },
    { id: 'san-pham', label: 'Sản phẩm' },
    { id: 'bo-suu-tap', label: 'Bộ sưu tập' },
    { id: 'kenh-mua-hang', label: 'Kênh mua hàng' },
    { id: 'lien-he', label: 'Liên hệ' },
  ];

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Continuous Infinite Marquee Banner */}
      <AnnouncementMarquee />

      {/* Top Notification Promo Banner */}
      <aside 
        id="top-announce-bar" 
        className="w-full bg-[#f1ddba]/70 py-1.5 sm:py-2 px-3 sm:px-4 border-b border-[#cac7ae]/40 text-[11px] sm:text-xs text-[#201b12] relative z-50"
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium flex-wrap">
            <span className="inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#f4f34d] text-[#201b12] text-[10px] sm:text-[11px] font-bold shadow-xs shrink-0">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </span>
            <span className="truncate max-w-[200px] sm:max-w-none">Ưu đãi độc quyền: Giảm 20% Shopee &amp; TikTok</span>
            <button
              id="copy-voucher-top-btn"
              onClick={() => onCopyVoucher('HUGZSHOPEE20')}
              className="inline-flex items-center gap-1 font-bold underline hover:text-[#626200] transition-colors cursor-pointer bg-white/70 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] shrink-0"
              title="Nhấp để sao chép mã"
            >
              {hasCopiedVoucher ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Đã chép mã</span>
                </>
              ) : (
                <>
                  <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>Mã: HUGZSHOPEE20 →</span>
                </>
              )}
            </button>
          </div>

          {/* Social Links on Top Bar */}
          <div className="hidden md:flex items-center gap-3 text-xs font-semibold">
            <span className="text-[#797862] text-[11px]">Kết nối:</span>
            <a
              href="https://www.facebook.com/thehugzlife"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white text-[#1877F2] transition-colors shadow-2xs"
              title="Facebook Fanpage The Hugz Life"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-[11px] text-[#201b12]">Facebook</span>
            </a>
            <a
              href="https://www.tiktok.com/@thehugzlife"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/70 hover:bg-white text-black transition-colors shadow-2xs"
              title="TikTok Channel @thehugzlife"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="text-[11px] text-[#201b12]">TikTok</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Sticky Header */}
      <header className="sticky top-0 left-0 w-full z-40 bg-[#fff8f2]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#cac7ae]/30">
        <div className="h-14 sm:h-16 lg:h-20 max-w-[1280px] mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('trang-chu')}
              className="flex items-center gap-1 group text-left cursor-pointer focus:outline-none"
            >
              <span className="font-display text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-[#201b12]">
                hug
                <span className="text-[#484834] font-normal text-lg sm:text-xl lg:text-2xl">(</span>
                <span className="inline-block w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#f4f34d] mx-0.5 transform group-hover:scale-125 transition-transform"></span>
                <span className="text-[#484834] font-normal text-lg sm:text-xl lg:text-2xl">)</span>
                z
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#f2e7d8] text-[#201b12] font-semibold shadow-xs'
                      : 'text-[#484834] hover:bg-[#f8ecdd] hover:text-[#201b12] font-medium'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button */}
            <button
              id="search-trigger-btn"
              onClick={onOpenSearch}
              aria-label="Tìm kiếm sản phẩm"
              className="p-2 sm:p-2.5 rounded-lg text-[#484834] hover:bg-[#f8ecdd] hover:text-[#201b12] transition-colors flex items-center justify-center cursor-pointer"
              title="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              aria-label="Giỏ hàng HUGZ"
              className="p-2 sm:p-2.5 rounded-lg text-[#484834] hover:bg-[#f8ecdd] hover:text-[#201b12] transition-colors relative flex items-center justify-center cursor-pointer"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-[#b62506] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Order Tracking Button */}
            {onOpenOrderTracking && (
              <button
                id="order-tracking-trigger-btn"
                onClick={onOpenOrderTracking}
                aria-label="Tra cứu đơn hàng"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#484834] hover:bg-[#f8ecdd] hover:text-[#201b12] border border-[#cac7ae]/40 transition-colors cursor-pointer"
                title="Tra cứu đơn hàng đã đặt"
              >
                <Package className="w-4 h-4 text-[#626200]" />
                <span>Tra cứu đơn</span>
              </button>
            )}

            {/* Quick Channel Link */}
            <button
              id="header-channels-cta-btn"
              onClick={() => handleNavClick('kenh-mua-hang')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#f4f34d] text-[#201b12] text-sm font-semibold hover:bg-[#eae944] transition-all shadow-[0_2px_8px_rgba(122,114,102,0.08)] cursor-pointer"
            >
              Kênh mua hàng
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#484834] hover:bg-[#f8ecdd] transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Mở menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#fff8f2] border-b border-[#cac7ae]/40 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm flex items-center justify-between ${
                    isActive
                      ? 'bg-[#f2e7d8] text-[#201b12] font-bold'
                      : 'text-[#484834] hover:bg-[#f8ecdd]'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <ArrowRight className="w-4 h-4 text-[#626200]" />}
                </button>
              );
            })}
            <div className="pt-3 border-t border-[#cac7ae]/30 flex flex-col gap-2">
              {onOpenOrderTracking && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenOrderTracking();
                  }}
                  className="w-full py-2.5 px-4 text-left rounded-lg bg-white border border-[#cac7ae]/50 text-[#201b12] font-semibold text-xs flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#626200]" />
                    <span>Lịch sử & Tra cứu đơn hàng</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#797862]" />
                </button>
              )}
              <button
                onClick={() => handleNavClick('kenh-mua-hang')}
                className="w-full py-2.5 text-center rounded-lg bg-[#f4f34d] text-[#201b12] font-semibold text-sm cursor-pointer"
              >
                Ghé thăm Shopee Mall & TikTok Shop
              </button>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="https://www.facebook.com/thehugzlife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-lg bg-white border border-[#cac7ae]/50 text-xs font-bold text-[#1877F2] flex items-center justify-center gap-1.5"
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
                  className="py-2 px-3 rounded-lg bg-white border border-[#cac7ae]/50 text-xs font-bold text-black flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
