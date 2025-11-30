import { parseHTMLString } from "../../utils/dom";

// ============ Type Definitions ============

export interface ShopItemPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  ogUrl: string;
  twitterCard: string;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
  locale: string;
  userSignedIn: boolean;
  userAdult: boolean;
  userUuid: string | null;
  csrfToken: string | null;
  gaTrackingId: string | null;
  gaShopTrackingId: string | null;
  themeColor: string | null;
}

export interface ShopItemPageProduct {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  event: string | null;
  price: number;
  priceFormatted: string;
  availability: string;
  productList: string;
}

export interface ShopItemPagePriceRange {
  lowPrice: number;
  highPrice: number;
  currency: string;
}

export interface ShopItemPageShop {
  name: string;
  nickname: string;
  subdomain: string;
  url: string;
  avatarUrl: string;
  cartUrl: string;
  pixivUrl: string | null;
  twitterUrl: string | null;
  contactUrl: string | null;
}

export interface ShopItemPageBadge {
  name: string;
  imageUrl: string;
  url: string;
}

export interface ShopItemPageVariation {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
  type: "Digital" | "Physical" | "Unknown";
  isAvailable: boolean;
  cartUrl: string;
  giftCartUrl: string;
  productId: string;
  productName: string;
  productBrand: string;
  productCategory: string;
  productVariant: string;
}

export interface ShopItemPageImage {
  thumbnailUrl: string;
  originalUrl: string;
  alt: string;
}

export interface ShopItemPageVideo {
  type: "youtube" | "other";
  embedUrl: string;
}

export interface ShopItemPageMedia {
  images: ShopItemPageImage[];
  thumbnails: string[];
  videos: ShopItemPageVideo[];
}

export interface ShopItemPageDescriptionSection {
  title: string;
  content: string;
}

export interface ShopItemPageSocialLink {
  type: "pixiv" | "twitter" | "contact" | "other";
  url: string;
  label: string | null;
}

export interface ShopItemPageMoreItem {
  itemId: string;
  subdomain: string;
  isAdultUser: boolean;
  isMobile: boolean;
  productList: string;
}

export interface ShopItemPageJsonLd {
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
    price: number;
  } | null;
}

export interface ShopItemPageTheme {
  backgroundColor: string;
  baseColor: string;
  borderColor: string;
  contentsColor: string;
  linkColor: string;
  priceColor: string;
  textColor: string;
}

export interface ShopItemPage {
  meta: ShopItemPageMeta;
  product: ShopItemPageProduct;
  priceRange: ShopItemPagePriceRange | null;
  shop: ShopItemPageShop;
  badges: ShopItemPageBadge[];
  variations: ShopItemPageVariation[];
  media: ShopItemPageMedia;
  description: string;
  descriptionSections: ShopItemPageDescriptionSection[];
  socialLinks: ShopItemPageSocialLink[];
  moreItemsConfig: ShopItemPageMoreItem | null;
  isPrivate: boolean;
  jsonLd: ShopItemPageJsonLd | null;
  theme: ShopItemPageTheme | null;
}

// ============ Helper Functions ============

function getMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"], meta[property="${name}"], meta[content][name="${name}"]`);
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

function extractSubdomainFromUrl(url: string): string {
  const match = url.match(/https?:\/\/([^.]+)\.booth\.pm/);
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

function parseCSSVariable(doc: Document, varName: string): string | null {
  const styleElements = doc.querySelectorAll("style");
  for (const style of styleElements) {
    const content = style.textContent ?? "";
    const regex = new RegExp(`--${varName}:\\s*([^;]+);`);
    const match = content.match(regex);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
}

// ============ Parser Functions ============

function parseMeta(doc: Document): ShopItemPageMeta {
  return {
    title: doc.title ?? "",
    description: getMetaContent(doc, "description") ?? "",
    keywords: (getMetaContent(doc, "keywords") ?? "").split(",").map(k => k.trim()).filter(Boolean),
    canonicalUrl: doc.querySelector("link[rel='canonical']")?.getAttribute("href") ?? "",
    ogImage: getMetaContent(doc, "og:image") ?? "",
    ogType: getMetaContent(doc, "og:type") ?? "",
    ogUrl: getMetaContent(doc, "og:url") ?? "",
    twitterCard: getMetaContent(doc, "twitter:card") ?? "",
    twitterImage: getMetaContent(doc, "twitter:image") ?? "",
    twitterTitle: getMetaContent(doc, "twitter:title") ?? "",
    twitterDescription: getMetaContent(doc, "twitter:description") ?? "",
    locale: parseJsonMetaContent<string>(doc, "js_const_user_locale") ?? "en",
    userSignedIn: getMetaContent(doc, "js_const_user_signed_in") === "true",
    userAdult: getMetaContent(doc, "js_const_user_adult") === "true",
    userUuid: parseJsonMetaContent<string>(doc, "js_const_user_uuid"),
    csrfToken: getMetaContent(doc, "csrf-token"),
    gaTrackingId: getMetaContent(doc, "ga") ?? null,
    gaShopTrackingId: getMetaContent(doc, "ga:shop") ?? null,
    themeColor: getMetaContent(doc, "theme-color") ?? null,
  };
}

function parseJsonLd(doc: Document): ShopItemPageJsonLd | null {
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
        price: parseInt(data.offers.price, 10) || 0,
      } : null,
    };
  } catch {
    return null;
  }
}

