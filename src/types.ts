export type NavTab = 
  | 'trang-chu' 
  | 've-chung-toi' 
  | 'san-pham' 
  | 'bo-suu-tap' 
  | 'kenh-mua-hang' 
  | 'lien-he';

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
}
