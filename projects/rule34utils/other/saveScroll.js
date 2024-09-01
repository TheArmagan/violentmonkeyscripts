import _ from "lodash";
import { getCurrentPageHashKey, setCurrentPageHashKey, sleep } from "../utils.js";

export function patchSaveScroll() {
  window.addEventListener("scroll", _.debounce(() => {
    setCurrentPageHashKey("scrollY", window.scrollY);
  }, 100));
}

export function restoreScrollY() {
  setTimeout(() => {
    const scrollY = getCurrentPageHashKey("scrollY");
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY));
    }
  }, 100);
}