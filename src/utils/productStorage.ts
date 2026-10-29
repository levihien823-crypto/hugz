import { Product, CategoryInfo, PlacedOrder, Coupon } from '../types';
import { PRODUCTS, ECOSYSTEM_PILLARS, CATEGORIES, FAQS, LOOKBOOKS } from '../data/products';

const STORAGE_KEY = 'hugz_custom_products';
const AUTH_KEY = 'hugz_admin_auth_v3';

// Xóa bỏ các session cũ để bắt buộc đăng nhập bằng tài khoản mới
try {
  sessionStorage.removeItem('hugz_admin_auth');
  sessionStorage.removeItem('hugz_admin_auth_v2');
} catch {
  // ignore
}

export const ADMIN_CREDENTIALS = {
  email: 'Levihien823@gmail.com',
  password: 'Hugzlife2026@',
};

/**
 * Kiểm tra trạng thái đăng nhập admin trong phiên làm việc hiện tại
 */
export function isAdminAuthenticated(): boolean {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Đăng nhập admin với email và mật khẩu
 */
export function authenticateAdmin(email: string, pass: string): boolean {
  const isMatchEmail = email.trim().toLowerCase() === ADMIN_CREDENTIALS.email.toLowerCase();
  const isMatchPass = pass.trim() === ADMIN_CREDENTIALS.password;

  if (isMatchEmail && isMatchPass) {
    try {
      sessionStorage.setItem(AUTH_KEY, 'true');
      window.dispatchEvent(new Event('hugz-auth-changed'));
    } catch {
      // fallback
    }
    return true;
  }
  return false;
}

/**
 * Đăng xuất admin
 */
export function logoutAdmin(): void {
  try {
    sessionStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event('hugz-auth-changed'));
  } catch {
    // fallback
  }
}

/**
 * Lấy danh sách sản phẩm từ localStorage hoặc fallback về dữ liệu mẫu ban đầu
 */
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Lỗi khi đọc dữ liệu sản phẩm từ localStorage:', err);
  }
  return [...PRODUCTS];
}

/**
 * Lưu danh sách sản phẩm vào localStorage
 */
export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Phát event để các tab hoặc component khác cùng nhận diện
    window.dispatchEvent(new Event('hugz-products-updated'));
  } catch (err) {
    console.error('Lỗi khi ghi dữ liệu sản phẩm vào localStorage:', err);
  }
}

/**
 * Khôi phục danh sách sản phẩm về mặc định từ mã nguồn
 */
export function resetToDefaultProducts(): Product[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fallback
  }
  return [...PRODUCTS];
}

/**
 * Tạo nội dung mã nguồn file products.ts hoàn chỉnh để đẩy lên Git
 */
export function generateProductsTsCode(products: Product[]): string {
  const productsJson = JSON.stringify(products, null, 2);

  return `import { Product, CategoryInfo } from '../types';

export interface EcosystemPillar {
  id: string;
  pillarNumber: string;
  name: string;
  subtitle: string;
  badge: string;
  tagline: string;
  desc: string;
  highlights: string[];
  keyBenefits: string[];
  image: string;
  productCount: number;
}

export const ECOSYSTEM_PILLARS: EcosystemPillar[] = ${JSON.stringify(ECOSYSTEM_PILLARS, null, 2)};

export const CATEGORIES: CategoryInfo[] = ${JSON.stringify(CATEGORIES, null, 2)};

export const PRODUCTS: Product[] = ${productsJson};

export const FAQS = ${JSON.stringify(FAQS, null, 2)};

export const LOOKBOOKS = ${JSON.stringify(LOOKBOOKS, null, 2)};
`;
}

/**
 * Tiện ích tải file về máy
 */
export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ==========================================
// 1. QUẢN LÝ MÃ GIẢM GIÁ (COUPONS / VOUCHERS)
// ==========================================
const COUPONS_STORAGE_KEY = 'hugz_custom_coupons';

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'HUGZSHOPEE20',
    discountPercent: 20,
    minOrderAmount: 0,
    description: 'Giảm 20% cho đơn hàng đầu tiên qua Shopee Mall & Website',
    isActive: true,
    usageCount: 42,
  },
  {
    id: 'c-2',
    code: 'TIKTOKHUGZ30',
    discountPercent: 30,
    minOrderAmount: 250000,
    description: 'Giảm 30% cho đơn hàng từ 250.000đ từ kênh TikTok Shop',
    isActive: true,
    usageCount: 28,
  },
  {
    id: 'c-3',
    code: 'CHAOBANMOI',
    discountPercent: 15,
    minOrderAmount: 100000,
    description: 'Voucher chào bạn mới giảm 15% tất cả sản phẩm HUGZ',
    isActive: true,
    usageCount: 15,
  },
  {
    id: 'c-4',
    code: 'FREESHIP',
    discountPercent: 10,
    discountAmount: 25000,
    minOrderAmount: 200000,
    description: 'Hỗ trợ 25.000đ phí vận chuyển toàn quốc cho đơn từ 200k',
    isActive: true,
    usageCount: 63,
  }
];

export function getStoredCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return [...DEFAULT_COUPONS];
}

export function saveStoredCoupons(coupons: Coupon[]): void {
  try {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
    window.dispatchEvent(new Event('hugz-coupons-updated'));
  } catch (err) {
    console.error('Lỗi khi lưu coupons:', err);
  }
}

