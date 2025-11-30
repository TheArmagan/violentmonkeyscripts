import { parseHTMLString } from "../../utils/dom";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Shop landing page metadata from HTML meta tags
 */
export interface ShopLandingPageMeta {
  /** Page title (shop name + BOOTH) */
  title: string;
  /** Page meta description */
  description: string | null;
  /** Open Graph image URL */
  ogImage: string | null;
  /** Theme color for browser UI */
  themeColor: string | null;
  /** Canonical URL of the shop */
  canonicalUrl: string | null;
  /** Twitter card type */
  twitterCard: string | null;
  /** Locale of the page (e.g., "en", "ja") */
  locale: string | null;
}

/**
 * Shop theme CSS variables for custom styling
 */
export interface ShopTheme {
  /** Main background color (e.g., "#4A4A4A" or "#FAFAFA") */
  backgroundColor: string | null;
  /** Base/accent color for text on backgrounds */
  baseColor: string | null;
  /** Border color for UI elements */
  borderColor: string | null;
  /** Content/card background color */
  contentsColor: string | null;
  /** Link/interactive element color */
  linkColor: string | null;
  /** Price display color */
  priceColor: string | null;
  /** Main text color */
  textColor: string | null;
  /** Background image URL (if set) */
  backgroundImage: string | null;
  /** Background attachment (scroll, fixed) */
  backgroundAttachment: string | null;
  /** Background position X */
  backgroundPositionX: string | null;
  /** Background position Y */
  backgroundPositionY: string | null;
  /** Background repeat mode */
  backgroundRepeat: string | null;
}

/**
 * Shop profile/owner information
 */
export interface ShopInfo {
  /** Shop display name (e.g., "BECKENZI", "STUDIO JINGO") */
  name: string;
  /** Shop subdomain identifier (e.g., "beckenzi", "jingo1016") */
  subdomain: string;
  /** Shop owner's display nickname */
  nickname: string | null;
  /** Shop avatar/icon URL */
  avatarUrl: string | null;
  /** Shop header image URL (if present) */
  headerImageUrl: string | null;
  /** Shop description/bio text */
  description: string | null;
  /** Whether the shop is verified */
  isVerified: boolean;
  /** Shop URL */
  url: string;
  /** Follow action path */
  followPath: string | null;
}

/**
 * Social link associated with the shop
 */
export interface ShopSocialLink {
  /** Platform/service name (e.g., "pixiv", "twitter", "email") */
  platform: string;
  /** Link URL */
  url: string;
  /** Optional display title */
  title: string | null;
}

/**
 * Category navigation tab/slider item
 */
export interface ShopItemList {
  /** Item list display label */
  label: string;
  /** Item list URL */
  url: string;
}

/**
 * Category information for items
 */
export interface ShopItemCategory {
  /** Category name in English */
  nameEn: string;
  /** Category name in Japanese */
  nameJa: string;
  /** Category URL */
  url: string;
}

/**
 * Shop information embedded in item data
 */
export interface ShopItemShopInfo {
  /** Shop thumbnail URL */
  thumbnailUrl: string;
  /** Shop name */
  name: string;
  /** Shop URL */
  url: string;
  /** Whether shop is verified */
  verified: boolean;
}

/**
 * Tracking data for analytics
 */
export interface ShopItemTrackingData {
  /** Product ID */
  productId: number;
  /** Product name (truncated for tracking) */
  productName: string;
  /** Product price (numeric) */
  productPrice: number;
  /** Shop brand/subdomain */
  productBrand: string;
  /** Category ID */
  productCategory: number;
  /** Event association (if any) */
  productEvent: string | null;
  /** Tracking type */
  tracking: string;
}

/**
 * Badge/tag displayed on an item (e.g., VRChat, event badges)
 */
export interface ShopItemBadge {
  /** Badge display name (e.g., "VRChat") */
  name: string;
  /** Badge image URL */
  imageUrl: string;
  /** Badge link URL */
  url: string;
}

/**
 * Item displayed on the shop landing page
 */
