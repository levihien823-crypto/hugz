import React from 'react';
import { Home, Grid, Search, ShoppingBag, ClipboardList } from 'lucide-react';
import { NavTab } from '../types';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenOrderTracking: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  onOpenCart,
  onOpenSearch,
  onOpenOrderTracking,
}) => {
  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav 
      aria-label="Thanh điều hướng di động"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#cac7ae]/50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center justify-between text-center max-w-md mx-auto">
        {/* 1. Trang chủ */}
        <button
          onClick={() => handleTabClick('trang-chu')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'trang-chu' ? 'text-[#201b12]' : 'text-[#797862] hover:text-[#201b12]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {currentTab === 'trang-chu' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f4f34d] border border-[#626200]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold ${currentTab === 'trang-chu' ? 'font-bold text-[#201b12]' : ''}`}>
            Trang chủ
          </span>
        </button>

        {/* 2. Sản phẩm */}
        <button
          onClick={() => handleTabClick('san-pham')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            currentTab === 'san-pham' ? 'text-[#201b12]' : 'text-[#797862] hover:text-[#201b12]'
          }`}
        >
          <div className="relative">
            <Grid className="w-5 h-5" />
            {currentTab === 'san-pham' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#f4f34d] border border-[#626200]" />
            )}
          </div>
          <span className={`text-[10px] mt-1 font-semibold ${currentTab === 'san-pham' ? 'font-bold text-[#201b12]' : ''}`}>
            Sản phẩm
          </span>
        </button>

        {/* 3. Tìm kiếm */}
        <button
          onClick={onOpenSearch}
          className="flex flex-col items-center justify-center py-1 text-[#797862] hover:text-[#201b12] transition-colors cursor-pointer"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold">
            Tìm kiếm
          </span>
        </button>

        {/* 4. Đơn hàng */}
        <button
          onClick={onOpenOrderTracking}
          className="flex flex-col items-center justify-center py-1 text-[#797862] hover:text-[#201b12] transition-colors cursor-pointer"
        >
          <ClipboardList className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-semibold">
            Đơn hàng
          </span>
        </button>

        {/* 5. Giỏ hàng */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center py-1 text-[#797862] hover:text-[#201b12] transition-colors relative cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-[#b62506] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-semibold">
            Giỏ hàng
          </span>
        </button>
      </div>
    </nav>
  );
};
