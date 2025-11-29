import { parseHTMLString } from "../utils/dom";

// ============ Type Definitions ============

export interface ItemPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterImage: string;
  locale: string;
  userSignedIn: boolean;
  userAdult: boolean;
  userUuid: string | null;
  csrfToken: string | null;
}

export interface ItemPageProduct {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  event: string | null;
  price: number;
  priceRange: PriceRange | null;
}

export interface PriceRange {
  lowPrice: number;
  highPrice: number;
  currency: string;
}

export interface ItemPageShop {
  name: string;
  subdomain: string;
  url: string;
  avatarUrl: string;
  cartUrl: string;
  termsUrl: string | null;
  privacyPolicyUrl: string | null;
  contactUrl: string | null;
}

export interface ItemPageBreadcrumb {
  label: string;
  url: string;
}

export interface ItemPageBadge {
  name: string;
  imageUrl: string;
  url: string;
}

export interface ItemPageVariation {
  id: string;
  name: string;
  price: number;
  priceText: string;
  type: string; // "Digital", "Physical", etc.
  isAvailable: boolean;
  stock: number | null;
  cartUrl: string;
}

export interface ItemPageImage {
  thumbnailUrl: string;
  originalUrl: string;
}

export interface ItemPageVideo {
  type: "youtube" | "other";
  embedUrl: string;
}

export interface ItemPageMedia {
  images: ItemPageImage[];
  videos: ItemPageVideo[];
}

export interface ItemPageDescriptionSection {
  title: string;
  content: string;
}

export interface ItemPageTag {
  name: string;
  url: string;
  imageUrl: string | null;
}

export interface ItemPageRecentViewedItem {
  id: string;
  thumbnailUrl: string;
  url: string;
}

export interface ItemPageJsonLd {
  name: string;
  description: string;
  url: string;
  image: string;
  brand: {
    name: string;
    url: string;
  };
  offers: {
    priceCurrency: string;
    availability: string;
    lowPrice: number;
    highPrice: number;
  } | null;
}

export interface ItemPage {
  meta: ItemPageMeta;
  product: ItemPageProduct;
  shop: ItemPageShop;
  breadcrumbs: ItemPageBreadcrumb[];
  badges: ItemPageBadge[];
  variations: ItemPageVariation[];
  media: ItemPageMedia;
  description: string;
  descriptionSections: ItemPageDescriptionSection[];
  tags: ItemPageTag[];
  wishListCount: number;
  publishedDate: string | null;
  recentViewedItems: ItemPageRecentViewedItem[];
  jsonLd: ItemPageJsonLd | null;
}

// ============ Helper Functions ============

function getMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
  return meta?.getAttribute("content") ?? null;
}

