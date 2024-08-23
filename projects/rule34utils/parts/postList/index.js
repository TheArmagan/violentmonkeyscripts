import _ from "lodash";
import "./styles.scss";
import { currentPageURL, fetchAutocompleteQuery, formatNumber, formatTagName, highlightText, parseHTML } from "../../utils.js";
import { parsePostListPageContent } from "./parsers.js";

const handlePreviewHover = _.debounce(
  /**
   * @param {import("./parsers.js").Post} post 
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

export function patchPostList() {
  if (!(currentPageURL.searchParams.get("page") === "post" && currentPageURL.searchParams.get("s") === "list")) return;

  const content = parsePostListPageContent(document.querySelector("#content"));
  console.log(content);

  document.querySelector("#content").remove();

  const contentElm = parseHTML(`
    <div class="r34u--post-list-content">
      <div class="r34u--sidebar">
        <div class="search-container">
          <div class="search-bar">
            <i class="ri-search-2-line"></i>
            <input type="text" placeholder="Search tags..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          </div>
          <div class="search-button">Search</div>
          <div class="search-results"></div>
        </div>
        <div class="tags">
          
        </div>
      </div>
      <div class="r34u--post-list">
        <div class="posts"></div>

      </div>
    </div>
  `);

  patchSidebarElement(contentElm.querySelector(".r34u--sidebar"), content);
  patchPostListElement(contentElm.querySelector(".r34u--post-list"), content);

  document.body.appendChild(contentElm);
}

/**
 * @param {HTMLDivElement} searchContainer 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchSidebarSearchElement(searchContainer, content) {
  const searchInput = searchContainer.querySelector("input");
  const searchResultsElm = searchContainer.querySelector(".search-results");
  const searchButton = searchContainer.querySelector(".search-button");

  searchInput.value = currentPageURL.searchParams.get("tags") || "";

  function doSearch() {
    const url = new URL(location.href);
    url.searchParams.set("tags", searchInput.value);
    location.href = url.href;
  }

  const debouncedSearch = _.debounce(async () => {
    const lastSpaceIdx = searchInput.value.indexOf(" ", searchInput.selectionStart);
    let searchValue = searchInput.value.slice(searchInput.selectionStart || 0, lastSpaceIdx === -1 ? searchInput.value.length : (lastSpaceIdx + 1)).trim();
    if (!searchValue) searchValue = searchInput.value.split(" ").pop();

    const foundTags = await fetchAutocompleteQuery(searchValue);

    searchResultsElm.replaceChildren(...foundTags.map((tag) => {
      const tagElm = parseHTML(`
        <button class="search-result" title="${tag.name} (${tag.count.toLocaleString()})">
          <span class="name">${highlightText(tag.name, searchValue)}</span>
          <span class="count">${formatNumber(tag.count)}</span>
        </button>
      `);

      tagElm.addEventListener("click", (e) => {
        const tagsExcluded = searchInput.value.split(" ").slice(0, -1).filter((i) => i !== tag.name && i !== `-${tag.name}`);
        searchInput.value = `${tagsExcluded.join(" ")} ${e.shiftKey ? "-" : ""}${tag.name}`.trim();
      });

      return tagElm;
    }));
    acceptTab = true;
  }, 500);

  document.body.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      searchResultsElm.classList.remove("visible");
    }
  });

  searchButton.addEventListener("click", doSearch);

  searchInput.addEventListener("focus", () => {
    searchResultsElm.classList.add("visible");
  });

  searchInput.addEventListener("keydown", (e) => {
    const searchValue = searchInput.value;

    searchResultsElm.querySelectorAll(".search-result .name").forEach((elm) => {
      elm.innerHTML = highlightText(elm.textContent, searchValue);
    });

    if (e.key === "Shift") return;

    if (e.key === "Enter") {
      doSearch();
      return;
    }

    debouncedSearch();
  });

  searchInput.addEventListener("mouseup", () => {
    debouncedSearch();
  });

  debouncedSearch();
}

/**
 * @param {HTMLDivElement} sidebarElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchSidebarElement(sidebarElm, content) {
  patchSidebarSearchElement(sidebarElm.querySelector(".search-container"), content);
}

/**
 * @param {HTMLDivElement} postListElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListElement(postListElm, content) {
  const postsElm = postListElm.querySelector(".posts");

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

      tagElm.addEventListener("click", (e) => {
        e.preventDefault();

        const url = new URL(location.href);
        let excludedTags = url.searchParams.get("tags").split(" ").filter((t) => t !== tag.name && t !== `-${tag.name}`);
        if (e.ctrlKey) {
          url.searchParams.set("tags", `${excludedTags.join(" ")} ${tag.name}`);
        } else if (e.shiftKey) {
          url.searchParams.set("tags", `${excludedTags.join(" ")} -${tag.name}`);
        } else {
          url.searchParams.set("tags", tag.name);
        }

        location.href = url.href;
      });

      tagsContainer.appendChild(tagElm);
    });

    postsElm.appendChild(newElement);
  });
}