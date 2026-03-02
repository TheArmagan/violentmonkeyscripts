import _ from "lodash";
import "./styles.scss";
import { currentPageURL, formatNumber, formatTagName, parseHTML } from "../../../utils.js";
import { parsePostListPageContent } from "./parsers.js";
import { buildPaginationElement, buildTagSidebar, tagClickHandler } from "../base/index.js";

const handlePreviewHover = _.debounce(
  /**
   * @param {import("../../../utils.js").Post} post 
   * @param {HTMLDivElement} container 
   */
  async (post, container) => {
    if (container.classList.contains("preview-patched")) return;
    container.classList.add("preview-patched");

    const videoIndicator = container.querySelector(".video-indicator");

    videoIndicator.classList.add("loading-rotate");
    videoIndicator.innerHTML = `<i class="ri-loader-4-line"></i>`;

    if (post.is_video) {
      const videoURL = await post.fetchVideoURL();

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
      });

      staticPreview.addEventListener("mouseenter", () => {
        staticPreview.replaceWith(videoPreview);
        videoPreview.play();
      });

      videoPreview.addEventListener("loadeddata", () => {
        videoPreview.play();
        staticPreview.replaceWith(videoPreview);
      });
    } else if (post.is_animation) {
      const animURL = await post.fetchFullImageURL();

      if (!animURL) {
        videoIndicator.remove();
        return;
      }

      videoIndicator.classList.remove("loading-rotate");
      videoIndicator.innerHTML = `<i class="ri-play-fill"></i>`;

      const animPreview = parseHTML(`<img src="${animURL}" />`);

      const staticPreview = container.querySelector("img");

      animPreview.addEventListener("mouseleave", () => {
        animPreview.replaceWith(staticPreview);
      });

      staticPreview.addEventListener("mouseenter", () => {
        staticPreview.replaceWith(animPreview);
      });

      animPreview.addEventListener("load", () => {
        staticPreview.replaceWith(animPreview);
      });
    }
  },
  500
);

export function patchPostListPage() {
  if (!(currentPageURL.searchParams.get("page") === "post" && currentPageURL.searchParams.get("s") === "list")) return;

  localStorage.setItem("r34u--last-search-tags", currentPageURL.searchParams.get("tags") || "");

  const content = parsePostListPageContent(document.querySelector("#content"));
  console.log("Post List Page", content);

  document.querySelector("#content").remove();

  const contentElm = parseHTML(`
    <div class="r34u--post-list-content">
      <div class="r34u--post-list">
        <div class="posts ${content.posts.length === 0 ? "hidden" : ""}"></div>
      </div>
    </div>
  `);

  contentElm.prepend(buildTagSidebar(content.tags));

  patchPostListElement(contentElm.querySelector(".r34u--post-list"), content);

  document.body.appendChild(contentElm);
}


/**
 * @param {HTMLDivElement} postListElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListElement(postListElm, content) {
  patchPostListPostsElement(postListElm.querySelector(".posts"), content);

  if (content.pagination) {
    postListElm.prepend(buildListViewPaginationElement(content.pagination));
    postListElm.appendChild(buildListViewPaginationElement(content.pagination));
  }
}

function buildListViewPaginationElement(pagination) {
  return buildPaginationElement(pagination, {
    input(num) {
      const url = new URL(location.href);
      url.searchParams.set("pid", Math.max(num - 1, 0) * 42);
      location.href = url.href;
    },
    prev() {
      const url = new URL(location.href);
      url.searchParams.set("pid", Math.max(pagination.current_page.pid - 42, 0));
      location.href = url.href;
    },
    next() {
      const url = new URL(location.href);
      url.searchParams.set("pid", pagination.current_page.pid + 42);
      location.href = url.href;
    }
  });
}

/**
 * @param {HTMLDivElement} postsElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListPostsElement(postsElm, content) {
  content.posts.forEach((post) => {
    const newElement = parseHTML(`
      <a class="post-item" href="${post.url}">
        <div class="preview-container">
          ${post.is_video || post.is_animation ? `<div class="video-indicator"><i class="ri-play-fill"></i></div>` : ""}
        </div>
        <div class="tags"></div>
      </a>
    `);

    const previewContainer = newElement.querySelector(".preview-container");
    const staticPreview = parseHTML(`<img src="${post.thumbnail_img}" />`);
    previewContainer.appendChild(staticPreview);

    if (post.is_video || post.is_animation) {
      previewContainer.addEventListener("mouseenter", () => handlePreviewHover(post, previewContainer));
    }

    // 3-second hover → fullscreen preview
    let hoverCountdownInterval = null;
    let hoverCountdownTimeout = null;
    let hoverCountdownElm = null;

    newElement.addEventListener("mouseenter", () => {
      let remaining = 3;

      hoverCountdownElm = parseHTML(`<div class="hover-countdown">${remaining}</div>`);
      previewContainer.appendChild(hoverCountdownElm);

      hoverCountdownInterval = setInterval(() => {
        remaining--;
        if (hoverCountdownElm) hoverCountdownElm.textContent = remaining;
      }, 1000);

      hoverCountdownTimeout = setTimeout(async () => {
        clearInterval(hoverCountdownInterval);
        if (hoverCountdownElm) { hoverCountdownElm.remove(); hoverCountdownElm = null; }

        const overlay = parseHTML(`<div class="r34u--fullscreen-overlay"><button class="r34u--fullscreen-close"><i class="ri-close-line"></i></button><div class="r34u--fullscreen-loading"><i class="ri-loader-4-line loading-rotate"></i></div></div>`);
        overlay.querySelector(".r34u--fullscreen-close").addEventListener("click", () => overlay.remove());
        document.body.appendChild(overlay);

        let mediaElm;
        if (post.is_video) {
          const videoURL = await post.fetchVideoURL();
          if (videoURL) {
            mediaElm = parseHTML(`<video src="${videoURL}" controls autoplay loop muted></video>`);
          }
        } else {
          const fullURL = await post.fetchFullImageURL();
          if (fullURL) {
            mediaElm = parseHTML(`<img src="${fullURL}" />`);
          }
        }

        if (!mediaElm) {
          mediaElm = parseHTML(`<img src="${post.thumbnail_img}" />`);
        }

        overlay.querySelector(".r34u--fullscreen-loading").replaceWith(mediaElm);
      }, 3000);
    });

    newElement.addEventListener("mouseleave", () => {
      clearInterval(hoverCountdownInterval);
      clearTimeout(hoverCountdownTimeout);
      if (hoverCountdownElm) { hoverCountdownElm.remove(); hoverCountdownElm = null; }
    });

    const tagsContainer = newElement.querySelector(".tags");

    post.tags.forEach((tag) => {
      /** @type {HTMLSpanElement} */
      const tagElm = parseHTML(`
        <a class="tag" title="Click to set tag, ctrl+click to add tag or shift+click to exclude tag." href="https://rule34.xxx/index.php?page=post&s=list&tags=${tag.name}">
          <span class="name">${formatTagName(tag.name)}</span>
          ${tag.count ? `<span class="count">${formatNumber(tag.count)}</span>` : ""}
        </a>
      `);

      tagElm.addEventListener("click", tagClickHandler(tag));

      tagsContainer.appendChild(tagElm);
    });

    postsElm.appendChild(newElement);
  });
}