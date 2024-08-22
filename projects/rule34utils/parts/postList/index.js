import _ from "lodash";
import "./styles.scss";
import { currentPageURL, parseHTML, parseHTMLDocument } from "../../utils.js";

const handlePreviewHover = _.debounce(
  /**
   * @param {PostThumb} thumb 
   * @param {HTMLDivElement} container 
   */
  async (thumb, container) => {
    if (container.classList.contains("video-preview-patched")) return;
    container.classList.add("video-preview-patched");

    const videoIndicator = container.querySelector(".video-indicator");

    videoIndicator.classList.add("loading-rotate");
    videoIndicator.innerHTML = `<i class="ri-loader-4-line"></i>`;

    const videoURL = await thumb.fetchVideoURL();

    if (!videoURL) {
      videoIndicator.remove();
      return;
    }

    videoIndicator.classList.remove("loading-rotate");
    videoIndicator.innerHTML = `<i class="ri-play-fill"></i>`;

    const videoPreview = parseHTML(`<video src="${videoURL}" loop muted></video>`);

    const staticPreview = container.querySelector("img");

    videoPreview.addEventListener("mouseleave", () => {
      videoPreview.replaceWith(staticPreview);
      videoPreview.pause();
      hovered = false;
    });

    staticPreview.addEventListener("mouseenter", () => {
      staticPreview.replaceWith(videoPreview);
      videoPreview.play();
    });

    videoPreview.addEventListener("loadeddata", () => {
      videoPreview.play();
      staticPreview.replaceWith(videoPreview);
    });
  },
  500
);

export function patchPostList() {
  if (!(currentPageURL.searchParams.get("page") === "post" && currentPageURL.searchParams.get("s") === "list")) return;

  document.querySelectorAll(".thumb").forEach(
    /**
     * @param {HTMLSpanElement} thumbElm 
     */
    (thumbElm) => {
      const thumb = parseThumb(thumbElm);

      const newElement = parseHTML(`
        <a class="r34u--post-item" href="${thumb.url}">
          <div class="preview-container">
            ${thumb.is_video ? `<div class="video-indicator"><i class="ri-play-fill"></i></div>` : ""}
          </div>
          <div class="tags"></div>
        </a>
      `);

      (async () => {

        const previewContainer = newElement.querySelector(".preview-container");
        const staticPreview = parseHTML(`<img src="${thumb.thumbnail_img}" />`);
        previewContainer.appendChild(staticPreview);

        if (thumb.is_video) {
          previewContainer.addEventListener("mouseenter", () => handlePreviewHover(thumb, previewContainer));
        }
      })();

      (async () => {

        const tagsContainer = newElement.querySelector(".tags");

        tagsContainer.innerHTML = thumb.tags.map((tag) => {
          const formattedTag = tag.replace(/_/g, " ").replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
          return `<a href="/index.php?page=post&s=list&tags=${tag}">${formattedTag}</a>`;
        }).join("");

      })();

      thumbElm.replaceWith(newElement);
    }
  );

  document.querySelector(".image-list").classList.add("r34u--post-list");
}

/**
 * @typedef {{id: number, url: string, thumbnail_img: string, is_video: boolean, tags: string[], fetchVideoURL: () => Promise<string | null>}} PostThumb 
 */

/**
 * @param {HTMLSpanElement} elm
 * @returns {PostThumb}
 */
function parseThumb(elm) {
  const img = elm.querySelector("img");
  const url = elm.querySelector("a").href;
  let videoURL = null;
  return {
    id: parseInt(elm.id.slice(1)),
    url,
    thumbnail_img: img.src,
    is_video: img.alt.includes("video "),
    tags: img.alt.trim().split(" "),
    async fetchVideoURL() {
      if (!img.alt.includes("video ") || videoURL === "NotFound") return null;
      if (videoURL) return videoURL;

      const contentHtml = await fetch(url).then((res) => res.text());
      const doc = parseHTMLDocument(contentHtml);

      if (doc.querySelector("source")) {
        videoURL = doc.querySelector("source").src;
      } else {
        videoURL = "NotFound";
      }

      return videoURL === "NotFound" ? null : videoURL;
    }
  };
}