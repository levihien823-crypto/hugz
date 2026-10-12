import React, { useState } from 'react';
import { FAQS } from '../data/products';
import { Send, CheckCircle2, ChevronDown, Copy, ExternalLink, MessageCircle, X, Check } from 'lucide-react';

interface ContactViewProps {
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      onShowToast('Vui lòng điền họ và tên của bạn');
      return;
    }

    const messageContent = `[Đăng ký tư vấn HUGZ]\nHọ tên: ${formData.name}${formData.phone ? `\nSĐT: ${formData.phone}` : ''}${formData.message ? `\nLời nhắn: ${formData.message}` : ''}`;

    setGeneratedMessage(messageContent);

    // Sao chép nội dung tin nhắn vào Clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(messageContent)
        .then(() => setCopied(true))
        .catch(() => setCopied(false));
    }

    setShowModal(true);
    onShowToast('Nội dung đã được chuẩn bị! Vui lòng làm theo hướng dẫn để gửi qua Facebook.');
  };

  const handleCopyAgain = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedMessage)
        .then(() => {
          setCopied(true);
          onShowToast('Đã sao chép lại nội dung tin nhắn!');
          setTimeout(() => setCopied(false), 3000);
        })
        .catch(() => {
          onShowToast('Không thể sao chép, bạn có thể bôi đen nội dung bên dưới để copy');
        });
    }
  };

  const handleOpenMessenger = () => {
    window.open('https://m.me/thehugzlife', '_blank');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      phone: '',
      message: '',
    });
  };

  return (
    <div className="w-full py-10">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f34d] text-[#201b12] text-xs font-bold uppercase mb-2">
            <span>CHĂM SÓC KHÁCH HÀNG</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#201b12]">
            Liên Hệ & Hỗ Trợ Khách Hàng
          </h1>
          <p className="text-sm text-[#484834] mt-2 leading-relaxed">
            HUGZ luôn lắng nghe mọi góp ý, thắc mắc về đơn hàng, chính sách đổi trả hoặc nhu cầu hợp tác phân phối sỉ.
          </p>
        </div>

        {/* Contact Form & Social Connect Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Social Connect Card in Contact View */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-gradient-to-br from-[#fdf2e3] to-[#f8ecdd] p-6 sm:p-7 rounded-3xl border border-[#cac7ae]/40 shadow-sm space-y-4">
              <div>
                <h4 className="font-display text-lg font-bold text-[#201b12]">
                  Mạng Xã Hội Trực Tuyến
                </h4>
                <p className="text-xs text-[#484834] mt-1 leading-relaxed">
                  Nhắn tin trực tiếp qua Facebook hoặc tương tác trên TikTok để nhận hỗ trợ nhanh từ đội ngũ HUGZ:
                </p>
              </div>
              <div className="space-y-3 pt-1">
                <a
                  href="https://www.facebook.com/thehugzlife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#cac7ae]/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook Messenger</span>
                </a>
                <a
                  href="https://www.tiktok.com/@thehugzlife"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white hover:bg-black text-black hover:text-white border border-[#cac7ae]/40 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-2xs group cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                  <span>TikTok HUGZ</span>
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-[#cac7ae]/40 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-[#201b12] mb-1">
              Gửi Tin Nhắn Cho HUGZ
            </h3>
            <p className="text-xs text-[#484834] mb-6">
              Điền thông tin bên dưới và bấm gửi. Hệ thống sẽ tự động mở **Facebook Messenger** để kết nối trực tiếp với CSKH HUGZ.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#201b12] block mb-1">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#201b12] block mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#201b12] block mb-1">
                  Nội dung lời nhắn
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Bạn cần hỗ trợ điều gì về sản phẩm HUGZ..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-display text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Gửi tin nhắn qua Facebook Messenger</span>
              </button>
            </form>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#cac7ae]/40 shadow-sm">
          <h3 className="font-display text-2xl font-bold text-[#201b12] mb-6 text-center">
            Câu Hỏi Thường Gặp (FAQ)
          </h3>
          <div className="divide-y divide-[#cac7ae]/30 max-w-3xl mx-auto">
            {FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="py-4">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span className="font-display text-sm sm:text-base font-bold text-[#201b12] group-hover:text-[#626200] transition-colors">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#484834] transition-transform duration-300 shrink-0 ${
                        isOpen ? 'rotate-180 text-[#626200]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm text-[#484834] mt-2.5 leading-relaxed pl-2 border-l-2 border-[#f4f34d]">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Instruction Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#cac7ae]/50 relative space-y-5 overflow-hidden">
              
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#cac7ae]/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1877F2] flex items-center justify-center text-white shrink-0 shadow-sm">
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#201b12]">
                      Hướng Dẫn Gửi Tin Nhắn
                    </h3>
                    <p className="text-xs text-[#484834]">
                      Gửi nội dung trực tiếp tới Facebook Messenger HUGZ
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 rounded-full hover:bg-[#fdf2e3] text-[#484834] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Copy Notification Status */}
              <div className="bg-[#e7f3ff] border border-[#1877F2]/30 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-[#1877F2]">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#1877F2]" />
                <div>
                  <span className="font-bold block">Đã tự động sao chép thông tin!</span>
                  <span className="text-[#335075] text-[11px]">Nội dung đã sẵn sàng trong khay nhớ tạm (Clipboard).</span>
                </div>
              </div>

              {/* Message Preview Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#201b12]">
                  <span>Nội dung đã soạn sẵn:</span>
                  <button
                    onClick={handleCopyAgain}
                    className="text-[#1877F2] hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Đã chép!' : 'Sao chép lại'}</span>
                  </button>
                </div>
                <div className="bg-[#fdf2e3] p-3.5 rounded-2xl border border-[#cac7ae]/50 text-xs font-mono text-[#201b12] whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed shadow-inner">
                  {generatedMessage}
                </div>
              </div>

              {/* Steps List */}
              <div className="space-y-2.5 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#484834]">
                  Các bước gửi tin nhắn (Chỉ 2 giây):
                </h4>
                <div className="space-y-2 text-xs text-[#201b12]">
                  <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#cac7ae]/30">
                    <span className="w-5 h-5 rounded-full bg-[#f4f34d] text-[#201b12] font-bold text-[11px] flex items-center justify-center shrink-0">1</span>
                    <span>Bấm nút <strong>"Mở Facebook Messenger Ngay"</strong> bên dưới.</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#cac7ae]/30">
                    <span className="w-5 h-5 rounded-full bg-[#f4f34d] text-[#201b12] font-bold text-[11px] flex items-center justify-center shrink-0">2</span>
                    <span>Tại ô chat Messenger, thực hiện <strong>Dán (Paste / Ctrl+V / Giữ chọn Dán)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2.5 bg-white p-2.5 rounded-xl border border-[#cac7ae]/30">
                    <span className="w-5 h-5 rounded-full bg-[#f4f34d] text-[#201b12] font-bold text-[11px] flex items-center justify-center shrink-0">3</span>
                    <span>Ấn <strong>Gửi</strong> để CSKH HUGZ hỗ trợ bạn ngay lập tức!</span>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleOpenMessenger}
                  className="w-full sm:flex-1 py-3.5 px-4 rounded-xl bg-[#1877F2] hover:bg-[#166FE5] text-white font-display text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Mở Facebook Messenger Ngay</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </button>
                <button
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#fdf2e3] hover:bg-[#f5e3cd] text-[#201b12] text-xs font-bold transition-all cursor-pointer"
                >
                  Đóng
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
