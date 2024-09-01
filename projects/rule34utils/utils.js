/**
 * @typedef {{type: "copyright" | "general" | "metadata" | "artist", count: number, name: string}} TagType
 */

/**
 * @typedef {{id: number, url: string, thumbnail_img: string, is_video: boolean, is_animation: boolean, tags: TagType[], fetchVideoURL: () => Promise<string | null>, fetchAnimationURL: () => Promise<string | null>}} Post 
 */

const domParser = new DOMParser();

export function parseHTMLDocument(html) {
  return domParser.parseFromString(html, "text/html");
}

export function parseHTML(html) {
  const elm = document.createElement("div");
  elm.innerHTML = html;
  return elm.firstElementChild;
}

export function escapeHTML(html) {
  return new Option(html).innerHTML;
}

export function ifExits(elm, callback) {
  if (elm) callback(elm);
}

export function uppercaseFirstLetters(string) {
  return string.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
}

export function formatTagName(tag) {
  return uppercaseFirstLetters(tag.replace(/_/g, " "));
}

/**
 * @param {string} query
 * @returns {Promise<TagType[]>}
 */
export async function fetchAutocompleteQuery(query) {
  const json = await fetch(`https://ac.rule34.xxx/autocomplete.php?q=${encodeURIComponent(query.trim().toLowerCase())}`).then((res) => res.json());
  return json.map((tag) => ({
    name: tag.value,
    count: parseInt(tag.label.split(" ")[1].slice(1, -1)),
    type: tag.type
  }));
}

export function highlightText(text, query) {
  return text.replace(new RegExp(`(${query.split(" ").map(i => i.replace(/^-/, "")).join("|")})`, "gi"), "<mark>$1</mark>");
}

export function formatNumber(number) {
  if (number < 1000) return number;
  if (number < 1000000) return `${(number / 1000).toFixed(2)}k`;
  if (number < 1000000000) return `${(number / 1000000).toFixed(2)}m`;
  return `${(number / 1000000000).toFixed(2)}b`;
}

export const currentPageURL = new URL(location.href);

export function setCurrentPageHashKey(key, value) {
  let params = new URLSearchParams(location.hash.slice(1));
  if (value) params.set(key, value);
  else params.delete(key);
  location.hash = params.toString();
  currentPageURL.hash = location.hash;
  history.replaceState(null, "", currentPageURL.href);
}

export function getCurrentPageHashKey(key) {
  return new URLSearchParams(location.hash.slice(1)).get(key);
}

export const getPidFromURL = (url) => {
  if (!url) return;
  return parseInt(new URL(url).searchParams.get("pid"));
}

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));