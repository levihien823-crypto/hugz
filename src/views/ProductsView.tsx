import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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
