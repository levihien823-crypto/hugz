import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Copy, 
  ExternalLink, 
  LogOut, 
  Home, 
  Sparkles, 
  Package, 
  DollarSign, 
  Star, 
  Filter, 
  Lock, 
  ArrowRight, 
  FileCode,
  Tag,
  Mail,
  Eye,
  EyeOff,
  User
} from 'lucide-react';
import { Product, NavTab } from '../types';
import { CATEGORIES } from '../data/products';
import { 
  isAdminAuthenticated, 
  authenticateAdmin, 
  logoutAdmin, 
  ADMIN_CREDENTIALS 
} from '../utils/productStorage';
import { ProductFormModal } from '../components/admin/ProductFormModal';
import { ProductExportModal } from '../components/admin/ProductExportModal';

interface AdminViewProps {
  products: Product[];
  onUpdateProducts: (newProducts: Product[]) => void;
  onNavigateTab: (tab: NavTab) => void;
  showToast: (msg: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  onUpdateProducts,
  onNavigateTab,
  showToast
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isAdminAuthenticated());
  const [inputEmail, setInputEmail] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(inputEmail, inputPassword)) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Đăng nhập thành công!');
    } else {
      setLoginError('Tài khoản email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setInputEmail('');
    setInputPassword('');
    showToast('Đã đăng xuất khỏi tài khoản');
  };

  // CRUD Actions
  const handleSaveProduct = (product: Product) => {
    const exists = products.some(p => p.id === product.id);
    let updatedList: Product[];

    if (exists) {
      updatedList = products.map(p => p.id === product.id ? product : p);
      showToast(`Đã cập nhật sản phẩm "${product.title}"`);
    } else {
      updatedList = [product, ...products];
      showToast(`Đã thêm mới sản phẩm "${product.title}"`);
    }

    onUpdateProducts(updatedList);
  };

  const handleDeleteProduct = (product: Product) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.title}" không?`)) {
      const updatedList = products.filter(p => p.id !== product.id);
      onUpdateProducts(updatedList);
      showToast(`Đã xóa sản phẩm "${product.title}"`);
    }
  };

  const handleDuplicateProduct = (product: Product) => {
    const newProduct: Product = {
      ...product,
      id: `${product.id}-copy-${Date.now().toString().slice(-4)}`,
      title: `${product.title} (Bản sao)`,
      soldCount: '0 đã bán',
      isNew: true,
    };
    const updatedList = [newProduct, ...products];
    onUpdateProducts(updatedList);
    showToast(`Đã nhân bản sản phẩm "${product.title}"`);
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Statistics
  const stats = useMemo(() => {
    const total = products.length;
    const bestSellers = products.filter(p => p.isBestSeller).length;
    const newItems = products.filter(p => p.isNew).length;
    const categoryCount = new Set(products.map(p => p.category)).size;
    return { total, bestSellers, newItems, categoryCount };
  }, [products]);

  // Màn hình Đăng nhập nếu chưa xác thực
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-stone-100 text-center"
        >
          <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Đăng Nhập Hệ Thống
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Dành cho nhóm phát triển để quản lý sản phẩm và đồng bộ mã nguồn lên Git.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tài khoản Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={e => setInputEmail(e.target.value)}
                  placeholder="Levihien823@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="text-left">
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={inputPassword}
                  onChange={e => setInputPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-10 pr-11 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-left">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-lg shadow-amber-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              Đăng Nhập
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('trang-chu')}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Quay lại cửa hàng HUGZ
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Giao diện Quản trị khi đã Đăng nhập
  return (
    <div className="min-h-screen bg-stone-50/60 pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Navbar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-stone-900">
                  Hệ Thống Quản Trị Sản Phẩm
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Đã kết nối LocalStorage
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Tài khoản: <strong className="text-stone-700">{ADMIN_CREDENTIALS.email}</strong> • Thêm, chỉnh sửa sản phẩm và xuất file <strong>products.ts</strong> để đẩy lên Git.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('trang-chu')}
              className="px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Xem Cửa Hàng
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Tổng sản phẩm
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.total}</span>
              <span className="text-xs text-stone-400">mục</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Bán chạy (Best Seller)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-amber-600">{stats.bestSellers}</span>
              <span className="text-xs text-stone-400">mục</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Sản phẩm mới (New)
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-blue-600">{stats.newItems}</span>
              <span className="text-xs text-stone-400">mục</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-stone-100 shadow-sm">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
              Danh mục
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900">{stats.categoryCount}</span>
              <span className="text-xs text-stone-400">nhóm</span>
            </div>
          </div>
        </div>

        {/* Controls & Search Toolbar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên sản phẩm hoặc mã ID..."
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs"
              />
            </div>

            {/* Category Select */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
              >
                <option value="all">Tất cả danh mục ({products.length})</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExportOpen(true)}
              className="px-4 py-2.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <FileCode className="w-4 h-4" />
              Xuất File products.ts (Git)
            </button>

            <button
              onClick={() => {
                setProductToEdit(null);
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Thêm Sản Phẩm Mới
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Sản phẩm</th>
                  <th className="py-4 px-4">Danh mục</th>
                  <th className="py-4 px-4">Giá bán / Giá gốc</th>
                  <th className="py-4 px-4">Đánh giá & Bán</th>
                  <th className="py-4 px-4">Nhãn (Badge)</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      Không tìm thấy sản phẩm nào khớp với từ khóa hoặc bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-amber-50/20 transition-colors">
                      {/* Sản phẩm */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=HUGZ';
                            }}
                          />
                          <div className="min-w-0 max-w-xs">
                            <p className="font-bold text-stone-900 truncate" title={product.title}>
                              {product.title}
                            </p>
                            <p className="text-[10px] text-stone-400 font-mono truncate">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Danh mục */}
                      <td className="py-4 px-4 text-stone-700 font-medium">
                        {product.category}
                      </td>

                      {/* Giá */}
                      <td className="py-4 px-4">
                        <p className="font-bold text-amber-600">
                          {product.price.toLocaleString('vi-VN')}₫
                        </p>
                        {product.originalPrice > product.price && (
                          <p className="text-[11px] text-stone-400 line-through">
                            {product.originalPrice.toLocaleString('vi-VN')}₫
                          </p>
                        )}
                      </td>

                      {/* Đánh giá & Lượt bán */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1 text-amber-500 font-bold mb-0.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{product.rating}</span>
                          <span className="text-stone-400 text-[10px]">({product.reviewsCount})</span>
                        </div>
                        <p className="text-[11px] text-stone-500">{product.soldCount}</p>
                      </td>

                      {/* Badges */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {product.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {product.badge}
                            </span>
                          )}
                          {product.isBestSeller && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                              Bán chạy
                            </span>
                          )}
                          {product.isNew && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                              Mới
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Thao tác */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Sửa */}
                          <button
                            onClick={() => {
                              setProductToEdit(product);
                              setIsFormOpen(true);
                            }}
                            title="Chỉnh sửa sản phẩm"
                            className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Nhân bản */}
                          <button
                            onClick={() => handleDuplicateProduct(product)}
                            title="Tạo bản sao"
                            className="p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Xóa */}
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            title="Xóa sản phẩm"
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form Thêm/Sửa */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Modal Xuất file Git */}
      <ProductExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        products={products}
        onProductsReload={onUpdateProducts}
        showToast={showToast}
      />
    </div>
  );
};
