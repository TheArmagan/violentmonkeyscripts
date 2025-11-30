import { parseHTMLString } from "../../utils/dom";

// ============ Type Definitions ============

// === Meta Information ===
export interface LandingPageMeta {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  locale: string;
  userSignedIn: boolean;
  userAdult: boolean;
  userUuid: string | null;
  csrfToken: string | null;
  gaFrom: string | null;
  baseDomain: string | null;
  wishListsUrl: string | null;
}

// === User Information ===
export interface LandingPageUser {
  signedIn: boolean;
  nickname: string | null;
  thumbnailUrl: string | null;
  hasShop: boolean;
}

// === Search Configuration ===
export interface LandingPageSearch {
  portalDomain: string | null;
  searchUrl: string | null;
  searchHistories: SearchHistory[];
  portalUrl: string | null;
}

export interface SearchHistory {
  query: string;
  adult?: string;
}

// === Recently Viewed Items ===
export interface RecentlyViewedItem {
  id: string;
  thumbnailUrl: string;
  url: string;
}

// === Featured Links (Events/Tags/Categories banners) ===
export interface FeaturedLink {
  label: string;
  url: string;
  backgroundColor: string | null;
  type: "event" | "tag" | "category" | "search";
}

// === Categories ===
export interface Category {
  id: string;
  name: string;
  iconUrl: string;
  url: string;
}

// === Popular Tags ===
export interface PopularTag {
  name: string;
  url: string;
}

// === Item Card (used in multiple sections) ===
export interface LandingPageItem {
  id: string;
  name: string;
  price: number;
  priceText: string;
  url: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  categoryUrl: string;
  event: string | null;
  eventUrl: string | null;
  thumbnails: string[];
  badges: ItemBadge[];
  shop: ItemShop;
  sectionType: string;
}

export interface ItemBadge {
  name: string;
  imageUrl: string;
  url: string;
}

export interface ItemShop {
  name: string;
  url: string;
  avatarUrl: string;
  verified: boolean;
}

// === Hot Items Section (Per Category) ===
export interface HotItemsSection {
  categoryName: string;
  categoryTitle: string;
  showMoreUrl: string;
  items: LandingPageItem[];
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  url: string;
}

