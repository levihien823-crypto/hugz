import React, { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  FolderOpen,
  UploadCloud,
  Crown,
  ArrowLeft,
  ArrowRight,
  ClipboardPaste,
  Link as LinkIcon
} from 'lucide-react';
import { Product } from '../../types';
import { CATEGORIES } from '../../data/products';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  productToEdit?: Product | null;
}

/**
 * Nén và chuyển đổi file ảnh từ máy tính / clipboard sang Data URL (WebP/JPEG)
 * Giúp dung lượng nhỏ gọn (~35-60KB), lưu trữ mượt mà trên localStorage cho bộ sưu tập 10-20 ảnh.
 */
const compressImageFile = (file: File): Promise<{ dataUrl: string; sizeKb: number }> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Vui lòng chọn hoặc dán file hình ảnh hợp lệ (JPG, PNG, WebP...).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1000;
        const maxHeight = 1000;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const raw = readerEvent.target?.result as string;
          resolve({ dataUrl: raw, sizeKb: Math.round(file.size / 1024) });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.82);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.82);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        }

        const approxSizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);
        resolve({ dataUrl, sizeKb: approxSizeKb });
      };
      img.onerror = () => reject(new Error('Không thể xử lý dữ liệu ảnh này. Vui lòng thử ảnh khác.'));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Lỗi khi đọc file ảnh từ bộ nhớ.'));
    reader.readAsDataURL(file);
  });
};

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

  // Quản lý danh sách hình ảnh (10 - 20 ảnh) và hỗ trợ dán ảnh Clipboard (Ctrl + V)
  const [images, setImages] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [pasteNotification, setPasteNotification] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState<string>('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (productToEdit) {
      setFormData({ ...productToEdit });
      let initialImgs: string[] = [];
      if (productToEdit.images && productToEdit.images.length > 0) {
        initialImgs = [...productToEdit.images];
      } else if (productToEdit.gallery && productToEdit.gallery.length > 0) {
        initialImgs = productToEdit.gallery.map(g => g.url);
      } else if (productToEdit.image) {
        initialImgs = [productToEdit.image];
      }
      setImages(initialImgs);
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
      setImages([]);
    }
    setUrlInput('');
    setShowUrlInput(false);
    setErrorMsg('');
    setPasteNotification(null);
  }, [productToEdit, isOpen]);

  // Nén và thêm nhiều file ảnh (từ thư mục, kéo thả, hoặc dán Ctrl+V)
  const processMultipleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileArray.length === 0) {
      setErrorMsg('Vui lòng chọn hoặc dán file hình ảnh hợp lệ (JPG, PNG, WebP...).');
      return;
    }

    const maxLimit = 20;
    const remainingSlots = maxLimit - images.length;
    if (remainingSlots <= 0) {
      setErrorMsg(`Đã đạt giới hạn tối đa ${maxLimit} ảnh cho sản phẩm.`);
      return;
    }

    const filesToProcess = fileArray.slice(0, remainingSlots);
    setIsProcessingImage(true);
    setErrorMsg('');

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < filesToProcess.length; i++) {
        setProcessingProgress(`${i + 1}/${filesToProcess.length}`);
        const res = await compressImageFile(filesToProcess[i]);
        newUrls.push(res.dataUrl);
      }

      setImages(prev => {
        const updated = [...prev, ...newUrls];
        if (!formData.image && updated.length > 0) {
          setFormData(f => ({ ...f, image: updated[0] }));
        }
        return updated;
      });

      if (fileArray.length > remainingSlots) {
        setErrorMsg(`Chỉ có thể nạp thêm ${remainingSlots} ảnh do giới hạn tối đa ${maxLimit} ảnh.`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi xử lý file ảnh.');
    } finally {
      setIsProcessingImage(false);
      setProcessingProgress('');
    }
  };

  // Lắng nghe sự kiện Paste (Ctrl + V) toàn cục trong modal
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const clipboardData = e.clipboardData;
      if (!clipboardData) return;

      // 1. Kiểm tra nếu clipboard có chứa file ảnh (chụp màn hình, copy file...)
      const imageFiles: File[] = [];

      if (clipboardData.files && clipboardData.files.length > 0) {
        for (let i = 0; i < clipboardData.files.length; i++) {
          const file = clipboardData.files[i];
          if (file.type.startsWith('image/')) {
            imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length === 0 && clipboardData.items) {
        for (let i = 0; i < clipboardData.items.length; i++) {
          const item = clipboardData.items[i];
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) imageFiles.push(file);
          }
        }
      }

      if (imageFiles.length > 0) {
        e.preventDefault();
        processMultipleFiles(imageFiles).then(() => {
          setPasteNotification(`Đã dán thành công ${imageFiles.length} hình ảnh từ Clipboard! (Ctrl+V)`);
          setTimeout(() => setPasteNotification(null), 3500);
        });
        return;
      }

      // 2. Nếu người dùng copy link URL ảnh từ web rồi bấm Ctrl + V
      const text = clipboardData.getData('text')?.trim();
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        // Nếu người dùng đang gõ ở ô input/textarea thông thường khác thì để text paste tự nhiên
        if (activeTag === 'input' || activeTag === 'textarea') {
          return;
        }
        e.preventDefault();
        setImages(prev => {
          if (prev.length >= 20) {
            setErrorMsg('Đã đạt tối đa 20 ảnh cho sản phẩm.');
            return prev;
          }
          return [...prev, text];
        });
        setPasteNotification('Đã thêm 1 đường dẫn ảnh từ Clipboard!');
        setTimeout(() => setPasteNotification(null), 3500);
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => {
      window.removeEventListener('paste', handleWindowPaste);
    };
  }, [isOpen, images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processMultipleFiles(e.target.files);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processMultipleFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const updated = [...prev];
      const [selected] = updated.splice(index, 1);
      updated.unshift(selected);
      return updated;
    });
  };

  const handleMoveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    setImages(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllImages = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ ảnh trong danh sách?')) {
      setImages([]);
    }
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    if (images.length >= 20) {
      setErrorMsg('Đã đạt giới hạn tối đa 20 ảnh cho sản phẩm.');
      return;
    }
    setImages(prev => [...prev, urlInput.trim()]);
    setUrlInput('');
    setErrorMsg('');
  };

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
    
    const finalImages = images.filter(img => Boolean(img.trim()));
    if (finalImages.length === 0) {
      setErrorMsg('Vui lòng thêm ít nhất 1 hình ảnh sản phẩm (chọn từ máy, dán ảnh Ctrl+V hoặc nhập link URL)');
      return;
    }

    const coverImage = finalImages[0];

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
      image: coverImage,
      images: finalImages,
      gallery: finalImages.map((url, idx) => ({
        id: `img-${Date.now()}-${idx + 1}`,
        url,
        title: `${formData.title.trim()} - Ảnh ${idx + 1}`,
        desc: formData.subtitle?.trim() || formData.title.trim(),
        badge: undefined
      })),
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

            {/* Block 3: Bộ sưu tập hình ảnh (Hỗ trợ 10 - 20 ảnh + Copy Paste Ctrl+V) */}
            <div className="space-y-4 pt-2 border-t border-stone-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold tracking-wider text-stone-600 uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-600" /> 
                    Bộ sưu tập hình ảnh sản phẩm <span className="text-red-500">*</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Hỗ trợ thêm <strong>10 đến 20 ảnh chi tiết</strong>. Có thể <strong>Copy ảnh rồi nhấn Ctrl + V</strong> để dán trực tiếp.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    images.length >= 10 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : images.length > 0 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-stone-100 text-stone-500'
                  }`}>
                    {images.length}/20 ảnh {images.length >= 10 ? '✨ Đạt chuẩn' : '(Khuyên dùng 10+ ảnh)'}
                  </span>

                  {images.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAllImages}
                      className="text-[11px] text-stone-400 hover:text-red-600 hover:underline transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Xóa tất cả
                    </button>
                  )}
                </div>
              </div>

              {/* Toast thông báo khi dán ảnh từ Clipboard */}
              <AnimatePresence>
                {pasteNotification && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{pasteNotification}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input file ẩn hỗ trợ multiple */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Thanh công cụ & Dropzone / Paste zone đa năng */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative rounded-2xl border-2 border-dashed p-5 transition-all text-center ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50/60 scale-[1.01]'
                    : 'border-stone-300 hover:border-amber-500 bg-stone-50/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 shadow-inner">
                    {isProcessingImage ? (
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ClipboardPaste className="w-6 h-6" />
                    )}
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <p className="text-xs sm:text-sm font-bold text-stone-800">
                      {isProcessingImage ? (
                        <span className="text-amber-700 animate-pulse">
                          Đang nén & tối ưu {processingProgress}...
                        </span>
                      ) : (
                        'Chọn ảnh từ máy tính hoặc nhấn Ctrl + V để dán ảnh tức thì'
                      )}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Chụp màn hình (Win + Shift + S), copy ảnh từ web/thư mục rồi dán vào đây • Hoặc kéo & thả nhiều ảnh cùng lúc
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-auto">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                    >
                      <FolderOpen className="w-4 h-4" />
                      Chọn nhiều ảnh
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        showUrlInput 
                          ? 'bg-amber-100 border-amber-300 text-amber-800' 
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Link URL
                    </button>
                  </div>
                </div>

                {/* Nhập link URL nếu bấm mở */}
                {showUrlInput && (
                  <div className="mt-4 pt-3 border-t border-stone-200/80 flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={e => setUrlInput(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddUrlImage();
                        }
                      }}
                      placeholder="Dán đường dẫn ảnh URL (https://...) rồi bấm Thêm..."
                      className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrlImage}
                      className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Thêm URL
                    </button>
                  </div>
                )}
              </div>

              {/* Lưới hiển thị danh sách hình ảnh đã thêm */}
              {images.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                    <span>
                      Danh sách góc nhìn ({images.length} ảnh) — <em>Ảnh đầu tiên là ảnh bìa đại diện</em>:
                    </span>
                    <span className="text-[11px] text-amber-700">
                      💡 Bấm biểu tượng 👑 để chọn ảnh bìa đại diện
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-80 overflow-y-auto p-1.5 rounded-2xl bg-stone-50 border border-stone-200">
                    {images.map((imgUrl, idx) => {
                      const isPrimary = idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`group relative aspect-square rounded-2xl overflow-hidden bg-white border-2 transition-all flex flex-col justify-between ${
                            isPrimary
                              ? 'border-amber-500 ring-2 ring-amber-400/40 shadow-md'
                              : 'border-stone-200 hover:border-stone-400'
                          }`}
                        >
                          <img
                            src={imgUrl}
                            alt={`Ảnh sản phẩm ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Loi+Anh';
                            }}
                          />

                          {/* Huy hiệu thứ tự & ảnh chính */}
                          <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                            {isPrimary ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-stone-950 font-black text-[10px] uppercase shadow-md">
                                <Crown className="w-3 h-3 text-stone-950 fill-stone-950" />
                                Ảnh chính
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-sm text-white font-bold text-[10px]">
                                #{idx + 1}
                              </span>
                            )}
                          </div>

                          {/* Hover Action Overlay */}
                          <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                            {!isPrimary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(idx)}
                                title="Đặt làm ảnh chính đại diện"
                                className="w-full py-1 px-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                              >
                                <Crown className="w-3 h-3 fill-stone-950" /> Đặt làm ảnh chính
                              </button>
                            )}

                            <div className="flex items-center gap-1 w-full justify-center">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx - 1)}
                                  title="Di chuyển sang trái"
                                  className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 transition-colors cursor-pointer"
                                >
                                  <ArrowLeft className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {idx < images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(idx, idx + 1)}
                                  title="Di chuyển sang phải"
                                  className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 transition-colors cursor-pointer"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                title="Xóa ảnh này"
                                className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-center space-y-1">
                  <p className="text-xs font-semibold text-amber-900">
                    Chưa có hình ảnh nào được thêm
                  </p>
                  <p className="text-[11px] text-amber-700">
                    Vui lòng thêm ít nhất 1 ảnh (khuyến khích 10+ ảnh chi tiết từ nhiều góc độ) để khách hàng có trải nghiệm xem sản phẩm tốt nhất.
                  </p>
                </div>
              )}
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
