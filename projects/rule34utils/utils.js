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

export const currentPageURL = new URL(location.href);