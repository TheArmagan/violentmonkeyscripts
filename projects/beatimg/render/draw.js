/* Canvas çizim yardımcıları.
 *
 * Tüm efektler burada, DOM/CSS filter yerine doğrudan 2D context ile çizilir.
 * Piksel okuması (getImageData) hiçbir yerde kullanılmaz; böylece cross-origin
 * görseller de sorunsuz çizilebilir.
 */

import { clamp, seeded } from "../utils/math.js";

/** Kaynağın hedefi tamamen kaplayan (cover) kırpma dikdörtgeni */
export function coverRect(iw, ih, w, h) {
  const s = Math.max(w / iw, h / ih);
  const sw = w / s;
  const sh = h / s;
  return { sx: (iw - sw) / 2, sy: (ih - sh) / 2, sw, sh };
}

/** Görseli hedef kutuya cover/contain olarak çizer */
export function drawFit(ctx, img, iw, ih, x, y, w, h, mode = "cover") {
  if (!iw || !ih || w <= 0 || h <= 0) return;
  if (mode === "contain") {
    const s = Math.min(w / iw, h / ih);
    const dw = iw * s;
    const dh = ih * s;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  } else {
    const { sx, sy, sw, sh } = coverRect(iw, ih, w, h);
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }
}

export function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, rr);
  else {
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }
}

const CHANNELS = [
  ["#ff0000", -1],
  ["#00ff00", 0],
  ["#0000ff", 1],
];

export class Painter {
  /** @param {import('../images/image-cache.js').ImageCache} cache */
  constructor(cache) {
    this.cache = cache;
    this.scratch = document.createElement("canvas");
    this.sctx = this.scratch.getContext("2d");
    this.quality = 2; // 0 = düşük, 1 = orta, 2 = yüksek
  }

  /**
   * Bir görseli verilen stil ile hedef kutuya çizer.
   * Çağıran taraf transformları (translate/rotate/scale) zaten uygulamış olmalıdır.
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('../images/image-cache.js').ImageEntry} entry
   * @param {{x:number,y:number,w:number,h:number,fit:string,seed:number}} box
   * @param {Object} st stil
   */
  paint(ctx, entry, box, st) {
    if (!entry.img) return;
    // Her karede tam çözünürlükten ölçeklemek yerine hazır küçük kopya kullanılır
    const src = this.cache.source(entry, box.w, box.h);
    if (!src) return;
    const { x, y, w, h, fit } = box;

    if (st.wipe) {
      ctx.save();
      this._clipWipe(ctx, st.wipe, x, y, w, h);
    }

    if (st.echo > 0 && this.quality > 0) this._echo(ctx, src, box, st);

    if (st.blocks && this.quality > 0) this._blocks(ctx, src, box, st.blocks);
    else if (st.slices && this.quality > 0) this._slices(ctx, src, box, st.slices);
    else if (st.roll) this._roll(ctx, src, box, st.roll);
    else if (st.pixel > 1.5 && this.quality > 0) this._pixel(ctx, src, box, st.pixel);
    else if (st.rgbSplit > 0.5 && this.quality > 1) this._rgb(ctx, entry, src, box, st.rgbSplit);
    else drawFit(ctx, src.img, src.w, src.h, x, y, w, h, fit);

    if (st.glow > 0.01) {
      const prev = ctx.globalCompositeOperation;
      const a = ctx.globalAlpha;
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = a * clamp(st.glow, 0, 1);
      drawFit(ctx, src.img, src.w, src.h, x, y, w, h, fit);
      ctx.globalCompositeOperation = prev;
      ctx.globalAlpha = a;
    }

    if (st.tint && st.tintAlpha > 0.01) {
      const prev = ctx.globalCompositeOperation;
      const a = ctx.globalAlpha;
      ctx.globalCompositeOperation = st.tintMode || "overlay";
      ctx.globalAlpha = a * clamp(st.tintAlpha, 0, 1);
      ctx.fillStyle = st.tint;
      ctx.fillRect(x, y, w, h);
      ctx.globalCompositeOperation = prev;
      ctx.globalAlpha = a;
    }

    if (st.wipe) ctx.restore();
  }

  /* -------------------------------------------------------------- */
  /* Çizim modları                                                   */
  /* -------------------------------------------------------------- */

  _echo(ctx, src, box, st) {
    const n = Math.min(4, Math.round(st.echo));
    const a = ctx.globalAlpha;
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    for (let i = n; i >= 1; i--) {
      const k = i / (n + 1);
      const s = 1 + k * (st.echoScale ?? 0.16);
      const ew = box.w * s;
      const eh = box.h * s;
      ctx.globalAlpha = a * 0.24 * (1 - k);
      drawFit(
        ctx, src.img, src.w, src.h,
        box.x - (ew - box.w) / 2 + (st.echoDx || 0) * k,
        box.y - (eh - box.h) / 2 + (st.echoDy || 0) * k,
        ew, eh, box.fit
      );
    }
    ctx.globalAlpha = a;
    ctx.globalCompositeOperation = prev;
  }

