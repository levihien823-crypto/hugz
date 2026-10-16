import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  ProductFilterSidebar, 
  FilterState, 
  CATEGORY_OPTIONS, 
  PASTEL_COLORS, 
  FEATURE_TAGS,
  isProductMatchingCategory
} from '../components/ProductFilterSidebar';
import { Search, SlidersHorizontal, ArrowUpDown, X, RotateCcw, Check } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onBuyNowDirect?: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onOpenDetail,
  onAddToCart,
  onBuyNowDirect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Unified Filter State matching default clean state (no filter applied)
  const [filterState, setFilterState] = useState<FilterState>({
    category: selectedCategory || 'all',
    color: null,
    priceRange: 'all',
    maxSliderPrice: 1000000,
    features: [],
  });

  // Keep filterState.category in sync if parent changes selectedCategory
  React.useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      const match = CATEGORY_OPTIONS.find(c => c.slugs.includes(selectedCategory) || c.id === selectedCategory);
      if (match) {
        setFilterState(prev => ({ ...prev, category: match.id }));
      } else {
        setFilterState(prev => ({ ...prev, category: selectedCategory }));
      }
    } else {
      setFilterState(prev => ({ ...prev, category: 'all' }));
    }
  }, [selectedCategory]);

  const handleResetFilters = () => {
    setFilterState({
      category: 'all',
      color: null,
      priceRange: 'all',
      maxSliderPrice: 1000000,
      features: [],
    });
    setSearchTerm('');
    onSelectCategory('all');
  };

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // 1. Search Query
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            p.title.toLowerCase().includes(q) ||
            (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        // 2. Category Filter
        if (filterState.category && filterState.category !== 'all') {
          if (!isProductMatchingCategory(p, filterState.category)) {
            return false;
          }
        }

        // 3. Color Filter
        if (filterState.color) {
          const colorDef = PASTEL_COLORS.find(c => c.id === filterState.color);
          if (colorDef) {
            const textToSearch = [
              p.title,
              p.subtitle || '',
              p.description,
              ...(p.variants || [])
            ].join(' ').toLowerCase();

            const matchColor = colorDef.keywords.some(kw => textToSearch.includes(kw));
            if (!matchColor) return false;
          }
        }

        // 4. Price Filter (Radio + Range Slider)
        if (p.price > filterState.maxSliderPrice) {
          return false;
        }

        if (filterState.priceRange === 'under150' && p.price >= 150000) return false;
        if (filterState.priceRange === '150to300' && (p.price < 150000 || p.price > 300000)) return false;
        if (filterState.priceRange === 'above300' && p.price <= 300000) return false;

        // 5. Feature & Material Filter
        if (filterState.features.length > 0) {
          const productAllText = [
            p.title,
            p.subtitle || '',
            p.description,
            p.material || '',
            ...(p.features || [])
          ].join(' ').toLowerCase();

          for (const featureId of filterState.features) {
            const tagDef = FEATURE_TAGS.find(t => t.id === featureId);
            if (tagDef) {
              const hasTag = tagDef.keywords.some(kw => productAllText.includes(kw));
              if (!hasTag) return false;
            }
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured
      });
  }, [products, filterState, searchTerm, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterState.category !== 'all') count++;
    if (filterState.color) count++;
    if (filterState.priceRange !== 'all') count++;
    if (filterState.maxSliderPrice < 1000000) count++;
    count += filterState.features.length;
    if (searchTerm) count++;
    return count;
  }, [filterState, searchTerm]);

  return (
    <div className="w-full py-10 bg-[#fff8f2]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2e7d8] text-[11px] font-semibold text-[#626200] mb-2.5 border border-[#cac7ae]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#626200]"></span>
            <span>Bộ sưu tập tiện ích HUGZ</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201b12] leading-tight text-balance">
            Tất cả sản phẩm tiện ích HUGZ
          </h1>
          <p className="text-xs sm:text-sm text-[#5c5443] mt-2 max-w-2xl leading-relaxed">
            Hệ sinh thái lưu trữ thông minh, chăn sữa và đồ dùng cá nhân được thiết kế tỉ mỉ với chất liệu an toàn và gam màu pastel ấm áp.
          </p>
        </div>

        {/* Top Control Bar: Search, Mobile Filter Trigger & Sort Dropdown */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-[#cac7ae]/40 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#797862] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm sản phẩm, chất liệu..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12] text-[#201b12]"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-3 text-[#797862] hover:text-[#201b12]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right: Mobile Filter Button & Sort */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#201b12] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Bộ lọc</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#f4f34d] text-[#201b12] text-[10px] font-black flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#484834] hidden sm:inline flex items-center gap-1">
                <ArrowUpDown className="w-3.5 h-3.5" /> Sắp xếp:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-[#fdf2e3]/60 border border-[#cac7ae]/50 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#201b12] font-semibold text-[#201b12] cursor-pointer"
              >
                <option value="featured">Nổi bật / Bán chạy</option>
                <option value="price-asc">Giá: Thấp đến cao</option>
                <option value="price-desc">Giá: Cao đến thấp</option>
                <option value="rating">Đánh giá 5 sao</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Row */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6 text-xs">
            <span className="text-[#797862] font-semibold text-[11px]">Đang lọc theo:</span>
            
            {filterState.category !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#cac7ae]/50 text-[#201b12] font-bold shadow-2xs">
                <span>{CATEGORY_OPTIONS.find(c => c.id === filterState.category)?.label}</span>
                <button onClick={() => setFilterState({ ...filterState, category: 'all' })}>
                  <X className="w-3 h-3 text-[#797862] hover:text-[#b62506]" />
                </button>
              </span>
            )}

            {filterState.color && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#cac7ae]/50 text-[#201b12] font-bold shadow-2xs">
                <span 
                  className="w-3 h-3 rounded-full border border-black/10 inline-block" 
                  style={{ backgroundColor: PASTEL_COLORS.find(c => c.id === filterState.color)?.hex }} 
                />
                <span>Màu: {PASTEL_COLORS.find(c => c.id === filterState.color)?.name}</span>
                <button onClick={() => setFilterState({ ...filterState, color: null })}>
                  <X className="w-3 h-3 text-[#797862] hover:text-[#b62506]" />
                </button>
              </span>
            )}

            {filterState.priceRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#cac7ae]/50 text-[#201b12] font-bold shadow-2xs">
                <span>
                  {filterState.priceRange === 'under150' && 'Dưới 150k'}
                  {filterState.priceRange === '150to300' && '150k - 300k'}
                  {filterState.priceRange === 'above300' && 'Trên 300k'}
                </span>
                <button onClick={() => setFilterState({ ...filterState, priceRange: 'all', maxSliderPrice: 500000 })}>
                  <X className="w-3 h-3 text-[#797862] hover:text-[#b62506]" />
                </button>
              </span>
            )}

            {filterState.features.map(f => (
              <span key={f} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#cac7ae]/50 text-[#201b12] font-bold shadow-2xs">
                <span>{FEATURE_TAGS.find(t => t.id === f)?.label}</span>
                <button onClick={() => setFilterState({ ...filterState, features: filterState.features.filter(x => x !== f) })}>
                  <X className="w-3 h-3 text-[#797862] hover:text-[#b62506]" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="text-[#b62506] hover:underline font-bold text-[11px] ml-2 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Xóa tất cả</span>
            </button>
          </div>
        )}

        {/* MAIN BODY: 2-COLUMN LAYOUT (DESKTOP SIDEBAR FILTER + PRODUCT GRID) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: DESKTOP SIDEBAR FILTER (COMPACT SIDEBAR) */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-2.5">
            <ProductFilterSidebar
              filterState={filterState}
              onChangeFilter={setFilterState}
              onReset={handleResetFilters}
              totalProductsCount={products.length}
              filteredCount={filteredAndSortedProducts.length}
              products={products}
            />
          </aside>

          {/* RIGHT: PRODUCTS GRID AREA */}
          <main className="lg:col-span-9 xl:col-span-9.5 space-y-5">
            
            {/* Results count text */}
            <div className="flex items-center justify-between text-xs text-[#797862] px-1">
              <span>
                Tìm thấy <strong className="text-[#201b12] font-bold">{filteredAndSortedProducts.length}</strong> sản phẩm phù hợp
              </span>
              <span className="text-[11px] text-[#626200]">
                Chính hãng HUGZ Living
              </span>
            </div>

            {/* Product Cards Grid */}
            {filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#cac7ae]/40 my-4 shadow-sm">
                <div className="w-14 h-14 rounded-full bg-[#fdf2e3] flex items-center justify-center mx-auto mb-4 text-[#626200]">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#201b12]">
                  Không tìm thấy sản phẩm phù hợp với bộ lọc
                </h3>
                <p className="text-xs text-[#797862] mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Vui lòng thử bỏ bớt điều kiện lọc màu sắc, khoảng giá hoặc chọn lại danh mục khác.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-[#201b12] hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại toàn bộ bộ lọc</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 sm:gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={onOpenDetail}
                    onAddToCart={onAddToCart}
                    onBuyNowDirect={onBuyNowDirect}
                  />
                ))}
              </div>
            )}

          </main>
        </div>

      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div 
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ProductFilterSidebar
              filterState={filterState}
              onChangeFilter={setFilterState}
              onReset={handleResetFilters}
              totalProductsCount={products.length}
              filteredCount={filteredAndSortedProducts.length}
              products={products}
              isMobileModal={true}
              onCloseMobileModal={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
