import React from 'react';
import { NavTab } from '../types';
import { Heart, Sparkles, Leaf, ShieldCheck, Smile, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onSelectTab: (tab: NavTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  return (
    <div className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Banner */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-[#cac7ae]/40 shadow-sm mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f4f34d]/15 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f8ecdd] text-xs font-bold text-[#626200] mb-4">
              <span>CÂU CHUYỆN THƯƠNG HIỆU</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#201b12] leading-tight mb-4">
              Gọi tên màu sắc để cảm xúc có hình hài
            </h1>
            <p className="text-base sm:text-lg text-[#484834] leading-relaxed mb-6">
              HUGZ ra đời từ một ý niệm giản dị: mỗi ngôi nhà là một chiếc kén vỗ về tâm hồn. Khi những món đồ lặt vặt được sắp xếp có trật tự trong những chiếc túi êm ái, sắc màu ấm áp, chúng ta tìm lại được sự thảnh thơi sau những bộn bề cuộc sống.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectTab('san-pham')}
                className="px-6 py-3 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Khám phá sản phẩm HUGZ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#fdf2e3] p-8 rounded-2xl border border-[#cac7ae]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-[#201b12]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#201b12] mb-2">
                Sự Ấm Áp & Vỗ Về
              </h3>
              <p className="text-sm text-[#484834] leading-relaxed">
                Biểu tượng chiếc chấm tròn nhỏ nằm giữa hai dấu ngoặc đơn `hug(•)z` như một cái ôm chở che. Từng đường may, chiếc khuy bấm, đến chất liệu chăn sữa lông tuyết đều mềm mại và an toàn cho trẻ nhỏ.
              </p>
            </div>
          </div>

          <div className="bg-[#fdf2e3] p-8 rounded-2xl border border-[#cac7ae]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-[#201b12]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#201b12] mb-2">
                100% Sợi Tự Nhiên
              </h3>
              <p className="text-sm text-[#484834] leading-relaxed">
                Từ dòng khăn lau mặt Daizy Daily chiết xuất 100% Cotton hữu cơ đến khăn khô Rayon thực vật tự phân hủy, HUGZ cam kết không sử dụng chất tẩy trắng quang học hay cồn gây hại da.
              </p>
            </div>
          </div>

          <div className="bg-[#fdf2e3] p-8 rounded-2xl border border-[#cac7ae]/40 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#f4f34d] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-[#201b12]" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#201b12] mb-2">
                Ngăn Nắp & Đa Tiện Ích
              </h3>
              <p className="text-sm text-[#484834] leading-relaxed">
                Không gian nhỏ nhưng tiện ích lớn. Hệ thống phân chia túi 7 món, túi sandwich trang sức nhiều tầng và túi chống sốc laptop tối ưu hóa tới 60% thể tích chứa đồ.
              </p>
            </div>
          </div>
        </div>

        {/* The HUGZ Promise Strip */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-[#cac7ae]/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-bold text-[#201b12] mb-2">
              Cam Kết Đóng Gói Xanh & Bảo Vệ Môi Trường
            </h3>
            <p className="text-sm text-[#484834] leading-relaxed">
              Tất cả sản phẩm HUGZ xuất xưởng đều được đóng gói trong hộp giấy kraft tái chế, hạn chế tối đa nilon một lần, hướng đến lối sống bền vững cho tương lai.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-3 rounded-xl bg-[#f8ecdd]">
              <span className="font-display text-2xl font-bold text-[#201b12]">50.000+</span>
              <p className="text-xs text-[#484834]">Đơn hàng phục vụ</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-[#f8ecdd]">
              <span className="font-display text-2xl font-bold text-[#201b12]">99.2%</span>
              <p className="text-xs text-[#484834]">Hài lòng 5 sao</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
