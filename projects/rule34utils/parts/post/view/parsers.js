import { currentPageURL, getPidFromURL } from "../../../utils.js";
import { parseTagSidebar } from "../base/parsers.js";

/**
 * @param {HTMLDivElement} elm 
 * @returns {{tags: import("../../../utils.js").TagType[], content: ReturnType<parseViewContent>, comments: ReturnType<parseViewPostComments> }}
 */
export function parsePostViewPageContent(elm) {
  const tags = parseTagSidebar(elm.querySelector("#tag-sidebar"));
  return {
    tags,
    content: parseViewContent(elm, tags),
    comments: parseViewPostComments(elm.querySelector("#post-comments"))
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

/**
 * @param {HTMLDivElement} elm 
 * @returns {{ total_count: number, items: { id: number, author: string, date: Date, score: number, content: string}[]}}
 */
export function parseViewPostComments(elm) {
  const commentList = elm.querySelector("#comment-list");
  return {
    total_count: parseInt(commentList.childNodes[2].textContent.split(" ")[0].trim()) || 0,
    items: [...commentList.querySelectorAll("& > div[id]")].map((commentElm) => {
      return {
        id: parseInt(commentElm.id.slice(1)),
        author: commentElm.querySelector(".col1 > a").textContent,
        date: new Date(commentElm.querySelector(".col1 > b").childNodes[0].textContent.split(/ |\n/).slice(3, 5).join(" ")),
        score: parseInt(commentElm.querySelector(".col1 > b > a[id]").textContent),
        content: commentElm.querySelector(".col2").textContent.trim()
      }
    }),
    pagination: parseCommentsPaginator(elm.querySelector("#paginator"))
  }
}

/**
 * @param {HTMLDivElement} elm 
 * @returns {{ current_page: { number: number, pid: number }, next_page: { number: number, pid: number } | null }}
 */
function parseCommentsPaginator(elm) {
  const currentPageNum = parseInt(elm.querySelector("b")?.textContent || 1);
  const nextPage = elm.querySelector('a[alt="next"]');
  return {
    current_page: {
      number: currentPageNum,
      pid: currentPageURL.searchParams.get("pid") ? parseInt(currentPageURL.searchParams.get("pid")) : 0
    },
    next_page: nextPage ? {
      number: currentPageNum + 1,
      pid: nextPage ? getPidFromURL(nextPage.href) : 0
    } : null
  }
}