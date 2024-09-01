import { currentPageURL, fetchAutocompleteQuery, formatNumber, formatTagName, highlightText, parseHTML, uppercaseFirstLetters } from "../../../utils.js";
import _ from "lodash";
import "./styles.scss";

export function tagClickHandler(tag) {
  return (e) => {
    e.preventDefault();

    const url = new URL("https://rule34.xxx/index.php?page=post&s=list");
    url.searchParams.set("pid", 0);

    let excludedTags = (currentPageURL.searchParams.get("tags") || localStorage.getItem("r34u--last-search-tags") || "").split(" ").filter((t) => t !== tag.name && t !== `-${tag.name}`);
    if (e.ctrlKey) {
      url.searchParams.set("tags", `${excludedTags.join(" ")} ${tag.name}`);
    } else if (e.shiftKey) {
      url.searchParams.set("tags", `${excludedTags.join(" ")} -${tag.name}`);
    } else {
      url.searchParams.set("tags", tag.name);
    }

    location.href = url.href;
  }
};

/**
 * @param {import("../../../utils.js").TagType[]} tags
 */
export function buildTagSidebar(tags) {
  const sidebar = parseHTML(`
    <div class="r34u--sidebar">
      <div class="search-container">
        <div class="search-bar">
          <i class="ri-search-2-line"></i>
          <input type="text" placeholder="Search tags..." autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />
        </div>
        <div class="buttons">
          <div class="filters-button button">
            <i class="ri-filter-3-line"></i>
            Filters
          </div>
          <div class="search-button button">
            <i class="ri-search-2-line"></i>
            Search
          </div>
        </div>
        <div class="filter-sections">
          <div class="filter-section" data-key="rating" data-allow-multiple-values="false">
            <div class="header">Rating</div>
            <div class="filters">
              <div class="filter" data-value="safe" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Safe</span>
              </div>
              <div class="filter" data-value="questionable" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Questionable</span>
              </div>
              <div class="filter" data-value="explicit" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>Explicit</span>
              </div>
              <div class="filter" data-value="[none]" data-type="+-_">
                <i class="ri-checkbox-blank-line"></i>
                <span>All</span>
              </div>
            </div>
          </div>
          <div class="filter-section" data-key="sort" data-allow-multiple-values="false">
            <div class="header">Storting</div>
            <div class="filters">
              <div class="filter" data-value="score" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Score</span>
              </div>
              <div class="filter" data-value="updated" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Updated</span>
              </div>
              <div class="filter" data-value="[none]" data-type="+-">
                <i class="ri-checkbox-blank-line"></i>
                <span>Unsorted</span>
              </div>
            </div>
          </div>
        </div>
        <div class="search-results"></div>
      </div>
      <div class="tag-sections"></div>
    </div>
  `);

  patchSidebarSearchElement(sidebar.querySelector(".search-container"));
  patchSidebarTagSectionsElement(sidebar.querySelector(".tag-sections"), tags);

  return sidebar;
}

/**
 * @param {HTMLDivElement} searchContainer 
 */
