import { parseBrowsePage } from "../../parsers/booth/browse";

function isThisPage(href: string) {
  const url = new URL(href);
  const parts = url.pathname.split("/");
  return ['browse', 'items', 'search', 'events'].includes(parts[2]) && (parts[2] === 'items' ? parts.length === 3 : true);
}

function preparePage(href: string) {
  const url = new URL(href);
  if (url.searchParams.get("adult") == "include") {
    if (document.querySelector("h3")?.textContent.trim() === "Are you over 18 years of age?") {
      const yesButton = document.querySelector<HTMLAnchorElement>(".js-approve-adult a");
      yesButton?.click();
      return false;
    }
  }
}

async function parsePage(html: string) {
  return await parseBrowsePage(html);
}

async function fetchAndParse(url: string) {
  const targetUrl = new URL(url);
  // adult parametresini otomatik ekle
  if (targetUrl.searchParams.get("adult") !== "include") {
    targetUrl.searchParams.set("adult", "include");
  }

  const response = await fetch(targetUrl.toString());
  const html = await response.text();
  return await parsePage(html);
}

async function load() {
  console.log("Boothkit browse loader loaded.");
  const parsedPage = await parsePage(document.documentElement.outerHTML);

  return {
    pageType: "browse",
    parsedPage
  }
}

export const browseLoader = {
  isThisPage,
  preparePage,
  parsePage,
  fetchAndParse,
  load,
  pageType: "browse"
}