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
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'click_marketplace', {
        event_category: 'outbound_ecommerce',
        event_label: `${platform} - ${productName}`,
        marketplace: platform,
        product_name: productName,
        link_url: url,
        value: price,
        currency: 'VND',
      });
    }
  } catch (err) {
    console.debug('Analytics error:', err);
  }
};

