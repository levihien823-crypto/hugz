import React from 'react';
import { SlidersHorizontal, Check, X } from 'lucide-react';
import { Product } from '../../types';

export interface FilterState {
  category: string;
  color: string | null;
  priceRange: 'all' | 'under150' | '150to300' | 'above300';
  maxSliderPrice: number;
  features: string[];
}

interface ProductFilterSidebarProps {
  filterState: FilterState;
  onChangeFilter: (newState: FilterState) => void;
  onReset: () => void;
  totalProductsCount: number;
  filteredCount: number;
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
  products?: Product[];
}

export const PASTEL_COLORS = [
  { id: 'kem', name: 'Kem', hex: '#F5EBE1', borderHex: '#E2D5C7', keywords: ['kem', 'be', 'hạnh nhân', 'trắng'] },
  { id: 'vang-hugz', name: 'Vàng Hugz', hex: '#F4F34D', borderHex: '#D8D732', keywords: ['vàng', 'sunshine', 'hoàng hôn', 'hugz'] },
  { id: 'bac-ha', name: 'Bạc Hà', hex: '#D4E9E2', borderHex: '#B6D3CA', keywords: ['bạc hà', 'mint', 'xanh'] },
  { id: 'hong', name: 'Hồng', hex: '#F6D9D9', borderHex: '#E4BFBF', keywords: ['hồng', 'blush', 'baby'] },
  { id: 'taupe', name: 'Taupe', hex: '#D2BBA0', borderHex: '#BC9F7F', keywords: ['taupe', 'nâu', 'đất'] },
  { id: 'xam-da', name: 'Xám Đá', hex: '#C5BEB5', borderHex: '#ADA59B', keywords: ['xám', 'ghi', 'đen', 'đá'] },
];

export const isProductMatchingCategory = (product: Product, categoryId: string): boolean => {
  if (!categoryId || categoryId === 'all') return true;

  if (categoryId === 'do-luu-tru-du-lich' || categoryId === 'phan-loai-san-pham') {
    return (
      product.categorySlug === 'phan-loai-san-pham' ||
      product.title.toLowerCase().includes('du lịch') ||
      product.title.toLowerCase().includes('vali') ||
      product.title.toLowerCase().includes('dã ngoại') ||
      product.title.toLowerCase().includes('hành lý')
    );
  }

  if (categoryId === 'do-dung-hang-ngay') {
    // Đồ dùng hàng ngày encompasses all everyday home, personal, office & kitchen essentials
    return (
      ['do-ca-nhan', 'tai-lieu', 'vat-dung-nho', 'thuc-pham-an-uong'].includes(product.categorySlug) ||
      product.categorySlug === 'do-dung-hang-ngay' ||
      product.title.toLowerCase().includes('hàng ngày')
    );
  }

  if (categoryId === 'tui-ca-nhan-phu-kien' || categoryId === 'do-ca-nhan') {
    return product.categorySlug === 'do-ca-nhan';
  }

  if (categoryId === 'tui-tai-lieu-cong-so' || categoryId === 'tai-lieu') {
    return product.categorySlug === 'tai-lieu';
  }

  if (categoryId === 'vat-dung-nho-khay-chia' || categoryId === 'vat-dung-nho') {
    return product.categorySlug === 'vat-dung-nho';
  }

  if (categoryId === 'luu-tru-thuc-pham-bep' || categoryId === 'thuc-pham-an-uong') {
    return product.categorySlug === 'thuc-pham-an-uong';
  }

  return product.categorySlug === categoryId;
};

export const CATEGORY_OPTIONS = [
  { id: 'do-luu-tru-du-lich', label: 'Đồ lưu trữ du lịch', slugs: ['phan-loai-san-pham'] },
  { id: 'do-dung-hang-ngay', label: 'Đồ dùng hàng ngày', slugs: ['do-ca-nhan', 'tai-lieu', 'vat-dung-nho', 'thuc-pham-an-uong'] },
  { id: 'tui-ca-nhan-phu-kien', label: 'Túi cá nhân & phụ kiện', slugs: ['do-ca-nhan'] },
  { id: 'tui-tai-lieu-cong-so', label: 'Túi tài liệu & công sở', slugs: ['tai-lieu'] },
  { id: 'vat-dung-nho-khay-chia', label: 'Vật dụng nhỏ & Khay chia', slugs: ['vat-dung-nho'] },
  { id: 'luu-tru-thuc-pham-bep', label: 'Lưu trữ thực phẩm & Bếp', slugs: ['thuc-pham-an-uong'] },
];

