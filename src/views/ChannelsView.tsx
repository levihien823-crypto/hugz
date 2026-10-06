import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Sparkles, Clock, ShieldCheck, Ticket } from 'lucide-react';

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
              href="https://s.shopee.vn/9pbeimilNQ"
              target="_blank"
              rel="noopener noreferrer"
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
              href="https://www.tiktok.com/@hugzvietnam"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-xl bg-[#111111] hover:bg-black text-white font-display text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Truy cập TikTok Shop HUGZ</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
