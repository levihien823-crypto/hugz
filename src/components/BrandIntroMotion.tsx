import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface BrandIntroMotionProps {
  onComplete?: () => void;
}

export const BrandIntroMotion: React.FC<BrandIntroMotionProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tự động hoàn tất sau 1.4s
    const timer = setTimeout(() => {
      handleDismiss();
    }, 1400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onComplete) onComplete();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="brand-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          onClick={handleDismiss}
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#fff8f2] cursor-pointer select-none overflow-hidden"
          title="Nhấp bất kỳ đâu để vào ngay"
        >
          {/* Ambient Warm Gradient Glows */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1.1], opacity: [0, 0.5, 0.4] }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#f4f34d]/30 via-[#f1ddba]/40 to-[#e3d8ca]/20 blur-3xl pointer-events-none"
          />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#f4f34d]/25 blur-3xl pointer-events-none"
          />

          {/* Central Brand Emblem */}
          <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md">
            {/* Small Kicker */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#cac7ae]/50 text-[11px] font-bold text-[#626200] shadow-2xs mb-4"
            >
              <Sparkles className="w-3 h-3 text-[#f4f34d] fill-[#f4f34d]" />
              <span>HUGZ LIVING • VIỆT NAM</span>
            </motion.div>

            {/* Main Wordmark */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-2 mb-3"
            >
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#201b12] tracking-wider">
                hug
              </span>
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#626200] inline-block shadow-xs"
              />
              <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#201b12] tracking-wider">
                z
              </span>
            </motion.div>

            {/* Brand Slogan */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="font-display text-sm sm:text-base font-semibold text-[#484834] leading-relaxed max-w-xs"
            >
              Vỗ về từng khoảnh khắc &amp; lưu trữ thông minh cho tổ ấm
            </motion.p>

            {/* Smooth Progress Indicator */}
            <div className="w-36 h-1 bg-[#cac7ae]/30 rounded-full mt-6 overflow-hidden relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 1.2, ease: 'easeInOut', repeat: Infinity }}
                className="w-1/2 h-full bg-[#201b12] rounded-full"
              />
            </div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.6 }}
              className="text-[10px] text-[#797862] mt-3 tracking-wide"
            >
              Chạm để vào ngay
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
