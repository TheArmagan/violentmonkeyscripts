// import { registerFetchResponse } from "./http.js";
import Masonry from "masonry-layout";
import { checkIsElementVisible, parseHTML, sleep } from "./utils.js";
import "./styles.scss";

async function main() {
  const container = parseHTML(`
    <div class="pu--masonry-grid">
      <div class="infinite-scroll-trigger"></div>
    </div>  
  `);

  document.body.appendChild(container);

  // Remove original page content to save resources
  document.querySelectorAll("body > *:not(.pu--masonry-grid)").forEach(el => el.remove());

  const masonry = new Masonry(container, {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 0,
    transitionDuration: 0
  });

  async function fetchIllustPages(illustId) {
    const json = await fetch(`https://www.pixiv.net/ajax/illust/${illustId}/pages?lang=en`).then(d => d.json());
    return json.body;
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  async function toggleBookmark(illustId, btn) {
    const isBookmarked = btn.classList.contains("bookmarked");
    btn.classList.add("busy");

    try {
      if (isBookmarked) {
        // Get bookmark ID first, then delete
        const detailJson = await fetch(`https://www.pixiv.net/ajax/illust/${illustId}?lang=en`).then(d => d.json());
        const bookmarkId = detailJson.body?.bookmarkData?.id;
        if (bookmarkId) {
          await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/delete", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `bookmark_id=${bookmarkId}`,
            credentials: "same-origin"
          });
        }
        btn.classList.remove("bookmarked");
      } else {
        await fetch("https://www.pixiv.net/ajax/illusts/bookmarks/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            illust_id: illustId,
            restrict: 0,
            comment: "",
            tags: []
          }),
          credentials: "same-origin"
        });
        btn.classList.add("bookmarked");
      }
    } catch (e) {
      console.error("Bookmark toggle failed", illustId, e);
    } finally {
      btn.classList.remove("busy");
    }
  }

  async function toggleExpand(gridElm, illustId) {
    if (gridElm.classList.contains("expanded")) {
      // Collapse: remove the extra grid items
      const extras = container.querySelectorAll(`.grid-item-extra[data-parent-id="${illustId}"]`);
      extras.forEach(el => {
        masonry.remove(el);
        el.remove();
      });
      gridElm.classList.remove("expanded");
      masonry.layout();
      return;
    }

    gridElm.classList.add("expanded", "loading");

    try {
      const pages = await fetchIllustPages(illustId);
      const newItems = [];
      let insertAfter = gridElm;

      for (let i = 1; i < pages.length; i++) {
        const extraElm = parseHTML(`
          <a class="grid-item grid-item-extra" data-parent-id="${illustId}" href="/en/artworks/${illustId}">
            <span class="extra-page-label">${i + 1} / ${pages.length}</span>
          </a>
        `);

        const img = new Image();
        newItems.push({ elm: extraElm, img, src: pages[i].urls.regular });
      }

      // Load images one by one and append to DOM only after each loads
      for (const { elm, img, src } of newItems) {
        await new Promise(resolve => {
          img.onload = () => {
            elm.prepend(img);
            insertAfter.after(elm);
            insertAfter = elm;
            masonry.reloadItems();
            masonry.layout();
            resolve();
          };
          img.onerror = resolve;
          img.src = src;
        });
      }
    } catch (e) {
      console.error("Failed to load pages for", illustId, e);
    } finally {
      gridElm.classList.remove("loading");
    }
  }

  async function loadIllustList(body) {
    await Promise.all(
      body.map(illust => {
        return new Promise(async (resolve) => {
          const src = illust.urls["1200x1200"];
          const pageCount = illust.pageCount || 1;
          const title = illust.title || "";

          const img = new Image();

          const gridElm = parseHTML(`
            <div class="grid-item${pageCount > 1 ? ' has-multiple' : ''}" data-id="${illust.id}">
            </div>
          `);

          const link = document.createElement("div");
          link.className = "grid-item-link";
          gridElm.appendChild(link);

          const info = parseHTML(`
            <div class="grid-item-info">
              <button class="grid-item-like${illust.bookmarkData ? ' bookmarked' : ''}" type="button" title="Like">
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              </button>
              <a class="grid-item-title" href="/en/artworks/${illust.id}" target="_blank" rel="noopener">${escapeHTML(title)}</a>
              ${pageCount > 1 ? `<span class="grid-item-badge">${pageCount}P</span>` : ''}
            </div>
          `);
          gridElm.appendChild(info);

          info.querySelector(".grid-item-like").addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(illust.id, e.currentTarget);
          });

          // Clicking the image area: expand if multi-page, open in new tab if single
          link.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (pageCount > 1) {
              toggleExpand(gridElm, illust.id);
            } else {
              window.open(`/en/artworks/${illust.id}`, "_blank");
            }
          });

          img.onload = () => {
            link.appendChild(img);
            container.appendChild(gridElm);
            masonry.appended(gridElm);
            masonry.layout();
            resolve();
          }

          img.onerror = () => {
            resolve();
          }

          img.src = src;
        });
      })
    );
  }


  switch (window.location.pathname) {
    case "/bookmark_new_illust.php":
    case "/bookmark_new_illust_r18.php": {
      let lastPageNumber = 0;
      async function loadNextPage() {
        const mode = window.location.pathname === "/bookmark_new_illust_r18.php" ? "r18" : "all";

        const json = await fetch(`https://www.pixiv.net/ajax/follow_latest/illust?p=${lastPageNumber}&mode=${mode}&lang=en`).then(d => d.json())

        await loadIllustList(json.body.thumbnails.illust);

        console.log("Loaded page", lastPageNumber);
      }

      let loading = false;
      setInterval(async () => {
        if (!checkIsElementVisible(
          container.children.item(container.children.length - 5) || container.lastElementChild,
          "vertical", 50)) return;
        if (loading) return;
        lastPageNumber++;
        loading = true;
        await loadNextPage();
        loading = false;
        console.log("Loading next page", lastPageNumber);
      }, 1000);
      break;
    }
    case "/discovery": {
      async function loadNextPage() {
        const mode = new URLSearchParams(window.location.search).get("mode") || "all";

        const json = await fetch(`https://www.pixiv.net/ajax/discovery/artworks?mode=${mode}&limit=60&lang=en`).then(d => d.json())

        await loadIllustList(json.body.thumbnails.illust);

        console.log("Loaded page");
      }

      let loading = false;
      setInterval(async () => {
        if (!checkIsElementVisible(
          container.children.item(container.children.length - 5) || container.lastElementChild,
          "vertical", 50)) return;
        if (loading) return;
        loading = true;
        await loadNextPage();
        loading = false;
        console.log("Loading next page", lastPageNumber);
      }, 1000);
      break;
    }
  }
}

main();