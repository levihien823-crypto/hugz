import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Clock, ShieldCheck, Ticket } from 'lucide-react';
import { trackMarketplaceClick, buildTrackedUrl } from '../utils/analytics';

interface ChannelsViewProps {
  onCopyVoucher: (code: string) => void;
  hasCopiedVoucher: boolean;
}

export const ChannelsView: React.FC<ChannelsViewProps> = ({
  onCopyVoucher,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const vouchers = [
    {
      code: 'HUGZSHOPEE20',
      platform: 'Shopee Mall',
      discount: 'Giảm ngay 20%',
      minOrder: 'Đơn từ 199.000₫',
      expiry: 'Hạn dùng: 30/10/2025',
      tagColor: 'bg-[#EE4D2D] text-white',
    },
    {
      code: 'TIKTOKHUGZ30',
      platform: 'TikTok Shop',
      discount: 'Giảm 30% khi xem Live',
      minOrder: 'Áp dụng cho mọi đơn',
      expiry: 'Khung giờ: 12:00 & 20:00',
      tagColor: 'bg-[#111111] text-white',
    },
    {
      code: 'FREESHIPXTRA',
      platform: 'Toàn quốc',
      discount: 'Miễn phí vận chuyển',
      minOrder: 'Đơn từ 150.000₫',
      expiry: 'Không giới hạn lượt dùng',
      tagColor: 'bg-[#626200] text-white',
    },
  ];

  const handleCopy = (code: string) => {
    onCopyVoucher(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OFFICIAL STORES & PARTNERS</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#201b12]">
            Kênh Mua Hàng Chính Hãng HUGZ
          </h1>
          <p className="text-sm text-[#484834] mt-2 leading-relaxed">
            Để đảm bảo quyền lợi và bảo hành chính hãng 100%, quý khách vui lòng đặt mua tại các kênh phân phối chính thức của HUGZ dưới đây.
          </p>
        </div>

        {/* Vouchers Section */}
        <div className="mb-14">
          <h3 className="font-display text-xl font-bold text-[#201b12] mb-4 flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#626200]" />
            <span>Voucher Khuyến Mãi Độc Quyền Tháng Này</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vouchers.map((v) => (
              <div
                key={v.code}
                className="bg-white p-5 rounded-2xl border border-[#cac7ae]/40 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${v.tagColor}`}>
                      {v.platform}
                    </span>
                    <span className="text-xs text-[#797862]">{v.expiry}</span>
                  </div>
                  <h4 className="font-display text-lg font-bold text-[#201b12]">
                    {v.discount}
                  </h4>
                  <p className="text-xs text-[#484834] mt-0.5">{v.minOrder}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#f8ecdd] flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-[#626200]">
                    {v.code}
                  </span>
                  <button
                    onClick={() => handleCopy(v.code)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f8ecdd] hover:bg-[#f1ddba] text-[#201b12] text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedCode === v.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 Main Marketplace Hubs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Shopee Mall */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cac7ae]/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md text-xs font-extrabold text-white bg-[#EE4D2D]">
                  SHOPEE MALL CHÍNH HÃNG
                </span>
                <span className="text-xs font-bold text-[#E5A800]">★ 4.9/5.0 (25.000+ Đánh giá)</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#201b12] mb-2">
                Gian Hàng Shopee Mall HUGZ Home
              </h3>
              <p className="text-sm text-[#484834] leading-relaxed mb-6">
                Kênh bán hàng có đầy đủ mọi mã SKU của HUGZ. Đảm bảo 100% hàng thật, hỗ trợ hoàn tiền gấp đôi nếu phát hiện hàng giả, áp dụng mã Freeship Extra toàn quốc.
              </p>
              <ul className="space-y-2 text-xs text-[#484834] mb-6">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#EE4D2D]" />
                  <span>Cam kết chính hãng 100% bảo hộ bởi Shopee Mall</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#EE4D2D]" />
                  <span>Giao hỏa tốc nhận trong 2 giờ tại HN & TP.HCM</span>
                </li>
              </ul>
            </div>
            <a
              href={buildTrackedUrl('https://shopee.vn/hugzvietnam', 'shopee', 'channels_shopee_mall')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMarketplaceClick('Shopee', 'Gian Hàng Shopee Mall Official', 'https://shopee.vn/hugzvietnam')}
              className="w-full py-3.5 rounded-xl bg-[#EE4D2D] hover:bg-[#d63f20] text-white font-display text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Truy cập Shopee Mall HUGZ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* TikTok Shop */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#cac7ae]/40 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-md text-xs font-extrabold text-white bg-[#111111]">
                  TIKTOK SHOP OFFICIAL
                </span>
                <span className="text-xs font-bold text-rose-600">● LIVE 12:00 & 20:00 HÀNG NGÀY</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-[#201b12] mb-2">
                TikTok Shop HUGZ Lifestyle
              </h3>
              <p className="text-sm text-[#484834] leading-relaxed mb-6">
                Trải nghiệm xem trực quan từng chi tiết túi, chăn sữa và khăn lau mặt trên sóng livestream. Tham gia các minigame tặng quà và săn deal giảm sốc 30% trực tiếp trên sóng.
              </p>
              <ul className="space-y-2 text-xs text-[#484834] mb-6">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#111111]" />
                  <span>Mua sắm trực tiếp trên video ngắn & livestream</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#111111]" />
                  <span>Voucher giảm giá độc quyền từ trợ giá TikTok Shop</span>
                </li>
              </ul>
            </div>
            <a
              href={buildTrackedUrl('https://www.tiktok.com/@hugzvietnam', 'tiktok', 'channels_tiktok_shop')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMarketplaceClick('TikTok', 'Kênh TikTok Shop Official', 'https://www.tiktok.com/@hugzvietnam')}
              className="w-full py-3.5 rounded-xl bg-[#111111] hover:bg-black text-white font-display text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Truy cập TikTok Shop HUGZ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Social Media Community Section */}
        <div className="bg-[#fdf2e3] rounded-3xl p-6 sm:p-10 border border-[#cac7ae]/40 mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase inline-block mb-2">
              KẾT NỐI MẠNG XÃ HỘI
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#201b12]">
              Cộng Đồng Phong Cách Sống HUGZ
            </h3>
            <p className="text-xs sm:text-sm text-[#484834] mt-2">
              Theo dõi các trang mạng xã hội chính thức để cập nhật video thực tế, mẹo tổ chức không gian và săn quà tặng minigame.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#201b12]">
                      The Hugz Life Fanpage
                    </h4>
                    <span className="text-xs text-[#797862]">facebook.com/thehugzlife</span>
                  </div>
                </div>
                <p className="text-xs text-[#484834] leading-relaxed mb-4">
                  Cập nhật các bộ sưu tập túi mới nhất, thông tin ưu đãi độc quyền và hỗ trợ giải đáp tin nhắn khách hàng 24/7.
                </p>
              </div>
              <a
                href="https://www.facebook.com/thehugzlife"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Ghé thăm Facebook The Hugz Life</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* TikTok Card */}
            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-black/10 text-black flex items-center justify-center font-bold">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-[#201b12]">
                      Kênh TikTok @thehugzlife
                    </h4>
                    <span className="text-xs text-[#797862]">tiktok.com/@thehugzlife</span>
                  </div>
                </div>
                <p className="text-xs text-[#484834] leading-relaxed mb-4">
                  Theo dõi video trải nghiệm thực tế, mẹo sắp xếp hành lý du lịch, xem livestream mỗi ngày và săn voucher giảm 30%.
                </p>
              </div>
              <a
                href="https://www.tiktok.com/@thehugzlife"
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Xem TikTok @thehugzlife</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
