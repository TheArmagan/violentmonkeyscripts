import { currentPageURL, parseHTML } from "../../../utils.js";
import { buildTagSidebar } from "../base/index.js";
import { parsePostViewPageContent } from "./parsers.js";
import "./styles.scss";

export function patchPostViewPage() {
  if (!(currentPageURL.searchParams.get("page") === "post" && currentPageURL.searchParams.get("s") === "view")) return;

  const content = parsePostViewPageContent(document.querySelector("#content"));
  console.log("Post View Page", content);

  (() => {
    const player = document.querySelector("#gelcomVideoContainer");
    if (player) {
      player.remove();
      player.setAttribute("style", "display: none;");
      document.body.append(player);
    }
  })();

  document.querySelector("#content").remove();


  /** @type {HTMLDivElement} */
  const contentElm = parseHTML(`
    <div class="r34u--post-view-content">
      <div class="r34u--post-view">
        <div class="media"></div>
      </div>
    </div>
  `);

  contentElm.prepend(buildTagSidebar(content.tags));

  const mediaElm = contentElm.querySelector(".media");


  if (content.content.is_video) {
    /** @type {HTMLVideoElement} */
    const videoElm = parseHTML(`<video controls loop playsinline></video>`);
    videoElm.src = content.content.url;

    videoElm.volume = parseFloat(localStorage.getItem("r34u--video-volume") || "0.25");

    videoElm.addEventListener("volumechange", () => {
      localStorage.setItem("r34u--video-volume", videoElm.volume.toFixed(2));
    });

    mediaElm.appendChild(videoElm);
  } else {
    const imgElm = parseHTML(`<img />`);
    imgElm.src = content.content.url;

    mediaElm.appendChild(imgElm);
  }

  document.body.appendChild(contentElm);
}
