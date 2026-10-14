// Google Analytics 4 & UTM tracking helpers
import { Product, CartItem } from '../types';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Tự động gắn tham số UTM vào đường link Shopee / TikTok để sàn ghi nhận nguồn đơn hàng từ website
 */
export const buildTrackedUrl = (
  rawUrl: string,
  platform: 'shopee' | 'tiktok',
  campaignName: string = 'website_referral'
): string => {
  if (!rawUrl) return '';
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('utm_source', 'thehugzlife_website');
    url.searchParams.set('utm_medium', `${platform}_referral`);
    url.searchParams.set('utm_campaign', campaignName.replace(/[^a-zA-Z0-9_-]/g, '_'));
    return url.toString();
  } catch {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}utm_source=thehugzlife_website&utm_medium=${platform}_referral&utm_campaign=${campaignName}`;
  }
};

/**
 * 1. GA4 Outbound Marketplace Click (Khi khách bấm link mua trên Shopee / TikTok)
 */
export const trackMarketplaceClick = (
  platform: 'Shopee' | 'TikTok',
  productName: string,
  url: string,
  price?: number
) => {
  try {
    const eventPayload = {
      event_category: 'outbound_ecommerce',
      event_label: `${platform} - ${productName}`,
      marketplace: platform,
      product_name: productName,
      link_url: url,
      value: price,
      currency: 'VND',
      transport_type: 'beacon',
    };

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'click_marketplace', eventPayload);

      const specificEventName = platform === 'Shopee' ? 'click_shopee' : 'click_tiktok';
      window.gtag('event', specificEventName, eventPayload);

      window.gtag('event', 'click', {
        event_category: 'outbound',
        event_label: `${platform} - ${productName}`,
        link_url: url,
        link_domain: platform === 'Shopee' ? 'shopee.vn' : 'tiktok.com',
        outbound: true,
        transport_type: 'beacon',
      });

      if (price) {
        window.gtag('event', 'select_item', {
          item_list_name: 'Marketplace Outbound',
          items: [
            {
              item_name: productName,
              item_brand: 'HUGZ',
              item_category: platform,
              price: price,
            },
          ],
          transport_type: 'beacon',
        });
      }
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'click_marketplace',
        ...eventPayload,
      });
      window.dataLayer.push({
        event: platform === 'Shopee' ? 'click_shopee' : 'click_tiktok',
        ...eventPayload,
      });
    }
  } catch (err) {
    console.debug('Analytics error:', err);
  }
};

/**
 * 2. GA4 E-commerce view_item: Báo cáo "Số mặt hàng được xem"
 */
export const trackViewItem = (product: Product) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        currency: 'VND',
        value: product.price,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_brand: 'HUGZ',
            item_category: product.category,
            price: product.price,
            quantity: 1,
          },
        ],
      });
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'view_item',
        ecommerce: {
          currency: 'VND',
          value: product.price,
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              item_brand: 'HUGZ',
              item_category: product.category,
              price: product.price,
              quantity: 1,
            },
          ],
        },
      });
    }
  } catch (err) {
    console.debug('Analytics error trackViewItem:', err);
  }
};

/**
 * 3. GA4 E-commerce add_to_cart: Báo cáo "Số mặt hàng được thêm vào giỏ hàng"
 */
export const trackAddToCart = (product: Product, quantity = 1, variant?: string) => {
  try {
    const itemTotal = product.price * quantity;
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'add_to_cart', {
        currency: 'VND',
        value: itemTotal,
        items: [
          {
            item_id: product.id,
            item_name: product.title,
            item_brand: 'HUGZ',
            item_category: product.category,
            item_variant: variant,
            price: product.price,
            quantity: quantity,
          },
        ],
      });
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'add_to_cart',
        ecommerce: {
          currency: 'VND',
          value: itemTotal,
          items: [
            {
              item_id: product.id,
              item_name: product.title,
              item_brand: 'HUGZ',
              item_category: product.category,
              item_variant: variant,
              price: product.price,
              quantity: quantity,
            },
          ],
        },
      });
    }
  } catch (err) {
    console.debug('Analytics error trackAddToCart:', err);
  }
};

/**
 * 4. GA4 E-commerce begin_checkout: Báo cáo "Bắt đầu thanh toán"
 */
export const trackBeginCheckout = (items: CartItem[], totalAmount: number) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'begin_checkout', {
        currency: 'VND',
        value: totalAmount,
        items: items.map((i) => ({
          item_id: i.product.id,
          item_name: i.product.title,
          item_brand: 'HUGZ',
          item_category: i.product.category,
          item_variant: i.variant,
          price: i.product.price,
          quantity: i.quantity,
        })),
      });
    }
  } catch (err) {
    console.debug('Analytics error trackBeginCheckout:', err);
  }
};

/**
 * 5. GA4 E-commerce purchase: Báo cáo "Mặt hàng đã mua" & "Doanh thu theo mặt hàng"
 */
export const trackPurchase = (orderId: string, items: CartItem[], totalAmount: number) => {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'VND',
        value: totalAmount,
        items: items.map((i) => ({
          item_id: i.product.id,
          item_name: i.product.title,
          item_brand: 'HUGZ',
          item_category: i.product.category,
          item_variant: i.variant,
          price: i.product.price,
          quantity: i.quantity,
        })),
      });
    } else if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'purchase',
        ecommerce: {
          transaction_id: orderId,
          currency: 'VND',
          value: totalAmount,
          items: items.map((i) => ({
            item_id: i.product.id,
            item_name: i.product.title,
            item_brand: 'HUGZ',
            item_category: i.product.category,
            item_variant: i.variant,
            price: i.product.price,
            quantity: i.quantity,
          })),
        },
      });
    }
  } catch (err) {
    console.debug('Analytics error trackPurchase:', err);
  }
};
