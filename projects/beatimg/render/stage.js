/* Tek canvas sahnesi — tüm görsel katmanlar burada, tek bir rAF döngüsünde çizilir.
 *
 * Eski DOM/GSAP tabanlı yaklaşımda her beat onlarca div oluşturuluyor, layout ve
 * paint tetikleniyordu. Tek canvas + tek döngü ile kare maliyeti sabitlenir,
 * kalite otomatik olarak cihazın gücüne göre ayarlanır.
 */

import { BEAT_COLORS, PFX, RENDER, Z } from "../core/config.js";
import { clamp, lerp } from "../utils/math.js";
import { Painter } from "./draw.js";
import { SceneLayer } from "./scene.js";
import { ScrollLayer } from "./scroll-layer.js";
import { Particles } from "./particles.js";

const DIM_TARGET = 0.62;

export class Stage {
  constructor({ cache, pool, settings }) {
    this.cache = cache;
    this.pool = pool;
    this.settings = settings;

    this.canvas = document.createElement("canvas");
    this.canvas.className = `${PFX}stage`;
    this.canvas.style.zIndex = String(Z.stage);
    this.ctx = this.canvas.getContext("2d", { alpha: true, desynchronized: true });

    this.painter = new Painter(cache);
    this.scroll = new ScrollLayer(pool, cache);
    this.scenes = new SceneLayer(this.painter);
    this.particles = new Particles();

    this.w = 0;
    this.h = 0;
    this.dpr = 1;
    this.running = false;
    this.dim = 0;
    this.flash = { a: 0, color: "#ffffff" };
    this.beatColor = BEAT_COLORS.bass.hex;
    this.quality = 2;
    this.emaFrame = 16;
    this.fps = 0;
    this._rafId = null;
    this.onTick = null;
    this._lastTs = 0;
    this._fpsAcc = 0;
    this._fpsCount = 0;
    this._vignette = null;
    this._speedScale = 1;
    this._onResize = () => this.resize();
  }

