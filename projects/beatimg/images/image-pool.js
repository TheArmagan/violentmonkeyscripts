/* Sayfadaki görselleri toplayan havuz.
 *
 * Eski sürümde her beat'te tüm DOM (`querySelectorAll('*')` + getComputedStyle)
 * taranıyordu; bu tek başına kare düşmesinin ana sebebiydi. Artık tarama
 * yalnızca seyrek aralıklarla ve boşta (requestIdleCallback), parça parça yapılır;
 * görünür alandaki <img>'ler ise IntersectionObserver ile anında yakalanır.
 */

import { PFX, POOL } from "../core/config.js";
import { absoluteUrl, idle } from "../utils/dom.js";
import { shuffle } from "../utils/math.js";

const SKIP_SELECTOR = `.${PFX}stage, .${PFX}panel, .${PFX}toggle`;
const BG_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/;

export class ImagePool {
  /** @param {import('./image-cache.js').ImageCache} cache */
  constructor(cache) {
    this.cache = cache;
    /** @type {Set<string>} */
    this.seen = new Set();
    /** @type {string[]} */
    this.list = [];
    this.onChange = null;

    this._queue = [];
    this._scrollQueue = [];
    this._lastFullScan = 0;
    this._lastBgScan = 0;
    this._sweeping = false;
    this._io = null;
    this._mo = null;
    this._destroyed = false;
  }

  get size() {
    return this.list.length;
  }

  start() {
    this._setupIntersection();
    this._setupMutation();
    this.scan(true);
  }

  destroy() {
    this._destroyed = true;
    this._io?.disconnect();
    this._mo?.disconnect();
    this._io = null;
    this._mo = null;
  }

  /* ---------------------------------------------------------------- */
  /* Gözlemciler                                                      */
  /* ---------------------------------------------------------------- */

