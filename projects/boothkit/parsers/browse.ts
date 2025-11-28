import { parseHTMLString } from "../utils/dom";

// ============ Type Definitions ============

export interface BrowsePageMeta {
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
}

export interface BrowsePageSearch {
  category: string | null;
  parentCategory: string | null;
  portalDomain: string | null;
  searchUrl: string | null;
  searchHistories: SearchHistory[];
}

export interface SearchHistory {
  query: string;
  adult?: string;
}

export interface BrowsePageBreadcrumb {
  label: string;
  url: string;
}

export interface BrowsePageCategoryTag {
  label: string;
  imageUrl: string;
  url: string;
}

export interface BrowsePageItem {
  id: string;
  name: string;
  price: number;
  priceText: string;
  url: string;
  brand: string;
  categoryId: string;
  event: string | null;
  thumbnails: string[];
  badges: ItemBadge[];
  shop: ItemShop;
  wishListCount: number;
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
}

export interface BrowsePagePagination {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPageUrl: string | null;
  lastPageUrl: string | null;
  pages: PaginationPage[];
}

export interface PaginationPage {
  page: number | null; // null for gap (...)
  url: string | null;
  isCurrent: boolean;
  isGap: boolean;
}

export interface BrowsePageRecentViewedItem {
  id: string;
  thumbnailUrl: string;
  url: string;
}

export interface BrowsePageCategory {
  name: string;
  count: number;
  url: string;
}

export interface BrowsePageFilterOptions {
  categories: FilterOption[];
  subCategories: SubCategoryOption[];
  events: FilterOption[];
  itemTypes: FilterOption[];
  ageRestrictions: FilterOption[];
}

export interface FilterOption {
  label: string;
  value: string;
}

export interface SubCategoryOption {
  parentCategory: string;
  children: FilterOption[];
}

export interface BrowsePage {
  meta: BrowsePageMeta;
  search: BrowsePageSearch;
  breadcrumbs: BrowsePageBreadcrumb[];
  categoryName: string;
  totalResults: number;
  categoryTags: BrowsePageCategoryTag[];
  items: BrowsePageItem[];
  pagination: BrowsePagePagination;
  recentViewedItems: BrowsePageRecentViewedItem[];
  otherCategories: BrowsePageCategory[];
  filterOptions: BrowsePageFilterOptions;
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

// ============ Parser Functions ============

function parseMeta(doc: Document): BrowsePageMeta {
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
  };
}

function parseSearch(doc: Document): BrowsePageSearch {
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
    category: parsedParams.category ?? null,
    parentCategory: parsedParams.parent_category ?? null,
    portalDomain: parsedParams.portal_domain ?? null,
    searchUrl: searchModal?.getAttribute("data-search-url") ?? null,
    searchHistories,
  };
}

function parseBreadcrumbs(doc: Document): BrowsePageBreadcrumb[] {
  const breadcrumbs: BrowsePageBreadcrumb[] = [];
  const breadcrumbElements = doc.querySelectorAll(".breadcrumbs .breadcrumb a.label");

  breadcrumbElements.forEach(el => {
    breadcrumbs.push({
      label: el.textContent?.trim() ?? "",
      url: el.getAttribute("href") ?? "",
    });
  });

  return breadcrumbs;
}

function parseCategoryTags(doc: Document): BrowsePageCategoryTag[] {
  const tags: BrowsePageCategoryTag[] = [];
  const tagElements = doc.querySelectorAll(".search-guide-tablet");

  tagElements.forEach(el => {
    const imageEl = el.querySelector(".search-guide-tablet-image");
    const labelEl = el.querySelector(".search-guide-tablet-label-inner");

    tags.push({
      label: labelEl?.textContent?.trim() ?? "",
      imageUrl: extractBackgroundImageUrl(imageEl?.getAttribute("style") ?? null),
      url: el.getAttribute("href") ?? "",
    });
  });

  return tags;
}

function parseItems(doc: Document): BrowsePageItem[] {
  const items: BrowsePageItem[] = [];
  const itemCards = doc.querySelectorAll("li.item-card");

  itemCards.forEach(card => {
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

    // Parse shop info
    const shopAnchor = card.querySelector(".item-card__shop-name-anchor");
    const shopAvatar = shopAnchor?.querySelector("img");
    const shopNameEl = shopAnchor?.querySelector(".item-card__shop-name");

    const shop: ItemShop = {
      name: shopNameEl?.textContent?.trim() ?? shopAvatar?.getAttribute("alt") ?? "",
      url: shopAnchor?.getAttribute("href") ?? "",
      avatarUrl: shopAvatar?.getAttribute("src") ?? "",
    };

    // Parse price text
    const priceEl = card.querySelector(".price");
    const priceText = priceEl?.textContent?.trim() ?? "";

    // Parse wish list count
    const wishListButton = card.querySelector(".js-item-card-wish-list-button");
    const wishListCountEl = wishListButton?.querySelector(".typography-14, .typography-12, div[class*='typography']");
    const wishListCount = parseCount(wishListCountEl?.textContent ?? "0");

    items.push({
      id,
      name: fullName,
      price: parseInt(priceAttr, 10),
      priceText,
      url: itemUrl,
      brand,
      categoryId,
      event,
      thumbnails,
      badges,
      shop,
      wishListCount,
    });
  });

  return items;
}

