import { Product } from '../types';
import { PRODUCTS, ECOSYSTEM_PILLARS, CATEGORIES, FAQS, LOOKBOOKS } from '../data/products';

const STORAGE_KEY = 'hugz_custom_products';
const AUTH_KEY = 'hugz_admin_auth';

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
