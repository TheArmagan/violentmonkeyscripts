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

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @param {HTMLElement} elm
 * @param {"vertical"|"horizontal"} direction
 * @param {number} [threshold]
 * @param {"visible"|"above"|"below"} [mode]
 * @returns {boolean}
 */
export function checkIsElementVisible(elm, direction = "vertical", threshold, mode) {
  threshold = threshold || 0;
  mode = mode || 'visible';

  let rect = elm.getBoundingClientRect();
  if (direction == "vertical") {

    let viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    let above = rect.bottom - threshold < 0;
    let below = rect.top - viewHeight + threshold >= 0;

    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
  } else if (direction == "horizontal") {
    let viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth);
    let above = rect.right - threshold < 0;
    let below = rect.left - viewWidth + threshold >= 0;

    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
  } else {
    return false;
  }
}