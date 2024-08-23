import { parseHTMLDocument } from "../../utils.js";

/**
 * @param {HTMLSpanElement} elm
 * @returns {Post}
 */
function parseThumb(elm, sidebarTags = []) {
  const img = elm.querySelector("img");
  const url = elm.querySelector("a").href;
  const strTags = img.alt.trim().split(" ");
  const altSpaced = `${img.alt} `;
  const isVideo = altSpaced.includes("video ");
  const isAnimation = altSpaced.includes("animated ");
  let videoURL = null;
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
    }
  };
}

/**
 * @param {HTMLUListElement} elm
 * @returns {TagType[]}
 */
function parseTagSidebar(elm) {
  return [...elm.querySelectorAll('[class*="tag-type-"]')].map(parseSidebarTagType);
}

/**
 * @param {HTMLLIElement} elm
 * @returns {TagType}
 */
function parseSidebarTagType(elm) {
  return {
    type: elm.className.slice(9),
    count: parseInt(elm.querySelector(".tag-count").textContent),
    name: elm.querySelector('a[href^="index.php"]').textContent.trim().replace(/ /g, "_")
  }
}

/**
 * @param {HTMLDivElement} elm 
 * @returns {{tags: TagType[], posts: Post[], pagination: { current_page: number, has_next: boolean, max_page: number }}}
 */
export function parsePostListPageContent(elm) {
  const tags = parseTagSidebar(elm.querySelector("#tag-sidebar"));
  return {
    tags,
    posts: [...elm.querySelectorAll(".thumb")].map((thumb) => parseThumb(thumb, tags)),
    pagination: parsePaginator(elm.querySelector("#paginator"))
  }
}

/**
 * @param {HTMLDivElement} elm 
 * @returns {{ current_page: number, has_next: boolean, max_page: number }}
 */
function parsePaginator(elm) {
  return {
    current_page: parseInt(elm.querySelector("b").textContent),
    max_page: parseInt([...elm.querySelectorAll('a[href^="?page="]')].filter((a) => !!parseInt(a.textContent)).at(-1).textContent),
    has_next: !!elm.querySelector('a[alt="next"]'),
  }
}

/**
 * @typedef {{id: number, url: string, thumbnail_img: string, is_video: boolean, is_animation: boolean, tags: TagType[], fetchVideoURL: () => Promise<string | null>, fetchAnimationURL: () => Promise<string | null>}} Post 
 */

/**
 * @typedef {{type: "copyright" | "general" | "metadata" | "artist", count: number, name: string}} TagType
 */