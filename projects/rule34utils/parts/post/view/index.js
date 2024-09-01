import { restoreScrollY } from "../../../other/saveScroll.js";
import { currentPageURL, escapeHTML, parseHTML } from "../../../utils.js";
import { buildPaginationElement, buildTagSidebar } from "../base/index.js";
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

        <div class="comments-container">
          <div class="header">
            <div class="title">Comments</div>
            <div class="subtext">Total ${content.comments.total_count} comments</div>
          </div>
          <div class="comments"></div>
        </div>
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

  const commentsContainerElm = contentElm.querySelector(".comments-container");

  commentsContainerElm.appendChild(
    buildPaginationElement(
      content.comments.pagination,
      {
        input(num) {
          const url = new URL(location.href);
          url.searchParams.set("pid", Math.max(num - 1, 0) * 10);
          location.href = url.href;
        },
        prev() {
          const url = new URL(location.href);
          url.searchParams.set("pid", Math.max(content.comments.pagination.current_page.pid - 10, 0));
          location.href = url.href;
        },
        next() {
          const url = new URL(location.href);
          url.searchParams.set("pid", content.comments.pagination.current_page.pid + 10);
          location.href = url.href;
        }
      }
    )
  )

  commentsContainerElm.querySelector(".comments").replaceChildren(
    ...content.comments.items.map((comment) => {
      const commentElm = parseHTML(`
        <div class="comment">
          <div class="date">${comment.date.toLocaleString()}</div>
          <div class="about">
            <a class="author" href="/index.php?page=account&s=profile&uname=${escapeHTML(comment.author)}">${escapeHTML(comment.author)}</a>
            <div class="score">
              <div class="icon">
                <i class="ri-arrow-up-s-line"></i>
              </div>
              <div class="value">${comment.score}</div>
            </div>
          </div>
          <div class="content">
            ${escapeHTML(comment.content)}
          </div>
        </div>
      `);
      return commentElm;
    })
  )


  document.body.appendChild(contentElm);
  restoreScrollY();
}
