import React from 'react';
import { Product } from '../types';
import { LOOKBOOKS, ECOSYSTEM_PILLARS } from '../data/products';
import { Sparkles, ArrowRight, ShoppingBag, Eye, Layers } from 'lucide-react';

interface CollectionsViewProps {
  products: Product[];
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  products,
  onOpenDetail,
  onAddToCart,
}) => {
  return (
    <div className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>LOOKBOOK & CURATED EDITIONS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#201b12]">
            Bộ Sưu Tập Cảm Xúc HUGZ
          </h1>
          <p className="text-sm text-[#484834] mt-2 leading-relaxed">
            Mỗi bộ sưu tập là một câu chuyện về không gian sống an yên, nâng niu từng thói quen thường nhật với sự gọn gàng và những gam màu vỗ về tâm hồn.
          </p>
        </div>

        {/* Lookbooks Showcase */}
        <div className="space-y-16">
          {LOOKBOOKS.map((lookbook, idx) => {
            const matchedProducts = products.filter((p) => lookbook.productIds.includes(p.id));
            const isReversed = idx % 2 !== 0;

            return (
              <section 
                key={lookbook.id}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-[#cac7ae]/40 shadow-sm overflow-hidden"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                  
                  {/* Visual Image */}
                  <div className={`lg:col-span-6 relative rounded-2xl overflow-hidden shadow-md bg-[#f8ecdd] ${isReversed ? 'lg:order-2' : ''}`}>
                    <img
                      src={lookbook.image}
                      alt={lookbook.title}
                      className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-[#201b12] text-white text-xs font-bold tracking-wider">
                        {lookbook.tag}
                      </span>
                    </div>
                  </div>

                  {/* Story & Matching Products */}
                  <div className={`lg:col-span-6 flex flex-col justify-between ${isReversed ? 'lg:order-1' : ''}`}>
                    <div>
                      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#201b12]">
                        {lookbook.title}
                      </h2>
                      <p className="text-sm font-semibold text-[#626200] mt-1 mb-4">
                        {lookbook.subtitle}
                      </p>
                      <p className="text-sm text-[#484834] leading-relaxed mb-6">
                        {lookbook.story}
                      </p>
                    </div>

                    {/* Curated Products in this Lookbook */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#201b12] mb-3">
                        Sản phẩm tâm điểm trong bộ sưu tập:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchedProducts.map((p) => (
                          <div
                            key={p.id}
                            onClick={() => onOpenDetail(p)}
                            className="flex items-center gap-3 p-3 rounded-xl bg-[#fdf2e3] hover:bg-[#f1ddba] transition-colors border border-[#cac7ae]/30 cursor-pointer group"
                          >
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-14 h-14 rounded-lg object-cover bg-white shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-display text-xs font-bold text-[#201b12] uppercase truncate group-hover:text-[#626200]">
                                {p.title}
                              </h5>
                              <p className="text-xs font-bold text-[#b62506] mt-0.5">
                                {new Intl.NumberFormat('vi-VN').format(p.price)}₫
                              </p>
                              <span className="text-[11px] text-[#484834]">
                                ★ {p.rating} • {p.soldCount} đã bán
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(p);
                              }}
                              className="p-2 rounded-lg bg-white text-[#201b12] hover:bg-[#f4f34d] transition-colors shadow-xs"
                              title="Thêm vào giỏ"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              </section>
            );
          })}
        </div>

        {/* Ecosystem Pillars Navigation Guide */}
        <div className="mt-20 pt-12 border-t border-[#cac7ae]/40">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] uppercase mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>HỆ SINH THÁI TOÀN DIỆN</span>
            </div>
            <h3 className="font-display text-2xl font-black text-[#201b12]">
              5 Nhóm Giải Pháp Lưu Trữ Thông Minh HUGZ
            </h3>
            <p className="text-xs sm:text-sm text-[#484834] mt-1">
              Phân loại khoa học giúp mọi gia đình dễ dàng lựa chọn sản phẩm phù hợp với thói quen sinh hoạt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ECOSYSTEM_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-5 border border-[#cac7ae]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#f4f34d] text-[#201b12]">
                      {pillar.badge}
                    </span>
                    <span className="text-xs font-black text-[#626200]/40 font-display">
                      {pillar.pillarNumber}
                    </span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-[#201b12] mb-1">
                    {pillar.name}
                  </h4>
                  <p className="text-[11px] text-[#484834] line-clamp-3 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#fdf2e3] flex items-center justify-between text-[11px] text-[#797862] font-semibold">
                  <span>{pillar.productCount} sản phẩm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