function parseJsonMetaContent<T>(doc: Document, name: string): T | null {
  const content = getMetaContent(doc, name);
  if (!content) return null;
  try {
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function extractIdFromUrl(url: string): string {
  const match = url.match(/\/items\/(\d+)/);
  return match?.[1] ?? "";
}

function extractBackgroundImageUrl(style: string | null): string {
  if (!style) return "";
  const match = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
  return match?.[1] ?? "";
}

function parsePrice(priceText: string): number {
  const match = priceText.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseCount(text: string): number {
  const match = text.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function extractSubdomainFromUrl(url: string): string {
  const match = url.match(/https?:\/\/([^.]+)\.booth\.pm/);
  return match?.[1] ?? "";
}

// ============ Parser Functions ============

function parseMeta(doc: Document): ItemPageMeta {
  return {
    title: doc.title ?? "",
    description: getMetaContent(doc, "description") ?? "",
    keywords: (getMetaContent(doc, "keywords") ?? "").split(",").map(k => k.trim()).filter(Boolean),
    canonicalUrl: doc.querySelector("link[rel='canonical']")?.getAttribute("href") ?? "",
    ogImage: getMetaContent(doc, "og:image") ?? "",
    ogType: getMetaContent(doc, "og:type") ?? "",
    twitterCard: getMetaContent(doc, "twitter:card") ?? "",
    twitterImage: getMetaContent(doc, "twitter:image") ?? "",
    locale: parseJsonMetaContent<string>(doc, "js_const_user_locale") ?? "en",
    userSignedIn: getMetaContent(doc, "js_const_user_signed_in") === "true",
    userAdult: getMetaContent(doc, "js_const_user_adult") === "true",
    userUuid: parseJsonMetaContent<string>(doc, "js_const_user_uuid"),
    csrfToken: getMetaContent(doc, "csrf-token"),
  };
}

function parseJsonLd(doc: Document): ItemPageJsonLd | null {
  const script = doc.querySelector('script[type="application/ld+json"]');
  if (!script) return null;

  try {
    const data = JSON.parse(script.textContent ?? "");
    if (data["@type"] !== "Product") return null;

    return {
      name: data.name ?? "",
      description: data.description ?? "",
      url: data.url ?? "",
      image: data.image ?? "",
      brand: {
        name: data.brand?.name ?? "",
        url: data.brand?.url ?? "",
      },
      offers: data.offers ? {
        priceCurrency: data.offers.priceCurrency ?? "JPY",
        availability: data.offers.availability ?? "",
        lowPrice: parseInt(data.offers.lowPrice, 10) || 0,
        highPrice: parseInt(data.offers.highPrice, 10) || 0,
      } : null,
    };
  } catch {
    return null;
  }
}

function parseProduct(doc: Document): ItemPageProduct {
  const marketDiv = doc.querySelector(".market[data-product-id]");

  const id = marketDiv?.getAttribute("data-product-id") ?? "";
  const name = marketDiv?.getAttribute("data-product-name") ?? "";
  const brand = marketDiv?.getAttribute("data-product-brand") ?? "";
  const categoryId = marketDiv?.getAttribute("data-product-category") ?? "";
  const event = marketDiv?.getAttribute("data-product-event") || null;
  const price = parseInt(marketDiv?.getAttribute("data-product-price") ?? "0", 10);

  // Get category name from tracking attribute
  const categoryName = marketDiv?.getAttribute("data-shop-tracking-product-category") ?? "";

  // Get price range from JSON-LD
  const jsonLd = parseJsonLd(doc);
  const priceRange = jsonLd?.offers ? {
    lowPrice: jsonLd.offers.lowPrice,
    highPrice: jsonLd.offers.highPrice,
    currency: jsonLd.offers.priceCurrency,
  } : null;

  // Get full name from h2
  const h2 = doc.querySelector("h2.font-bold");
  const fullName = h2?.textContent?.trim() ?? name;

  return {
    id,
    name: fullName,
    brand,
    categoryId,
    categoryName,
    event,
    price,
    priceRange,
  };
}

function parseShop(doc: Document): ItemPageShop {
  const shopAnchor = doc.querySelector('a[data-product-list*="to shop_index"]');
  const shopUrl = shopAnchor?.getAttribute("href") ?? "";
  const subdomain = extractSubdomainFromUrl(shopUrl);

  const avatarImg = shopAnchor?.querySelector("img");
  const avatarUrl = avatarImg?.getAttribute("src") ?? "";
  const shopName = avatarImg?.getAttribute("alt") ?? shopAnchor?.querySelector("span")?.textContent?.trim() ?? "";

  const cartAnchor = doc.querySelector('a[title="カート"], a[href*="/cart"]');
  const cartUrl = cartAnchor?.getAttribute("href") ?? `https://${subdomain}.booth.pm/cart`;

  // Find terms/privacy/contact links
  const termsLink = doc.querySelector('a[href*="/terms"]');
  const privacyLink = doc.querySelector('a[href*="/privacy_policy"]');
  const contactLink = doc.querySelector('a[href*="/conversations/new"]');

  return {
    name: shopName,
    subdomain,
    url: shopUrl,
    avatarUrl,
    cartUrl,
    termsUrl: termsLink?.getAttribute("href") ?? null,
    privacyPolicyUrl: privacyLink?.getAttribute("href") ?? null,
    contactUrl: contactLink?.getAttribute("href") ?? null,
  };
}

function parseBreadcrumbs(doc: Document): ItemPageBreadcrumb[] {
  const breadcrumbs: ItemPageBreadcrumb[] = [];
  const navContainer = doc.querySelector("#js-item-category-breadcrumbs nav");

  if (navContainer) {
    const links = navContainer.querySelectorAll("a");
    links.forEach(link => {
      breadcrumbs.push({
        label: link.textContent?.trim() ?? "",
        url: link.getAttribute("href") ?? "",
      });
    });
  }

  return breadcrumbs;
}

function parseBadges(doc: Document): ItemPageBadge[] {
  const badges: ItemPageBadge[] = [];
  const badgeContainer = doc.querySelector(".empty\\:hidden.flex.gap-4.items-center");

  if (badgeContainer) {
    const badgeLinks = badgeContainer.querySelectorAll("a");
    badgeLinks.forEach(link => {
      const img = link.querySelector("img");
      badges.push({
        name: img?.getAttribute("alt") ?? "",
        imageUrl: img?.getAttribute("src") ?? "",
        url: link.getAttribute("href") ?? "",
      });
    });
  }

  return badges;
}

function parseVariations(doc: Document): ItemPageVariation[] {
  const variations: ItemPageVariation[] = [];
  const variationItems = doc.querySelectorAll(".variation-item");

  variationItems.forEach(item => {
    const nameEl = item.querySelector(".variation-name");
    const typeEl = item.querySelector(".u-tpg-caption1");
    const priceEl = item.querySelector(".variation-price");
    const addCartBtn = item.querySelector("button.add-cart");
    const variationIdInput = item.querySelector('input[name="cart_item[variation_id]"]');

    const id = variationIdInput?.getAttribute("value") ?? addCartBtn?.getAttribute("data-product-variant") ?? "";
    const name = nameEl?.textContent?.trim() ?? "";
    const type = typeEl?.textContent?.trim() ?? "";
    const priceText = priceEl?.textContent?.trim() ?? "";
    const price = parseInt(addCartBtn?.getAttribute("data-product-price") ?? "0", 10);

    // Check if sold out
    const isSoldOut = item.querySelector(".sold-out") !== null;
    const stockEl = item.querySelector(".stock");
    const stockText = stockEl?.textContent?.trim() ?? "";
    const stock = stockText ? parseCount(stockText) : null;

    const form = item.querySelector("form.button_to");
    const cartUrl = form?.getAttribute("action") ?? "";

    variations.push({
      id,
      name,
      price,
      priceText,
      type,
      isAvailable: !isSoldOut,
      stock,
      cartUrl,
    });
  });

  return variations;
}

function parseMedia(doc: Document): ItemPageMedia {
  const images: ItemPageImage[] = [];
  const videos: ItemPageVideo[] = [];

  // Track seen URLs to avoid duplicates
  const seenImageUrls = new Set<string>();
  const seenVideoUrls = new Set<string>();

  // Get all media wrappers from primary-image-area (direct children approach - works with or without slick)
  const primaryImageArea = doc.querySelector(".primary-image-area");

  if (primaryImageArea) {
    // Get all market-item-detail-item-image-wrapper elements
    const wrappers = primaryImageArea.querySelectorAll(".market-item-detail-item-image-wrapper");

    wrappers.forEach(wrapper => {
      // Check for iframe (video)
      const iframe = wrapper.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src") ?? "";
        if (src && !seenVideoUrls.has(src)) {
          seenVideoUrls.add(src);
          if (src.includes("youtube.com") || src.includes("youtu.be")) {
            videos.push({
              type: "youtube",
              embedUrl: src,
            });
          } else {
            videos.push({
              type: "other",
              embedUrl: src,
            });
          }
        }
        return;
      }

      // Parse image
      const img = wrapper.querySelector("img.market-item-detail-item-image");
      if (img) {
        // For thumbnail: prefer src, fallback to data-lazy
        const thumbnailUrl = img.getAttribute("src") || img.getAttribute("data-lazy") || "";
        // For original: always use data-origin if available
        const originalUrl = img.getAttribute("data-origin") || thumbnailUrl;

        // Use originalUrl as unique key to avoid duplicates
        if (originalUrl && !seenImageUrls.has(originalUrl)) {
          seenImageUrls.add(originalUrl);
          images.push({
            thumbnailUrl,
            originalUrl,
          });
        }
      }
    });
  }

  return { images, videos };
}

function parseDescription(doc: Document): string {
  const descEl = doc.querySelector(".js-market-item-detail-description p.autolink");
  return descEl?.textContent?.trim() ?? "";
}

function parseDescriptionSections(doc: Document): ItemPageDescriptionSection[] {
  const sections: ItemPageDescriptionSection[] = [];
  const sectionElements = doc.querySelectorAll("section.shop__text");

  sectionElements.forEach(section => {
    const titleEl = section.querySelector("h2");
    const contentEl = section.querySelector("p.js-autolink");

    if (titleEl && contentEl) {
      sections.push({
        title: titleEl.textContent?.trim() ?? "",
        content: contentEl.textContent?.trim() ?? "",
      });
    }
  });

  return sections;
}

function parseTags(doc: Document): ItemPageTag[] {
  const tags: ItemPageTag[] = [];
  const tagContainer = doc.querySelector("#js-item-tag-list");

  if (tagContainer) {
    const tagLinks = tagContainer.querySelectorAll("a.no-underline");

    tagLinks.forEach(link => {
      const nameEl = link.querySelector(".text-white");
      const bgEl = link.querySelector("[style*='background']");

      const name = nameEl?.textContent?.trim() ?? "";
      const url = link.getAttribute("href") ?? "";
      const imageUrl = extractBackgroundImageUrl(bgEl?.getAttribute("style") ?? null);

      if (name) {
        tags.push({
          name,
          url,
          imageUrl: imageUrl || null,
        });
      }
    });
  }

  return tags;
}

function parseWishListCount(doc: Document): number {
  const wishListEl = doc.querySelector("#js-item-wishlist-button .typography-14, #js-item-wishlist-button .typography-12");
  return parseCount(wishListEl?.textContent ?? "0");
}

function parsePublishedDate(doc: Document): string | null {
  const dateEl = doc.querySelector("#js-item-published-date .typography-14");
  const text = dateEl?.textContent?.trim() ?? "";
  const match = text.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
  return match?.[1] ?? null;
}

function parseRecentViewedItems(doc: Document): ItemPageRecentViewedItem[] {
  const items: ItemPageRecentViewedItem[] = [];
  const itemElements = doc.querySelectorAll(".recent_viewed_item_component");

  itemElements.forEach(el => {
    const url = el.getAttribute("href") ?? "";
    const id = extractIdFromUrl(url);
    const thumbnailUrl = extractBackgroundImageUrl(el.getAttribute("style"));

    if (id) {
      items.push({ id, thumbnailUrl, url });
    }
  });

  return items;
}

// ============ Wishlist Count Fetcher ============

interface WishlistCountsResponse {
  item_ids: number[];
  wishlists_counts: Record<string, number>;
}

async function fetchWishlistCount(itemId: string): Promise<number> {
  if (!itemId) return 0;

  try {
    const url = new URL("https://accounts.booth.pm/wish_lists.json");
    url.searchParams.append("item_ids[]", itemId);

    const response = await fetch(url.toString(), {
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("[BoothKit] Failed to fetch wishlist count:", response.status);
      return 0;
    }

    const data: WishlistCountsResponse = await response.json();
    return data.wishlists_counts?.[itemId] ?? 0;
  } catch (error) {
    console.warn("[BoothKit] Error fetching wishlist count:", error);
    return 0;
  }
}

// ============ Main Parser ============

export async function parseItemPage(htmlString: string): Promise<ItemPage> {
  const doc = parseHTMLString(htmlString);

  const product = parseProduct(doc);
  const wishListCountFromPage = parseWishListCount(doc);

  // Try to fetch fresh wishlist count
  const wishListCount = wishListCountFromPage || await fetchWishlistCount(product.id);

  return {
    meta: parseMeta(doc),
    product,
    shop: parseShop(doc),
    breadcrumbs: parseBreadcrumbs(doc),
    badges: parseBadges(doc),
    variations: parseVariations(doc),
    media: parseMedia(doc),
    description: parseDescription(doc),
    descriptionSections: parseDescriptionSections(doc),
    tags: parseTags(doc),
    wishListCount,
    publishedDate: parsePublishedDate(doc),
    recentViewedItems: parseRecentViewedItems(doc),
    jsonLd: parseJsonLd(doc),
  };
}

export async function fetchAndParseItemPage(url: string): Promise<ItemPage> {
  const response = await fetch(url);
  const htmlString = await response.text();
  return parseItemPage(htmlString);
}

// ============ Utility Exports ============

export {
  getMetaContent,
  parseJsonMetaContent,
  extractIdFromUrl,
  extractBackgroundImageUrl,
  parsePrice,
  parseCount,
  extractSubdomainFromUrl,
};