export interface ShopLandingItem {
  /** Item ID (numeric) */
  id: number;
  /** Item display name */
  name: string;
  /** Formatted price string (e.g., "1,500 JPY~", "650 JPY") */
  priceText: string;
  /** Numeric price value (minimum price if range) */
  price: number;
  /** Whether price is a range (has "~") */
  isPriceRange: boolean;
  /** Item detail URL */
  url: string;
  /** Shop-specific item URL */
  shopItemUrl: string;
  /** Wishlist action URL */
  wishListUrl: string;
  /** Primary thumbnail URL */
  thumbnailUrl: string;
  /** All thumbnail image URLs */
  thumbnailUrls: string[];
  /** Item category */
  category: ShopItemCategory;
  /** Shop information */
  shop: ShopItemShopInfo;
  /** Whether item is for adults only */
  isAdult: boolean;
  /** Whether item has ended sales */
  isEndOfSale: boolean;
  /** Whether item is sold out */
  isSoldOut: boolean;
  /** Whether item is a placeholder */
  isPlaceholder: boolean;
  /** Whether item is VRChat compatible */
  isVRChat: boolean;
  /** Minimum stock level (if tracked) */
  minimumStock: number | null;
  /** Event association */
  event: string | null;
  /** Music data (if applicable) */
  music: unknown | null;
  /** Analytics tracking data */
  trackingData: ShopItemTrackingData;
  /** Wishlist count for this item */
  wishlistCount: number;
  /** Badges/tags displayed on the item (e.g., VRChat, event badges) */
  badges: ShopItemBadge[];
}

/**
 * Pagination information for shop items
 */
export interface ShopPagination {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** URL for next page (null if on last page) */
  nextPageUrl: string | null;
  /** URL for previous page (null if on first page) */
  prevPageUrl: string | null;
  /** URL for last page */
  lastPageUrl: string | null;
  /** All available page numbers and their URLs */
  pages: { page: number; url: string; isCurrent: boolean }[];
}

/**
 * User session information from JS const meta tags
 */
export interface ShopUserSession {
  /** Whether user is signed in */
  isSignedIn: boolean;
  /** User's locale preference */
  locale: string | null;
  /** Current user's nickname */
  nickname: string | null;
  /** Current user's thumbnail URL */
  thumbnailUrl: string | null;
}

/**
 * Complete parsed shop landing page data
 */
export interface ShopLandingPage {
  /** Page type identifier */
  pageType: "shop-landing";
  /** Page metadata */
  meta: ShopLandingPageMeta;
  /** Shop theme/styling */
  theme: ShopTheme;
  /** Shop profile information */
  shop: ShopInfo;
  /** Shop social links */
  socialLinks: ShopSocialLink[];
  /** Category/item list navigation tabs */
  itemLists: ShopItemList[];
  /** Items displayed on the page */
  items: ShopLandingItem[];
  /** Pagination information */
  pagination: ShopPagination | null;
  /** User session data */
  userSession: ShopUserSession;
  /** Raw page source (if needed) */
  _rawSource?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get content of a meta tag by name or property
 */
function getMetaContent(doc: Document, nameOrProperty: string): string | null {
  const meta =
    doc.querySelector(`meta[name="${nameOrProperty}"]`) ||
    doc.querySelector(`meta[property="${nameOrProperty}"]`);
  return meta?.getAttribute("content") || null;
}

/**
 * Get content from a custom meta tag by name attribute
 */
function getJsConstMetaContent(doc: Document, name: string): string | null {
  const meta = doc.querySelector(`meta[name="${name}"]`);
  return meta?.getAttribute("content") || null;
}

/**
 * Extract subdomain from URL
 * @example "https://beckenzi.booth.pm/" -> "beckenzi"
 */
function extractSubdomainFromUrl(url: string): string {
  const match = url.match(/https?:\/\/([^.]+)\.booth\.pm/);
  return match ? match[1] : "";
}

/**
 * Extract numeric price from price text
 * @example "1,500 JPY~" -> 1500
 * @example "650 JPY" -> 650
 */
function parsePrice(priceText: string): number {
  const match = priceText.match(/[\d,]+/);
  if (!match) return 0;
  return parseInt(match[0].replace(/,/g, ""), 10);
}

/**
 * Extract CSS variable value from style element
 */
function extractCssVariable(
  styleContent: string,
  variableName: string
): string | null {
  // Match patterns like: --shop-theme-background-color: #4A4A4A;
  const regex = new RegExp(`${variableName}:\\s*([^;]+);`, "i");
  const match = styleContent.match(regex);
  return match ? match[1].trim() : null;
}

/**
 * Extract background image URL from CSS variable value
 * @example "url(https://example.com/image.jpg)" -> "https://example.com/image.jpg"
 */
function extractUrlFromCss(value: string | null): string | null {
  if (!value || value === "none") return null;
  const match = value.match(/url\(["']?([^"')]+)["']?\)/);
  return match ? match[1] : null;
}

/**
 * Extract avatar URL from inline style
 * @example "background-image: url(https://...)" -> "https://..."
 */
function extractBackgroundImageUrl(style: string): string | null {
  const match = style.match(/url\(([^)]+)\)/);
  return match ? match[1] : null;
}

