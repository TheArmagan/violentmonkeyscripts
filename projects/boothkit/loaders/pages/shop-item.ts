import { parseShopItemPage } from "../../parsers/booth/shop-item";

/**
 * Checks if the current URL is a shop item page.
 * Shop item pages have URLs in the format:
 * - https://{subdomain}.booth.pm/items/{itemId}
 * 
 * This is different from the regular item page which uses:
 * - https://booth.pm/{locale}/items/{itemId}
 */
function isThisPage(href: string) {
  const url = new URL(href);
  const pathnameParts = url.pathname.split("/").filter(Boolean);
  const hostnameParts = url.hostname.split(".");

  // Shop item pages are on {subdomain}.booth.pm/items/{itemId}
  // Must have 3 hostname parts (subdomain.booth.pm) and path must be /items/{id}
  if (hostnameParts.length === 3 &&
    hostnameParts[1] === "booth" &&
    hostnameParts[2] === "pm" &&
    hostnameParts[0] !== "www" &&
    pathnameParts[0] === "items" &&
    pathnameParts.length === 2) {
    return true;
  }

  return false;
}

/**
 * Prepare the page before parsing (if needed).
 * Returns false as no preparation is needed for shop item pages.
 */
function preparePage(href: string) {
  return false;
}

/**
 * Parse the HTML string of a shop item page.
 */
async function parsePage(html: string) {
  return await parseShopItemPage(html);
}

/**
 * Fetch a shop item page and parse it.
 */
async function fetchAndParse(url: string) {
  const targetUrl = new URL(url);
  const response = await fetch(targetUrl.toString());
  const html = await response.text();
  return await parseShopItemPage(html);
}

/**
 * Load and parse the current shop item page.
 */
async function load() {
  console.log("Boothkit shop-item loader loaded.");
  const parsedPage = await parseShopItemPage(document.documentElement.outerHTML);

  return {
    pageType: "shop-item",
    parsedPage
  }
}

export const shopItemLoader = {
  isThisPage,
  preparePage,
  parsePage,
  fetchAndParse,
  load,
  pageType: "shop-item"
}
