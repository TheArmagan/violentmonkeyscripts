import { parseBrowsePage } from "../../parsers/browse";
import { injectComponent } from "../../utils/svelte";
// @ts-ignore
import BrowsePage from "../../components/browse-page/browse-page.svelte";

function isThisPage() {
  const url = new URL(window.location.href);
  return url.pathname.split("/")[2] === "browse";
}

function preparePage() {
  const url = new URL(window.location.href);
  if (url.searchParams.get("adult") !== "include") {
    url.searchParams.set("adult", "include");
    window.location.href = url.toString();
    return true;
  } else {
    if (document.querySelector("h3")?.textContent.trim() === "Are you over 18 years of age?") {
      const yesButton = document.querySelector<HTMLAnchorElement>(".js-approve-adult a");
      yesButton?.click();
      return false;
    }
  }
}

function load() {
  console.log("Boothkit browse loader loaded.");
  const parsedPage = parseBrowsePage(document.documentElement.outerHTML);
  document.body.innerHTML = "";

  injectComponent(BrowsePage, {
    parsedPage
  }, {
    prependTo: "body",
    id: "boothkit-browse-page-container",
  });
}

export const browseLoader = {
  isThisPage,
  preparePage,
  load
}