function parsePagination(doc: Document): BrowsePagePagination {
  const pager = doc.querySelector(".pager nav ul");
  const pages: PaginationPage[] = [];
  let currentPage = 1;
  let totalPages = 1;
  let nextPageUrl: string | null = null;
  let lastPageUrl: string | null = null;

  if (pager) {
    const pageItems = pager.querySelectorAll("li");

    pageItems.forEach(item => {
      const anchor = item.querySelector("a");
      const isCurrent = item.classList.contains("current");
      const isGap = item.classList.contains("gap");
      const isNext = anchor?.getAttribute("rel") === "next";
      const isLast = anchor?.classList.contains("last-page");

      if (isGap) {
        pages.push({ page: null, url: null, isCurrent: false, isGap: true });
        return;
      }

      if (isNext) {
        nextPageUrl = anchor?.getAttribute("href") ?? null;
        return;
      }

      if (isLast) {
        lastPageUrl = anchor?.getAttribute("href") ?? null;
        const lastPageMatch = lastPageUrl?.match(/page=(\d+)/);
        if (lastPageMatch) {
          totalPages = parseInt(lastPageMatch[1], 10);
        }
        return;
      }

      const pageText = anchor?.textContent?.trim() ?? item.textContent?.trim() ?? "";
      const pageNum = parseInt(pageText, 10);

      if (!isNaN(pageNum)) {
        if (isCurrent) currentPage = pageNum;
        pages.push({
          page: pageNum,
          url: anchor?.getAttribute("href") ?? null,
          isCurrent,
          isGap: false,
        });
      }
    });
  }

  return {
    currentPage,
    totalPages,
    hasNextPage: nextPageUrl !== null,
    hasPrevPage: currentPage > 1,
    nextPageUrl,
    lastPageUrl,
    pages,
  };
}

function parseRecentViewedItems(doc: Document): BrowsePageRecentViewedItem[] {
  const items: BrowsePageRecentViewedItem[] = [];
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

function parseOtherCategories(doc: Document): BrowsePageCategory[] {
  const categories: BrowsePageCategory[] = [];
  const categoryContainer = doc.querySelector(".categories nav");

  if (categoryContainer) {
    const categoryElements = categoryContainer.querySelectorAll("a.nav-reverse, span.nav-reverse");

    categoryElements.forEach(el => {
      const text = el.textContent?.trim() ?? "";
      const match = text.match(/^(.+)\((\d+)\)$/);

      if (match) {
        categories.push({
          name: match[1].trim(),
          count: parseInt(match[2], 10),
          url: el.getAttribute("href") ?? "",
        });
      }
    });
  }

  return categories;
}

function parseFilterOptions(doc: Document): BrowsePageFilterOptions {
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

  // Item types (static)
  const itemTypes: FilterOption[] = [
    { label: "All", value: "default" },
    { label: "Digital", value: "digital" },
    { label: "Physical", value: "physical" },
    { label: "Physical (direct)", value: "direct" },
    { label: "Physical (via warehouse)", value: "via_warehouse" },
    { label: "Physical (pixivFACTORY)", value: "factory_item" },
  ];

  // Age restrictions (static)
  const ageRestrictions: FilterOption[] = [
    { label: "All-Age", value: "default" },
    { label: "Adult Only", value: "only" },
    { label: "All", value: "include" },
  ];

  return {
    categories,
    subCategories,
    events,
    itemTypes,
    ageRestrictions,
  };
}

function parseTotalResults(doc: Document): number {
  const resultsText = doc.querySelector(".flex.items-center.u-pb-300 b")?.textContent ?? "";
  return parseCount(resultsText);
}

function parseCategoryName(doc: Document): string {
  const h1 = doc.querySelector("h1 .text-text-default");
  return h1?.textContent?.trim() ?? "";
}

// ============ Wishlist Counts Fetcher ============

interface WishlistCountsResponse {
  item_ids: number[];
  wishlists_counts: Record<string, number>;
}

async function fetchWishlistCounts(itemIds: string[]): Promise<Record<string, number>> {
  if (itemIds.length === 0) return {};

  try {
    // Build URL with item_ids[] params
    const url = new URL("https://accounts.booth.pm/wish_lists.json");
    itemIds.forEach(id => {
      url.searchParams.append("item_ids[]", id);
    });

    const response = await fetch(url.toString(), {
      credentials: "include", // Include cookies for auth
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

export async function parseBrowsePage(htmlString: string): Promise<BrowsePage> {
  const doc = parseHTMLString(htmlString);

  // Parse items first
  const items = parseItems(doc);

  // Fetch wishlist counts for all items
  const itemIds = items.map(item => item.id).filter(Boolean);
  const wishlistCounts = await fetchWishlistCounts(itemIds);

  // Update items with wishlist counts
  items.forEach(item => {
    if (wishlistCounts[item.id] !== undefined) {
      item.wishListCount = wishlistCounts[item.id];
    }
  });

  return {
    meta: parseMeta(doc),
    search: parseSearch(doc),
    breadcrumbs: parseBreadcrumbs(doc),
    categoryName: parseCategoryName(doc),
    totalResults: parseTotalResults(doc),
    categoryTags: parseCategoryTags(doc),
    items,
    pagination: parsePagination(doc),
    recentViewedItems: parseRecentViewedItems(doc),
    otherCategories: parseOtherCategories(doc),
    filterOptions: parseFilterOptions(doc),
  };
}

export async function fetchAndParseBrowsePage(url: string): Promise<BrowsePage> {
  const response = await fetch(url);
  const htmlString = await response.text();
  return parseBrowsePage(htmlString);
}

// ============ Utility Exports ============

export {
  getMetaContent,
  parseJsonMetaContent,
  extractIdFromUrl,
  extractBackgroundImageUrl,
  parsePrice,
  parseCount,
};