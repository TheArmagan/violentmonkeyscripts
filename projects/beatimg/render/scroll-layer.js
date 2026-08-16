/* Arka planda sürekli kayan görsel şeritleri.
 *
 * Eskiden yüzlerce DOM div'i GSAP ile taşınıyordu; artık her satır basit bir
 * öğe listesi ve tek bir x ofseti ile canvas'a çizilir. Ekran dışına çıkan öğe
 * geri dönüştürülür, böylece bellek ve DOM maliyeti sabit kalır.
 */

import { clamp, lerp, rand } from "../utils/math.js";

const GAP = 8;
const BASE_SPEED = 90; // px/sn

export class ScrollLayer {
  /**
   * @param {import('../images/image-pool.js').ImagePool} pool
   * @param {import('../images/image-cache.js').ImageCache} cache
   */
  constructor(pool, cache) {
    this.pool = pool;
    this.cache = cache;
    this.rows = [];
    this.w = 0;
    this.h = 0;
    this.enabled = true;
    this.pulse = 0;
    this.speedScale = 1;
  }

  configure(count) {
    const defs = [
      { dir: -1, speedMul: 1.0 },
      { dir: 1, speedMul: 0.72 },
      { dir: -1, speedMul: 1.35 },
      { dir: 1, speedMul: 0.55 },
    ];
    const n = clamp(count | 0, 0, defs.length);
    this.rows = defs.slice(0, n).map((d) => ({ ...d, items: [], y: 0, h: 0 }));
    this._layout();
  }

  resize(w, h) {
    this.w = w;
    this.h = h;
    this._layout();
  }

  _layout() {
    const n = this.rows.length;
    if (!n || !this.h) return;
    const rowH = this.h / n;
    this.rows.forEach((row, i) => {
      row.y = i * rowH + 4;
      row.h = rowH - 8;
      row.items.length = 0; // yeni yükseklikte yeniden doldurulur
    });
  }

  reset() {
    for (const row of this.rows) row.items.length = 0;
    this.pulse = 0;
  }

  onBeat(strength) {
    this.pulse = Math.min(1, this.pulse + strength * 0.6);
  }

  /**
   * @param {number} dt saniye
   * @param {number} speedScale BPM + enerjiden gelen hız çarpanı
   */
  update(dt, speedScale) {
    if (!this.enabled || !this.rows.length || !this.w) return;
    this.speedScale = lerp(this.speedScale, speedScale, clamp(dt * 6, 0, 1));
    this.pulse = Math.max(0, this.pulse - dt * 2.2);

    for (const row of this.rows) {
      this._fill(row);
      const v = BASE_SPEED * this.speedScale * row.speedMul * row.dir * dt;
      for (const it of row.items) it.x += v;
      this._recycle(row);
    }
  }

  _newItem(row, x) {
    const src = this.pool.nextScrollSrc();
    if (!src) return null;
    const w = row.h * rand(1.05, 1.6);
    return { src, x, w, entry: null, tries: 0 };
  }

  _fill(row) {
    if (!this.pool.size) return;
    let guard = 0;
    if (!row.items.length) {
      let x = 0;
      while (x < this.w + row.h * 2 && guard++ < 64) {
        const it = this._newItem(row, x);
        if (!it) break;
        row.items.push(it);
        x += it.w + GAP;
      }
      return;
    }
    // Sağ uçtaki boşluğu kapat
    const last = row.items[row.items.length - 1];
    let right = last.x + last.w;
    while (right < this.w + row.h && guard++ < 32) {
      const it = this._newItem(row, right + GAP);
      if (!it) break;
      row.items.push(it);
      right = it.x + it.w;
    }
    // Sol uçtaki boşluğu kapat
    let left = row.items[0].x;
    while (left > -row.h && guard++ < 64) {
      const it = this._newItem(row, 0);
      if (!it) break;
      it.x = left - GAP - it.w;
      row.items.unshift(it);
      left = it.x;
    }
  }

  _recycle(row) {
    while (row.items.length && row.items[0].x + row.items[0].w < -row.h) row.items.shift();
    while (row.items.length && row.items[row.items.length - 1].x > this.w + row.h) row.items.pop();
  }

  draw(ctx, env) {
    if (!this.enabled || !this.rows.length) return;
    const glow = 0.55 + this.pulse * 0.35;
    ctx.save();
    ctx.globalAlpha = clamp(glow, 0, 1);
    for (const row of this.rows) {
      for (const it of row.items) {
        if (it.x + it.w < 0 || it.x > this.w) continue;
        if (!it.entry) {
          it.entry = this.cache.ready(it.src);
          if (!it.entry) {
            // İndirilemeyen kaynağı sessizce başkasıyla değiştir
            if (this.cache.entries.get(it.src)?.state === "error") {
              const next = this.pool.nextScrollSrc();
              if (next) it.src = next;
            }
            continue;
          }
        }
        const e = it.entry;
        if (!e.img) { it.entry = null; continue; }
        // Şerit görselleri küçük çizilir; hazır küçültülmüş kopya kullanmak
        // her karede tam çözünürlük örneklemekten kat kat ucuz
        const src = this.cache.source(e, it.w, row.h);
        if (!src) continue;
        const s = Math.max(it.w / src.w, row.h / src.h);
        const sw = it.w / s;
        const sh = row.h / s;
        ctx.drawImage(src.img, (src.w - sw) / 2, (src.h - sh) / 2, sw, sh, it.x, row.y, it.w, row.h);
      }
    }
    ctx.restore();

    if (this.pulse > 0.02 && env.quality > 0) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = this.pulse * 0.12;
      ctx.fillStyle = env.beatColor || "#ffffff";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
  }
}
