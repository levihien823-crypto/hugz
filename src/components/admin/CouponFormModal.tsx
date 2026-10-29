import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { Coupon } from '../../types';

interface CouponFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (coupon: Coupon) => void;
  couponToEdit?: Coupon | null;
}

export const CouponFormModal: React.FC<CouponFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  couponToEdit
}) => {
  const [formData, setFormData] = useState<Partial<Coupon>>({
    code: '',
    discountPercent: 20,
    minOrderAmount: 0,
    description: '',
    isActive: true,
  });

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (couponToEdit) {
      setFormData({ ...couponToEdit });
    } else {
      setFormData({
        code: '',
        discountPercent: 20,
        minOrderAmount: 0,
        description: '',
        isActive: true,
      });
    }
    setErrorMsg('');
  }, [couponToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = formData.code?.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMsg('Vui lòng nhập mã voucher (ví dụ: HUGZSALE20)');
      return;
    }
    if (!formData.discountPercent || formData.discountPercent <= 0 || formData.discountPercent > 100) {
      setErrorMsg('Mức giảm giá phải từ 1% đến 100%');
      return;
    }

    const finalCoupon: Coupon = {
      id: couponToEdit?.id || `coupon-${cleanCode.toLowerCase()}-${Date.now().toString().slice(-4)}`,
      code: cleanCode,
      discountPercent: Number(formData.discountPercent),
      minOrderAmount: Number(formData.minOrderAmount || 0),
      description: formData.description?.trim() || `Giảm ${formData.discountPercent}% cho đơn hàng`,
      isActive: Boolean(formData.isActive),
      usageCount: couponToEdit?.usageCount || 0,
      expiryDate: formData.expiryDate || undefined
    };

    onSave(finalCoupon);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden my-6"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-amber-50/50 to-stone-50 border-b border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  {couponToEdit ? 'Chỉnh Sửa Mã Giảm Giá' : 'Thêm Mã Giảm Giá Mới'}
                </h3>
                <p className="text-xs text-stone-500">
                  Khách hàng có thể nhập mã này tại giỏ hàng để nhận ưu đãi
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mã Voucher (Code) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.code || ''}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="VD: HUGZVIP20, CHAOBANMOI..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-bold uppercase tracking-wider"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mức giảm (%) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.discountPercent || ''}
                    onChange={(e) => setFormData({ ...formData, discountPercent: Number(e.target.value) })}
                    placeholder="20"
                    className="w-full px-4 py-2.5 pr-8 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Đơn hàng tối thiểu (VNĐ)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.minOrderAmount || ''}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                  placeholder="0đ"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mô tả hiển thị
              </label>
              <input
                type="text"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="VD: Giảm 20% cho đơn hàng đầu tiên"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hạn sử dụng (Tùy chọn)
              </label>
              <input
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm bg-white"
              />
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center gap-2.5 cursor-pointer text-sm text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={formData.isActive ?? true}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                />
                <span className="font-semibold text-xs">Kích hoạt mã voucher ngay bây giờ</span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                {couponToEdit ? 'Lưu Thay Đổi' : 'Tạo Mã Giảm Giá'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
