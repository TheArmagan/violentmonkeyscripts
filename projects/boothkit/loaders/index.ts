// @ts-ignore
import Main from "../components/main.svelte";

import { landingLoader } from "./pages/landing";
import { browseLoader } from "./pages/browse";
import { itemLoader } from "./pages/item";

import { injectComponent } from "../utils/svelte";

export const loaders = [
  landingLoader,
  browseLoader,
  itemLoader
];

export type Loader = typeof loaders[number];

// Global state for the current page
let currentLoadPage: ((parsed: any, type: string) => void) | null = null;
let currentSetLoading: ((loading: boolean) => void) | null = null;

/**
 * Find a loader that can handle the given URL
 */
export function findLoader(url: string): Loader | undefined {
  return loaders.find(loader => loader.isThisPage(url));
}

/**
 * Fetch the next page and return parsed data for merging (infinite scroll)
 * Does NOT update URL or trigger page change
 */
export async function fetchNextPage(url: string): Promise<any | null> {
  const loader = findLoader(url);

  if (!loader) {
    return null;
  }

  try {
    const parsedPage = await loader.fetchAndParse(url);
    return parsedPage;
  } catch (error) {
    console.error("[BoothKit] Fetch next page failed:", error);
    return null;
  }
}

/**
 * Navigate to a URL using hot-reload if possible
 * Returns true if navigation was handled, false if should use normal navigation
 */
export async function navigate(url: string): Promise<boolean> {
  const loader = findLoader(url);

  if (!loader || !currentLoadPage) {
    // No loader found or no loadPage callback, use normal navigation
    return false;
  }

  try {
    // Set loading state if available
    currentSetLoading?.(true);

    // Fetch and parse the new page
    const parsedPage = await loader.fetchAndParse(url);

    // Update the page without refresh
    currentLoadPage(parsedPage, loader.pageType);

    // Update browser URL without reload
    window.history.pushState({ url, pageType: loader.pageType }, "", url);

    // Scroll to top
    window.scrollTo(0, 0);

    return true;
  } catch (error) {
    console.error("[BoothKit] Hot navigation failed:", error);
    return false;
  } finally {
    currentSetLoading?.(false);
  }
}

/**
 * Setup link interception for hot-reload navigation
 */
function setupLinkInterception() {
  document.addEventListener("click", async (e) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");

    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    // Skip external links, hash links, and special protocols
    if (href.startsWith("#") ||
      href.startsWith("javascript:") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      anchor.target === "_blank") {
      return;
    }

    // Convert relative URLs to absolute
    const absoluteUrl = new URL(href, window.location.origin).toString();

    // Check if we have a loader for this URL
    const loader = findLoader(absoluteUrl);
    if (!loader) return;

    // Prevent default navigation
    e.preventDefault();

    // Try hot navigation
    const handled = await navigate(absoluteUrl);

    // If hot navigation failed, fall back to normal navigation
    if (!handled) {
      window.location.href = absoluteUrl;
    }
  }, true);

  // Handle browser back/forward buttons
  window.addEventListener("popstate", async (e) => {
    const url = window.location.href;
    const loader = findLoader(url);

    if (loader && currentLoadPage) {
      try {
        currentSetLoading?.(true);
        const parsedPage = await loader.fetchAndParse(url);
        currentLoadPage(parsedPage, loader.pageType);
      } catch (error) {
        console.error("[BoothKit] Popstate navigation failed:", error);
        window.location.reload();
      } finally {
        currentSetLoading?.(false);
      }
    }
  });
}

export async function runLoaders(url: string = window.location.href) {
  const currentLoader = loaders.find(loader => loader.isThisPage(url));

  if (currentLoader) {
    const preparationNeeded = await currentLoader.preparePage(url);
    if (!preparationNeeded) {
      const response = await currentLoader.load();

      document.body.innerHTML = "";

      injectComponent(Main, {
        pageType: response.pageType,
        parsedPage: response.parsedPage,
        onLoadPage: (callback: (parsed: any, type: string) => void) => {
          currentLoadPage = callback;
        },
        onSetLoading: (callback: (loading: boolean) => void) => {
          currentSetLoading = callback;
        }
      }, {
        prependTo: "body",
        id: "boothkit-container",
      });

      // Setup link interception after component is mounted
      setupLinkInterception();
    }
  }
}