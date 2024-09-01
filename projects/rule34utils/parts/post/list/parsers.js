import { currentPageURL, getPidFromURL, parseHTMLDocument } from "../../../utils.js";
import { parseTagSidebar } from "../base/parsers.js";

/**
 * @param {HTMLSpanElement} elm
 * @returns {import("../../../utils.js").Post}
 */
function parseThumb(elm, sidebarTags = []) {
  const img = elm.querySelector("img");
  const url = elm.querySelector("a").href;
  const strTags = img.alt.trim().split(" ");
  const altSpaced = `${img.alt} `;
  const isVideo = altSpaced.includes("video ");
  const isAnimation = altSpaced.includes("animated ");
  let videoURL = null;
  let animationURL = null;
  return {
    id: parseInt(elm.id.slice(1)),
    url,
    thumbnail_img: img.src,
    is_video: isVideo,
    is_animation: isAnimation,
    tags: strTags.map((tag) => sidebarTags.find((t) => t.name === tag) || { type: "general", count: 0, name: tag }),
    async fetchVideoURL() {
      if (!isVideo || videoURL === "NotFound") return null;
      if (videoURL) return videoURL;

      const contentHtml = await fetch(url).then((res) => res.text());
      const doc = parseHTMLDocument(contentHtml);

      if (doc.querySelector("#content source")) {
        videoURL = doc.querySelector("#content source").src;
      } else {
        videoURL = "NotFound";
      }

      return videoURL === "NotFound" ? null : videoURL;
    },
    async fetchAnimationURL() {
      if (!isAnimation || animationURL === "NotFound") return null;
      if (animationURL) return animationURL;

      const contentHtml = await fetch(url).then((res) => res.text());
      const doc = parseHTMLDocument(contentHtml);

      if (doc.querySelector("#fit-to-screen img[alt]")) {
        animationURL = doc.querySelector("#fit-to-screen img[alt]").src;
      } else {
        animationURL = "NotFound";
      }

      return animationURL === "NotFound" ? null : animationURL;
    }
  };
}


/**
 * @param {HTMLDivElement} elm 
 * @returns {{tags: import("../../../utils.js").TagType[], posts: Post[], pagination: ReturnType<parsePaginator> }}
 */
export function parsePostListPageContent(elm) {
  const tags = elm.querySelector("#tag-sidebar") ? parseTagSidebar(elm.querySelector("#tag-sidebar")) : [];
  return {
    tags,
    posts: [...elm.querySelectorAll(".thumb")].map((thumb) => parseThumb(thumb, tags)),
    pagination: parsePaginator(elm.querySelector("#paginator"))
  }
}



/**
 * @param {HTMLDivElement} elm 
 * @returns {{ current_page: { number: number, pid: number }, next_page: { number: number, pid: number } | null }}
 */
function parsePaginator(elm) {
  if (!document.querySelector('a[href^="?page="]')) return null;

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


