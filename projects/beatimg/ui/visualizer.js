/* Panel içindeki spektrum görselleştirici.
 * Yalnızca panel açıkken çizilir; kapalıyken hiç iş yapılmaz.
 */

import { clamp } from "../utils/math.js";

const BARS = 48;

export class Visualizer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.values = new Float32Array(BARS);
    this.peaks = new Float32Array(BARS);
    this.enabled = false;
    this._sized = false;
  }

  _size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = this.canvas.clientWidth || 240;
    const h = this.canvas.clientHeight || 54;
    const cw = Math.round(w * dpr);
    const ch = Math.round(h * dpr);
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    this._sized = true;
  }

  clear() {
    if (!this._sized) this._size();
    this.ctx.clearRect(0, 0, this.w, this.h);
    this.values.fill(0);
    this.peaks.fill(0);
  }

  /**
   * @param {Uint8Array} spectrum
   * @param {number} dt saniye
   */
  draw(spectrum, dt) {
    if (!this.enabled || !spectrum) return;
    if (!this._sized || this.canvas.clientWidth !== this.w) this._size();
    const { ctx, w, h } = this;
    ctx.clearRect(0, 0, w, h);

    // Logaritmik bant dağılımı — bas taraf ezilmesin
    const n = spectrum.length;
    const barW = w / BARS;
    const decay = clamp(dt * 6, 0, 1);

    for (let i = 0; i < BARS; i++) {
      const lo = Math.floor(Math.pow(i / BARS, 1.9) * n);
      const hi = Math.max(lo + 1, Math.floor(Math.pow((i + 1) / BARS, 1.9) * n));
      let sum = 0;
      for (let j = lo; j < hi; j++) sum += spectrum[j];
      const v = sum / (hi - lo) / 255;

      this.values[i] = Math.max(v, this.values[i] - decay * 0.9);
      this.peaks[i] = Math.max(this.values[i], this.peaks[i] - decay * 0.35);

      const bh = Math.max(1, this.values[i] * h);
      const hue = 265 - (i / BARS) * 190;
      ctx.fillStyle = `hsl(${hue}, 88%, ${48 + this.values[i] * 22}%)`;
      ctx.fillRect(i * barW + 0.5, h - bh, barW - 1.2, bh);

      const ph = this.peaks[i] * h;
      ctx.fillStyle = `hsla(${hue}, 95%, 78%, 0.85)`;
      ctx.fillRect(i * barW + 0.5, h - ph - 1.5, barW - 1.2, 1.5);
    }
  }
}
