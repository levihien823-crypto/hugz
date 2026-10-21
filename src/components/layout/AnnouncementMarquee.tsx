import React from 'react';
import { Sparkles, Truck, ShieldCheck, Heart, Star, Gift } from 'lucide-react';

interface MarqueeItem {
  icon: typeof Sparkles;
  text: string;
}

const MARQUEE_ITEMS: MarqueeItem[] = [
  { icon: Sparkles, text: 'HUGZ Living — Vỗ về từng khoảnh khắc & Sắp xếp cuộc sống ngăn nắp' },
  { icon: Truck, text: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 200.000₫' },
  { icon: Gift, text: 'Mã HUGZSHOPEE20 — Giảm 20% đơn đầu tiên trên Shopee Mall & TikTok' },
  { icon: ShieldCheck, text: 'Kiểm tra hàng đồng kiểm trước khi thanh toán (COD tận nhà)' },
  { icon: Heart, text: '100% Chất liệu an toàn, thân thiện với bé và mẹ bầu' },
  { icon: Star, text: 'Hơn 50.000 khách hàng đánh giá 4.9/5.0★ yêu chuộng' },
];

export const AnnouncementMarquee: React.FC = () => {
  return (
    <div className="w-full bg-[#f8ecdd] border-b border-[#cac7ae]/40 overflow-hidden py-1.5 text-xs text-[#201b12] select-none">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {/* Lặp 2 lần để tạo hiệu ứng cuộn vô tận mượt mà */}
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const IconComp = item.icon;
          return (
            <div key={idx} className="inline-flex items-center gap-2 px-2 text-[11px] sm:text-xs font-semibold text-[#484834]">
              <span className="w-4 h-4 rounded-full bg-[#f4f34d] text-[#626200] flex items-center justify-center shrink-0">
                <IconComp className="w-2.5 h-2.5" />
              </span>
              <span>{item.text}</span>
              <span className="text-[#cac7ae] ml-6">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
