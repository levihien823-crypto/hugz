import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="flex items-center gap-3 px-4 py-3 bg-[#201b12] text-white rounded-xl shadow-xl border border-[#cac7ae]/40 text-xs sm:text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 text-[#f4f34d] shrink-0" />
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
