import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  User,
  ClipboardList,
  Ticket,
  Layers,
  BarChart3,
  TrendingUp,
  Megaphone,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Percent,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { Product, NavTab, PlacedOrder, Coupon, CategoryInfo, AdminTab } from '../types';
import { CATEGORIES } from '../data/products';
import { 
  isAdminAuthenticated, 
  authenticateAdmin, 
  logoutAdmin, 
  ADMIN_CREDENTIALS,
  getStoredOrders,
  saveStoredOrders,
  updateStoredOrderStatus,
  deleteStoredOrder,
  getStoredCoupons,
  saveStoredCoupons,
  getStoredCategories,
  saveStoredCategories,
  getStoredAnnouncement,
  saveStoredAnnouncement,
  SAMPLE_ORDERS
} from '../utils/productStorage';
import { fetchOrdersFromGoogleSheet } from '../utils/orderService';
import { 
  ProductFormModal, 
  ProductExportModal, 
  OrderDetailsModal, 
  CouponFormModal, 
  CategoryFormModal 
} from '../components/admin';

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

  // Active Admin Sub-Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('products');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  // Search & Filter state for Products
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Orders State
  const [orders, setOrders] = useState<PlacedOrder[]>(() => getStoredOrders());
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isSyncingSheet, setIsSyncingSheet] = useState(false);

  // Coupons State
  const [coupons, setCoupons] = useState<Coupon[]>(() => getStoredCoupons());
  const [couponToEdit, setCouponToEdit] = useState<Coupon | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Categories & Announcement State
  const [categories, setCategories] = useState<CategoryInfo[]>(() => getStoredCategories());
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryInfo | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [announcementText, setAnnouncementText] = useState(() => getStoredAnnouncement());

  // Đồng bộ Auth
  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(isAdminAuthenticated());
    };
    window.addEventListener('hugz-auth-changed', syncAuth);
    return () => window.removeEventListener('hugz-auth-changed', syncAuth);
  }, []);

  // Đồng bộ Orders & Coupons từ các tab khác
  useEffect(() => {
    const syncOrders = () => setOrders(getStoredOrders());
    const syncCoupons = () => setCoupons(getStoredCoupons());
    const syncCategories = () => setCategories(getStoredCategories());
    const syncAnnouncement = () => setAnnouncementText(getStoredAnnouncement());

    window.addEventListener('hugz-orders-updated', syncOrders);
    window.addEventListener('hugz-coupons-updated', syncCoupons);
    window.addEventListener('hugz-categories-updated', syncCategories);
    window.addEventListener('hugz-announcement-updated', syncAnnouncement);
    window.addEventListener('storage', syncOrders);

    return () => {
      window.removeEventListener('hugz-orders-updated', syncOrders);
      window.removeEventListener('hugz-coupons-updated', syncCoupons);
      window.removeEventListener('hugz-categories-updated', syncCategories);
      window.removeEventListener('hugz-announcement-updated', syncAnnouncement);
      window.removeEventListener('storage', syncOrders);
    };
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticateAdmin(inputEmail, inputPassword)) {
      setIsAuthenticated(true);
      setLoginError('');
      showToast('Đăng nhập quản trị thành công!');
    } else {
      setLoginError('Tài khoản email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!');
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
    setInputEmail('');
    setInputPassword('');
    if (window.location.hash.includes('admin') || window.location.pathname.includes('/admin')) {
      window.history.pushState(null, '', '/');
    }
    onNavigateTab('trang-chu');
    showToast('Đã đăng xuất khỏi tài khoản quản trị');
  };

  const handleReturnToShop = () => {
    if (window.location.hash.includes('admin') || window.location.pathname.includes('/admin')) {
      window.history.pushState(null, '', '/');
    }
    onNavigateTab('trang-chu');
  };

  // ==========================================
  // Product CRUD
  // ==========================================
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

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const productStats = useMemo(() => {
    const total = products.length;
    const bestSellers = products.filter(p => p.isBestSeller).length;
    const newItems = products.filter(p => p.isNew).length;
    const categoryCount = new Set(products.map(p => p.category)).size;
    return { total, bestSellers, newItems, categoryCount };
  }, [products]);

  // ==========================================
  // Orders Handling
  // ==========================================
  const handleOrderStatusChange = (orderId: string, newStatus: PlacedOrder['status']) => {
    updateStoredOrderStatus(orderId, newStatus);
    setOrders(getStoredOrders());
    showToast(`Đã cập nhật trạng thái đơn #${orderId}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa lịch sử đơn hàng #${orderId} khỏi danh sách?`)) {
      deleteStoredOrder(orderId);
      setOrders(getStoredOrders());
      showToast(`Đã xóa đơn hàng #${orderId}`);
    }
  };

  const handleSyncFromGoogleSheet = async () => {
    setIsSyncingSheet(true);
    try {
      const res = await fetchOrdersFromGoogleSheet();
      if (res.success && res.orders && res.orders.length > 0) {
        const existingIds = new Set(orders.map(o => o.orderId.toUpperCase()));
        const newOrders = res.orders.filter(o => !existingIds.has(o.orderId.toUpperCase()));
        const merged = [...newOrders, ...orders];
        saveStoredOrders(merged);
        setOrders(merged);
        showToast(`Đồng bộ thành công! Đã thêm ${newOrders.length} đơn hàng mới từ Google Sheets.`);
      } else {
        showToast(res.message);
      }
    } catch (e: any) {
      showToast('Lỗi khi đồng bộ: ' + (e?.message || 'Không thể kết nối'));
    } finally {
      setIsSyncingSheet(false);
    }
  };

  const handleLoadSampleOrders = () => {
    if (window.confirm('Bạn có muốn nạp thêm các đơn hàng mẫu vào danh sách để kiểm tra tính toán doanh số và báo cáo?')) {
      const existingIds = new Set(orders.map(o => o.orderId.toUpperCase()));
      const toAdd = SAMPLE_ORDERS.filter(o => !existingIds.has(o.orderId.toUpperCase()));
      const merged = [...orders, ...toAdd];
      saveStoredOrders(merged);
      setOrders(merged);
      showToast(`Đã nạp thêm ${toAdd.length} đơn hàng mẫu vào hệ thống!`);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = 
        o.orderId.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        o.customer.fullName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        o.customer.phone.toLowerCase().includes(orderSearchTerm.toLowerCase());
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchTerm, orderStatusFilter]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'pending_confirmation').length;
  }, [orders]);

  // ==========================================
  // Coupons Handling
  // ==========================================
  const handleSaveCoupon = (coupon: Coupon) => {
    const exists = coupons.some(c => c.id === coupon.id || c.code === coupon.code);
    let updated: Coupon[];
    if (exists) {
      updated = coupons.map(c => (c.id === coupon.id || c.code === coupon.code) ? coupon : c);
      showToast(`Đã cập nhật voucher "${coupon.code}"`);
    } else {
      updated = [coupon, ...coupons];
      showToast(`Đã tạo mã giảm giá "${coupon.code}"`);
    }
    saveStoredCoupons(updated);
    setCoupons(updated);
  };

  const handleToggleCoupon = (couponId: string) => {
    const updated = coupons.map(c => c.id === couponId ? { ...c, isActive: !c.isActive } : c);
    saveStoredCoupons(updated);
    setCoupons(updated);
    showToast('Đã đổi trạng thái voucher');
  };

  const handleDeleteCoupon = (couponId: string, code: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa mã giảm giá "${code}" không?`)) {
      const updated = coupons.filter(c => c.id !== couponId);
      saveStoredCoupons(updated);
      setCoupons(updated);
      showToast(`Đã xóa mã voucher "${code}"`);
    }
  };

  // ==========================================
  // Categories & Announcement Handling
  // ==========================================
  const handleSaveCategory = (cat: CategoryInfo) => {
    const exists = categories.some(c => c.id === cat.id);
    let updated: CategoryInfo[];
    if (exists) {
      updated = categories.map(c => c.id === cat.id ? cat : c);
      showToast(`Đã cập nhật danh mục "${cat.name}"`);
    } else {
      updated = [...categories, cat];
      showToast(`Đã thêm danh mục "${cat.name}"`);
    }
    saveStoredCategories(updated);
    setCategories(updated);
  };

  const handleDeleteCategory = (catId: string, name: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${name}" không?`)) {
      const updated = categories.filter(c => c.id !== catId);
      saveStoredCategories(updated);
      setCategories(updated);
      showToast(`Đã xóa danh mục "${name}"`);
    }
  };

  const handleSaveAnnouncement = () => {
    saveStoredAnnouncement(announcementText.trim());
    showToast('Đã cập nhật khẩu hiệu Top Bar thành công!');
  };

  // ==========================================
  // Analytics Calculations
  // ==========================================
  const analyticsData = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'cancelled');
    const totalRevenue = validOrders.reduce((sum, o) => sum + o.grandTotal, 0);
    const totalOrdersCount = orders.length;
    const completedOrdersCount = orders.filter(o => o.status === 'completed').length;
    const shippingOrdersCount = orders.filter(o => o.status === 'shipping').length;
    const cancelledOrdersCount = orders.filter(o => o.status === 'cancelled').length;
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    let totalSoldItems = 0;
    const productSalesMap: Record<string, { title: string; image: string; count: number; revenue: number }> = {};

    validOrders.forEach(o => {
      o.items.forEach(it => {
        totalSoldItems += it.quantity;
        const key = it.product.title;
        if (!productSalesMap[key]) {
          productSalesMap[key] = {
            title: it.product.title,
            image: it.product.image,
            count: 0,
            revenue: 0
          };
        }
        productSalesMap[key].count += it.quantity;
        productSalesMap[key].revenue += it.product.price * it.quantity;
      });
    });

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // COD vs Banking
    const codOrders = orders.filter(o => o.customer.paymentMethod === 'cod').length;
    const bankingOrders = orders.filter(o => o.customer.paymentMethod === 'banking').length;

    return {
      totalRevenue,
      totalOrdersCount,
      completedOrdersCount,
      shippingOrdersCount,
      cancelledOrdersCount,
      averageOrderValue,
      totalSoldItems,
      topProducts,
      codOrders,
      bankingOrders
    };
  }, [orders]);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + '₫';
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  // ==========================================
  // Render: Login Screen (Nếu chưa đăng nhập)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-stone-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl border border-stone-100 text-center"
        >
          <div className="w-16 h-16 bg-amber-500/10 text-amber-600 rounded-3xl mx-auto flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-stone-900 mb-2">
            Đăng Nhập Quản Trị HUGZ
          </h2>
          <p className="text-xs text-stone-500 mb-6">
            Hệ thống quản lý sản phẩm, đơn hàng, voucher và doanh thu cửa hàng.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="Nhập email quản trị..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm"
                />
              </div>
            </div>

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
              onClick={handleReturnToShop}
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

  // ==========================================
  // Render: Admin Dashboard (Đã Đăng Nhập)
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-50/70 pb-24 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold shadow-inner">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                  HUGZ Admin Control Center
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Online
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Quản lý Sản phẩm • Đơn hàng • Voucher • Danh mục • Thống kê doanh thu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleReturnToShop}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Xem Cửa Hàng
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* Navigation Tabs (5 Tabs chính) */}
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-stone-200/80 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Sản Phẩm ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Đơn Hàng ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-pulse">
                {pendingOrdersCount} mới
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Mã Giảm Giá / Voucher ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Danh Mục & Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Thống Kê Doanh Thu</span>
          </button>
        </div>

        {/* ==========================================
            TAB 1: QUẢN LÝ SẢN PHẨM
        ========================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Tổng sản phẩm
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">{productStats.total}</span>
                  <span className="text-xs text-stone-400">mục</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Bán chạy (Best Seller)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-600">{productStats.bestSellers}</span>
                  <span className="text-xs text-stone-400">mục</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Mới ra mắt (New)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-600">{productStats.newItems}</span>
                  <span className="text-xs text-stone-400">mục</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Danh mục
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-stone-900">{productStats.categoryCount}</span>
                  <span className="text-xs text-stone-400">nhóm</span>
                </div>
              </div>
            </div>

            {/* Toolbar: Tìm kiếm, lọc và nút thêm */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
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

                <div className="w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                  >
                    <option value="all">Tất cả danh mục ({products.length})</option>
                    {categories.map(cat => (
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
                  className="px-4 py-2.5 rounded-2xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Xuất mã nguồn products.ts để commit lên Git"
                >
                  <FileCode className="w-4 h-4" />
                  <span>Xuất File Git</span>
                </button>

                <button
                  onClick={() => {
                    setProductToEdit(null);
                    setIsFormOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sản Phẩm Mới</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50/80 text-stone-500 border-b border-stone-200/80 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Sản phẩm</th>
                      <th className="px-6 py-4 font-bold">Danh mục</th>
                      <th className="px-6 py-4 font-bold">Giá bán</th>
                      <th className="px-6 py-4 font-bold">Đặc điểm / Badge</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                          <Package className="w-8 h-8 mx-auto mb-2 stroke-1" />
                          Không tìm thấy sản phẩm nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => (
                        <tr key={product.id} className="hover:bg-amber-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                                onError={e => {
                                  (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=HUGZ';
                                }}
                              />
                              <div className="min-w-0 max-w-xs sm:max-w-sm">
                                <p className="font-bold text-stone-900 truncate">
                                  {product.title}
                                </p>
                                <p className="text-[11px] text-stone-400 truncate font-mono">
                                  ID: {product.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-stone-600 font-medium">
                            <span className="px-2.5 py-1 bg-stone-100 rounded-lg text-stone-700">
                              {product.category}
                            </span>
                          </td>

                          <td className="px-6 py-4 font-bold text-stone-900">
                            <div>{formatPrice(product.price)}</div>
                            {product.originalPrice > product.price && (
                              <div className="text-[10px] text-stone-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {product.badge && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  {product.badge}
                                </span>
                              )}
                              {product.isBestSeller && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  Hot
                                </span>
                              )}
                              {product.isNew && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setProductToEdit(product);
                                  setIsFormOpen(true);
                                }}
                                className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                                title="Chỉnh sửa sản phẩm"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDuplicateProduct(product)}
                                className="p-2 rounded-xl hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors"
                                title="Nhân bản sản phẩm"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product)}
                                className="p-2 rounded-xl hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                                title="Xóa sản phẩm"
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
        )}

        {/* ==========================================
            TAB 2: QUẢN LÝ ĐƠN HÀNG
        ========================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Google Sheets Audit & Real-time Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 border border-emerald-200/90 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-stone-900 text-sm">
                        Tra soát đơn hàng (Google Sheets & Bộ nhớ trình duyệt)
                      </h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Đang kết nối Google Sheets
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed max-w-3xl">
                      Bảng bên dưới đang hiển thị <strong>{orders.length} đơn hàng</strong> lưu trong bộ nhớ trình duyệt này.
                      Tất cả các đơn thực tế do khách hàng đặt từ các máy tính/điện thoại khác đều được <strong>tự động chuyển ngay vào Google Sheets</strong> của bạn theo thời gian thực để không bao giờ thất lạc!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                  <button
                    onClick={handleSyncFromGoogleSheet}
                    disabled={isSyncingSheet}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-stone-700 hover:text-emerald-800 rounded-2xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    title="Đồng bộ danh sách từ Google Sheets về trình duyệt này"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSheet ? 'animate-spin text-emerald-600' : ''}`} />
                    {isSyncingSheet ? 'Đang đồng bộ...' : 'Đồng bộ từ Google Sheets'}
                  </button>

                  <a
                    href="https://docs.google.com/spreadsheets/u/0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Mở Google Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  {orders.length < 5 && (
                    <button
                      onClick={handleLoadSampleOrders}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl text-xs font-medium transition-colors cursor-pointer"
                      title="Nạp thêm đơn hàng mẫu để kiểm tra giao diện thống kê"
                    >
                      + Nạp đơn mẫu
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Orders KPI Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Tổng đơn hàng
                </span>
                <span className="text-3xl font-extrabold text-stone-900">{orders.length}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-200/80 shadow-sm bg-amber-50/20">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block mb-1">
                  Chờ xác nhận
                </span>
                <span className="text-3xl font-extrabold text-amber-600">{pendingOrdersCount}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-purple-200/80 shadow-sm bg-purple-50/20">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block mb-1">
                  Đang giao hàng
                </span>
                <span className="text-3xl font-extrabold text-purple-600">{analyticsData.shippingOrdersCount}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 shadow-sm bg-emerald-50/20">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block mb-1">
                  Đã hoàn thành
                </span>
                <span className="text-3xl font-extrabold text-emerald-600">{analyticsData.completedOrdersCount}</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-sm">
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  Doanh số đơn
                </span>
                <span className="text-2xl font-extrabold text-amber-700">{formatPrice(analyticsData.totalRevenue)}</span>
              </div>
            </div>

            {/* Filter Toolbar for Orders */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchTerm}
                    onChange={e => setOrderSearchTerm(e.target.value)}
                    placeholder="Tìm theo Mã đơn, Tên khách hoặc SĐT..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs"
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <select
                    value={orderStatusFilter}
                    onChange={e => setOrderStatusFilter(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-2xl border border-stone-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white"
                  >
                    <option value="all">Tất cả trạng thái ({orders.length})</option>
                    <option value="pending_confirmation">🕒 Chờ xác nhận ({pendingOrdersCount})</option>
                    <option value="confirmed">📦 Đã xác nhận</option>
                    <option value="shipping">🚚 Đang giao hàng</option>
                    <option value="completed">✅ Đã hoàn thành</option>
                    <option value="cancelled">❌ Đã hủy</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-stone-500">
                Hiển thị <strong className="text-stone-900">{filteredOrders.length}</strong> đơn hàng
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50/80 text-stone-500 border-b border-stone-200/80 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Mã đơn & Thời gian</th>
                      <th className="px-6 py-4 font-bold">Khách hàng & SĐT</th>
                      <th className="px-6 py-4 font-bold">Sản phẩm</th>
                      <th className="px-6 py-4 font-bold">Tổng thanh toán</th>
                      <th className="px-6 py-4 font-bold">Trạng thái đơn</th>
                      <th className="px-6 py-4 font-bold text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                          <ClipboardList className="w-8 h-8 mx-auto mb-2 stroke-1" />
                          Chưa có đơn hàng nào phù hợp.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => (
                        <tr key={order.orderId} className="hover:bg-stone-50/60 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-extrabold text-amber-700 text-sm">
                              #{order.orderId}
                            </p>
                            <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {formatDate(order.createdAt)}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-stone-900">{order.customer.fullName}</p>
                            <p className="text-[11px] text-stone-500 font-mono mt-0.5">{order.customer.phone}</p>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-0.5 max-w-xs">
                              <p className="font-semibold text-stone-800 truncate">
                                {order.items[0]?.product.title}
                              </p>
                              {order.items.length > 1 && (
                                <p className="text-[11px] text-stone-400">
                                  + {order.items.length - 1} sản phẩm khác
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 font-bold text-stone-900">
                            <div>{formatPrice(order.grandTotal)}</div>
                            <span className="text-[10px] text-stone-400 uppercase font-medium">
                              {order.customer.paymentMethod === 'cod' ? 'COD' : 'CK Ngân Hàng'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={e => handleOrderStatusChange(order.orderId, e.target.value as PlacedOrder['status'])}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                                order.status === 'pending_confirmation' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                                order.status === 'confirmed' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                                order.status === 'shipping' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                                order.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                                'bg-red-50 text-red-800 border-red-300'
                              }`}
                            >
                              <option value="pending_confirmation">🕒 Chờ xác nhận</option>
                              <option value="confirmed">📦 Đã xác nhận</option>
                              <option value="shipping">🚚 Đang giao hàng</option>
                              <option value="completed">✅ Đã hoàn thành</option>
                              <option value="cancelled">❌ Đã hủy</option>
                            </select>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order);
                                  setIsOrderModalOpen(true);
                                }}
                                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                              >
                                Chi tiết
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.orderId)}
                                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                                title="Xóa đơn hàng"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
        )}

        {/* ==========================================
            TAB 3: QUẢN LÝ MÃ GIẢM GIÁ (COUPONS)
        ========================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-600" />
                  Quản Lý Mã Giảm Giá & Voucher Khuyến Mãi
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Tạo và kích hoạt các mã voucher giảm giá cho khách hàng nhập tại giỏ hàng.
                </p>
              </div>

              <button
                onClick={() => {
                  setCouponToEdit(null);
                  setIsCouponModalOpen(true);
                }}
                className="px-5 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/25 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo Mã Giảm Giá Mới</span>
              </button>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map(coupon => (
                <div
                  key={coupon.id}
                  className={`bg-white rounded-3xl p-5 border shadow-sm transition-all relative overflow-hidden flex flex-col justify-between ${
                    coupon.isActive ? 'border-amber-200' : 'border-stone-200 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-base font-extrabold tracking-wider px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200/60">
                        {coupon.code}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        coupon.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {coupon.isActive ? 'Đang kích hoạt' : 'Tạm tắt'}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-stone-900">
                        -{coupon.discountPercent}%
                      </span>
                      {coupon.minOrderAmount ? (
                        <span className="text-xs text-stone-500">
                          (Đơn từ {formatPrice(coupon.minOrderAmount)})
                        </span>
                      ) : (
                        <span className="text-xs text-stone-500">(Mọi đơn hàng)</span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {coupon.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleCoupon(coupon.id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        coupon.isActive 
                          ? 'border-stone-200 text-stone-600 hover:bg-stone-50'
                          : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      }`}
                    >
                      {coupon.isActive ? 'Tạm tắt mã' : 'Bật kích hoạt'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setCouponToEdit(coupon);
                          setIsCouponModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Chỉnh sửa mã"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Xóa mã"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 4: DANH MỤC & BANNER
        ========================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            {/* Announcement Bar Management */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
              <div className="flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-amber-600" />
                <h3 className="text-lg font-bold text-stone-900">
                  Khẩu Hiệu Thông Báo Đầu Trang (Top Announcement Bar)
                </h3>
              </div>
              <p className="text-xs text-stone-500">
                Dòng thông báo này chạy ở đỉnh trang web để thông báo voucher và sự kiện khuyến mãi cho khách hàng.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={announcementText}
                  onChange={e => setAnnouncementText(e.target.value)}
                  placeholder="Ví dụ: Ưu đãi độc quyền: Giảm 20% Shopee & TikTok..."
                  className="flex-1 px-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-xs font-medium"
                />
                <button
                  onClick={handleSaveAnnouncement}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                >
                  Lưu Khẩu Hiệu
                </button>
              </div>
            </div>

            {/* Categories Management */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-amber-600" />
                    Quản Lý Danh Mục Sản Phẩm
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Phân loại các dòng sản phẩm hiển thị trên trang chủ và bộ lọc sản phẩm.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCategoryToEdit(null);
                    setIsCategoryModalOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Danh Mục Mới</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map(cat => {
                  const productCountInCat = products.filter(p => p.category === cat.name).length;
                  return (
                    <div
                      key={cat.id}
                      className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-amber-300 transition-all space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-stone-900">{cat.name}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                          {productCountInCat} sản phẩm
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 font-mono">Slug: {cat.id}</p>
                      {cat.description && (
                        <p className="text-xs text-stone-600 line-clamp-2">{cat.description}</p>
                      )}
                      <div className="pt-2 flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setCategoryToEdit(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-200 transition-colors cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 5: THỐNG KÊ DOANH THU & BÁO CÁO
        ========================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-3xl shadow-lg shadow-amber-600/20 space-y-2">
                <div className="flex items-center justify-between opacity-90 text-xs font-bold uppercase tracking-wider">
                  <span>Tổng Doanh Thu</span>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-3xl font-black">
                  {formatPrice(analyticsData.totalRevenue)}
                </div>
                <p className="text-[11px] opacity-80 pt-1">
                  Tính từ {analyticsData.completedOrdersCount + analyticsData.shippingOrdersCount} đơn hợp lệ
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <span>Tổng Số Đơn Hàng</span>
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-3xl font-black text-stone-900">
                  {analyticsData.totalOrdersCount}
                </div>
                <p className="text-[11px] text-emerald-600 font-semibold pt-1">
                  {analyticsData.completedOrdersCount} đơn đã hoàn tất thành công
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <span>Giá Trị Đơn Trung Bình</span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-black text-stone-900">
                  {formatPrice(analyticsData.averageOrderValue)}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Trung bình mỗi khách mua tại shop
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-stone-200/80 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs font-bold uppercase tracking-wider">
                  <span>Sản Phẩm Đã Bán</span>
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-3xl font-black text-stone-900">
                  {analyticsData.totalSoldItems}
                </div>
                <p className="text-[11px] text-stone-500 pt-1">
                  Tổng số lượng sản phẩm rời kho
                </p>
              </div>
            </div>

            {/* Charts & Breakdown Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phân bổ trạng thái đơn */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-5">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                  Phân Bổ Trạng Thái Đơn Hàng
                </h3>

                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Chờ xác nhận</span>
                      <span>{pendingOrdersCount} đơn ({analyticsData.totalOrdersCount > 0 ? Math.round((pendingOrdersCount / analyticsData.totalOrdersCount) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${analyticsData.totalOrdersCount > 0 ? (pendingOrdersCount / analyticsData.totalOrdersCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Đang giao hàng</span>
                      <span>{analyticsData.shippingOrdersCount} đơn ({analyticsData.totalOrdersCount > 0 ? Math.round((analyticsData.shippingOrdersCount / analyticsData.totalOrdersCount) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${analyticsData.totalOrdersCount > 0 ? (analyticsData.shippingOrdersCount / analyticsData.totalOrdersCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Đã hoàn thành</span>
                      <span>{analyticsData.completedOrdersCount} đơn ({analyticsData.totalOrdersCount > 0 ? Math.round((analyticsData.completedOrdersCount / analyticsData.totalOrdersCount) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${analyticsData.totalOrdersCount > 0 ? (analyticsData.completedOrdersCount / analyticsData.totalOrdersCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                      <span>Đã hủy</span>
                      <span>{analyticsData.cancelledOrdersCount} đơn ({analyticsData.totalOrdersCount > 0 ? Math.round((analyticsData.cancelledOrdersCount / analyticsData.totalOrdersCount) * 100) : 0}%)</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full bg-red-400 rounded-full transition-all"
                        style={{ width: `${analyticsData.totalOrdersCount > 0 ? (analyticsData.cancelledOrdersCount / analyticsData.totalOrdersCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-stone-50">
                    <span className="text-[11px] text-stone-500 block">Thanh toán COD</span>
                    <span className="text-lg font-bold text-stone-800">{analyticsData.codOrders} đơn</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-stone-50">
                    <span className="text-[11px] text-stone-500 block">Chuyển khoản Banking</span>
                    <span className="text-lg font-bold text-stone-800">{analyticsData.bankingOrders} đơn</span>
                  </div>
                </div>
              </div>

              {/* Top sản phẩm bán chạy nhất */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/80 space-y-4">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Top Sản Phẩm Bán Chạy Nhất
                </h3>

                <div className="space-y-3">
                  {analyticsData.topProducts.length === 0 ? (
                    <p className="text-xs text-stone-400 text-center py-8">Chưa có dữ liệu bán hàng.</p>
                  ) : (
                    analyticsData.topProducts.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl border border-stone-100 bg-stone-50/50">
                        <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-700 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <img
                          src={p.image}
                          alt={p.title}
                          className="w-11 h-11 object-cover rounded-xl border border-stone-200 flex-shrink-0"
                          onError={e => {
                            (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=HUGZ';
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-stone-900 truncate">{p.title}</p>
                          <p className="text-[11px] text-stone-500">Đã bán: <strong className="text-stone-800">{p.count} cái</strong></p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-700">{formatPrice(p.revenue)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ==========================================
          MODALS
      ========================================== */}
      {/* Product Form Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />

      {/* Product Git Export Modal */}
      <ProductExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        products={products}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        order={selectedOrder}
        onStatusChange={handleOrderStatusChange}
      />

      {/* Coupon Form Modal */}
      <CouponFormModal
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        onSave={handleSaveCoupon}
        couponToEdit={couponToEdit}
      />

      {/* Category Form Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        categoryToEdit={categoryToEdit}
      />
    </div>
  );
};