/**
 * Detect platform from URL for social links
 */
function detectPlatform(url: string): string {
  if (url.includes("pixiv.net")) return "pixiv";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("/conversations")) return "email";
  if (url.includes("youtube.com")) return "youtube";
  if (url.includes("discord")) return "discord";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("twitch.tv")) return "twitch";
  return "website";
}

// ============================================================================
// PARSER FUNCTIONS
// ============================================================================

/**
 * Parse page metadata from meta tags
 */
function parseMeta(doc: Document): ShopLandingPageMeta {
  return {
    title: doc.title || "",
    description: getMetaContent(doc, "description"),
    ogImage: getMetaContent(doc, "og:image"),
    themeColor: getMetaContent(doc, "theme-color"),
    canonicalUrl:
      doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || null,
    twitterCard: getMetaContent(doc, "twitter:card"),
    locale: doc.body?.getAttribute("data-locale") || null,
  };
}

/**
 * Parse shop theme from CSS variables in style elements
 */
function parseTheme(doc: Document): ShopTheme {
  // Find the style block containing shop theme variables
  const styleElements = doc.querySelectorAll("style");
  let styleContent = "";

  for (const style of styleElements) {
    const content = style.textContent || "";
    if (content.includes("--shop-theme-background-color")) {
      // Get the non-disabled theme (first occurrence before .disable-shop-theme)
      const disableIndex = content.indexOf(".disable-shop-theme");
      if (disableIndex > 0) {
        styleContent = content.substring(0, disableIndex);
      } else {
        styleContent = content;
      }
      break;
    }
  }

  const backgroundImage = extractCssVariable(
    styleContent,
    "--shop-theme-background-image"
  );

  return {
    backgroundColor: extractCssVariable(
      styleContent,
      "--shop-theme-background-color"
    ),
    baseColor: extractCssVariable(styleContent, "--shop-theme-base-color"),
    borderColor: extractCssVariable(styleContent, "--shop-theme-border-color"),
    contentsColor: extractCssVariable(
      styleContent,
      "--shop-theme-contents-color"
    ),
    linkColor: extractCssVariable(styleContent, "--shop-theme-link-color"),
    priceColor: extractCssVariable(styleContent, "--shop-theme-price-color"),
    textColor: extractCssVariable(styleContent, "--shop-theme-text-color"),
    backgroundImage: extractUrlFromCss(backgroundImage),
    backgroundAttachment: extractCssVariable(
      styleContent,
      "--shop-theme-background-attachment"
    ),
    backgroundPositionX: extractCssVariable(
      styleContent,
      "--shop-theme-background-position-x"
    ),
    backgroundPositionY: extractCssVariable(
      styleContent,
      "--shop-theme-background-position-y"
    ),
    backgroundRepeat: extractCssVariable(
      styleContent,
      "--shop-theme-background-repeat"
    ),
  };
}

/**
 * Parse shop profile information
 */
function parseShopInfo(doc: Document): ShopInfo {
  // Get shop name from title or header
  const shopNameEl = doc.querySelector(".shop-name-label, .booth-title a");
  const shopName =
    shopNameEl?.textContent?.trim() ||
    doc.querySelector("h1.booth-title")?.textContent?.trim() ||
    "";

  // Get header image if present
  const headerImg = doc.querySelector(".header-image") as HTMLImageElement;
  const headerImageUrl = headerImg?.src || headerImg?.getAttribute("src") || null;

  // Get avatar
  const avatarEl = doc.querySelector(
    ".shop-global-nav__avatar-image-container .avatar-image"
  ) as HTMLElement;
  const avatarStyle = avatarEl?.getAttribute("style") || "";
  const avatarUrl = extractBackgroundImageUrl(avatarStyle);

  // Get nickname
  const nicknameEl = doc.querySelector(".home-link-container__nickname a");
  const nickname = nicknameEl?.textContent?.trim() || null;

  // Get description
  const descriptionEl = doc.querySelector(".booth-description .autolink");
  const description = descriptionEl?.textContent?.trim() || null;

  // Get follow path
  const followEl = doc.querySelector(".js-shop-follow");
  const followPath = followEl?.getAttribute("data-follow-path") || null;
  const subdomain = followEl?.getAttribute("data-subdomain") || "";

  // Check if verified
  const isVerified = !!doc.querySelector(".icon-verified");

  // Construct shop URL
  const url = subdomain ? `https://${subdomain}.booth.pm/` : "";

  return {
    name: shopName,
    subdomain,
    nickname,
    avatarUrl,
    headerImageUrl,
    description,
    isVerified,
    url,
    followPath,
  };
}

