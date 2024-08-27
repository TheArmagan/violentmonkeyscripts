/**
 * @param {HTMLUListElement} elm
 * @returns {import("../../../utils.js").TagType[]}
 */
export function parseTagSidebar(elm) {
  return [...elm.querySelectorAll('[class*="tag-type-"]')].map(parseSidebarTagType);
}

/**
 * @param {HTMLLIElement} elm
 * @returns {import("../../../utils.js").TagType}
 */
function parseSidebarTagType(elm) {
  return {
    type: elm.className.split(" ")[0].slice(9),
    count: parseInt(elm.querySelector(".tag-count").textContent),
    name: elm.querySelector('a[href^="index.php?page=post"]').textContent.trim().replace(/ /g, "_")
  }
}