// ==========================================
// 2. QUẢN LÝ ĐƠN HÀNG (ORDERS MANAGEMENT)
// ==========================================
const ORDERS_STORAGE_KEY = 'hugz_customer_orders';

export const SAMPLE_ORDERS: PlacedOrder[] = [
  {
    orderId: 'HUGZ-8892',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    customer: {
      fullName: 'Nguyễn Thị Minh Châu',
      phone: '0912345678',
      address: 'Phòng 402, Chung cư Sunrise, 25 Lê Văn Lương, Cầu Giấy, Hà Nội',
      note: 'Giao giờ hành chính giúp em ạ, gọi trước khi đến',
      paymentMethod: 'cod'
    },
    items: [
      {
        product: PRODUCTS[0] || {
          id: 'p-1',
          title: 'Túi Mini HUGZ Storage Bag',
          price: 150000,
          image: '/images/products/hugz-mini-pouch.jpg',
          category: 'Túi đựng đồ cá nhân'
        } as Product,
        quantity: 2,
        color: 'Màu Be'
      }
    ],
    subtotal: 300000,
    discount: 60000,
    couponCode: 'HUGZSHOPEE20',
    shippingFee: 25000,
    grandTotal: 265000,
    status: 'pending_confirmation'
  },
  {
    orderId: 'HUGZ-8854',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    customer: {
      fullName: 'Trần Hoàng Long',
      phone: '0988776655',
      address: 'Số 18/42 Võ Thị Sáu, Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
      note: 'Hàng dễ vỡ, bọc kỹ xốp khí giúp mình',
      paymentMethod: 'banking'
    },
    items: [
      {
        product: PRODUCTS[1] || {
          id: 'p-2',
          title: 'Hộp Đựng Trang Sức Đa Năng HUGZ Jewelry Box',
          price: 220000,
          image: '/images/products/hugz-jewelry-box.jpg',
          category: 'Hộp phụ kiện'
        } as Product,
        quantity: 1,
        color: 'Hồng Pastel'
      }
    ],
    subtotal: 220000,
    discount: 0,
    shippingFee: 25000,
    grandTotal: 245000,
    status: 'shipping'
  },
  {
    orderId: 'HUGZ-8790',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    customer: {
      fullName: 'Lê Thu Trang',
      phone: '0903112233',
      address: 'Toà S2.03 Vinhomes Ocean Park, Đa Tốn, Gia Lâm, Hà Nội',
      paymentMethod: 'cod'
    },
    items: [
      {
        product: PRODUCTS[2] || {
          id: 'p-3',
          title: 'Túi Giữ Nhiệt HUGZ Lunch Cooler Bag',
          price: 180000,
          image: '/images/products/hugz-lunch-bag.jpg',
          category: 'Túi giữ nhiệt'
        } as Product,
        quantity: 1
      }
    ],
    subtotal: 180000,
    discount: 36000,
    couponCode: 'HUGZSHOPEE20',
    shippingFee: 25000,
    grandTotal: 169000,
    status: 'completed'
  }
];

export function getStoredOrders(): PlacedOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(SAMPLE_ORDERS));
  } catch {}
  return [...SAMPLE_ORDERS];
}

export function saveStoredOrders(orders: PlacedOrder[]): void {
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new Event('hugz-orders-updated'));
  } catch (err) {
    console.error('Lỗi khi lưu đơn hàng:', err);
  }
}

export function updateStoredOrderStatus(orderId: string, status: PlacedOrder['status']): void {
  const orders = getStoredOrders();
  const index = orders.findIndex(o => o.orderId.toUpperCase() === orderId.toUpperCase());
  if (index !== -1) {
    orders[index] = {
      ...orders[index],
      status,
      ...(status === 'cancelled' && !orders[index].cancelledAt ? { cancelledAt: new Date().toISOString() } : {})
    };
    saveStoredOrders(orders);
  }
}

export function deleteStoredOrder(orderId: string): void {
  const orders = getStoredOrders().filter(o => o.orderId.toUpperCase() !== orderId.toUpperCase());
  saveStoredOrders(orders);
}

// ==========================================
// 3. QUẢN LÝ THÔNG BÁO BANNER (ANNOUNCEMENT)
// ==========================================
const ANNOUNCEMENT_STORAGE_KEY = 'hugz_announcement_text';
export const DEFAULT_ANNOUNCEMENT = 'Ưu đãi độc quyền: Giảm 20% Shopee & TikTok';

export function getStoredAnnouncement(): string {
  try {
    return localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY) || DEFAULT_ANNOUNCEMENT;
  } catch {
    return DEFAULT_ANNOUNCEMENT;
  }
}

export function saveStoredAnnouncement(text: string): void {
  try {
    localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, text);
    window.dispatchEvent(new Event('hugz-announcement-updated'));
  } catch {}
}

// ==========================================
// 4. QUẢN LÝ DANH MỤC (CATEGORIES)
// ==========================================
const CATEGORIES_STORAGE_KEY = 'hugz_categories_list';

export function getStoredCategories(): CategoryInfo[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}
  return [...CATEGORIES];
}

export function saveStoredCategories(cats: CategoryInfo[]): void {
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(cats));
    window.dispatchEvent(new Event('hugz-categories-updated'));
  } catch {}
}