// === Filter Options (from search modal) ===
export interface LandingPageFilterOptions {
  categories: FilterOption[];
  subCategories: SubCategoryOption[];
  events: FilterOption[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SubCategoryOption {
  parentCategory: string;
  children: FilterOption[];
}

// === Footer Links ===
export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  label: string;
  url: string;
  external: boolean;
}

// === Main Landing Page Interface ===
export interface LandingPage {
  meta: LandingPageMeta;
  user: LandingPageUser;
  search: LandingPageSearch;
  recentlyViewedItems: RecentlyViewedItem[];
  featuredLinks: FeaturedLink[];
  recommendedItems: LandingPageItem[];
  categories: Category[];
  popularTags: PopularTag[];
  hotItemsSections: HotItemsSection[];
  filterOptions: LandingPageFilterOptions;
  historyUrl: string | null;
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

function extractBackgroundColor(style: string | null): string | null {
  if (!style) return null;
  const match = style.match(/background-color:\s*([^;]+)/);
  return match?.[1]?.trim() ?? null;
}

function parsePrice(priceText: string): number {
  const match = priceText.replace(/,/g, "").match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseLinkType(url: string): "event" | "tag" | "category" | "search" {
  if (url.includes("/events/")) return "event";
  if (url.includes("tags%5B%5D=") || url.includes("tags[]=")) return "tag";
  if (url.includes("/browse/")) return "category";
  return "search";
}

// ============ Parser Functions ============

function parseMeta(doc: Document): LandingPageMeta {
  return {
    title: doc.title ?? "",
    description: getMetaContent(doc, "description") ?? "",
    keywords: (getMetaContent(doc, "keywords") ?? "").split(",").map(k => k.trim()).filter(Boolean),
    canonicalUrl: doc.querySelector("link[rel='canonical']")?.getAttribute("href") ?? "",
    ogImage: getMetaContent(doc, "og:image") ?? "",
    locale: parseJsonMetaContent<string>(doc, "js_const_user_locale") ?? "en",
    userSignedIn: getMetaContent(doc, "js_const_user_signed_in") === "true",
    userAdult: getMetaContent(doc, "js_const_user_adult") === "true",
    userUuid: parseJsonMetaContent<string>(doc, "js_const_user_uuid"),
    csrfToken: getMetaContent(doc, "csrf-token"),
    gaFrom: parseJsonMetaContent<string>(doc, "js_const_ga_from"),
    baseDomain: parseJsonMetaContent<string>(doc, "js_const_base_domain"),
    wishListsUrl: parseJsonMetaContent<string>(doc, "js_const_wish_lists_url"),
  };
}

function parseUser(doc: Document): LandingPageUser {
  const userPulldown = doc.querySelector("#js-user-pulldown");
  const currentUserData = userPulldown?.getAttribute("data-current-user");
  const shopData = userPulldown?.getAttribute("data-shop");

  let userData: { nickname?: string; thumbnail_url?: string } | null = null;
  let hasShop = false;

  if (currentUserData) {
    try {
      userData = JSON.parse(currentUserData);
    } catch { /* ignore */ }
  }

  if (shopData) {
    try {
      const shop = JSON.parse(shopData);
      hasShop = shop && Object.keys(shop).length > 0;
    } catch { /* ignore */ }
  }

  return {
    signedIn: getMetaContent(doc, "js_const_user_signed_in") === "true",
    nickname: userData?.nickname ?? null,
    thumbnailUrl: userData?.thumbnail_url ?? null,
    hasShop,
  };
}

function parseSearch(doc: Document): LandingPageSearch {
  const searchModal = doc.querySelector("#js-detail-search-modal");
  const searchParams = searchModal?.getAttribute("data-search-params");
  const searchHistoriesRaw = searchModal?.getAttribute("data-search-histories");

  let parsedParams: Record<string, string> = {};
  let searchHistories: SearchHistory[] = [];

  if (searchParams) {
    try {
      parsedParams = JSON.parse(searchParams);
    } catch { /* ignore */ }
  }

  if (searchHistoriesRaw) {
    try {
      const raw = JSON.parse(searchHistoriesRaw) as Array<{ q?: string; adult?: string }>;
      searchHistories = raw.map(h => ({
        query: h.q ?? "",
        adult: h.adult,
      }));
    } catch { /* ignore */ }
  }

  return {
    portalDomain: parsedParams.portal_domain ?? null,
    searchUrl: searchModal?.getAttribute("data-search-url") ?? null,
    searchHistories,
    portalUrl: searchModal?.getAttribute("data-portal-url") ?? null,
  };
}

function parseRecentlyViewedItems(doc: Document): RecentlyViewedItem[] {
  const items: RecentlyViewedItem[] = [];
  const itemElements = doc.querySelectorAll(".recent_viewed_items_wrapper .recent_viewed_item_component");

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

function parseFeaturedLinks(doc: Document): FeaturedLink[] {
  const links: FeaturedLink[] = [];
  const linkElements = doc.querySelectorAll(".search-guide-tablet.custom-small-banners");

  linkElements.forEach(el => {
    const labelEl = el.querySelector(".search-guide-tablet-label-inner");
    const url = el.getAttribute("href") ?? "";
    const style = el.getAttribute("style");

    links.push({
      label: labelEl?.textContent?.trim() ?? "",
      url,
      backgroundColor: extractBackgroundColor(style),
      type: parseLinkType(url),
    });
  });

  return links;
}

function parseItemCard(card: Element, sectionType: string): LandingPageItem {
  const id = card.getAttribute("data-product-id") ?? "";
  const name = card.getAttribute("data-product-name") ?? "";
  const priceAttr = card.getAttribute("data-product-price") ?? "0";
  const brand = card.getAttribute("data-product-brand") ?? "";
  const categoryId = card.getAttribute("data-product-category") ?? "";
  const event = card.getAttribute("data-product-event") || null;

  // Parse thumbnails
  const thumbnails: string[] = [];
  const thumbnailImages = card.querySelectorAll(".js-thumbnail-image");
  thumbnailImages.forEach(img => {
    const original = img.getAttribute("data-original");
    if (original) thumbnails.push(original);
  });

  // Parse badges
  const badges: ItemBadge[] = [];
  const badgeElements = card.querySelectorAll(".l-item-card-badge a");
  badgeElements.forEach(badgeEl => {
    const img = badgeEl.querySelector("img");
    badges.push({
      name: img?.getAttribute("alt") ?? "",
      imageUrl: img?.getAttribute("src") ?? "",
      url: badgeEl.getAttribute("href") ?? "",
    });
  });

  // Parse title and URL
  const titleAnchor = card.querySelector(".item-card__title a");
  const itemUrl = titleAnchor?.getAttribute("href") ?? "";
  const fullName = titleAnchor?.textContent?.trim() ?? name;

  // Parse category
  const categoryAnchor = card.querySelector(".item-card__category-anchor");
  const categoryName = categoryAnchor?.textContent?.trim() ?? "";
  const categoryUrl = categoryAnchor?.getAttribute("href") ?? "";

  // Parse event info
  const eventAnchor = card.querySelector(".eventname-flag--inner");
  const eventUrl = eventAnchor?.getAttribute("href") ?? null;

  // Parse shop info
  const shopAnchor = card.querySelector(".item-card__shop-name-anchor");
  const shopAvatar = shopAnchor?.querySelector("img.user-avatar");
  const shopNameEl = shopAnchor?.querySelector(".item-card__shop-name");
  const verifiedIcon = shopAnchor?.querySelector(".icon-verified");

  const shop: ItemShop = {
    name: shopNameEl?.textContent?.trim() ?? shopAvatar?.getAttribute("alt") ?? "",
    url: shopAnchor?.getAttribute("href") ?? "",
    avatarUrl: shopAvatar?.getAttribute("data-original") ?? shopAvatar?.getAttribute("src") ?? "",
    verified: !!verifiedIcon,
  };

  // Parse price text
  const priceEl = card.querySelector(".price");
  const priceText = priceEl?.textContent?.trim() ?? "";

  return {
    id,
    name: fullName,
    price: parseInt(priceAttr, 10),
    priceText,
    url: itemUrl,
    brand,
    categoryId,
    categoryName,
    categoryUrl,
    event,
    eventUrl,
    thumbnails,
    badges,
    shop,
    sectionType,
  };
}

function parseRecommendedItems(doc: Document): LandingPageItem[] {
  const items: LandingPageItem[] = [];

  // Find the recommended items section
  const recommendedSection = doc.querySelector(".market_section-head-title--large");
  let sectionContainer: Element | null = null;

  const sectionHeads = doc.querySelectorAll(".market_section-head-title--large");
  sectionHeads.forEach(head => {
    if (head.textContent?.includes("Recommended Items")) {
      sectionContainer = head.closest(".market_section");
    }
  });

  if (sectionContainer) {
    const itemCards = (sectionContainer as Element).querySelectorAll("li.item-card");
    itemCards.forEach(card => {
      items.push(parseItemCard(card, "recommend_items"));
    });
  }

  return items;
}

function parseCategories(doc: Document): Category[] {
  const categories: Category[] = [];
  const categorySection = doc.querySelector("#categories");

  if (categorySection) {
    const categoryLinks = categorySection.querySelectorAll(".categories-menu");
    categoryLinks.forEach(link => {
      const icon = link.querySelector("img.icon");
      const nameEl = link.querySelector(".name");
      const url = link.getAttribute("href") ?? "";

      // Extract category ID from data-product-list attribute
      const productList = link.getAttribute("data-product-list") ?? "";
      const idMatch = productList.match(/market_browse_(\d+)/);
      const id = idMatch?.[1] ?? "";

      categories.push({
        id,
        name: nameEl?.textContent?.trim() ?? icon?.getAttribute("alt") ?? "",
        iconUrl: icon?.getAttribute("src") ?? "",
        url,
      });
    });
  }

  return categories;
}

function parsePopularTags(doc: Document): PopularTag[] {
  const tags: PopularTag[] = [];

  // Find the popular tags section
  const sectionHeads = doc.querySelectorAll(".market_section-head-title--large");
  let sectionContainer: Element | null = null;

  sectionHeads.forEach(head => {
    if (head.textContent?.includes("Popular Tags")) {
      sectionContainer = head.closest(".market_section");
    }
  });

  if (sectionContainer) {
    const tagLinks = (sectionContainer as Element).querySelectorAll(".categories-list a");
    tagLinks.forEach(link => {
      tags.push({
        name: link.textContent?.trim() ?? "",
        url: link.getAttribute("href") ?? "",
      });
    });
  }

  return tags;
}

function parseHotItemsSections(doc: Document): HotItemsSection[] {
  const sections: HotItemsSection[] = [];
  const hotItemsDivs = doc.querySelectorAll(".hot_items");

  hotItemsDivs.forEach(hotItemsDiv => {
    // Get section title
    const titleEl = hotItemsDiv.querySelector(".market_section-head-title--large");
    const categoryTitle = titleEl?.textContent?.trim() ?? "";

    // Extract category name from title (format: "Categoryの注目商品" or "Category")
    const categoryNameMatch = categoryTitle.match(/^(.+?)(?:の注目商品)?$/);
    const categoryName = categoryNameMatch?.[1] ?? categoryTitle;

    // Get show more URL
    const showMoreLink = hotItemsDiv.querySelector(".more-to-category");
    const showMoreUrl = showMoreLink?.getAttribute("href") ?? "";

    // Parse items
    const items: LandingPageItem[] = [];
    const itemCards = hotItemsDiv.querySelectorAll(".market_section li.item-card");
    itemCards.forEach(card => {
      items.push(parseItemCard(card, "hot_items"));
    });

    // Parse subcategories
    const subcategories: Subcategory[] = [];
    const navSection = hotItemsDiv.querySelector(".nav-section");
    if (navSection) {
      const subcategoryLinks = navSection.querySelectorAll(".categories-list a");
      subcategoryLinks.forEach(link => {
        subcategories.push({
          name: link.textContent?.trim() ?? "",
          url: link.getAttribute("href") ?? "",
        });
      });
    }

    if (items.length > 0 || subcategories.length > 0) {
      sections.push({
        categoryName,
        categoryTitle,
        showMoreUrl,
        items,
        subcategories,
      });
    }
  });

  return sections;
}

function parseFilterOptions(doc: Document): LandingPageFilterOptions {
  const searchModal = doc.querySelector("#js-detail-search-modal");

  // Parse parent categories
  const parentCategoriesRaw = searchModal?.getAttribute("data-parent-category-options");
  let categories: FilterOption[] = [];
  if (parentCategoriesRaw) {
    try {
      categories = JSON.parse(parentCategoriesRaw);
    } catch { /* ignore */ }
  }

  // Parse sub categories
  const subCategoriesRaw = searchModal?.getAttribute("data-sub-category-options");
  let subCategories: SubCategoryOption[] = [];
  if (subCategoriesRaw) {
    try {
      const raw = JSON.parse(subCategoriesRaw) as Array<{ pc: string; children: FilterOption[] }>;
      subCategories = raw.map(sc => ({
        parentCategory: sc.pc,
        children: sc.children,
      }));
    } catch { /* ignore */ }
  }

  // Parse events
  const eventsRaw = searchModal?.getAttribute("data-event-options");
  let events: FilterOption[] = [];
  if (eventsRaw) {
    try {
      events = JSON.parse(eventsRaw);
    } catch { /* ignore */ }
  }

  return {
    categories,
    subCategories,
    events,
  };
}

function parseHistoryUrl(doc: Document): string | null {
  const historyLink = doc.querySelector(".recent_viewed_items_wrapper .show_history");
  return historyLink?.getAttribute("href") ?? null;
}

// ============ Wishlist Counts Fetcher ============

interface WishlistCountsResponse {
  item_ids: number[];
  wishlists_counts: Record<string, number>;
}

export async function fetchWishlistCounts(itemIds: string[]): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};

  try {
    const url = new URL("https://accounts.booth.pm/wish_lists.json");
    itemIds.forEach(id => {
      url.searchParams.append("item_ids[]", id);
    });

    const response = await fetch(url.toString(), {
      credentials: "include",
    });

    if (!response.ok) {
      console.warn("[BoothKit] Failed to fetch wishlist counts:", response.status);
      return {};
    }

    const data: WishlistCountsResponse = await response.json();
    return data.wishlists_counts ?? {};
  } catch (error) {
    console.warn("[BoothKit] Error fetching wishlist counts:", error);
    return {};
  }
}

// ============ Main Parser ============

export function parseLandingPage(htmlString: string): LandingPage {
  const doc = parseHTMLString(htmlString);

  return {
    meta: parseMeta(doc),
    user: parseUser(doc),
    search: parseSearch(doc),
    recentlyViewedItems: parseRecentlyViewedItems(doc),
    featuredLinks: parseFeaturedLinks(doc),
    recommendedItems: parseRecommendedItems(doc),
    categories: parseCategories(doc),
    popularTags: parsePopularTags(doc),
    hotItemsSections: parseHotItemsSections(doc),
    filterOptions: parseFilterOptions(doc),
    historyUrl: parseHistoryUrl(doc),
  };
}

export async function parseLandingPageWithWishlistCounts(htmlString: string): Promise<LandingPage> {
  const page = parseLandingPage(htmlString);

  // Collect all item IDs
  const allItemIds: string[] = [];

  page.recentlyViewedItems.forEach(item => {
    if (item.id) allItemIds.push(item.id);
  });

  page.recommendedItems.forEach(item => {
    if (item.id) allItemIds.push(item.id);
  });

  page.hotItemsSections.forEach(section => {
    section.items.forEach(item => {
      if (item.id) allItemIds.push(item.id);
    });
  });

  // Fetch wishlist counts (optional enhancement)
  // This can be used by the caller if needed
  // const wishlistCounts = await fetchWishlistCounts(allItemIds);

  return page;
}

export async function fetchAndParseLandingPage(url: string = "https://booth.pm/en"): Promise<LandingPage> {
  const response = await fetch(url);
  const htmlString = await response.text();
  return parseLandingPage(htmlString);
}

// ============ Utility Exports ============

export {
  getMetaContent,
  parseJsonMetaContent,
  extractIdFromUrl,
  extractBackgroundImageUrl,
  extractBackgroundColor,
  parsePrice,
  parseLinkType,
};
