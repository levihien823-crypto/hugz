import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/products';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    title: '',
    subtitle: '',
    category: CATEGORIES[0]?.name || 'Túi đựng đồ cá nhân',
    categorySlug: CATEGORIES[0]?.id || 'do-ca-nhan',
    price: 150000,
    originalPrice: 200000,
    rating: 5.0,
    reviewsCount: 1,
    soldCount: '1 đã bán',
    badge: 'MỚI RA MẮT',
    badgeColor: 'primary',
    image: '',
    description: '',
    features: ['Chất liệu cao cấp kháng nước', 'Đường may tỉ mỉ chắc chắn'],
    dimensions: '20cm x 15cm x 8cm',
    material: 'Vải Canvas chống thấm cao cấp',
    shopeeUrl: 'https://shopee.vn',
    tiktokUrl: 'https://tiktok.com',
    variants: ['Màu Be', 'Màu Đen'],
    isBestSeller: false,
    isNew: true,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newVariant, setNewVariant] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({ ...productToEdit });
    } else {
      setFormData({
        title: '',
        subtitle: '',
        category: CATEGORIES[0]?.name || 'Túi đựng đồ cá nhân',
        categorySlug: CATEGORIES[0]?.id || 'do-ca-nhan',
        price: 150000,
        originalPrice: 200000,
        rating: 5.0,
        reviewsCount: 1,
        soldCount: '1 đã bán',
        badge: 'MỚI RA MẮT',
        badgeColor: 'primary',
        image: '',
        description: '',
        features: ['Chất liệu cao cấp kháng nước', 'Đường may tỉ mỉ chắc chắn'],
        dimensions: '20cm x 15cm x 8cm',
        material: 'Vải Canvas chống thấm cao cấp',
        shopeeUrl: 'https://shopee.vn',
        tiktokUrl: 'https://tiktok.com',
        variants: ['Màu Be', 'Màu Đen'],
        isBestSeller: false,
        isNew: true,
      });
    }
    setErrorMsg('');
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCat = CATEGORIES.find(c => c.name === e.target.value);
    setFormData(prev => ({
      ...prev,
      category: e.target.value,
      categorySlug: selectedCat ? selectedCat.id : 'do-ca-nhan'
    }));
  };

  const handleAddFeature = () => {
    if (!newFeature.trim()) return;
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()]
    }));
    setNewFeature('');
  };

  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: (prev.features || []).filter((_, i) => i !== index)
    }));
  };

  const handleAddVariant = () => {
    if (!newVariant.trim()) return;
    setFormData(prev => ({
      ...prev,
      variants: [...(prev.variants || []), newVariant.trim()]
    }));
    setNewVariant('');
  };

  const handleRemoveVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: (prev.variants || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      setErrorMsg('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      setErrorMsg('Vui lòng nhập giá bán hợp lệ');
      return;
    }
    if (!formData.image?.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn hình ảnh sản phẩm');
      return;
    }

    const slug = formData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const finalProduct: Product = {
      id: productToEdit?.id || `hugz-${slug}-${Date.now().toString().slice(-4)}`,
      title: formData.title.trim(),
      subtitle: formData.subtitle?.trim() || '',
      category: formData.category || 'Túi đựng đồ cá nhân',
      categorySlug: formData.categorySlug || 'do-ca-nhan',
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice || formData.price),
      rating: Number(formData.rating || 5.0),
      reviewsCount: Number(formData.reviewsCount || 1),
      soldCount: formData.soldCount || '1 đã bán',
      badge: formData.badge?.trim() || undefined,
      badgeColor: formData.badgeColor || 'primary',
      image: formData.image.trim(),
      description: formData.description?.trim() || formData.title.trim(),
      features: formData.features && formData.features.length > 0 ? formData.features : ['Sản phẩm HUGZ chính hãng'],
      dimensions: formData.dimensions?.trim() || 'Tiêu chuẩn',
      material: formData.material?.trim() || 'Chất liệu cao cấp',
      shopeeUrl: formData.shopeeUrl?.trim() || 'https://shopee.vn',
      tiktokUrl: formData.tiktokUrl?.trim() || 'https://tiktok.com',
      variants: formData.variants || ['Mặc định'],
      isBestSeller: Boolean(formData.isBestSeller),
      isNew: Boolean(formData.isNew),
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden my-8"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-gradient-to-r from-stone-50 via-amber-50/30 to-stone-50 border-b border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {productToEdit ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
                </h3>
                <p className="text-xs text-stone-500">
                  Thông tin sẽ được cập nhật tức thì trên website
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Block 1: Thông tin cơ bản */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" /> Thông tin cơ bản
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tên sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ví dụ: Túi Mini HUGZ Storage Bag Chống Nước..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tiêu đề phụ / Điểm nhấn ngắn
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Ví dụ: Gọn gàng thanh lịch, bảo vệ tối ưu"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Danh mục sản phẩm
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm bg-white"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Block 2: Giá & Nhãn */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5" /> Giá bán & Nhãn nổi bật
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Giá bán ưu đãi (VNĐ) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1000"
                    step="1000"
                    value={formData.price || ''}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="150000"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Giá niêm yết gốc (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.originalPrice || ''}
                    onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    placeholder="220000"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Badge hiển thị (Huy hiệu)
                  </label>
                  <input
                    type="text"
                    value={formData.badge || ''}
                    onChange={e => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="VD: BEST SELLER, HOT..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller || false}
                    onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span>Đánh dấu là <strong>Sản phẩm Bán chạy</strong></span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isNew || false}
                    onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                  />
                  <span>Đánh dấu là <strong>Sản phẩm Mới (New)</strong></span>
                </label>
              </div>
            </div>

            {/* Block 3: Hình ảnh */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Hình ảnh đại diện
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Đường dẫn hình ảnh (URL hoặc đường dẫn /images/products/...) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.image || ''}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... hoặc /images/products/hugz-example.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                  <p className="text-[11px] text-stone-400 mt-1">
                    Mẹo: Có thể dùng link ảnh trực tiếp từ Imgur, Shopee, Unsplash hoặc file trong thư mục public.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-2 rounded-2xl border border-stone-200 bg-stone-50 h-28 w-28 mx-auto overflow-hidden">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Xem trước"
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Loi+Anh';
                      }}
                    />
                  ) : (
                    <div className="text-center text-stone-400 text-xs flex flex-col items-center gap-1">
                      <ImageIcon className="w-6 h-6 stroke-1" />
                      <span>Xem trước</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Block 4: Chi tiết mô tả & Đặc điểm nổi bật */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Mô tả & Đặc điểm
              </h4>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết về công năng, thiết kế và trải nghiệm sử dụng..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kích thước (D x R x C)
                  </label>
                  <input
                    type="text"
                    value={formData.dimensions || ''}
                    onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                    placeholder="VD: 24cm x 17cm x 14cm"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chất liệu
                  </label>
                  <input
                    type="text"
                    value={formData.material || ''}
                    onChange={e => setFormData({ ...formData, material: e.target.value })}
                    placeholder="VD: Vải Canvas chần bông chống thấm"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Danh sách Features */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Các điểm nổi bật (Features)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    placeholder="Thêm điểm nổi bật (nhấn Enter)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.features || []).map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-lg text-xs"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-amber-600 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Danh sách Biến thể / Phân loại */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Phân loại / Màu sắc
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newVariant}
                    onChange={e => setNewVariant(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddVariant(); } }}
                    placeholder="Thêm phân loại (Màu đen, Kẻ sọc be...)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Thêm
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.variants || []).map((v, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 border border-stone-200 rounded-lg text-xs"
                    >
                      {v}
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-stone-500 hover:text-red-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 5: Link Sàn TMĐT */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold tracking-wider text-stone-400 uppercase flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Liên kết Sàn thương mại điện tử
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Link Shopee chính hãng
                  </label>
                  <input
                    type="url"
                    value={formData.shopeeUrl || ''}
                    onChange={e => setFormData({ ...formData, shopeeUrl: e.target.value })}
                    placeholder="https://shopee.vn/..."
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Link TikTok Shop
                  </label>
                  <input
                    type="url"
                    value={formData.tiktokUrl || ''}
                    onChange={e => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@..."
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-semibold transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-md shadow-amber-600/20 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {productToEdit ? 'Lưu Thay Đổi' : 'Đăng Sản Phẩm'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
