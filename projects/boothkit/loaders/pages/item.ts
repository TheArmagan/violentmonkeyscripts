import { parseItemPage } from "../../parsers/item";

function isThisPage(href: string) {
  const url = new URL(href);
  const parts = url.pathname.split("/");
  return parts[2] === 'items' && parts.length === 4;
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
  console.log(parsedPage);

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