  _setupIntersection() {
    this._io = new IntersectionObserver(
      (entries) => {
        let changed = false;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // entry.boundingClientRect gözlemci tarafından zaten hesaplanmıştır;
          // burada getBoundingClientRect çağırmak her görsel için zorunlu
          // layout (reflow) tetiklerdi.
          if (this._addImgEl(entry.target, entry.boundingClientRect)) {
            changed = true;
            this._io.unobserve(entry.target); // yakalandı, artık izlemeye gerek yok
          }
        }
        if (changed) this._notify();
      },
      { threshold: 0.01, rootMargin: "200px" }
    );
    this._observeAll(document);
  }

  _setupMutation() {
    // Yalnızca yeni <img> düğümlerini gözlemciye ekler — tarama tetiklemez.
    // (Eskiden her mutasyon tam DOM taraması planlıyordu; yoğun sayfalarda
    // bu, saniyede birkaç kez binlerce getComputedStyle çağrısı demekti.)
    this._mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.closest?.(SKIP_SELECTOR)) continue;
          if (node.tagName === "IMG") this._observe(node);
          else if (node.childElementCount) node.querySelectorAll("img").forEach((img) => this._observe(img));
        }
      }
    });
    this._mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  _observeAll(root) {
    root.querySelectorAll?.("img").forEach((img) => this._observe(img));
  }

  _observe(img) {
    if (!this._io || img.closest(SKIP_SELECTOR)) return;
    try {
      this._io.observe(img);
    } catch { }
  }

  /* ---------------------------------------------------------------- */
  /* Tarama                                                           */
  /* ---------------------------------------------------------------- */

  /**
   * Tarama. <img>'ler ucuz olduğu için doğrudan, background-image sweep'i ise
   * parça parça (her boşta 250 eleman) yapılır — ana iş parçacığı hiç bloklanmaz.
   */
  scan(force = false) {
    if (this._destroyed) return;
    const now = performance.now();
    if (!force && now - this._lastFullScan < POOL.scanMinGap) return;
    this._lastFullScan = now;

    idle(() => {
      if (this._destroyed) return;
      let changed = false;
      for (const img of document.querySelectorAll("img")) {
        this._observe(img);
        if (this._addImgEl(img)) changed = true;
      }
      if (changed) this._notify();
      // Arka plan taraması pahalıdır: sadece havuz zayıfken ve seyrek çalışır
      if (this.list.length < POOL.bgScanUntil && now - this._lastBgScan > POOL.bgScanGap) {
        this._lastBgScan = now;
        this._sweepBackgrounds();
      }
    }, 1200);
  }

  /** background-image taraması — zaman dilimlenmiş, asla tek karede bitmez */
  _sweepBackgrounds() {
    if (this._sweeping || !document.body) return;
    this._sweeping = true;
    const all = document.body.querySelectorAll("*");
    const total = Math.min(all.length, POOL.bgScanMax);
    let i = 0;

    const step = () => {
      if (this._destroyed) { this._sweeping = false; return; }
      const end = Math.min(total, i + POOL.bgScanChunk);
      let changed = false;
      for (; i < end; i++) {
        const node = all[i];
        // Ucuz eleme önce: layout okumadan boyutu yeterince küçük olanları at
        if (node.offsetWidth < POOL.minRendered || node.offsetHeight < POOL.minRendered) continue;
        const bg = getComputedStyle(node).backgroundImage;
        if (!bg || bg === "none" || bg.indexOf("url(") === -1) continue;
        if (node.closest(SKIP_SELECTOR)) continue;
        const m = BG_URL_RE.exec(bg);
        if (m && this._add(m[2])) changed = true;
      }
      if (changed) this._notify();
      if (i < total) idle(step, 800);
      else this._sweeping = false;
    };
    idle(step, 800);
  }

  /**
   * @param {HTMLImageElement} img
   * @param {DOMRectReadOnly} [rect] varsa yeniden layout okunmaz
   */
  _addImgEl(img, rect) {
    const src = img.currentSrc || img.src;
    if (!src) return false;
    if (img.naturalWidth && (img.naturalWidth < POOL.minNatural || img.naturalHeight < POOL.minNatural)) return false;
    // offsetWidth/Height, getBoundingClientRect'e göre çok daha ucuz bir okuma
    const w = rect ? rect.width : img.offsetWidth;
    const h = rect ? rect.height : img.offsetHeight;
    if (w < POOL.minRendered || h < POOL.minRendered) return false;
    if (img.closest(SKIP_SELECTOR)) return false;
    return this._add(src);
  }

  _add(rawSrc) {
    if (this.list.length >= POOL.maxImages) return false;
    const src = absoluteUrl(rawSrc);
    if (!src) return false;
    if (src.startsWith("data:image/svg") || src.startsWith("blob:null")) return false;
    if (this.seen.has(src)) return false;
    this.seen.add(src);
    this.list.push(src);
    return true;
  }

  /** Bozuk/erişilemeyen kaynağı havuzdan çıkarır */
  _drop(src) {
    if (!this.seen.delete(src)) return;
    const i = this.list.indexOf(src);
    if (i >= 0) this.list.splice(i, 1);
    this.onChange?.(this.list.length);
  }

  _notify() {
    // Yeni gelenleri arka planda indirmeye başla (ilk beat'te takılma olmasın)
    this.cache.preload(this.list.slice(-24));
    this.onChange?.(this.list.length);
  }

  clear() {
    this.seen.clear();
    this.list.length = 0;
    this._queue.length = 0;
    this._scrollQueue.length = 0;
    this.onChange?.(0);
    this.scan(true);
  }

  /* ---------------------------------------------------------------- */
  /* Kuyruklar — her görsel tekrar etmeden bir tur gösterilir          */
  /* ---------------------------------------------------------------- */

  _dequeue(queueName, count) {
    const out = [];
    const q = this[queueName];
    if (!this.list.length) return out;
    let guard = 0;
    while (out.length < count && guard++ < count * 4) {
      if (!q.length) q.push(...shuffle(this.list));
      const src = q.shift();
      if (this.seen.has(src)) out.push(src);
    }
    return out;
  }

  /**
   * Sahne için görsel seçer. Öncelik indirmesi bitmiş olanlarda —
   * böylece sahne beat anında boş kare göstermez.
   * @returns {import('./image-cache.js').ImageEntry[]}
   */
  takeReady(count) {
    if (!this.list.length) return [];
    const picked = [];
    const fallback = [];
    const wanted = Math.min(count, this.list.length);
    const candidates = this._dequeue("_queue", Math.max(wanted * 3, wanted + 6));

    for (const src of candidates) {
      if (this.cache.entries.get(src)?.state === "error") {
        this._drop(src); // indirilemeyen görsel havuzda birikmesin
        continue;
      }
      const entry = this.cache.ready(src);
      if (entry) {
        if (picked.length < wanted) picked.push(entry);
      } else if (fallback.length < wanted) {
        fallback.push(src);
      }
      if (picked.length >= wanted) break;
    }
    // Hazır görsel yetmediyse bir sonraki beat'e hazır olsunlar diye indirmeyi tetikle
    this.cache.preload(fallback);
    return picked;
  }

  /** Kayan şerit için tek bir kaynak (hazır olması şart değil) */
  nextScrollSrc() {
    const [src] = this._dequeue("_scrollQueue", 1);
    return src || null;
  }
}
