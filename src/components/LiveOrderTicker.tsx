import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Star, Truck, Sparkles, X } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'order' | 'review' | 'shipping' | 'promo';
  title: string;
  time: string;
  location?: string;
  icon: typeof ShoppingBag;
  color: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'Chị Mai Anh vừa đặt Túi Mini HUGZ Chống Nước (Koala Vàng)',
    time: '2 phút trước',
    location: 'Cầu Giấy, Hà Nội',
    icon: ShoppingBag,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
  {
    id: '2',
    type: 'review',
    title: 'Đánh giá 5★ trên Shopee: "Túi đựng chăn mền rất dày dặn, kéo khóa êm!"',
    time: '5 phút trước',
    location: 'Quận 1, TP.HCM',
    icon: Star,
    color: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  },
  {
    id: '3',
    type: 'shipping',
    title: 'Đơn hàng #HUGZ-3902 vừa xuất kho giao hỏa tốc',
    time: '8 phút trước',
    location: 'Hải Châu, Đà Nẵng',
    icon: Truck,
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    id: '4',
    type: 'promo',
    title: 'Khách hàng vừa dùng mã HUGZSHOPEE20 giảm 20%',
    time: '12 phút trước',
    location: 'Nha Trang, Khánh Hòa',
    icon: Sparkles,
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    id: '5',
    type: 'order',
    title: 'Anh Tuấn vừa đặt Combo 2 Chăn Sữa HUGZ Vỗ Về Cảm Xúc',
    time: '15 phút trước',
    location: 'Đống Đa, Hà Nội',
    icon: ShoppingBag,
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];

export const LiveOrderTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isDismissed) return;

    const interval = setInterval(() => {
      // Ẩn tạm 1.5s rồi đổi sang tin tiếp theo
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 600);
    }, 9000);

    return () => clearInterval(interval);
  }, [isDismissed]);

  if (isDismissed) return null;

  const currentItem = ACTIVITIES[currentIndex];
  const IconComponent = currentItem.icon;

  return (
    <div className="fixed bottom-6 left-4 sm:left-6 z-40 max-w-[340px] pointer-events-auto">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#cac7ae]/60 shadow-xl text-xs text-[#201b12] group"
          >
            {/* Animated Icon Avatar */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${currentItem.color}`}>
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0 pr-1">
              <p className="font-semibold text-[11px] leading-snug line-clamp-2 text-[#201b12]">
                {currentItem.title}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-[#797862] mt-0.5">
                {currentItem.location && (
                  <>
                    <span className="truncate max-w-[140px]">{currentItem.location}</span>
                    <span aria-hidden="true">·</span>
                  </>
                )}
                <span className="text-[#626200] font-medium">{currentItem.time}</span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[#797862] hover:text-[#201b12] p-1 rounded-full hover:bg-[#faf5ee] transition-colors cursor-pointer self-start shrink-0"
              title="Đóng thông báo này"
              aria-label="Đóng thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