function parseProduct(doc: Document): ShopItemPageProduct {
  const itemInfoDetail = doc.querySelector(".item-info-detail[data-product-id]");

  const id = itemInfoDetail?.getAttribute("data-product-id") ?? "";
  const name = itemInfoDetail?.getAttribute("data-product-name") ?? "";
  const brand = itemInfoDetail?.getAttribute("data-product-brand") ?? "";
  const categoryId = itemInfoDetail?.getAttribute("data-product-category") ?? "";
  const event = itemInfoDetail?.getAttribute("data-product-event") || null;
  const price = parseInt(itemInfoDetail?.getAttribute("data-product-price") ?? "0", 10);
  const categoryName = itemInfoDetail?.getAttribute("data-shop-tracking-product-category") ?? "";
  const productList = itemInfoDetail?.getAttribute("data-product-list") ?? "";

  // Get price formatted text
  const priceEl = doc.querySelector(".variation-price");
  const priceFormatted = priceEl?.textContent?.trim() ?? `${price.toLocaleString()} JPY`;

  // Get availability from JSON-LD
  const jsonLd = parseJsonLd(doc);
  const availability = jsonLd?.offers?.availability?.replace("https://schema.org/", "") ?? "Unknown";

  // If we couldn't find the name from data attributes, try the h2
  const fullName = (name || doc.querySelector("h2.font-bold")?.textContent?.trim()) ?? "";

  return {
    id,
    name: fullName,
    brand,
    categoryId,
    categoryName,
    event,
    price,
    priceFormatted,
    availability,
    productList,
  };
}

function parsePriceRange(doc: Document): ShopItemPagePriceRange | null {
  const jsonLd = parseJsonLd(doc);
  if (!jsonLd?.offers) return null;

  return {
    lowPrice: jsonLd.offers.price,
    highPrice: jsonLd.offers.price,
    currency: jsonLd.offers.priceCurrency,
  };
}

function parseShop(doc: Document): ShopItemPageShop {
  // Get shop URL from the shop link
  const shopAnchor = doc.querySelector('a[data-product-list*="to shop_index"]');
  const shopUrl = shopAnchor?.getAttribute("href") ?? "";
  const subdomain = (extractSubdomainFromUrl(shopUrl) || doc.querySelector(".js-shop-follow")?.getAttribute("data-subdomain")) ?? "";

  // Get shop name
  const shopNameEl = doc.querySelector(".shop-name-label, .booth-title .shop-name span");
  const shopName = shopNameEl?.textContent?.trim() ?? "";

  // Get shop nickname (different from shop name)
  const nicknameEl = doc.querySelector(".home-link-container__nickname a");
  const nickname = nicknameEl?.textContent?.trim() ?? shopName;

  // Get avatar URL from the avatar container
  const avatarDiv = doc.querySelector(".shop-global-nav__avatar-image-container .avatar-image");
  const avatarStyle = avatarDiv?.getAttribute("style") ?? "";
  const avatarUrl = extractBackgroundImageUrl(avatarStyle);

  // Get cart URL
  const cartAnchor = doc.querySelector('a[title="カート"], a[href*="/cart"]');
  const cartUrl = cartAnchor?.getAttribute("href") ?? `https://${subdomain}.booth.pm/cart`;

  // Get social/contact links
  const pixivLink = doc.querySelector('a[href*="pixiv.net/users"]');
  const twitterLink = doc.querySelector('a[href*="twitter.com"], a[href*="x.com"]');
  const contactLink = doc.querySelector('a[href*="/conversations"]');

  return {
    name: shopName,
    nickname,
    subdomain,
    url: shopUrl || `https://${subdomain}.booth.pm/`,
    avatarUrl,
    cartUrl,
    pixivUrl: pixivLink?.getAttribute("href") ?? null,
    twitterUrl: twitterLink?.getAttribute("href") ?? null,
    contactUrl: contactLink?.getAttribute("href") ?? null,
  };
}