/**
 * Parse social links from shop description
 */
function parseSocialLinks(doc: Document): ShopSocialLink[] {
  const links: ShopSocialLink[] = [];
  const socialLinkEls = doc.querySelectorAll(
    ".booth-description .flex.flex-wrap a"
  );

  for (const el of socialLinkEls) {
    const href = el.getAttribute("href");
    if (!href) continue;

    const title = el.getAttribute("title") || null;
    const platform = detectPlatform(href);

    links.push({
      platform,
      url: href,
      title,
    });
  }

  return links;
}

/**
 * Parse item list navigation tabs
 */
function parseItemLists(doc: Document): ShopItemList[] {
  const lists: ShopItemList[] = [];
  const tabEls = doc.querySelectorAll(
    ".item-list-slider-inner a.custom-small-banners"
  );

  for (const el of tabEls) {
    const href = el.getAttribute("href") || "";
    const labelEl = el.querySelector(".item-list-tablet-label-inner");
    const label = labelEl?.textContent?.trim() || "";

    if (label && href) {
      lists.push({
        label,
        url: href,
      });
    }
  }

  return lists;
}

/**
 * Parse a single item from JSON data attribute
 */
function parseItemFromJson(jsonData: string): ShopLandingItem | null {
  try {
    const data = JSON.parse(jsonData);

    const priceText = data.price || "0 JPY";
    const price = parsePrice(priceText);
    const isPriceRange = priceText.includes("~");

    return {
      id: data.id,
      name: data.name || "",
      priceText,
      price,
      isPriceRange,
      url: data.url || "",
      shopItemUrl: data.shop_item_url || "",
      wishListUrl: data.wish_list_url || "",
      thumbnailUrl: data.thumbnail_image_urls?.[0] || "",
      thumbnailUrls: data.thumbnail_image_urls || [],
      category: {
        nameEn: data.category?.name?.en || "",
        nameJa: data.category?.name?.ja || "",
        url: data.category?.url || "",
      },
      shop: {
        thumbnailUrl: data.shop?.thumbnail_url || "",
        name: data.shop?.name || "",
        url: data.shop?.url || "",
        verified: data.shop?.verified || false,
      },
      isAdult: data.is_adult || false,
      isEndOfSale: data.is_end_of_sale || false,
      isSoldOut: data.is_sold_out || false,
      isPlaceholder: data.is_placeholder || false,
      isVRChat: data.is_vrchat || false,
      minimumStock: data.minimum_stock,
      event: data.event,
      music: data.music,
      trackingData: {
        productId: data.tracking_data?.product_id || data.id,
        productName: data.tracking_data?.product_name || data.name || "",
        productPrice: data.tracking_data?.product_price || price,
        productBrand: data.tracking_data?.product_brand || "",
        productCategory: data.tracking_data?.product_category || 0,
        productEvent: data.tracking_data?.product_event || null,
        tracking: data.tracking_data?.tracking || "",
      },
      wishlistCount: 0, // Will be populated by fetchWishlistCounts
      badges: [], // Will be populated by parseItems from HTML
    };
  } catch {
    return null;
  }
}

/**
 * Parse all items from the page
 */
