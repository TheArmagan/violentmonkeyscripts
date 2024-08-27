import { currentPageURL } from "../../../utils.js";
import { parseTagSidebar } from "../base/parsers.js";

// TODO: comments

/**
 * @param {HTMLDivElement} elm 
 * @returns {{tags: import("../../../utils.js").TagType[], content: ReturnType<parseViewContent> }}
 */
export function parsePostViewPageContent(elm) {
  const tags = parseTagSidebar(elm.querySelector("#tag-sidebar"));
  return {
    tags,
    content: parseViewContent(elm, tags)
  }
}

/**
 * @param {HTMLDivElement} elm 
 * @param {import("../../../utils.js").TagType[]} sidebarTags
 * @returns {Omit<import("../../../utils.js").Post, "fetchVideoURL" | "fetchAnimationURL" | "tags">}
 */
function parseViewContent(elm, sidebarTags) {
  return {
    id: parseInt(currentPageURL.searchParams.get("id")),
    is_video: sidebarTags.some(i => i.name === "video"),
    is_animation: sidebarTags.some(i => i.name === "animated"),
    url: elm.querySelector("source")?.src ?? elm.querySelector("#fit-to-screen img[alt]")?.src
  };
}