function parseBadges(doc: Document): ShopItemPageBadge[] {
  const badges: ShopItemPageBadge[] = [];

  // Find badge images (like VRChat badge)
  const badgeContainer = doc.querySelector(".summary header .flex.gap-4.items-center");
  if (badgeContainer) {
    const badgeLinks = badgeContainer.querySelectorAll("a");
    badgeLinks.forEach(link => {
      const img = link.querySelector("img");
      if (img) {
        badges.push({
          name: img.getAttribute("alt") ?? "",
          imageUrl: img.getAttribute("src") ?? "",
          url: link.getAttribute("href") ?? "",
        });
      }
    });
  }

  return badges;
}

function parseVariations(doc: Document): ShopItemPageVariation[] {
  const variations: ShopItemPageVariation[] = [];
  const variationItems = doc.querySelectorAll(".variation-item");

  variationItems.forEach(item => {
    const typeEl = item.querySelector(".type");
    const typeText = typeEl?.textContent?.trim() ?? "";
    const type = typeText === "Digital" ? "Digital" : typeText === "Physical" ? "Physical" : "Unknown";

    const nameEl = item.querySelector(".variation-name");
    const name = nameEl?.textContent?.trim() ?? "";

    const priceEl = item.querySelector(".variation-price");
    const priceFormatted = priceEl?.textContent?.trim() ?? "";

    // Get add to cart button data
    const addCartBtn = item.querySelector("button.add-cart");
    const id = addCartBtn?.getAttribute("data-product-variant") ?? "";
    const price = parseInt(addCartBtn?.getAttribute("data-product-price") ?? "0", 10);
    const productId = addCartBtn?.getAttribute("data-product-id") ?? "";
    const productName = addCartBtn?.getAttribute("data-product-name") ?? "";
    const productBrand = addCartBtn?.getAttribute("data-product-brand") ?? "";
    const productCategory = addCartBtn?.getAttribute("data-shop-tracking-product-category") ?? "";
    const productVariant = addCartBtn?.getAttribute("data-shop-tracking-product-variant") ?? "";

    // Get form action URLs
    const cartForm = item.querySelector("form.button_to");
    const cartUrl = cartForm?.getAttribute("action") ?? "";

    // Get gift form URL
    const giftForm = item.querySelector("form.button_to:has(button.add-gift)") ??
      Array.from(item.querySelectorAll("form.button_to")).find(f => f.querySelector("button.add-gift"));
    const giftCartUrl = giftForm?.getAttribute("action") ?? "";

    // Check availability (sold out check)
    const isAvailable = item.querySelector(".sold-out") === null &&
      addCartBtn !== null &&
      !addCartBtn.classList.contains("disabled");

    variations.push({
      id,
      name,
      price,
      priceFormatted,
      type,
      isAvailable,
      cartUrl,
      giftCartUrl,
      productId,
      productName,
      productBrand,
      productCategory,
      productVariant,
    });
  });

  return variations;
}

function parseMedia(doc: Document): ShopItemPageMedia {
  const images: ShopItemPageImage[] = [];
  const thumbnails: string[] = [];
  const videos: ShopItemPageVideo[] = [];

  const seenImageUrls = new Set<string>();
  const seenVideoUrls = new Set<string>();

  // Get primary images
  const primaryImageArea = doc.querySelector(".primary-image-area");
  if (primaryImageArea) {
    const wrappers = primaryImageArea.querySelectorAll(".market-item-detail-item-image-wrapper");

    wrappers.forEach(wrapper => {
      // Check for video iframe
      const iframe = wrapper.querySelector("iframe");
      if (iframe) {
        const src = iframe.getAttribute("src") ?? "";
        if (src && !seenVideoUrls.has(src)) {
          seenVideoUrls.add(src);
          videos.push({
            type: src.includes("youtube.com") || src.includes("youtu.be") ? "youtube" : "other",
            embedUrl: src,
          });
        }
        return;
      }

      // Parse image
      const img = wrapper.querySelector("img.market-item-detail-item-image");
      if (img) {
        const thumbnailUrl = img.getAttribute("src") || img.getAttribute("data-lazy") || "";
        const originalUrl = img.getAttribute("data-origin") || thumbnailUrl;
        const alt = img.getAttribute("alt") ?? "";

        if (originalUrl && !seenImageUrls.has(originalUrl)) {
          seenImageUrls.add(originalUrl);
          images.push({
            thumbnailUrl,
            originalUrl,
            alt,
          });
        }
      }
    });
  }

  // Get thumbnail images
  const thumbnailArea = doc.querySelector(".primary-image-thumbnails");
  if (thumbnailArea) {
    const thumbImgs = thumbnailArea.querySelectorAll("img");
    thumbImgs.forEach(img => {
      const src = img.getAttribute("src") ?? "";
      if (src) {
        thumbnails.push(src);
      }
    });
  }

  return { images, thumbnails, videos };
}

