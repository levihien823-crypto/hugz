import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingSocialWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Facebook Fanpage Button */}
          <a
            href="https://www.facebook.com/thehugzlife"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#1877F2] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-bold group"
            title="Nhắn tin qua Facebook The Hugz Life"
          >
            <span className="hidden sm:inline group-hover:inline">Chat Facebook</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
          </a>

          {/* TikTok Channel Button */}
          <a
            href="https://www.tiktok.com/@thehugzlife"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-[#111111] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all text-xs font-bold group"
            title="Xem TikTok @thehugzlife"
          >
            <span className="hidden sm:inline group-hover:inline">TikTok Video</span>
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </div>
          </a>
        </div>
      )}

      {/* Main Trigger Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full bg-[#201b12] hover:bg-black text-[#f4f34d] shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer border-2 border-[#f4f34d]/60 relative group"
        aria-label="Liên hệ mạng xã hội"
        title="Liên hệ Facebook & TikTok HUGZ"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-[#f4f34d]/50 animate-ping opacity-40 pointer-events-none" />
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
};
