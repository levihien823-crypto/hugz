export type NavTab = 
  | 'trang-chu' 
  | 've-chung-toi' 
  | 'san-pham' 
  | 'bo-suu-tap' 
  | 'kenh-mua-hang' 
  | 'lien-he'
  | 'quan-tri';

export interface ProductColorVariant {
  name: string;
  hex: string;
  inStock: boolean;
}

export interface ProductSizeVariant {
  name: string;
  volume: string;
  dimensions: string;
  price: number;
  isPopular?: boolean;
}

export interface ProductLifestyle {
  title: string;
  desc: string;
  image: string;
  tag: string;
}

export interface ProductReviewItem {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  variantBought: string;
  comment: string;
  photos?: string[];
  source: 'Shopee' | 'TikTok';
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  soldCount: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'tertiary';
  image: string;
  description: string;
  features: string[];
  dimensions?: string;
  material?: string;
  shopeeUrl: string;
  tiktokUrl: string;
  variants?: string[];
  isBestSeller?: boolean;
  isNew?: boolean;
  // Enhanced Content-driven Commerce PDP fields
  gallery?: {
    id: string;
    url: string;
    title: string;
    desc: string;
    badge?: string;
  }[];
  colorVariants?: ProductColorVariant[];
  sizeVariants?: ProductSizeVariant[];
  techSpecs?: { label: string; value: string }[];
  careInstructions?: { iconName: string; title: string; desc: string }[];
  lifestyleSuggestions?: ProductLifestyle[];
  socialReviews?: ProductReviewItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  variant: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  iconName: string;
  count: number;
  desc: string;
  pillarIndex?: number;
  subtitle?: string;
  badge?: string;
  highlightText?: string;
  image?: string;
}

export interface CustomerOrderInfo {
  fullName: string;
  phone: string;
  email?: string;
  contactMethod?: 'phone' | 'sms';
  contactTime?: 'anytime' | 'morning' | 'afternoon' | 'evening';
  province: string;
  district?: string;
  address: string;
  note?: string;
  paymentMethod: 'cod' | 'banking';
}

export interface PlacedOrder {
  orderId: string;
  createdAt: string;
  customer: CustomerOrderInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  grandTotal: number;
  status: 'pending_confirmation' | 'confirmed' | 'shipping' | 'completed' | 'cancelled';
  cancelReason?: string;
  cancelledAt?: string;
}

