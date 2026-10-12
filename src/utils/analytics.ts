// Google Analytics 4 & UTM tracking helpers
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

    // 1. Nếu có window.gtag (Google tag chuẩn GA4)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      // Event tổng hợp sàn
      window.gtag('event', 'click_marketplace', eventPayload);

      // Event riêng theo tên sàn để xem trực tiếp trong bảng Sự kiện GA4
      const specificEventName = platform === 'Shopee' ? 'click_shopee' : 'click_tiktok';
      window.gtag('event', specificEventName, eventPayload);

      // Chuẩn GA4 Outbound link click (tự động gom nhóm trong báo cáo Liên kết ngoài)
      window.gtag('event', 'click', {
        event_category: 'outbound',
        event_label: `${platform} - ${productName}`,
        link_url: url,
        link_domain: platform === 'Shopee' ? 'shopee.vn' : 'tiktok.com',
        outbound: true,
        transport_type: 'beacon',
      });

      // Chuẩn GA4 Ecommerce select_item
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
      // Fallback trực tiếp vào dataLayer nếu gtag script chưa sẵn sàng
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

