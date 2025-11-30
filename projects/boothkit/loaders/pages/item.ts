import { parseItemPage } from "../../parsers/booth/item";

function isThisPage(href: string) {
  const url = new URL(href);
  const pathnameParts = url.pathname.split("/");
  const hostnameParts = url.hostname.split(".");
  return hostnameParts.length === 2 && pathnameParts[2] === 'items' && pathnameParts.length === 4;
}

function preparePage(href: string) {
  return false;
}

async function parsePage(html: string) {
  return await parseItemPage(html);
}

async function fetchAndParse(url: string) {
  const targetUrl = new URL(url);
  const response = await fetch(targetUrl.toString());
  const html = await response.text();
  return await parseItemPage(html);
}

async function load() {
  console.log("Boothkit item loader loaded.");
  const parsedPage = await parseItemPage(document.documentElement.outerHTML);

  return {
    pageType: "item",
    parsedPage
  }
}

export const itemLoader = {
  isThisPage,
  preparePage,
  parsePage,
  fetchAndParse,
  load,
  pageType: "item"
}