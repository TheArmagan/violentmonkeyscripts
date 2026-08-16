/* Sahne katmanı — beat başına oluşan görsel kompozisyonlar.
 *
 * Aynı anda en fazla iki sahne yaşar: aktif olan ve sönmekte olan.
 * Her sahne kendi efektini, yerleşimini ve ömrünü taşır.
 */

import { clamp, rand, randInt } from "../utils/math.js";
import { layoutFor, sceneCount } from "./layouts.js";
import { holdFor, pickEffect, pickSceneEffect } from "./effects.js";

const FADE_MS = 170;

class Scene {
  /**
   * @param {import('../images/image-cache.js').ImageEntry[]} entries
   * @param {{w:number,h:number}} view
   */
  constructor(entries, view, { type, strength, cooldown, bpm, intensity }) {
    this.type = type;
    this.strength = strength;
    this.born = performance.now();
    this.hold = holdFor(type, cooldown, bpm);
    this.animMs = clamp(this.hold * 0.7, 220, 720);
    this.seed = randInt(1, 99999);
    this.effect = pickEffect(type);
    this.sceneEffect = pickSceneEffect(type, strength);
    this.alpha = 1;
    this.dead = false;

    const boxes = layoutFor(entries.length, {
      w: view.w,
      h: view.h,
      gap: entries.length > 1 ? 10 : 0,
      pad: 8,
    });

    this.sprites = entries.map((entry, i) => ({
      entry,
      x: boxes[i].x,
      y: boxes[i].y,
      w: boxes[i].w,
      h: boxes[i].h,
      fit: entries.length === 1 ? "contain" : "cover",
      i,
      count: entries.length,
      seed: this.seed + i * 977,
      rnd: rand(-1, 1),
      delay: i * this.effect.stagger * 1000 * (1 / clamp(intensity, 0.5, 2)),
      view,
    }));
  }

  get age() {
    return performance.now() - this.born;
  }

  /** Sönmeye başlar */
  retire(now = performance.now()) {
    if (this.retiredAt) return;
    this.retiredAt = now;
  }

  update(now) {
    const age = now - this.born;
    if (!this.retiredAt && age >= this.hold) this.retiredAt = this.born + this.hold;
    if (this.retiredAt) {
      this.alpha = 1 - clamp((now - this.retiredAt) / FADE_MS, 0, 1);
      if (this.alpha <= 0) this.dead = true;
    }
  }

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {import('./draw.js').Painter} painter
   */
  draw(ctx, painter, env) {
    if (this.dead) return null;
    const now = env.now;
    const age = now - this.born;
    const impact = clamp(age / 380, 0, 1);
    const se = this.sceneEffect.apply(impact, env, this) || {};
    if (env.shake === false) {
      se.dx = 0;
      se.dy = 0;
      se.rot = 0;
    }

    ctx.save();
    ctx.globalAlpha = this.alpha;

    const cx = env.w / 2;
    const cy = env.h / 2;
    if (se.dx || se.dy || se.rot || se.zoom) {
      ctx.translate(cx + (se.dx || 0), cy + (se.dy || 0));
      if (se.rot) ctx.rotate(se.rot);
      if (se.zoom) ctx.scale(se.zoom, se.zoom);
      ctx.translate(-cx, -cy);
    }

    for (const sp of this.sprites) {
      const p = clamp((age - sp.delay) / this.animMs, 0, 1);
      if (p <= 0) continue;
      const st = this.effect.transform(p, sp, env) || {};
      const alpha = (st.alpha ?? 1) * this.alpha;
      if (alpha <= 0.012) continue;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(sp.x + sp.w / 2 + (st.dx || 0), sp.y + sp.h / 2 + (st.dy || 0));
      if (st.rot) ctx.rotate(st.rot);
      if (st.skewX || st.skewY) ctx.transform(1, st.skewY || 0, st.skewX || 0, 1, 0, 0);
      const sx = st.sx ?? 1;
      const sy = st.sy ?? 1;
      if (sx !== 1 || sy !== 1) ctx.scale(sx, sy);

      painter.paint(
        ctx,
        sp.entry,
        { x: -sp.w / 2, y: -sp.h / 2, w: sp.w, h: sp.h, fit: sp.fit, seed: sp.seed },
        st
      );

      if (painter.quality > 0 && sp.count > 1) {
        ctx.globalAlpha = alpha * 0.5;
        ctx.strokeStyle = "rgba(255,255,255,0.14)";
        ctx.lineWidth = 1;
        ctx.strokeRect(-sp.w / 2, -sp.h / 2, sp.w, sp.h);
      }
      ctx.restore();
    }

    ctx.restore();
    return se; // sahne sonrası (post) efektler çağırana bırakılır
  }
}

export class SceneLayer {
  /** @param {import('./draw.js').Painter} painter */
  constructor(painter) {
    this.painter = painter;
    /** @type {Scene[]} */
    this.scenes = [];
    this.priority = 0;
    this.lastPost = {};
  }

  get active() {
    return this.scenes.length > 0;
  }

  /**
   * Yeni sahne oluşturur. Havuzda hazır görsel yoksa false döner.
   */
  spawn(entries, view, opts) {
    if (!entries.length) return false;
    const scene = new Scene(entries, view, opts);
    // Önceki sahneleri sönmeye al, en fazla 2 sahne canlı kalsın
    for (const s of this.scenes) s.retire();
    this.scenes.push(scene);
    while (this.scenes.length > 2) this.scenes.shift();
    return true;
  }

  clear() {
    this.scenes.length = 0;
    this.priority = 0;
  }

  update(now) {
    for (const s of this.scenes) s.update(now);
    this.scenes = this.scenes.filter((s) => !s.dead);
    if (!this.scenes.length) this.priority = 0;
  }

  draw(ctx, env) {
    let post = {};
    for (const s of this.scenes) {
      const p = s.draw(ctx, this.painter, env);
      if (p && s === this.scenes[this.scenes.length - 1]) post = p;
    }
    this.lastPost = post;
    return post;
  }

  /** Sahnede kaç görsel gösterilmeli */
  static countFor(type, strength, max) {
    return sceneCount(type, strength, max);
  }
}
