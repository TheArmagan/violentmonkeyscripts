import { parseLandingPage } from "../../parsers/booth/landing";

function isThisPage(href: string) {
  const url = new URL(href);
  const parts = url.pathname.split("/").filter(p => p !== "");
  // Landing page is just the root or /en, /ja etc (language code only)
  return parts.length === 0 || (parts.length === 1 && parts[0].length === 2);
}

function preparePage(href: string) {
  return false;
}

async function parsePage(html: string) {
  return await parseLandingPage(html);
}

async function fetchAndParse(url: string) {
  const targetUrl = new URL(url);
  const response = await fetch(targetUrl.toString());
  const html = await response.text();
  return await parseLandingPage(html);
}

async function load() {
  console.log("Boothkit landing loader loaded.");
  const parsedPage = await parseLandingPage(document.documentElement.outerHTML);

  return {
    pageType: "landing",
    parsedPage
  }
}

export const landingLoader = {
  isThisPage,
  preparePage,
  parsePage,
  fetchAndParse,
  load,
  pageType: "landing"
}