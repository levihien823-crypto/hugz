import React, { useState, useEffect } from 'react';
import { NavTab, Product, CartItem } from './types';
import { PRODUCTS } from './data/products';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { Toast } from './components/Toast';
import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { CollectionsView } from './views/CollectionsView';
import { AboutView } from './views/AboutView';
import { ChannelsView } from './views/ChannelsView';
import { ContactView } from './views/ContactView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('trang-chu');
  const [products] = useState<Product[]>(PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hasCopiedVoucher, setHasCopiedVoucher] = useState(false);

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
    <div className="min-h-screen flex flex-col bg-[#fff8f2] text-[#201b12]">
      {/* Top Bar & Main Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
        onCopyVoucher={handleCopyVoucher}
        hasCopiedVoucher={hasCopiedVoucher}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        {currentTab === 'trang-chu' && (
          <HomeView
            products={products}
            onOpenDetail={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
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
            onOpenDetail={setSelectedProduct}
            onAddToCart={(p) => handleAddToCart(p, 1)}
          />
        )}

        {currentTab === 'bo-suu-tap' && (
          <CollectionsView
            products={products}
            onOpenDetail={setSelectedProduct}
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
      </main>

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} onShowToast={showToast} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(p, qty, variant) => handleAddToCart(p, qty, variant)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
        }}
      />

      {/* Floating Feedback Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
