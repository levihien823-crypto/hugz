import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { Search, X, Star, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const quickTags = ['Chăn sữa', 'Túi du lịch 7 món', 'Khăn mặt Cotton', 'Túi laptop', 'Túi mỹ phẩm', 'Ví cầm tay'];

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [query, products]);

  if (!isOpen) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-black/45 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#cac7ae]/40 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#cac7ae]/30 flex items-center gap-3 bg-[#fff8f2]">
          <Search className="w-5 h-5 text-[#626200] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm chăn sữa, túi du lịch, khăn lau mặt, laptop..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#201b12] placeholder:text-[#797862] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#797862] hover:text-[#201b12] p-1 cursor-pointer"
            >
              Xóa
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#484834] hover:bg-[#f8ecdd] transition-colors cursor-pointer"
            aria-label="Đóng tìm kiếm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tag Recommendations */}
        <div className="px-4 sm:px-5 py-3 bg-[#fdf2e3]/60 border-b border-[#cac7ae]/20 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#484834] font-semibold whitespace-nowrap">Gợi ý tìm nhanh:</span>
          {quickTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#f4f34d] text-[#201b12] font-medium border border-[#cac7ae]/50 transition-colors whitespace-nowrap cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {!query.trim() ? (
            <div className="text-center py-10 text-xs text-[#797862]">
              Nhập từ khóa tìm kiếm để khám phá sản phẩm tiện ích HUGZ
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-[#201b12]">
                Không tìm thấy sản phẩm nào phù hợp với "{query}"
              </p>
              <p className="text-xs text-[#484834] mt-1">
                Hãy thử các từ khóa khác như "chăn", "túi", "khăn", "laptop"
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-[#484834]">
                Tìm thấy {filteredProducts.length} sản phẩm:
              </p>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#f8ecdd] transition-colors cursor-pointer group border border-transparent hover:border-[#cac7ae]/30"
                >
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-14 h-14 rounded-lg object-cover bg-[#f8ecdd] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-xs sm:text-sm font-bold text-[#201b12] uppercase group-hover:text-[#626200] transition-colors truncate">
                      {p.title}
                    </h4>
                    <p className="text-xs text-[#484834] truncate mt-0.5">
                      {p.subtitle || p.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-[#b62506]">
                        {formatPrice(p.price)}
                      </span>
                      <div className="flex items-center text-[11px] text-[#E5A800]">
                        <Star className="w-3 h-3 fill-[#E5A800]" />
                        <span className="ml-0.5">{p.rating}</span>
                      </div>
                      <span className="text-[11px] text-[#797862]">
                        • Đã bán {p.soldCount}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#797862] group-hover:text-[#201b12] group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
