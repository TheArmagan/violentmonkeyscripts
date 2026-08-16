/* BeatImg — sayfadaki görselleri müziğin ritmine göre canvas üzerinde patlatır.
 *
 * Dosya düzeni:
 *   core/     ayarlar ve sabitler
 *   audio/    Web Audio grafiği + beat algılama
 *   images/   görsel toplama ve önbellek
 *   render/   canvas sahnesi, efektler, parçacıklar
 *   ui/       kontrol paneli ve spektrum görselleştirici
 */

import "./styles.scss";
import { BeatImgApp } from "./app.js";

let instance = null;

function boot() {
  if (instance) return;
  if (window.top !== window.self) return; // iframe'lerde çalışma
  if (!document.body) return;
  try {
    instance = new BeatImgApp();
    instance.init();
    window.__beatimg = instance;
  } catch (err) {
    console.error("[BeatImg] failed to start:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 400), { once: true });
} else {
  setTimeout(boot, 400);
}