  mount() {
    document.documentElement.appendChild(this.canvas);
    window.addEventListener("resize", this._onResize, { passive: true });
    window.addEventListener("orientationchange", this._onResize, { passive: true });
    this.resize();
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this._onResize);
    window.removeEventListener("orientationchange", this._onResize);
    this.canvas.remove();
  }

  /* ---------------------------------------------------------------- */

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // 4K ekranda dpr 2 → 4× piksel; tam ekran görsellerde görünür fark yok.
    const dpr = this.quality > 1 ? Math.min(window.devicePixelRatio || 1, RENDER.maxDpr) : 1;
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.canvas.style.width = w + "px";
    this.canvas.style.height = h + "px";
    this.scroll.resize(w, h);
    this._buildVignette();
  }

  _buildVignette() {
    const g = this.ctx.createRadialGradient(
      this.w / 2, this.h / 2, Math.min(this.w, this.h) * 0.28,
      this.w / 2, this.h / 2, Math.max(this.w, this.h) * 0.75
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    this._vignette = g;
  }

  /* ---------------------------------------------------------------- */

  start() {
    if (this.running) return;
    this.running = true;
    this.canvas.classList.add("visible");
    this.scroll.configure(this.settings.scroll ? this.settings.scrollRows : 0);
    this.scroll.reset();
    this.particles.enabled = this.settings.particles;
    this._lastTs = 0;
    this.wake();
  }

  stop() {
    this.running = false;
    this.scenes.clear();
    this.particles.clear();
    this.scroll.reset();
    // Döngü, karartma sıfıra inip canvas temizlenene kadar sürer
  }

  setScrollRows(n) {
    this.scroll.configure(this.settings.scroll ? n : 0);
  }

  /* ---------------------------------------------------------------- */

  /** Yeni sahne dener; hazır görsel yoksa false döner */
  spawnScene(type, strength, cooldown, bpm) {
    const count = SceneLayer.countFor(type, strength, this.settings.sceneImages);
    const entries = this.pool.takeReady(count);
    if (!entries.length) return false;
    return this.scenes.spawn(entries, { w: this.w, h: this.h }, {
      type,
      strength,
      cooldown,
      bpm,
      intensity: this.settings.intensity,
    });
  }

  beat({ type, strength }) {
    const color = BEAT_COLORS[type] || BEAT_COLORS.bass;
    this.beatColor = color.hex;
    if (this.settings.flash) {
      this.flash.color = type === "bass" ? "#ffffff" : color.hex;
      this.flash.a = Math.max(this.flash.a, clamp(0.12 + strength * 0.4, 0, 0.6));
    }
    this.scroll.onBeat(strength);
    if (this.settings.particles && this.quality > 0) {
      this.particles.burst(this.w / 2, this.h / 2, color.rgb, strength, this.quality);
    }
  }

  setSpeedScale(v) {
    this._speedScale = clamp(v, 0.15, 5);
  }

  /* ---------------------------------------------------------------- */

  _tick(ts) {
    this._rafId = requestAnimationFrame((t) => this._tick(t));
    const prev = this._lastTs || ts;
    const rawDt = ts - prev;
    this._lastTs = ts;
    const dt = clamp(rawDt / 1000, 0.001, 0.08);

    this._measure(rawDt);
    this.onTick?.(ts, dt);

    const target = this.running ? DIM_TARGET : 0;
    this.dim = lerp(this.dim, target, clamp(dt * 6, 0, 1));

    this.scenes.update(ts);
    this.scroll.update(dt, this._speedScale);
    this.particles.update(dt);
    this.flash.a = Math.max(0, this.flash.a - dt * 2.6);

    const idleNow =
      !this.running && this.dim < 0.01 && !this.scenes.active && !this.particles.rings.length;

    if (document.hidden) return; // gizli sekmede çizim yapma
    this._render(ts, dt);

    if (idleNow) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.canvas.classList.remove("visible");
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _measure(rawDt) {
    if (rawDt > 0 && rawDt < 500) {
      this.emaFrame = this.emaFrame * 0.92 + rawDt * 0.08;
      this._fpsAcc += rawDt;
      this._fpsCount++;
      if (this._fpsAcc > 500) {
        this.fps = Math.round(1000 / (this._fpsAcc / this._fpsCount));
        this._fpsAcc = 0;
        this._fpsCount = 0;
      }
    }

    let q;
    if (this.settings.quality === "high") q = 2;
    else if (this.settings.quality === "low") q = 0;
    else {
      // Histerezis: düşerken 26ms, çıkarken 15ms — eşiğin etrafında salınmasın
      const down = this.emaFrame > 26 ? 1 : 0;
      const up = this.emaFrame < 15 ? 1 : 0;
      q = clamp(this.quality - down + up, 0, 2);
    }

    if (q === this.quality) return;
    // Kademe değişimi maliyetlidir (tuval yeniden ayrılır); seyrek olmalı
    const now = performance.now();
    if (now - (this._qualityAt || 0) < RENDER.qualityHoldMs) return;
    this._qualityAt = now;
    this.quality = q;
    this.painter.quality = q;
    this.particles.enabled = this.settings.particles && q > 0;
    this.resize();
  }

  _render(now, dt) {
    const ctx = this.ctx;
    const env = {
      now, dt, w: this.w, h: this.h,
      quality: this.quality,
      intensity: this.settings.intensity,
      beatColor: this.beatColor,
      shake: this.settings.shake,
    };

    this.cache.thumbBudget = 2;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    // 1) Karartma zemini
    if (this.dim > 0.001) {
      ctx.fillStyle = `rgba(4,4,10,${this.dim})`;
      ctx.fillRect(0, 0, this.w, this.h);
    }

    // 2) Kayan şeritler
    this.scroll.draw(ctx, env);

    // 3) Sahne görselleri
    const post = this.scenes.draw(ctx, env);

    // 4) Parçacıklar
    this.particles.draw(ctx);

    // 5) Sahne sonrası efektler
    if (post.rays > 0.01 && this.quality > 0) this._drawRays(ctx, post.rays);
    if (post.scanlines > 0.01) this._drawScanlines(ctx, post.scanlines);
    if (post.invert) {
      ctx.save();
      ctx.globalCompositeOperation = "difference";
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }

    // 6) Flaş + vinyet
    if (this.flash.a > 0.002) {
      ctx.save();
      ctx.globalAlpha = this.flash.a;
      ctx.fillStyle = this.flash.color;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
    if (this.dim > 0.02 && this._vignette && this.quality > 0) {
      ctx.save();
      ctx.globalAlpha = clamp(this.dim / DIM_TARGET, 0, 1);
      ctx.fillStyle = this._vignette;
      ctx.fillRect(0, 0, this.w, this.h);
      ctx.restore();
    }
  }

  _drawRays(ctx, amount) {
    const cx = this.w / 2;
    const cy = this.h / 2;
    const r = Math.hypot(this.w, this.h);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.1 * amount;
    ctx.fillStyle = this.beatColor;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + amount * 0.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, a, a + 0.09);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  /** Tarama çizgileri tek bir pattern fill ile — eskiden yüzlerce fillRect'ti */
  _drawScanlines(ctx, amount) {
    if (!this._scanPattern) {
      const cv = document.createElement("canvas");
      cv.width = 1;
      cv.height = 4;
      const g = cv.getContext("2d");
      g.fillStyle = "#000000";
      g.fillRect(0, 0, 1, 1.4);
      this._scanPattern = ctx.createPattern(cv, "repeat");
    }
    ctx.save();
    ctx.globalAlpha = clamp(amount, 0, 0.5);
    ctx.fillStyle = this._scanPattern;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.restore();
  }

  /** Döngü durmuşsa yeniden başlatır */
  wake() {
    if (!this._rafId) this._tick(performance.now());
  }
}
