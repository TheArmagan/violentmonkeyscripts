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

  const masonry = new Masonry(container, {
    itemSelector: '.grid-item',
    fitWidth: true,
    stagger: 30,
    transitionDuration: "200ms"
  });

  async function loadIllustList(body) {
    await Promise.all(
      body.map(illust => {
        return new Promise(async (resolve) => {
          const src = illust.urls["1200x1200"];

          const img = new Image();

          const gridElm = parseHTML(`
          <a class="grid-item" href="/en/artworks/${illust.id}">
          </a>
        `);

          img.onload = () => {
            gridElm.appendChild(img);
            masonry.appended(gridElm);
            masonry.layout();
            resolve();
          }

          img.onerror = () => {
            resolve();
          }

          img.src = src;

          container.appendChild(gridElm);
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