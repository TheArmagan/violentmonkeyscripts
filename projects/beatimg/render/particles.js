/* Basit parçacık sistemi — beat anında kıvılcım / şok dalgası.
 * Sabit boyutlu havuz kullanır, çalışma sırasında bellek ayırmaz.
 */

import { clamp, rand } from "../utils/math.js";

const MAX = 320;

export class Particles {
  constructor() {
    this.items = new Array(MAX).fill(null).map(() => ({
      alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 1, r: 255, g: 255, b: 255, drag: 0.9,
    }));
    this.cursor = 0;
    this.rings = [];
    this.enabled = true;
  }

  _spawn() {
    for (let i = 0; i < MAX; i++) {
      const p = this.items[(this.cursor + i) % MAX];
      if (!p.alive) {
        this.cursor = (this.cursor + i + 1) % MAX;
        return p;
      }
    }
    return this.items[(this.cursor = (this.cursor + 1) % MAX)];
  }

  /** Merkezden dışa kıvılcım patlaması */
  burst(x, y, rgb, strength, quality = 2) {
    if (!this.enabled) return;
    const n = Math.round(clamp(strength, 0.2, 1) * (quality > 1 ? 46 : 18));
    for (let i = 0; i < n; i++) {
      const p = this._spawn();
      const a = rand(0, Math.PI * 2);
      const sp = rand(140, 620) * (0.55 + strength);
      p.alive = true;
      p.x = x;
      p.y = y;
      p.vx = Math.cos(a) * sp;
      p.vy = Math.sin(a) * sp;
      p.max = rand(0.35, 0.85);
      p.life = p.max;
      p.size = rand(1.2, 3.4);
      p.drag = rand(0.86, 0.94);
      p.r = rgb[0];
      p.g = rgb[1];
      p.b = rgb[2];
    }
    this.rings.push({ x, y, r: 10, vr: 900 * (0.5 + strength), life: 0.45, max: 0.45, rgb });
    if (this.rings.length > 6) this.rings.shift();
  }

  update(dt) {
    for (const p of this.items) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      const d = Math.pow(p.drag, dt * 60);
      p.vx *= d;
      p.vy *= d;
      p.vy += 260 * dt; // hafif yerçekimi
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    for (const r of this.rings) {
      r.life -= dt;
      r.r += r.vr * dt;
      r.vr *= Math.pow(0.9, dt * 60);
    }
    this.rings = this.rings.filter((r) => r.life > 0);
  }

  draw(ctx) {
    if (!this.enabled) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (const r of this.rings) {
      const a = clamp(r.life / r.max, 0, 1);
      ctx.strokeStyle = `rgba(${r.rgb[0]},${r.rgb[1]},${r.rgb[2]},${a * 0.5})`;
      ctx.lineWidth = 2 + a * 6;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const p of this.items) {
      if (!p.alive) continue;
      const a = clamp(p.life / p.max, 0, 1);
      ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${a})`;
      const s = p.size * (0.4 + a);
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.restore();
  }

  clear() {
    for (const p of this.items) p.alive = false;
    this.rings.length = 0;
  }
}
