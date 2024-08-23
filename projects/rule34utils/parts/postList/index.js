import _ from "lodash";
import "./styles.scss";
import { currentPageURL, fetchAutocompleteQuery, formatNumber, formatTagName, highlightText, parseHTML, uppercaseFirstLetters } from "../../utils.js";
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

const tagClickHandler = (tag) => (e) => {
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
};

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
        <div class="tag-sections"></div>
      </div>
      <div class="r34u--post-list">
        <div class="pagination">
          <div class="icon prev ${content.pagination.current_page.number <= 1 ? "disabled" : ""}">
            <i class="ri-arrow-left-s-line"></i>
          </div>
          <input type="number" value="${content.pagination.current_page.number}" min="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="icon next ${!content.pagination.next_page ? "disabled" : ""}">
            <i class="ri-arrow-right-s-line"></i>
          </div>
        </div>
        <div class="posts"></div>
        <div class="pagination">
          <div class="icon prev ${content.pagination.current_page.number <= 1 ? "disabled" : ""}">
            <i class="ri-arrow-left-s-line"></i>
          </div>
          <input type="number" value="${content.pagination.current_page.number}" min="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
          <div class="icon next ${!content.pagination.next_page ? "disabled" : ""}">
            <i class="ri-arrow-right-s-line"></i>
          </div>
        </div>
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
        <button class="search-result" title="${uppercaseFirstLetters(tag.type)}: ${tag.name} (${tag.count.toLocaleString()})">
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
  patchSidebarTagsElement(sidebarElm.querySelector(".tag-sections"), content);
}

/**
 * @param {HTMLDivElement} tagsSectionElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchSidebarTagsElement(tagsSectionElm, content) {

  Object.entries(
    Object.groupBy(content.tags, (tag) => tag.type)
  ).forEach(([tagType, tags]) => {
    const sectionElm = parseHTML(`
      <div class="tag-section">
        <div class="header">${uppercaseFirstLetters(tagType)}</div>
        <div class="tags"></div>
      </div>  
    `);

    const tagsElm = sectionElm.querySelector(".tags");

    tagsElm.replaceChildren(...tags.map((tag) => {
      const tagElm = parseHTML(`
        <div class="tag" title="Click to set tag, ctrl+click to add tag or shift+click to exclude tag.">
          <span class="name">${formatTagName(tag.name)}</span>
          ${tag.count ? `<span class="count">${formatNumber(tag.count)}</span>` : ""}
        </div>  
      `);

      tagElm.addEventListener("click", tagClickHandler(tag));

      return tagElm;
    }));

    tagsSectionElm.appendChild(sectionElm);
  });

}

/**
 * @param {HTMLDivElement} postListElm 
 * @param {ReturnType<parsePostListPageContent>} content 
 */
function patchPostListElement(postListElm, content) {
  patchPostListPostsElement(postListElm.querySelector(".posts"), content);
  postListElm.querySelectorAll(".pagination").forEach((elm) => patchPostListPaginationElement(elm, content));

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
  const prevElm = paginationElm.querySelector(".prev");
  const nextElm = paginationElm.querySelector(".next");
  const pageInput = paginationElm.querySelector("input");

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
}