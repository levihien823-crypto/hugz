import React, { useState } from 'react';
import { NavTab } from '../types';
import { Search, ShoppingBag, Menu, X, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onCopyVoucher: (code: string) => void;
  hasCopiedVoucher: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onCopyVoucher,
  hasCopiedVoucher
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
      {/* Top Notification Promo Banner */}
      <aside 
        id="top-announce-bar" 
        className="w-full bg-[#f1ddba]/70 py-2 px-4 text-center border-b border-[#cac7ae]/40 text-xs sm:text-sm text-[#201b12] relative z-50"
      >
        <div className="max-w-[1280px] mx-auto flex items-center justify-center gap-2 flex-wrap font-medium">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#f4f34d] text-[#201b12] text-[11px] font-bold shadow-xs">
            <Sparkles className="w-3 h-3" />
          </span>
          <span>Ưu đãi độc quyền tháng này: Giảm ngay 20% đơn hàng đầu tiên trên Shopee Mall & TikTok Shop</span>
          <button
            id="copy-voucher-top-btn"
            onClick={() => onCopyVoucher('HUGZSHOPEE20')}
            className="inline-flex items-center gap-1 font-bold underline hover:text-[#626200] transition-colors cursor-pointer bg-white/60 px-2 py-0.5 rounded-full"
            title="Nhấp để sao chép mã"
          >
            {hasCopiedVoucher ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Đã chép: HUGZSHOPEE20</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Mã: HUGZSHOPEE20 →</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Sticky Header */}
      <header className="sticky top-0 left-0 w-full z-40 bg-[#fff8f2]/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#cac7ae]/30">
        <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button
              id="brand-logo-btn"
              onClick={() => handleNavClick('trang-chu')}
              className="flex items-center gap-1 group text-left cursor-pointer focus:outline-none"
            >
              <span className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#201b12]">
                hug
                <span className="text-[#484834] font-normal text-xl sm:text-2xl">(</span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#f4f34d] mx-0.5 transform group-hover:scale-125 transition-transform"></span>
                <span className="text-[#484834] font-normal text-xl sm:text-2xl">)</span>
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
              <button
                onClick={() => handleNavClick('kenh-mua-hang')}
                className="w-full py-2.5 text-center rounded-lg bg-[#f4f34d] text-[#201b12] font-semibold text-sm"
              >
                Ghé thăm Shopee Mall & TikTok Shop
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
