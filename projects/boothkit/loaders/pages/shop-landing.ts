import {
  parseShopLandingPage,
  isShopLandingPage,
  getShopSubdomain,
  type ShopLandingPage,
} from "../../parsers/booth/shop-landing";

/**
 * Check if the current URL is a shop landing page
 *
 * Shop landing pages are:
 * - https://subdomain.booth.pm/
 * - https://subdomain.booth.pm/items
 * - https://subdomain.booth.pm/items?page=N
 *
 * NOT shop landing pages:
 * - https://booth.pm/ (main landing page)
 * - https://subdomain.booth.pm/items/12345 (item detail page)
 * - https://manage.booth.pm/ (management pages)
 * - https://accounts.booth.pm/ (account pages)
 */
function isThisPage(href: string): boolean {
  try {
    const url = new URL(href);
    const hostname = url.hostname;

    // Exclude special subdomains
    const excludedSubdomains = ["manage", "accounts", "asset", "www"];
    const subdomain = hostname.split(".")[0];
    if (excludedSubdomains.includes(subdomain)) {
      return false;
    }

    // Must be a subdomain of booth.pm
    if (!hostname.endsWith(".booth.pm") || hostname === "booth.pm") {
      return false;
    }

    const pathname = url.pathname;

    // Root path or /items path (with optional trailing slash)
    // But NOT /items/{id} (item detail page)
    if (pathname === "/" || pathname === "") {
      return true;
    }

    // Check for /items but not /items/{id}
    if (pathname === "/items" || pathname === "/items/") {
      return true;
    }

    // Check for /items?page=N pattern
    if (pathname.startsWith("/items") && !pathname.match(/\/items\/\d+/)) {
      // Make sure it's not /items/{something}
      const pathParts = pathname.split("/").filter((p) => p !== "");
      return pathParts.length === 1 && pathParts[0] === "items";
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Prepare the page for parsing (no-op for shop landing)
 */
function preparePage(_href: string): boolean {
  return false;
}

/**
 * Parse HTML string into shop landing page data
 */
async function parsePage(html: string): Promise<ShopLandingPage> {
  return parseShopLandingPage(html);
}

/**
 * Fetch a shop landing page URL and parse it
 */
async function fetchAndParse(url: string): Promise<ShopLandingPage> {
  const targetUrl = new URL(url);
  const response = await fetch(targetUrl.toString());
  const html = await response.text();
  return parseShopLandingPage(html);
}

/**
 * Fetch a specific page of items from a shop
 */
async function fetchPage(
  shopSubdomain: string,
  page: number = 1
): Promise<ShopLandingPage> {
  const url =
    page === 1
      ? `https://${shopSubdomain}.booth.pm/items`
      : `https://${shopSubdomain}.booth.pm/items?page=${page}`;
  return fetchAndParse(url);
}

/**
 * Fetch all pages of items from a shop
 */
async function fetchAllPages(
  shopSubdomain: string,
  maxPages: number = 100
): Promise<ShopLandingPage[]> {
  const results: ShopLandingPage[] = [];
  let currentPage = 1;

  while (currentPage <= maxPages) {
    const page = await fetchPage(shopSubdomain, currentPage);
    results.push(page);

    // Check if there are more pages
    if (!page.pagination?.nextPageUrl) {
      break;
    }

    currentPage++;
  }

  return results;
}

/**
 * Load and parse the current shop landing page
 */
async function load(): Promise<{
  pageType: "shop-landing";
  parsedPage: ShopLandingPage;
  subdomain: string | null;
}> {
  console.log("Boothkit shop-landing loader loaded.");

  const parsedPage = await parseShopLandingPage(document.documentElement.outerHTML);
  const subdomain = getShopSubdomain(window.location.href);

  return {
    pageType: "shop-landing",
    parsedPage,
    subdomain,
  };
}

/**
 * Shop landing page loader
 *
 * @example
 * ```typescript
 * import { shopLandingLoader } from "./loaders/pages/shop-landing";
 *
 * // Check if current page is a shop landing
 * if (shopLandingLoader.isThisPage(window.location.href)) {
 *   const { parsedPage, subdomain } = await shopLandingLoader.load();
 *   console.log(`Shop: ${parsedPage.shop.name}`);
 *   console.log(`Items: ${parsedPage.items.length}`);
 * }
 *
 * // Fetch a specific shop
 * const beckenzi = await shopLandingLoader.fetchPage("beckenzi", 1);
 *
 * // Fetch all pages from a shop
 * const allPages = await shopLandingLoader.fetchAllPages("beckenzi");
 * const allItems = allPages.flatMap(p => p.items);
 * ```
 */
export const shopLandingLoader = {
  isThisPage,
  preparePage,
  parsePage,
  fetchAndParse,
  fetchPage,
  fetchAllPages,
  load,
  pageType: "shop-landing" as const,
  // Re-export helper functions
  isShopLandingPage,
  getShopSubdomain,
};

export type { ShopLandingPage };