  _rgb(ctx, entry, src, box, amount) {
    const { x, y, w, h, fit } = box;
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "lighter";
    let drew = false;
    for (const [color, dir] of CHANNELS) {
      const cv = this.cache.tinted(entry, color);
      if (!cv) continue;
      drew = true;
      drawFit(ctx, cv, cv.width, cv.height, x + dir * amount, y + dir * amount * 0.35, w, h, fit);
    }
    ctx.globalCompositeOperation = prev;
    if (!drew) drawFit(ctx, src.img, src.w, src.h, x, y, w, h, fit);
  }

  _pixel(ctx, src, box, size) {
    const { x, y, w, h, fit } = box;
    const px = clamp(size, 2, 64);
    const sw = Math.max(2, Math.round(w / px));
    const sh = Math.max(2, Math.round(h / px));
    const s = this.scratch;
    if (s.width < sw || s.height < sh) {
      s.width = Math.max(s.width, sw, 64);
      s.height = Math.max(s.height, sh, 64);
    }
    const g = this.sctx;
    g.clearRect(0, 0, sw, sh);
    g.imageSmoothingEnabled = true;
    drawFit(g, src.img, src.w, src.h, 0, 0, sw, sh, fit);
    const smoothing = ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s, 0, 0, sw, sh, x, y, w, h);
    ctx.imageSmoothingEnabled = smoothing;
  }

  /** Yatay (veya dikey) şeritleri kaydırarak çizer — glitch/shatter için */
  _slices(ctx, src, box, cfg) {
    const { x, y, w, h, fit } = box;
    const vertical = !!cfg.vertical;
    const n = clamp(Math.round(cfg.n || 8), 2, 16);
    const amp = cfg.amp || 0;
    const rnd = seeded(box.seed);
    const rect = fit === "contain" ? null : coverRect(src.w, src.h, w, h);
    const sx0 = rect ? rect.sx : 0;
    const sy0 = rect ? rect.sy : 0;
    const sw0 = rect ? rect.sw : src.w;
    const sh0 = rect ? rect.sh : src.h;

    for (let i = 0; i < n; i++) {
      const t0 = i / n;
      const off = (rnd() * 2 - 1) * amp;
      if (vertical) {
        ctx.drawImage(
          src.img,
          sx0 + sw0 * t0, sy0, sw0 / n, sh0,
          x + w * t0, y + off, w / n + 0.6, h
        );
      } else {
        ctx.drawImage(
          src.img,
          sx0, sy0 + sh0 * t0, sw0, sh0 / n,
          x + off, y + h * t0, w, h / n + 0.6
        );
      }
    }
  }

  /** Rastgele blok yer değiştirme — datamosh görünümü */
  _blocks(ctx, src, box, cfg) {
    const { x, y, w, h } = box;
    const cols = clamp(Math.round(cfg.cols || 6), 2, 10);
    const rows = clamp(Math.round(cfg.rows || 5), 2, 8);
    const amp = cfg.amp || 0;
    const rnd = seeded(box.seed + (cfg.frame || 0));
    const rect = coverRect(src.w, src.h, w, h);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitter = rnd();
        const dx = jitter < 0.45 ? (rnd() * 2 - 1) * amp : 0;
        const dy = jitter > 0.85 ? (rnd() * 2 - 1) * amp * 0.35 : 0;
        ctx.drawImage(
          src.img,
          rect.sx + (rect.sw * c) / cols, rect.sy + (rect.sh * r) / rows,
          rect.sw / cols, rect.sh / rows,
          x + (w * c) / cols + dx, y + (h * r) / rows + dy,
          w / cols + 0.6, h / rows + 0.6
        );
      }
    }
  }

  /** Dikey sarmalı kaydırma — VHS roll */
  _roll(ctx, src, box, amount) {
    const { x, y, w, h, fit } = box;
    const off = ((amount % 1) + 1) % 1;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    drawFit(ctx, src.img, src.w, src.h, x, y + h * off, w, h, fit);
    drawFit(ctx, src.img, src.w, src.h, x, y + h * off - h, w, h, fit);
    ctx.restore();
  }

  _clipWipe(ctx, wipe, x, y, w, h) {
    const p = clamp(wipe.p, 0, 1);
    ctx.beginPath();
    switch (wipe.dir) {
      case "left": ctx.rect(x, y, w * p, h); break;
      case "right": ctx.rect(x + w * (1 - p), y, w * p, h); break;
      case "up": ctx.rect(x, y, w, h * p); break;
      default: ctx.rect(x, y + h * (1 - p), w, h * p); break;
    }
    ctx.clip();
  }
}