function parseDescription(doc: Document): string {
  // Get the main description text
  const descEl = doc.querySelector(".main-info-column .description .autolink");
  return descEl?.textContent?.trim() ?? "";
}

function parseDescriptionSections(doc: Document): ShopItemPageDescriptionSection[] {
  const sections: ShopItemPageDescriptionSection[] = [];

  // Desktop description sections
  const sectionElements = doc.querySelectorAll(".main-info-column .description section.shop__text");

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

function parseSocialLinks(doc: Document): ShopItemPageSocialLink[] {
  const links: ShopItemPageSocialLink[] = [];

  const socialContainer = doc.querySelector(".booth-description .flex.flex-wrap.gap-8");
  if (socialContainer) {
    const anchors = socialContainer.querySelectorAll("a");
    anchors.forEach(a => {
      const href = a.getAttribute("href") ?? "";
      let type: ShopItemPageSocialLink["type"] = "other";
      let label: string | null = null;

      if (href.includes("pixiv.net")) {
        type = "pixiv";
      } else if (href.includes("twitter.com") || href.includes("x.com")) {
        type = "twitter";
        const labelEl = a.querySelector(".typography-14");
        label = labelEl?.textContent?.trim() ?? null;
      } else if (href.includes("/conversations")) {
        type = "contact";
      }

      links.push({ type, url: href, label });
    });
  }

  return links;
}

function parseMoreItemsConfig(doc: Document): ShopItemPageMoreItem | null {
  const moreItemsEl = doc.querySelector(".js-more-items[data-item-id]");
  if (!moreItemsEl) return null;

  return {
    itemId: moreItemsEl.getAttribute("data-item-id") ?? "",
    subdomain: moreItemsEl.getAttribute("data-subdomain") ?? "",
    isAdultUser: moreItemsEl.getAttribute("data-adult-user") === "true",
    isMobile: moreItemsEl.getAttribute("data-is-mobile") === "true",
    productList: moreItemsEl.getAttribute("data-product-list") ?? "",
  };
}

function parseIsPrivate(doc: Document): boolean {
  const privateState = doc.querySelector(".state-private");
  if (!privateState) return false;

  // Check if the element is visible (not display: none)
  const style = privateState.getAttribute("style") ?? "";
  return !style.includes("display: none");
}

function parseTheme(doc: Document): ShopItemPageTheme | null {
  const backgroundColor = parseCSSVariable(doc, "shop-theme-background-color");
  if (!backgroundColor) return null;

  return {
    backgroundColor,
    baseColor: parseCSSVariable(doc, "shop-theme-base-color") ?? "#000000",
    borderColor: parseCSSVariable(doc, "shop-theme-border-color") ?? "#f3f3f3",
    contentsColor: parseCSSVariable(doc, "shop-theme-contents-color") ?? "#ffffff",
    linkColor: parseCSSVariable(doc, "shop-theme-link-color") ?? "#000000",
    priceColor: parseCSSVariable(doc, "shop-theme-price-color") ?? "#bf2932",
    textColor: parseCSSVariable(doc, "shop-theme-text-color") ?? "#5a5a60",
  };
}

// ============ Main Parser ============

export async function parseShopItemPage(htmlString: string): Promise<ShopItemPage> {
  const doc = parseHTMLString(htmlString);

  return {
    meta: parseMeta(doc),
    product: parseProduct(doc),
    priceRange: parsePriceRange(doc),
    shop: parseShop(doc),
    badges: parseBadges(doc),
    variations: parseVariations(doc),
    media: parseMedia(doc),
    description: parseDescription(doc),
    descriptionSections: parseDescriptionSections(doc),
    socialLinks: parseSocialLinks(doc),
    moreItemsConfig: parseMoreItemsConfig(doc),
    isPrivate: parseIsPrivate(doc),
    jsonLd: parseJsonLd(doc),
    theme: parseTheme(doc),
  };
}

export async function fetchAndParseShopItemPage(url: string): Promise<ShopItemPage> {
  const response = await fetch(url);
  const htmlString = await response.text();
  return parseShopItemPage(htmlString);
}

// ============ Utility Exports ============

export {
  getMetaContent,
  parseJsonMetaContent,
  extractIdFromUrl,
  extractSubdomainFromUrl,
  extractBackgroundImageUrl,
  parsePrice,
};
