import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavTab, Product, CartItem, PlacedOrder } from './types';
import { PRODUCTS } from './data/products';
import { Header, Footer, MobileBottomNav, FloatingSocialWidget } from './components/layout';
import { ProductDetailModal, CartDrawer, CheckoutModal, OrderTrackingModal, SearchModal, LoginModal } from './components/modals';
import { Toast, BrandIntroMotion, LiveOrderTicker } from './components/common';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { CollectionsView } from './views/CollectionsView';
import { AboutView } from './views/AboutView';
import { ChannelsView } from './views/ChannelsView';
import { ContactView } from './views/ContactView';
import { AdminView } from './views/AdminView';
import { getStoredProducts, saveStoredProducts, isAdminAuthenticated } from './utils/productStorage';
import { trackViewItem, trackAddToCart } from './utils/analytics';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('trang-chu');
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAdminAuthenticated());
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    // Luôn cuộn lên đầu trang tức thì khi chuyển tab
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentTab]);

  useEffect(() => {
    const handleAuthSync = () => {
      setIsLoggedIn(isAdminAuthenticated());
    };
    window.addEventListener('hugz-auth-changed', handleAuthSync);

    // Lắng nghe sự kiện hash URL (#admin)
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        if (isAdminAuthenticated()) {
          setCurrentTab('quan-tri');
        } else {
          setLoginModalOpen(true);
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    const handleStorageSync = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('hugz-products-updated', handleStorageSync);
    window.addEventListener('storage', handleStorageSync);
    return () => {
      window.removeEventListener('hugz-auth-changed', handleAuthSync);
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('hugz-products-updated', handleStorageSync);
      window.removeEventListener('storage', handleStorageSync);
    };
  }, []);

  const handleOpenLogin = () => {
    if (isAdminAuthenticated()) {
      setCurrentTab('quan-tri');
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleUpdateProducts = (newProducts: Product[]) => {
    saveStoredProducts(newProducts);
    setProducts(newProducts);
  };
  
  // Cart state with localStorage support
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hugz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderTrackingOpen, setOrderTrackingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCopiedVoucher, setHasCopiedVoucher] = useState(false);

  const [checkoutData, setCheckoutData] = useState<{
    subtotal: number;
    discountAmount: number;
    couponCode: string;
    shippingFee: number;
    grandTotal: number;
    checkoutItems?: CartItem[];
  }>({
    subtotal: 0,
    discountAmount: 0,
    couponCode: '',
    shippingFee: 0,
    grandTotal: 0,
  });

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    trackViewItem(product);
  };

  const handleProceedToCheckoutFromCart = (data: {
    subtotal: number;
    discountAmount: number;
    couponCode: string;
    shippingFee: number;
    grandTotal: number;
  }) => {
    setCheckoutData({
      ...data,
      checkoutItems: cartItems,
    });
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleBuyNowDirect = (product: Product, quantity = 1, variant?: string) => {
    const chosenVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : 'Mặc định');
    const directItem: CartItem = { product, quantity, variant: chosenVariant };
    
    // Add to cart if not present
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === chosenVariant
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [...prev, directItem];
    });

    const subtotal = product.price * quantity;
    const shippingFee = subtotal > 300000 ? 0 : 20000;
    const grandTotal = subtotal + shippingFee;

    setCheckoutData({
      subtotal,
      discountAmount: 0,
      couponCode: '',
      shippingFee,
      grandTotal,
      checkoutItems: [directItem],
    });

    setSelectedProduct(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: PlacedOrder) => {
    setCartItems([]);
    showToast(`Đã tiếp nhận đơn hàng #${order.orderId}! HUGZ sẽ gửi tin nhắn xác nhận qua SMS hoặc qua Zalo sớm nhất cho bạn.`);
  };

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem('hugz_cart', JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  const handleCopyVoucher = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setHasCopiedVoucher(true);
    showToast(`Đã sao chép mã ưu đãi: ${code}! Dán tại giỏ hàng để nhận giảm 20%`);
    setTimeout(() => setHasCopiedVoucher(false), 4000);
  };

  const handleAddToCart = (product: Product, quantity = 1, variant?: string) => {
    const chosenVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : 'Mặc định');
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.variant === chosenVariant
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, variant: chosenVariant }];
      }
    });
    trackAddToCart(product, quantity, chosenVariant);
    showToast(`Đã thêm "${product.title}" vào giỏ hàng!`);
  };

  const handleUpdateCartQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, variant);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string, variant: string) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.variant === variant))
    );
    showToast('Đã xóa món đồ khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckoutSuccess = () => {
    showToast('Đơn hàng của bạn đã được tiếp nhận thành công! HUGZ sẽ liên hệ bạn sớm.');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f2] text-[#201b12] pb-16 lg:pb-0 overflow-x-hidden">
      {/* Top Bar & Main Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onCopyVoucher={handleCopyVoucher}
        hasCopiedVoucher={hasCopiedVoucher}
        onOpenOrderTracking={() => setOrderTrackingOpen(true)}
        isLoggedIn={isLoggedIn}
        onOpenLogin={handleOpenLogin}
      />

      {/* Main Content Body with Smooth View Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key={currentTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex-1 w-full"
        >
          {currentTab === 'trang-chu' && (
            <HomeView
              products={products}
              onOpenDetail={handleOpenDetail}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onBuyNowDirect={handleBuyNowDirect}
              onSelectTab={setCurrentTab}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onCopyVoucher={handleCopyVoucher}
            />
          )}

          {currentTab === 'san-pham' && (
            <ProductsView
              products={products}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onOpenDetail={handleOpenDetail}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onBuyNowDirect={handleBuyNowDirect}
            />
          )}

          {currentTab === 'bo-suu-tap' && (
            <CollectionsView
              products={products}
              onOpenDetail={handleOpenDetail}
              onAddToCart={(p) => handleAddToCart(p, 1)}
            />
          )}

          {currentTab === 've-chung-toi' && (
            <AboutView onSelectTab={setCurrentTab} />
          )}

          {currentTab === 'kenh-mua-hang' && (
            <ChannelsView
              onCopyVoucher={handleCopyVoucher}
              hasCopiedVoucher={hasCopiedVoucher}
            />
          )}

          {currentTab === 'lien-he' && (
            <ContactView onShowToast={showToast} />
          )}

          {currentTab === 'quan-tri' && (
            <AdminView
              products={products}
              onUpdateProducts={handleUpdateProducts}
              onNavigateTab={setCurrentTab}
              showToast={showToast}
            />
          )}
        </motion.main>
      </AnimatePresence>

      {/* Footer (Ẩn khi ở trang quản trị để tập trung vào bảng điều khiển) */}
      {currentTab !== 'quan-tri' && (
        <Footer 
          onSelectTab={setCurrentTab} 
          onShowToast={showToast} 
          onOpenOrderTracking={() => setOrderTrackingOpen(true)}
          isLoggedIn={isLoggedIn}
          onOpenLogin={handleOpenLogin}
        />
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={(p) => handleOpenDetail(p)}
        onAddToCart={(p, qty, variant) => handleAddToCart(p, qty, variant)}
        onBuyNowDirect={handleBuyNowDirect}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* Direct Website Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={checkoutData.checkoutItems && checkoutData.checkoutItems.length > 0 ? checkoutData.checkoutItems : cartItems}
        subtotal={checkoutData.subtotal}
        discountAmount={checkoutData.discountAmount}
        couponCode={checkoutData.couponCode}
        shippingFee={checkoutData.shippingFee}
        grandTotal={checkoutData.grandTotal}
        onOrderSuccess={handleOrderSuccess}
        onViewOrdersHistory={() => {
          setCheckoutOpen(false);
          setOrderTrackingOpen(true);
        }}
      />

      {/* Order Tracking / History Modal */}
      <OrderTrackingModal
        isOpen={orderTrackingOpen}
        onClose={() => setOrderTrackingOpen(false)}
        onContinueShopping={() => setCurrentTab('san-pham')}
      />

      {/* Account Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setLoginModalOpen(false);
          setCurrentTab('quan-tri');
          showToast('Đăng nhập thành công! Chào mừng Levihien823@gmail.com');
        }}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          handleOpenDetail(p);
        }}
      />

      {/* Floating Social Media & Messenger Widget */}
      <FloatingSocialWidget />

      {/* Live Order & Activity Notification Ticker */}
      <LiveOrderTicker />

      {/* Brand Opening Entrance Motion */}
      <BrandIntroMotion />

      {/* Mobile Fixed Bottom Navigation Bar (Ẩn khi ở trang quản trị) */}
      {currentTab !== 'quan-tri' && (
        <MobileBottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          cartCount={totalCartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenOrderTracking={() => setOrderTrackingOpen(true)}
        />
      )}

      {/* Floating Feedback Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
