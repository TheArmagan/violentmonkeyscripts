/* Görsel indirme / çözme önbelleği.
 *
 * Canvas'a çizim için HTMLImageElement yeterlidir; piksel okuması (getImageData)
 * hiçbir yerde yapılmadığından cross-origin görseller canvas'ı "tainted" yapsa
 * bile çizim sorunsuz çalışır. crossOrigin bilerek ayarlanmaz — aksi halde CORS
 * başlığı olmayan siteler tamamen kırılırdı.
 */

import { CACHE } from "../core/config.js";

/**
 * @typedef {Object} ImageEntry
 * @property {string} src
 * @property {HTMLImageElement|null} img
 * @property {'idle'|'loading'|'ready'|'error'} state
 * @property {number} w
 * @property {number} h
 * @property {number} used  son kullanım zamanı
 * @property {Map<string, HTMLCanvasElement>} tints
 */

export class ImageCache {
  constructor() {
    /** @type {Map<string, ImageEntry>} */
    this.entries = new Map();
    this._queue = [];
    this._active = 0;
    this._tintOwners = [];
    this._thumbs = []; // LRU — {entry, key}
    this.thumbBudget = 2; // kare başına üretilebilecek küçük kopya sayısı
  }

  /** Girdiyi döner, yoksa oluşturur (indirme başlatmaz) */
  entry(src) {
    let e = this.entries.get(src);
    if (!e) {
      e = { src, img: null, state: "idle", w: 0, h: 0, used: 0, tints: new Map(), thumbs: new Map() };
      this.entries.set(src, e);
    }
    return e;
  }

  /** Çizime hazır görseli döner; hazır değilse indirmeyi kuyruğa alır ve null döner */
  ready(src) {
    const e = this.entry(src);
    if (e.state === "ready") {
      e.used = performance.now();
      return e;
    }
    if (e.state === "idle") this.load(src);
    return null;
  }

  /** Görseli indirir/çözer */
  load(src) {
    const e = this.entry(src);
    if (e.state === "ready" || e.state === "loading") return;
    if (e.state === "error") return;
    e.state = "loading";
    this._queue.push(e);
    this._drain();
  }

  /** Birden çok URL'yi önceden yükler */
  preload(list) {
    for (const src of list) {
      const e = this.entries.get(src);
      if (!e || e.state === "idle") this.load(src);
    }
  }

  _drain() {
    while (this._active < CACHE.maxConcurrent && this._queue.length) {
      const e = this._queue.shift();
      this._active++;
      this._fetch(e).finally(() => {
        this._active--;
        this._drain();
      });
    }
  }

