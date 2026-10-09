import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { CATEGORIES, ECOSYSTEM_PILLARS } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProductsViewProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onOpenDetail,
  onAddToCart,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under150' | '150to300' | 'above300'>('all');

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'bo-suu-tap-moi' && !p.isNew) return false;
          if (selectedCategory !== 'bo-suu-tap-moi' && p.categorySlug !== selectedCategory) return false;
        }

        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const match =
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!match) return false;
        }

        // Price filter
        if (priceFilter === 'under150' && p.price >= 150000) return false;
        if (priceFilter === '150to300' && (p.price < 150000 || p.price > 300000)) return false;
        if (priceFilter === 'above300' && p.price <= 300000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default
      });
  }, [products, selectedCategory, searchTerm, sortBy, priceFilter]);

  const activePillar = useMemo(() => {
    return ECOSYSTEM_PILLARS.find((p) => p.id === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumbs */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] mb-2">
            <span>HUGZ CATALOGUE</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#201b12]">
            Tất Cả Sản Phẩm Tiện Ích HUGZ
          </h1>
          <p className="text-sm text-[#484834] mt-1 max-w-xl">
            Bộ giải pháp lưu trữ, chăn sữa và đồ dùng cá nhân thông minh mang đậm phong cách ấm áp tối giản.
          </p>
        </div>

        {/* Filter & Control Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#cac7ae]/40 mb-8 space-y-4">
          
          {/* Top row: Search & Sorting */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#797862] absolute left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm theo tên..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 text-xs text-[#484834]">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span className="font-semibold">Sắp xếp:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-[#fdf2e3]/60 border border-[#cac7ae]/50 rounded-xl px-3 py-2 focus:outline-none focus:border-[#201b12] font-medium"
              >
                <option value="featured">Nổi bật / Bán chạy</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="rating">Đánh giá 5 sao</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1 border-t border-[#f8ecdd]">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#201b12] text-white shadow-xs'
                      : 'bg-[#fdf2e3] text-[#484834] hover:bg-[#f1ddba] hover:text-[#201b12]'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Price Range Filter Pills */}
          <div className="flex items-center gap-2 pt-1 text-xs flex-wrap">
            <span className="text-[#484834] font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Mức giá:
            </span>
            <button
              onClick={() => setPriceFilter('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                priceFilter === 'all'
                  ? 'bg-[#f4f34d] text-[#201b12] font-bold'
                  : 'bg-white text-[#484834] border border-[#cac7ae]/50 hover:bg-[#f8ecdd]'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPriceFilter('under150')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                priceFilter === 'under150'
                  ? 'bg-[#f4f34d] text-[#201b12] font-bold'
                  : 'bg-white text-[#484834] border border-[#cac7ae]/50 hover:bg-[#f8ecdd]'
              }`}
            >
              Dưới 150.000₫
            </button>
            <button
              onClick={() => setPriceFilter('150to300')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                priceFilter === '150to300'
                  ? 'bg-[#f4f34d] text-[#201b12] font-bold'
                  : 'bg-white text-[#484834] border border-[#cac7ae]/50 hover:bg-[#f8ecdd]'
              }`}
            >
              150.000₫ - 300.000₫
            </button>
            <button
              onClick={() => setPriceFilter('above300')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                priceFilter === 'above300'
                  ? 'bg-[#f4f34d] text-[#201b12] font-bold'
                  : 'bg-white text-[#484834] border border-[#cac7ae]/50 hover:bg-[#f8ecdd]'
              }`}
            >
              Trên 300.000₫
            </button>
          </div>

        </div>

        {/* Active Ecosystem Pillar Spotlight Banner */}
        {activePillar && (
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#fff8f2] via-[#fdf2e3] to-[#f8ecdd] border-2 border-[#f4f34d]/60 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-black tracking-wider shadow-2xs">
                    {activePillar.badge}
                  </span>
                  <span className="text-xs font-bold text-[#626200] uppercase tracking-wider">
                    {activePillar.subtitle}
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-[#201b12]">
                  {activePillar.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#484834] leading-relaxed">
                  {activePillar.desc}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {activePillar.highlights.map((h, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 text-[11px] font-semibold text-[#201b12] border border-[#cac7ae]/40 shadow-2xs">
                      <CheckCircle2 className="w-3 h-3 text-[#22c55e]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="shrink-0 flex items-center md:flex-col md:items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-[#cac7ae]/40 pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-right">
                  <span className="text-xs text-[#797862] font-semibold block">Quy mô nhóm:</span>
                  <span className="font-display text-2xl font-black text-[#201b12]">
                    {activePillar.productCount} sản phẩm
                  </span>
                </div>
                <button
                  onClick={() => onSelectCategory('all')}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg bg-white hover:bg-[#201b12] hover:text-white transition-colors border border-[#cac7ae]/50 cursor-pointer shadow-2xs"
                >
                  ← Về tất cả sản phẩm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#484834]">
          <span>
            Hiển thị <strong>{filteredAndSortedProducts.length}</strong> sản phẩm tiện ích
          </span>
          {(selectedCategory !== 'all' || searchTerm || priceFilter !== 'all') && (
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchTerm('');
                setPriceFilter('all');
              }}
              className="text-[#b62506] font-semibold underline hover:text-[#93000a] cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#cac7ae]/40 my-6">
            <h3 className="font-display text-lg font-bold text-[#201b12]">
              Không tìm thấy sản phẩm phù hợp
            </h3>
            <p className="text-xs text-[#484834] mt-1 max-w-sm mx-auto">
              Vui lòng thử điều chỉnh lại từ khóa tìm kiếm hoặc chọn danh mục khác.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchTerm('');
                setPriceFilter('all');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#f4f34d] text-[#201b12] text-xs font-bold shadow-xs cursor-pointer"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={onOpenDetail}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