export const FEATURE_TAGS = [
  { id: 'linen', label: 'Vải Linen tự nhiên', keywords: ['linen', 'cotton', 'vải tự nhiên', 'canvas'] },
  { id: 'waterproof', label: 'Chống nước', keywords: ['chống nước', 'kháng nước', 'chống thấm', 'oxford'] },
  { id: 'heavy-load', label: 'Khung chịu lực 15kg', keywords: ['chịu lực', 'khung', 'form đứng', 'cứng cáp'] },
  { id: 'foldable', label: 'Gấp gọn 2.5cm', keywords: ['gấp gọn', 'xếp gọn', 'tiện lợi', 'gập phẳng'] },
  { id: 'antibacterial', label: 'Kháng khuẩn BPA Free', keywords: ['kháng khuẩn', 'tiệt trùng', 'an toàn', 'kháng ẩm'] },
];

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filterState,
  onChangeFilter,
  onReset,
  totalProductsCount,
  filteredCount,
  isMobileModal = false,
  onCloseMobileModal,
  products = [],
}) => {
  const hasActiveFilters = 
    filterState.category !== 'all' ||
    filterState.color !== null ||
    filterState.priceRange !== 'all' ||
    filterState.maxSliderPrice < 1000000 ||
    filterState.features.length > 0;

  const getCategoryCount = (catId: string) => {
    if (!products || products.length === 0) return 0;
    return products.filter(p => isProductMatchingCategory(p, catId)).length;
  };

  const handleSelectCategory = (catId: string) => {
    onChangeFilter({
      ...filterState,
      category: filterState.category === catId ? 'all' : catId,
    });
  };

  const handleToggleColor = (colorId: string) => {
    onChangeFilter({
      ...filterState,
      color: filterState.color === colorId ? null : colorId,
    });
  };

  const handleSelectPriceRange = (range: 'all' | 'under150' | '150to300' | 'above300') => {
    if (filterState.priceRange === range) {
      onChangeFilter({
        ...filterState,
        priceRange: 'all',
        maxSliderPrice: 1000000,
      });
      return;
    }

    let newMax = filterState.maxSliderPrice;
    if (range === 'under150') newMax = 150000;
    else if (range === '150to300') newMax = 300000;
    else if (range === 'above300') newMax = 1000000;
    else newMax = 1000000;

    onChangeFilter({
      ...filterState,
      priceRange: range,
      maxSliderPrice: newMax,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    let range: 'all' | 'under150' | '150to300' | 'above300' = 'all';
    if (val <= 150000) range = 'under150';
    else if (val <= 300000) range = '150to300';
    else range = 'above300';

    onChangeFilter({
      ...filterState,
      maxSliderPrice: val,
      priceRange: range,
    });
  };

  const handleToggleFeature = (featureId: string) => {
    const current = filterState.features;
    const exists = current.includes(featureId);
    const updated = exists 
      ? current.filter(f => f !== featureId)
      : [...current, featureId];

    onChangeFilter({
      ...filterState,
      features: updated,
    });
  };

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + 'đ';
  };

  return (
    <div className={`bg-white rounded-xl border border-[#cac7ae]/40 p-3 shadow-xs flex flex-col gap-2.5 text-[#201b12] text-[11px] ${
      isMobileModal ? 'max-h-[85vh] overflow-y-auto' : 'sticky top-24'
    }`}>
      {/* 1. Header with Reset Action */}
      <div className="flex items-center justify-between pb-2 border-b border-[#f4eee6]">
        <div className="flex items-center gap-1.5">
          <div className="w-5.5 h-5.5 rounded-md bg-[#fdf2e3] flex items-center justify-center text-[#201b12] shrink-0">
            <SlidersHorizontal className="w-3 h-3" />
          </div>
          <div>
            <h3 className="font-display text-[11px] font-bold text-[#201b12] leading-tight">
              Bộ lọc sản phẩm
            </h3>
            <span className="text-[9px] text-[#797862] block">
              {filteredCount} / {totalProductsCount} sản phẩm
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="text-[9px] font-semibold text-[#797862] hover:text-[#b62506] underline cursor-pointer transition-colors"
            >
              Xóa tất cả
            </button>
          )}

          {isMobileModal && (
            <button
              onClick={onCloseMobileModal}
              className="p-1 rounded-full bg-[#f8ecdd] text-[#201b12] hover:bg-[#f1ddba] cursor-pointer ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 2. DANH MỤC SẢN PHẨM (Checkboxes with count pills) */}
      <div className="space-y-1">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#201b12]">
          DANH MỤC SẢN PHẨM
        </h4>

        <div className="space-y-0.5">
          {CATEGORY_OPTIONS.map((cat) => {
            const isSelected = filterState.category === cat.id;

            return (
              <label
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="flex items-center justify-between py-0.5 px-1 rounded-md hover:bg-[#fdf9f4] transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-1">
                  <div className={`w-3 h-3 rounded-[3px] border flex items-center justify-center shrink-0 transition-all ${
                    isSelected 
                      ? 'bg-[#201b12] border-[#201b12] text-white' 
                      : 'border-[#cac7ae] bg-white group-hover:border-[#201b12]'
                  }`}>
                    {isSelected && <Check className="w-2 h-2 stroke-[3]" />}
                  </div>
                  <span className={`text-[10px] truncate ${
                    isSelected ? 'font-bold text-[#201b12]' : 'text-[#484834]'
                  }`}>
                    {cat.label}
                  </span>
                </div>

                <span className={`text-[8.5px] px-1 py-0 rounded font-bold shrink-0 transition-colors ${
                  isSelected 
                    ? 'bg-[#f4f34d] text-[#201b12]' 
                    : 'bg-[#f8f5ee] text-[#797862]'
                }`}>
                  {getCategoryCount(cat.id)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. TÔNG MÀU PASTEL HUGZ (2 Rows x 3 Columns) */}
      <div className="space-y-1 pt-2 border-t border-[#f4eee6]">
        <div className="flex items-center justify-between">
          <h4 className="text-[9px] font-black uppercase tracking-wider text-[#201b12]">
            TÔNG MÀU PASTEL
          </h4>
          {filterState.color && (
            <button 
              onClick={() => handleToggleColor(filterState.color!)}
              className="text-[8.5px] text-[#797862] hover:text-[#b62506] cursor-pointer"
            >
              Bỏ chọn
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-1">
          {PASTEL_COLORS.map((color) => {
            const isSelected = filterState.color === color.id;

            return (
              <button
                key={color.id}
                onClick={() => handleToggleColor(color.id)}
                className={`flex flex-col items-center justify-center p-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'border-[#201b12] bg-[#fffbf2] ring-1 ring-[#f4f34d]' 
                    : 'border-[#ece7dd] bg-white hover:border-[#cac7ae]'
                }`}
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-black/15 flex items-center justify-center mb-0.5 shrink-0"
                  style={{ backgroundColor: color.hex }}
                >
                  {isSelected && (
                    <Check className="w-2 h-2 text-[#201b12] stroke-[3]" />
                  )}
                </div>
                <span className={`text-[9px] font-semibold text-center truncate w-full leading-tight ${
                  isSelected ? 'text-[#201b12] font-bold' : 'text-[#5f584e]'
                }`}>
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. KHOẢNG GIÁ (Radios & Range Slider) */}
      <div className="space-y-1.5 pt-2 border-t border-[#f4eee6]">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#201b12]">
          KHOẢNG GIÁ
        </h4>

        {/* Radio options */}
        <div className="space-y-0.5 text-[10px]">
          {[
            { id: 'under150', label: 'Dưới 150.000đ' },
            { id: '150to300', label: '150.000đ - 300.000đ' },
            { id: 'above300', label: 'Trên 300.000đ' },
          ].map((option) => {
            const isChecked = filterState.priceRange === option.id;

            return (
              <label
                key={option.id}
                onClick={() => handleSelectPriceRange(option.id as any)}
                className="flex items-center gap-1.5 cursor-pointer py-0.5 px-1 rounded hover:bg-[#fdf9f4]"
              >
                <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  isChecked 
                    ? 'border-[#201b12] bg-[#201b12]' 
                    : 'border-[#cac7ae] bg-white'
                }`}>
                  {isChecked && <div className="w-1 h-1 rounded-full bg-white" />}
                </div>
                <span className={`${isChecked ? 'font-bold text-[#201b12]' : 'text-[#484834]'}`}>
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Slider */}
        <div className="pt-0.5 space-y-0.5">
          <div className="flex items-center justify-between text-[9px] font-bold text-[#797862]">
            <span>0đ</span>
            <span className="text-[#626200] font-black bg-[#fdf2e3] px-1 py-0.2 rounded">
              Tối đa: {formatPrice(filterState.maxSliderPrice)}
            </span>
            <span>1Tr</span>
          </div>

          <input
            type="range"
            min="50000"
            max="1000000"
            step="50000"
            value={filterState.maxSliderPrice}
            onChange={handleSliderChange}
            className="w-full h-1 bg-[#ece7dd] rounded-lg appearance-none cursor-pointer accent-[#626200]"
          />
        </div>
      </div>

      {/* 5. CHẤT LIỆU & TÍNH NĂNG (Selectable Feature Pills) */}
      <div className="space-y-1.5 pt-2 border-t border-[#f4eee6]">
        <h4 className="text-[9px] font-black uppercase tracking-wider text-[#201b12]">
          CHẤT LIỆU & TÍNH NĂNG
        </h4>

        <div className="flex flex-wrap gap-1">
          {FEATURE_TAGS.map((tag) => {
            const isSelected = filterState.features.includes(tag.id);

            return (
              <button
                key={tag.id}
                onClick={() => handleToggleFeature(tag.id)}
                className={`px-2 py-0.5 rounded-md text-[9px] font-medium border transition-all cursor-pointer flex items-center gap-0.5 ${
                  isSelected 
                    ? 'bg-[#f1ddba] border-[#201b12] text-[#201b12] font-bold' 
                    : 'bg-white border-[#cac7ae]/60 text-[#484834] hover:border-[#201b12] hover:bg-[#fdf9f4]'
                }`}
              >
                {isSelected && <Check className="w-2.5 h-2.5 text-[#201b12] stroke-[3]" />}
                <span>{tag.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Quick Apply for mobile modal */}
      {isMobileModal && (
        <div className="pt-2 border-t border-[#f4eee6]">
          <button
            onClick={onCloseMobileModal}
            className="w-full py-2 rounded-lg bg-[#201b12] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-colors"
          >
            Xem {filteredCount} sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};