function patchSidebarSearchElement(searchContainer) {
  const searchInput = searchContainer.querySelector("input");
  const searchResultsElm = searchContainer.querySelector(".search-results");
  const searchButton = searchContainer.querySelector(".search-button");

  const filtersButton = searchContainer.querySelector(".filters-button");

  /** @type {{key: "rating"|"sort", value: string, negate: boolean }[]} */
  let filters = [];
  searchInput.value = (currentPageURL.searchParams.get("tags") || localStorage.getItem("r34u--last-search-tags") || "").replace(/(-?)(\w+):(\w+)/g, "").trim();
  if (searchInput.value === "all") searchInput.value = "";

  /** @type {HTMLDivElement} */
  const filterSectionsElm = searchContainer.querySelector(".filter-sections");

  if (localStorage.getItem("r34u--show-filters") === "true") filterSectionsElm.classList.add("visible");

  filtersButton.addEventListener("click", () => {
    filterSectionsElm.classList.toggle("visible");
    localStorage.setItem("r34u--show-filters", filterSectionsElm.classList.contains("visible"));
  });

  (() => {
    const tags = currentPageURL.searchParams.get("tags") || "";
    [...tags.matchAll(/(-?)(\w+):(\w+)/g)].forEach(([, negate, key, value]) => {
      filters.push({ key, value, negate: !!negate });
    });

    /** @type {HTMLDivElement[]} */
    const filterSectionsElms = [...searchContainer.querySelectorAll(".filter-section")];

    filterSectionsElms.forEach((sectionElm) => {
      const filterKey = sectionElm.dataset.key;
      const allowMultipleValues = sectionElm.dataset.allowMultipleValues === "true";

      /** @type {HTMLDivElement[]} */
      const filterElms = [...sectionElm.querySelectorAll(".filter")];

      filterElms.forEach((filterElm) => {
        const filterValue = filterElm.dataset.value;
        const filterType = filterElm.dataset.type;

        const filter = filters.find((f) => f.key === filterKey && f.value === filterValue);

        if (filter) filterElm.querySelector("i").className = filter.negate ? "ri-checkbox-indeterminate-line" : "ri-add-box-line";

        filterElm.addEventListener("click", () => {
          let foundFilter = filters.find((f) => f.key === filterKey && f.value === filterValue);

          if (!allowMultipleValues) {
            filters = filters.filter((f) => f.key !== filterKey);
            filterElms.forEach((elm) => elm.querySelector("i").className = "ri-checkbox-blank-line");
          }

          if (filterValue === "[none]") {
            filters = filters.filter((f) => f.key !== filterKey);
            filterElms.forEach((elm) => elm.querySelector("i").className = "ri-checkbox-blank-line");
            filterElm.querySelector("i").className = "ri-add-box-line";
            return;
          }

          switch (filterType) {
            case "+-_": {
              if (!foundFilter) {
                filters.push({ key: filterKey, value: filterValue, negate: false });
                filterElm.querySelector("i").className = "ri-add-box-line";
                break;
              }

              if (foundFilter?.negate === false) {
                if (!allowMultipleValues) {
                  filters.push({ key: filterKey, value: filterValue, negate: true });
                } else {
                  foundFilter.negate = true;
                }
                filterElm.querySelector("i").className = "ri-checkbox-indeterminate-line";
                break;
              }

              if (foundFilter) {
                filters = filters.filter((f) => f !== foundFilter);
                filterElm.querySelector("i").className = "ri-checkbox-blank-line";
                break;
              }
              break;
            }
            case "+-": {
              if (!foundFilter) {
                filters.push({ key: filterKey, value: filterValue, negate: false });
                filterElm.querySelector("i").className = "ri-add-box-line";
              } else {
                filters = filters.filter((f) => f !== foundFilter);
                filterElm.querySelector("i").className = "ri-checkbox-blank-line";
              }
              break;
            }
          }
        });
      });
    });
  })();

  function doSearch() {
    const url = new URL("https://rule34.xxx/index.php?page=post&s=list");
    url.searchParams.set("tags", `${searchInput.value !== "all" ? searchInput.value : ""} ${filters.filter(i => i.value !== "[none]").map((f) => `${f.negate ? "-" : ""}${f.key}:${f.value}`).join(" ")}`.trim());
    url.searchParams.set("pid", 0);
    location.href = url.href;
  }

  const debouncedSearch = _.debounce(async () => {
    let input = searchInput.value.replaceAll("-", "").trim();
    if (input === "all") input = "";
    const lastSpaceIdx = input.indexOf(" ", searchInput.selectionStart);
    let searchValue = input.slice(searchInput.selectionStart || 0, lastSpaceIdx === -1 ? input.length : (lastSpaceIdx + 1)).trim();
    if (!searchValue) searchValue = input.split(" ").pop();

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
 * @param {HTMLDivElement} tagsSectionElm 
 * @param {import("../../../utils.js").TagType[]} sidebarTags 
 */
function patchSidebarTagSectionsElement(tagsSectionElm, sidebarTags) {

  Object.entries(
    Object.groupBy(sidebarTags, (tag) => tag.type)
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
 * @param {any} pagination 
 * @param {{ input(num: number): void, prev(): void, next(): void, }} callbacks 
 * @returns 
 */
export function buildPaginationElement(pagination, callbacks = {}) {
  const elm = parseHTML(`
    <div class="r34u--pagination">
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
      callbacks.input(Math.max(pageInput.value, 0));
    }
  });

  prevElm.addEventListener("click", () => {
    callbacks.prev();
  });

  nextElm.addEventListener("click", () => {
    callbacks.next();
  });

  return elm;
}