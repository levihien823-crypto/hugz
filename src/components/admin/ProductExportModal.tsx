import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileCode, 
  GitBranch, 
  RefreshCw, 
  FileText,
  AlertTriangle
} from 'lucide-react';
import { Product } from '../../types';
import { 
  generateProductsTsCode, 
  downloadFile, 
  saveStoredProducts,
  resetToDefaultProducts 
} from '../../utils/productStorage';

interface ProductExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onProductsReload: (newProducts: Product[]) => void;
  showToast: (msg: string) => void;
}

export const ProductExportModal: React.FC<ProductExportModalProps> = ({
  isOpen,
  onClose,
  products,
  onProductsReload,
  showToast
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'guide' | 'reset'>('export');

  if (!isOpen) return null;

  const tsCode = generateProductsTsCode(products);

  const handleDownloadTs = () => {
    downloadFile('products.ts', tsCode, 'text/typescript;charset=utf-8');
    showToast('Đã tải xuống file products.ts thành công!');
  };

  const handleDownloadJson = () => {
    downloadFile(
      `hugz-products-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(products, null, 2),
      'application/json;charset=utf-8'
    );
    showToast('Đã xuất file sao lưu JSON thành công!');
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(tsCode);
      setCopied(true);
      showToast('Đã sao chép mã nguồn products.ts vào clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Không thể sao chép, vui lòng dùng nút Tải file');
    }
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn khôi phục danh sách sản phẩm về mặc định ban đầu không?')) {
      const defaultList = resetToDefaultProducts();
      onProductsReload(defaultList);
      showToast('Đã khôi phục danh sách sản phẩm về mặc định!');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 bg-stone-50 border-b border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  Xuất Dữ Liệu & Đồng Bộ Git
                </h3>
                <p className="text-xs text-stone-500">
                  Đẩy sản phẩm mới lên repository cho cả nhóm cùng dùng
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

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-100 px-6 bg-stone-50/50">
            <button
              onClick={() => setActiveTab('export')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeTab === 'export'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Xuất File products.ts
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" /> Hướng dẫn đẩy lên Git
            </button>
            <button
              onClick={() => setActiveTab('reset')}
              className={`py-3 px-4 text-xs font-bold border-b-2 transition-all text-red-500 ${
                activeTab === 'reset'
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent hover:text-red-700'
              }`}
            >
              Khôi phục gốc
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {activeTab === 'export' && (
              <div className="space-y-5">
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-1">
                  <p className="font-semibold">💡 Hiện tại có tổng cộng {products.length} sản phẩm.</p>
                  <p>
                    Bạn có thể tải file <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">products.ts</code> về máy và copy đè vào thư mục <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">src/data/products.ts</code> để cập nhật vĩnh viễn vào dự án.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleDownloadTs}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm shadow-md transition-all"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    Tải File products.ts
                  </button>

                  <button
                    onClick={handleCopyCode}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" /> Đã sao chép!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" /> Sao chép mã code
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownloadJson}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 font-medium text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Tải file sao lưu định dạng JSON (.json)
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-4">
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-3">
                  <p className="font-bold text-stone-900 text-sm">
                    Quy trình 3 bước để bạn trong nhóm đẩy code sản phẩm lên GitHub:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                      <p>
                        Bấm nút <strong>Tải File products.ts</strong> ở tab bên cạnh.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                      <p>
                        Chép đè file vừa tải vào đúng đường dẫn: <br />
                        <code className="text-amber-800 font-mono font-bold bg-stone-100 px-1 py-0.5 rounded">src/data/products.ts</code>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                      <div>
                        <p className="mb-1">Mở Terminal và gõ các lệnh sau để đẩy lên nhánh <strong>develop</strong>:</p>
                        <pre className="bg-stone-900 text-amber-300 p-2.5 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`git add src/data/products.ts
git commit -m "feat: cap nhat danh sach san pham moi"
git push origin develop`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reset' && (
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-800 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-red-900 text-sm mb-1">Cảnh báo khôi phục mặc định</h5>
                    <p>
                      Hành động này sẽ xóa các sản phẩm bạn tự thêm/sửa trong trình duyệt và đặt lại danh sách 16 sản phẩm nguyên bản của HUGZ.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-md shadow-red-600/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Xác nhận khôi phục mặc định
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