function parseItems(doc: Document): ShopLandingItem[] {
  const items: ShopLandingItem[] = [];
  const itemEls = doc.querySelectorAll(".js-mount-point-shop-item-card");

  for (const el of itemEls) {
    const dataItem = el.getAttribute("data-item");
    if (!dataItem) continue;

    const item = parseItemFromJson(dataItem);
    if (item) {
      // Parse badges from HTML (they're not in the JSON data)
      const badges: ShopItemBadge[] = [];
      const badgeEls = el.querySelectorAll(".item-head a[href*='tags'], .item-head a img[alt]");

      // Try to find badge links with images
      const badgeLinkEls = el.querySelectorAll(".item-head a[href*='tags']");
      for (const badgeLink of badgeLinkEls) {
        const img = badgeLink.querySelector("img");
        if (img) {
          badges.push({
            name: img.getAttribute("alt") || "",
            imageUrl: img.getAttribute("src") || "",
            url: badgeLink.getAttribute("href") || "",
          });
        }
      }

      // Also check for badge images in the flex container
      if (badges.length === 0) {
        const flexBadgeContainer = el.querySelector(".item-head .flex.flex-wrap");
        if (flexBadgeContainer) {
          const linkEls = flexBadgeContainer.querySelectorAll("a");
          for (const linkEl of linkEls) {
            const img = linkEl.querySelector("img");
            if (img) {
              badges.push({
                name: img.getAttribute("alt") || "",
                imageUrl: img.getAttribute("src") || "",
                url: linkEl.getAttribute("href") || "",
              });
            }
          }
        }
      }

      item.badges = badges;

      // Update isVRChat based on badges if not already set
      if (!item.isVRChat && badges.some(b => b.name.toLowerCase().includes("vrchat"))) {
        item.isVRChat = true;
      }

      items.push(item);
    }
  }

  return items;
}

/**
 * Parse pagination information
 */
function parsePagination(doc: Document): ShopPagination | null {
  const pagerEl = doc.querySelector(".shop-pager nav ul");
  if (!pagerEl) return null;

  const pageItems = pagerEl.querySelectorAll("li");
  if (pageItems.length === 0) return null;

  const pages: { page: number; url: string; isCurrent: boolean }[] = [];
  let currentPage = 1;
  let lastPageUrl: string | null = null;
  let nextPageUrl: string | null = null;
  let prevPageUrl: string | null = null;

  for (const li of pageItems) {
    const linkEl = li.querySelector("a.nav-item");
    const href = linkEl?.getAttribute("href") || "";

    // Skip gap items
    if (li.classList.contains("gap")) continue;

    // Check if current page
    if (li.classList.contains("current")) {
      const pageNum = parseInt(linkEl?.textContent?.trim() || "1", 10);
      currentPage = pageNum;
      pages.push({ page: pageNum, url: href, isCurrent: true });
      continue;
    }

    // Check for navigation arrows
    if (linkEl?.getAttribute("rel") === "next") {
      nextPageUrl = href;
      continue;
    }

    if (linkEl?.classList.contains("last-page")) {
      lastPageUrl = href;
      continue;
    }

    // Check for prev (arrow left)
    if (linkEl?.querySelector(".icon-arrow-open-left")) {
      prevPageUrl = href;
      continue;
    }

    // Regular page number
    const pageText = linkEl?.textContent?.trim();
    const pageNum = parseInt(pageText || "0", 10);
    if (pageNum > 0) {
      pages.push({ page: pageNum, url: href, isCurrent: false });
    }
  }

  // Calculate total pages from last page URL or highest page number
  let totalPages = currentPage;
  if (lastPageUrl) {
    const lastPageMatch = lastPageUrl.match(/page=(\d+)/);
    if (lastPageMatch) {
      totalPages = parseInt(lastPageMatch[1], 10);
    }
  } else if (pages.length > 0) {
    totalPages = Math.max(...pages.map((p) => p.page));
  }

  return {
    currentPage,
    totalPages,
    nextPageUrl,
    prevPageUrl,
    lastPageUrl,
    pages,
  };
}

// ============================================================================
// WISHLIST COUNTS FETCHER
// ============================================================================

interface WishlistCountsResponse {
  item_ids: number[];
  wishlists_counts: Record<string, number>;
}

/**
 * Fetch wishlist counts for items from the BOOTH API
 * @param itemIds - Array of item IDs to fetch counts for
 * @returns Record mapping item ID to wishlist count
 */
async function fetchWishlistCounts(
  itemIds: number[]
): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};

  try {
    // Build URL with item_ids[] params
    const url = new URL("https://accounts.booth.pm/wish_lists.json");
    itemIds.forEach((id) => {
      url.searchParams.append("item_ids[]", id.toString());
    });

    const response = await fetch(url.toString(), {
      credentials: "include", // Include cookies for auth
    });

    if (!response.ok) {
      console.warn(
        "[BoothKit] Failed to fetch wishlist counts:",
        response.status
      );
      return {};
    }

    const data: WishlistCountsResponse = await response.json();
    return data.wishlists_counts ?? {};
  } catch (error) {
    console.warn("[BoothKit] Error fetching wishlist counts:", error);
    return {};
  }
}

