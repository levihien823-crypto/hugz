import React, { useState } from 'react';
import { FAQS } from '../data/products';
import { Phone, Mail, Clock, MapPin, Send, CheckCircle2, ChevronDown } from 'lucide-react';

interface ContactViewProps {
  onShowToast: (msg: string) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onShowToast }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Tư vấn sản phẩm',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      onShowToast('Vui lòng điền họ tên và email');
      return;
    }
    setSubmitted(true);
    onShowToast('Cảm ơn bạn! Đội ngũ HUGZ sẽ phản hồi trong vòng 24 giờ.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      topic: 'Tư vấn sản phẩm',
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

        {/* Contact Form & Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8ecdd] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#626200]" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#201b12]">Hotline Hỗ Trợ</h4>
                <p className="text-xs text-[#484834] mt-0.5">Tư vấn đơn hàng & bảo hành nhanh</p>
                <p className="font-display text-lg font-bold text-[#b62506] mt-1">1900 6868</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8ecdd] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#626200]" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#201b12]">Email CSKH</h4>
                <p className="text-xs text-[#484834] mt-0.5">Tiếp nhận khiếu nại & hợp tác B2B</p>
                <p className="text-sm font-semibold text-[#201b12] mt-1">cskh@hugzhome.vn</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8ecdd] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#626200]" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#201b12]">Thời Gian Làm Việc</h4>
                <p className="text-xs text-[#484834] mt-0.5">Thứ 2 đến Thứ 7 hàng tuần</p>
                <p className="text-sm font-semibold text-[#201b12] mt-1">08:30 - 18:00 (Nghỉ Chủ Nhật)</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#cac7ae]/40 shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f8ecdd] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#626200]" />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-[#201b12]">Kho Hàng & Trụ Sở</h4>
                <p className="text-xs text-[#484834] mt-0.5">Trung tâm phân phối chính thức</p>
                <p className="text-sm font-semibold text-[#201b12] mt-1">
                  KĐT Mỗ Lao, Phường Mộ Lao, Quận Hà Đông, Hà Nội
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#cac7ae]/40 shadow-sm">
            <h3 className="font-display text-2xl font-bold text-[#201b12] mb-1">
              Gửi Tin Nhắn Cho HUGZ
            </h3>
            <p className="text-xs text-[#484834] mb-6">
              Điền thông tin bên dưới, nhân viên chăm sóc khách hàng sẽ liên hệ với bạn trong tích tắc.
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#201b12] block mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#201b12] block mb-1">
                    Chủ đề hỗ trợ
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#fdf2e3]/60 rounded-xl border border-[#cac7ae]/50 focus:outline-none focus:border-[#201b12]"
                  >
                    <option>Tư vấn sản phẩm & kích thước</option>
                    <option>Bảo hành & đổi trả hàng lỗi</option>
                    <option>Hợp tác đại lý / B2B</option>
                    <option>Ý kiến đóng góp phát triển sản phẩm</option>
                  </select>
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
                className="w-full py-3 rounded-xl bg-[#f4f34d] hover:bg-[#eae944] text-[#201b12] font-display text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Đã gửi thông tin thành công!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi tin nhắn ngay</span>
                  </>
                )}
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

      </div>
    </div>
  );
};
