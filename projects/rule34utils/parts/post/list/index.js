import _ from "lodash";
import "./styles.scss";
import { currentPageURL, formatNumber, formatTagName, parseHTML } from "../../../utils.js";
import { parsePostListPageContent } from "./parsers.js";
import { buildTagSidebar, tagClickHandler } from "../base/index.js";

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
      const animURL = await post.fetchAnimationURL();

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

function buildPaginationElement(pagination) {
  const elm = parseHTML(`
    <div class="pagination">
      <div class="icon prev ${pagination.current_page.number <= 1 ? "disabled" : ""}">
        <i class="ri-arrow-left-s-line"></i>
      </div>
      <input type="number" value="${pagination.current_page.number}" min="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
      <div class="icon next ${!pagination.next_page ? "disabled" : ""}">
        <i class="ri-arrow-right-s-line"></i>
      </div>
    </div>
  `);

  const prevElm = elm.querySelector(".prev");
  const nextElm = elm.querySelector(".next");
  const pageInput = elm.querySelector("input");

  pageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const url = new URL(location.href);
      url.searchParams.set("pid", Math.max(pageInput.value - 1, 0) * 42);
      location.href = url.href;
    }
  });

  prevElm.addEventListener("click", () => {
    const url = new URL(location.href);
    url.searchParams.set("pid", Math.max(content.pagination.current_page.pid - 42, 0));
    location.href = url.href;
  });

  nextElm.addEventListener("click", () => {
    const url = new URL(location.href);
    url.searchParams.set("pid", content.pagination.current_page.pid + 42);
    location.href = url.href;
  });

  return elm;
}

/**
 * @param {HTMLDivElement} postListElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListElement(postListElm, content) {
  patchPostListPostsElement(postListElm.querySelector(".posts"), content);

  if (content.pagination) {
    const paginationElm = buildPaginationElement(content.pagination);
    postListElm.prepend(paginationElm);
    postListElm.appendChild(paginationElm);
  }
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

    const tagsContainer = newElement.querySelector(".tags");

    post.tags.forEach((tag) => {
      /** @type {HTMLSpanElement} */
      const tagElm = parseHTML(`
        <span class="tag" title="Click to set tag, ctrl+click to add tag or shift+click to exclude tag.">
          <span class="name">${formatTagName(tag.name)}</span>
          ${tag.count ? `<span class="count">${formatNumber(tag.count)}</span>` : ""}
        </span>
      `);

      tagElm.addEventListener("click", tagClickHandler(tag));

      tagsContainer.appendChild(tagElm);
    });

    postsElm.appendChild(newElement);
  });
}

/**
 * @param {HTMLDivElement} paginationElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListPaginationElement(paginationElm, content) {

}