  async _fetch(e) {
    const img = new Image();
    img.decoding = "async";
    img.referrerPolicy = "no-referrer-when-downgrade";
    const done = new Promise((resolve) => {
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
    img.src = e.src;
    let ok = await done;
    if (ok && typeof img.decode === "function") {
      // decode() bazı tarayıcılarda cross-origin'de reddedebilir; onload zaten yeterli
      try { await img.decode(); } catch { }
    }
    const w = img.naturalWidth || 0;
    const h = img.naturalHeight || 0;
    if (!ok || !w || !h) {
      e.state = "error";
      e.img = null;
      return;
    }
    // Çok büyük görseller bellekte ham haliyle tutulmaz: 4000×3000'lik bir
    // fotoğrafın çözülmüş hali ~48 MB'tır; onlarcası birikince tarayıcı
    // bellek baskısıyla takılır. Bir kez küçültüp orijinali bırakıyoruz.
    const maxSide = Math.max(w, h);
    if (maxSide > CACHE.storeMax) {
      const s = CACHE.storeMax / maxSide;
      const dw = Math.max(1, Math.round(w * s));
      const dh = Math.max(1, Math.round(h * s));
      const cv = document.createElement("canvas");
      cv.width = dw;
      cv.height = dh;
      const g = cv.getContext("2d");
      if (g) {
        g.imageSmoothingQuality = "high";
        g.drawImage(img, 0, 0, dw, dh);
        e.img = cv;
        e.w = dw;
        e.h = dh;
        e.state = "ready";
        e.used = performance.now();
        this._prune();
        return;
      }
    }

    e.img = img;
    e.w = w;
    e.h = h;
    e.state = "ready";
    e.used = performance.now();
    this._prune();
  }

  /** En uzun süredir kullanılmayan çözülmüş görselleri serbest bırakır */
  _prune() {
    const ready = [];
    for (const e of this.entries.values()) if (e.state === "ready") ready.push(e);
    if (ready.length <= CACHE.maxDecoded) return;
    ready.sort((a, b) => a.used - b.used);
    const drop = ready.length - CACHE.maxDecoded;
    for (let i = 0; i < drop; i++) {
      const e = ready[i];
      e.img = null;
      e.state = "idle";
      e.tints.clear();
      e.thumbs.clear();
    }
    this._thumbs = this._thumbs.filter((t) => t.entry.state === "ready");
  }

  /**
   * Hedef kutuya uygun ölçekte, önceden küçültülmüş kopya döner.
   *
   * Bu, kare maliyetindeki en büyük kazanç: 4000×3000'lik bir fotoğrafı her
   * karede 400×300'lük bir kutuya ölçeklemek yerine bir kez küçültüp sonraki
   * tüm karelerde hazır kopyayı çiziyoruz. Boyut kademeli (256px adım) olduğu
   * için animasyon sırasında büyüyen/küçülen sprite'lar sürekli yeni kopya
   * üretmez.
   *
   * @returns {{img: CanvasImageSource, w: number, h: number}}
   */
  source(entry, targetW, targetH) {
    if (entry.state !== "ready" || !entry.img) return null;
    const maxSide = Math.max(entry.w, entry.h);
    // Ekranda kapladığı en uzun kenar (biraz pay bırakılır — zoom efektleri için)
    const need = Math.max(targetW, targetH) * 1.35;
    if (maxSide <= need * 1.2) return { img: entry.img, w: entry.w, h: entry.h };

    const step = CACHE.thumbStep;
    const bucket = Math.min(CACHE.thumbMax, maxSide, Math.max(step, Math.ceil(need / step) * step));
    const hit = entry.thumbs.get(bucket);
    if (hit) {
      entry.used = performance.now();
      return hit;
    }
    // Aynı karede birden çok kopya üretmek tek bir kare sıçramasına yol açar;
    // kalanlar bir sonraki karede üretilir (bu kare tam çözünürlükten çizilir).
    if (this.thumbBudget <= 0) return { img: entry.img, w: entry.w, h: entry.h };
    this.thumbBudget--;

    const s = bucket / maxSide;
    const w = Math.max(1, Math.round(entry.w * s));
    const h = Math.max(1, Math.round(entry.h * s));
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const g = cv.getContext("2d");
    if (!g) return { img: entry.img, w: entry.w, h: entry.h };
    g.imageSmoothingQuality = "medium";
    g.drawImage(entry.img, 0, 0, w, h);

    const rec = { img: cv, w, h };
    entry.thumbs.set(bucket, rec);
    this._thumbs.push({ entry, key: bucket });
    while (this._thumbs.length > CACHE.maxThumbs) {
      const old = this._thumbs.shift();
      old.entry.thumbs.delete(old.key);
    }
    return rec;
  }

  /**
   * Görselin tek kanala boyanmış küçük kopyasını döner (RGB split efektleri için).
   * Piksel okuması yapmaz — multiply + destination-in kompozisyonu kullanır.
   */
  tinted(e, color) {
    if (e.state !== "ready" || !e.img) return null;
    const hit = e.tints.get(color);
    if (hit) return hit;

    const s = Math.min(1, CACHE.tintMaxDim / Math.max(e.w, e.h));
    const w = Math.max(1, Math.round(e.w * s));
    const h = Math.max(1, Math.round(e.h * s));
    const cv = document.createElement("canvas");
    cv.width = w;
    cv.height = h;
    const g = cv.getContext("2d");
    if (!g) return null;
    // Kaynak olarak (varsa) hazır küçük kopya kullanılır — tam çözünürlükten ucuz
    const src = e.thumbs.get([...e.thumbs.keys()][0]) || { img: e.img, w: e.w, h: e.h };
    g.drawImage(src.img, 0, 0, w, h);
    g.globalCompositeOperation = "multiply";
    g.fillStyle = color;
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = "destination-in";
    g.drawImage(src.img, 0, 0, w, h);
    e.tints.set(color, cv);

    if (!this._tintOwners.includes(e)) {
      this._tintOwners.push(e);
      while (this._tintOwners.length > CACHE.maxTintEntries) {
        this._tintOwners.shift().tints.clear();
      }
    }
    return cv;
  }

  clear() {
    this.entries.clear();
    this._queue.length = 0;
    this._tintOwners.length = 0;
    this._thumbs.length = 0;
  }
}