/**
 * Parse user session information from JS const meta tags
 */
function parseUserSession(doc: Document): ShopUserSession {
  const signedInStr = getJsConstMetaContent(doc, "js_const_user_signed_in");
  const isSignedIn = signedInStr === "true";

  const locale = getJsConstMetaContent(doc, "js_const_user_locale");

  // Get current user data from navigation element
  const navEl = doc.querySelector("#js-navigation");
  const nickname = navEl?.getAttribute("data-user-name") || null;
  const thumbnailUrl = navEl?.getAttribute("data-user-thumbnail-url") || null;

  return {
    isSignedIn,
    locale,
    nickname,
    thumbnailUrl,
  };
}

// ============================================================================
// MAIN PARSER EXPORT
// ============================================================================

/**
 * Parse a shop landing page HTML string into structured data
 *
 * @param htmlString - Raw HTML string of the shop landing page
 * @param includeRawSource - Whether to include raw HTML in output
 * @returns Parsed shop landing page data
 *
 * @example
 * ```typescript
 * const response = await fetch("https://beckenzi.booth.pm/");
 * const html = await response.text();
 * const data = await parseShopLandingPage(html);
 *
 * console.log(data.shop.name); // "BECKENZI"
 * console.log(data.items.length); // Number of items on page
 * console.log(data.theme.backgroundColor); // "#4A4A4A"
 * ```
 */
export async function parseShopLandingPage(
  htmlString: string,
  includeRawSource = false
): Promise<ShopLandingPage> {
  const doc = parseHTMLString(htmlString);

  // Parse items first
  const items = parseItems(doc);

  // Fetch wishlist counts for all items
  const itemIds = items.map((item) => item.id).filter(Boolean);
  const wishlistCounts = await fetchWishlistCounts(itemIds);

  // Update items with wishlist counts
  items.forEach((item) => {
    const count = wishlistCounts[item.id.toString()];
    if (count !== undefined) {
      item.wishlistCount = count;
    }
  });

  const result: ShopLandingPage = {
    pageType: "shop-landing",
    meta: parseMeta(doc),
    theme: parseTheme(doc),
    shop: parseShopInfo(doc),
    socialLinks: parseSocialLinks(doc),
    itemLists: parseItemLists(doc),
    items,
    pagination: parsePagination(doc),
    userSession: parseUserSession(doc),
  };

  if (includeRawSource) {
    result._rawSource = htmlString;
  }

  return result;
}

/**
 * Check if a URL is a shop landing page
 *
 * @param url - URL to check
 * @returns True if URL is a shop landing page (subdomain.booth.pm root or /items)
 *
 * @example
 * ```typescript
 * isShopLandingPage("https://beckenzi.booth.pm/"); // true
 * isShopLandingPage("https://beckenzi.booth.pm/items"); // true
 * isShopLandingPage("https://beckenzi.booth.pm/items?page=2"); // true
 * isShopLandingPage("https://booth.pm/"); // false (main landing)
 * isShopLandingPage("https://beckenzi.booth.pm/items/12345"); // false (item page)
 * ```
 */
export function isShopLandingPage(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Must be a subdomain of booth.pm (not booth.pm itself)
    if (!hostname.endsWith(".booth.pm") || hostname === "booth.pm") {
      return false;
    }

    // Root path or /items path (with optional query params)
    const pathname = urlObj.pathname;
    return (
      pathname === "/" ||
      pathname === "" ||
      pathname === "/items" ||
      pathname === "/items/"
    );
  } catch {
    return false;
  }
}

/**
 * Extract shop subdomain from URL
 *
 * @param url - Shop URL
 * @returns Subdomain or null if not a valid shop URL
 *
 * @example
 * ```typescript
 * getShopSubdomain("https://beckenzi.booth.pm/items"); // "beckenzi"
 * getShopSubdomain("https://booth.pm/"); // null
 * ```
 */
export function getShopSubdomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    if (!hostname.endsWith(".booth.pm") || hostname === "booth.pm") {
      return null;
    }

    const subdomain = hostname.replace(".booth.pm", "");
    return subdomain || null;
  } catch {
    return null;
  }
}
