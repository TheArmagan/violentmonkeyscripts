/* Efekt kataloğu.
 *
 * Her efekt, 0→1 ilerlemeden (p) bir "stil" nesnesi üretir. Stil hem transform
 * (dx/dy/sx/sy/rot/skew/alpha) hem de çizim modu (rgbSplit, pixel, slices,
 * blocks, roll, wipe, echo, glow, tint) alanlarını içerebilir; Painter bunları
 * yorumlar. Böylece yeni efekt eklemek tek bir saf fonksiyon yazmaktan ibarettir.
 */

import { clamp, ease, lerp, pick, rand, spike } from "../utils/math.js";

const dirOf = (i) => (i % 2 === 0 ? 1 : -1);

/** @type {{name:string, bands:string[], stagger:number, hold?:number, transform:Function}[]} */
export const EFFECTS = [
  /* ---------------------------- BASS ---------------------------- */
  {
    name: "slam", bands: ["bass"], stagger: 0.03,
    transform: (p, s, e) => {
      const k = ease.outBack(Math.min(1, p * 3.2), 2.4);
      return { sx: lerp(0.55, 1, k), sy: lerp(0.55, 1, k), rot: dirOf(s.i) * 0.1 * (1 - k) * e.intensity, glow: 0.35 * (1 - Math.min(1, p * 4)) };
    },
  },
  {
    name: "zoomCrush", bands: ["bass"], stagger: 0.05,
    transform: (p, s, e) => {
      const k = ease.outExpo(Math.min(1, p * 2.4));
      const sc = lerp(2.4 * e.intensity, 1, k);
      return { sx: sc, sy: sc, alpha: Math.min(1, p * 6), rgbSplit: 14 * (1 - k) * e.intensity };
    },
  },
  {
    name: "dropIn", bands: ["bass"], stagger: 0.05,
    transform: (p, s) => {
      const k = ease.outBack(Math.min(1, p * 2.6), 2);
      return { dy: lerp(-s.view.h * 0.9, 0, k), rot: dirOf(s.i) * 0.06 * (1 - k) };
    },
  },
  {
    name: "vortex", bands: ["bass"], stagger: 0.045,
    transform: (p, s, e) => {
      const k = ease.outBack(Math.min(1, p * 2.2), 1.6);
      return { rot: dirOf(s.i) * 2.6 * (1 - k) * e.intensity, sx: lerp(0.15, 1, k), sy: lerp(0.15, 1, k) };
    },
  },
  {
    name: "earthquake", bands: ["bass"], stagger: 0.01,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 2.6);
      const amp = 16 * decay * e.intensity;
      const t = p * 90;
      return {
        dx: Math.sin(t * 1.7 + s.seed) * amp,
        dy: Math.cos(t * 2.3 + s.seed) * amp * 0.5,
        rot: Math.sin(t * 1.1) * 0.035 * decay,
        sx: 1 + decay * 0.05, sy: 1 + decay * 0.05,
      };
    },
  },
  {
    name: "rgbSlam", bands: ["bass"], stagger: 0.03,
    transform: (p, s, e) => {
      const k = ease.outExpo(Math.min(1, p * 3));
      return { sx: lerp(1.25, 1, k), sy: lerp(1.25, 1, k), rgbSplit: 26 * (1 - k) * e.intensity, glow: 0.25 * (1 - k) };
    },
  },
  {
    name: "echoPunch", bands: ["bass"], stagger: 0.02,
    transform: (p, s, e) => {
      const k = ease.outCubic(Math.min(1, p * 2.2));
      return { sx: lerp(0.82, 1, k), sy: lerp(0.82, 1, k), echo: 4 * (1 - k) * e.intensity, echoScale: 0.3, echoDy: -30 * (1 - k) };
    },
  },
  {
    name: "burnIn", bands: ["bass"], stagger: 0.04,
    transform: (p, s, e) => {
      const k = ease.outCubic(Math.min(1, p * 2.6));
      return { sx: lerp(0.75, 1, k), sy: lerp(0.75, 1, k), glow: 0.9 * (1 - k) * e.intensity, tint: "#ffd0a0", tintMode: "overlay", tintAlpha: 0.5 * (1 - k) };
    },
  },
  {
    name: "shatterSlam", bands: ["bass"], stagger: 0.03,
    transform: (p, s, e) => {
      const k = Math.min(1, p * 2.4);
      const amp = 46 * (1 - ease.outQuint(k)) * e.intensity;
      return { slices: { n: 10, amp, vertical: false }, sx: lerp(1.12, 1, ease.outCubic(k)), sy: lerp(1.12, 1, ease.outCubic(k)) };
    },
  },
  {
    name: "squashPop", bands: ["bass"], stagger: 0.035,
    transform: (p) => {
      const k = ease.outElastic(Math.min(1, p * 1.6));
      return { sx: lerp(1.35, 1, k), sy: lerp(0.68, 1, k) };
    },
  },

  /* ----------------------------- MID ---------------------------- */
  {
    name: "slideSplit", bands: ["mid"], stagger: 0.03,
    transform: (p, s) => {
      const k = ease.outExpo(Math.min(1, p * 2.8));
      return { dx: dirOf(s.i) * s.view.w * (1 - k), skewX: dirOf(s.i) * 0.35 * (1 - k) };
    },
  },
  {
    name: "diagonalSlice", bands: ["mid"], stagger: 0.035,
    transform: (p, s, e) => {
      const k = ease.outExpo(Math.min(1, p * 3));
      const dx = dirOf(s.i);
      const dy = ((s.i >> 1) % 2 === 0 ? 1 : -1);
      return { dx: dx * s.view.w * 0.28 * (1 - k), dy: dy * s.view.h * 0.2 * (1 - k), skewX: dx * 0.28 * (1 - k) * e.intensity };
    },
  },
  {
    name: "zipIn", bands: ["mid"], stagger: 0.025,
    transform: (p, s) => {
      const k = ease.outExpo(Math.min(1, p * 3.4));
      const m = s.i % 4;
      const dx = m === 0 ? -1 : m === 1 ? 1 : 0;
      const dy = m === 2 ? -1 : m === 3 ? 1 : 0;
      return { dx: dx * s.view.w * (1 - k), dy: dy * s.view.h * (1 - k) };
    },
  },
  {
    name: "glitchBlocks", bands: ["mid"], stagger: 0.02,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 2.2);
      return {
        blocks: { cols: 7, rows: 5, amp: 34 * decay * e.intensity, frame: Math.floor(p * 26) },
        rgbSplit: 10 * decay * e.intensity,
      };
    },
  },
  {
    name: "dataCorrupt", bands: ["mid"], stagger: 0.03,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 2);
      return {
        slices: { n: 14, amp: 30 * decay * e.intensity, vertical: false },
        skewX: Math.sin(p * 30) * 0.14 * decay,
        tint: "#30ffd0", tintMode: "screen", tintAlpha: 0.3 * decay,
      };
    },
  },
  {
    name: "wipeReveal", bands: ["mid"], stagger: 0.04,
    transform: (p, s) => {
      const k = ease.outQuint(Math.min(1, p * 2.4));
      const dir = ["left", "right", "up", "down"][s.i % 4];
      return { wipe: { dir, p: k }, dx: (dir === "left" ? -1 : dir === "right" ? 1 : 0) * 40 * (1 - k) };
    },
  },
  {
    name: "flipIn", bands: ["mid"], stagger: 0.04,
    transform: (p, s) => {
      const k = ease.outCubic(Math.min(1, p * 2.4));
      const sx = Math.abs(lerp(-1, 1, k));
      return { sx: Math.max(0.02, sx), sy: 1, glow: 0.3 * (1 - k) };
    },
  },
  {
    name: "rollIn", bands: ["mid"], stagger: 0.035,
    transform: (p, s) => {
      const k = ease.outQuint(Math.min(1, p * 2.6));
      const d = dirOf(s.i);
      return { dx: d * s.view.w * 0.45 * (1 - k), rot: d * 0.9 * (1 - k) };
    },
  },
  {
    name: "barSweep", bands: ["mid"], stagger: 0.03,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 2.4);
      return { slices: { n: 6, amp: 22 * decay * e.intensity, vertical: true }, dy: dirOf(s.i) * 18 * decay };
    },
  },

  /* ---------------------------- HIGH ---------------------------- */
  {
    name: "scatterPop", bands: ["high"], stagger: 0.03,
    transform: (p, s, e) => {
      const k = ease.outBack(Math.min(1, p * 3.6), 2.8);
      return { sx: lerp(0.5, 1, k), sy: lerp(0.5, 1, k), rot: s.rnd * 0.5 * (1 - k) * e.intensity };
    },
  },
  {
    name: "strobePop", bands: ["high"], stagger: 0.015,
    transform: (p, s) => {
      const flick = p < 0.24 ? (Math.floor(p * 40 + s.seed) % 2 ? 1 : 0.14) : 1;
      return { alpha: flick, sx: lerp(1.18, 1, ease.outExpo(Math.min(1, p * 4))), sy: lerp(1.18, 1, ease.outExpo(Math.min(1, p * 4))) };
    },
  },
  {
    name: "pixelBurst", bands: ["high"], stagger: 0.025,
    transform: (p, s, e) => {
      const k = ease.outCubic(Math.min(1, p * 2.6));
      return { pixel: lerp(38 * e.intensity, 1, k), sx: lerp(1.1, 1, k), sy: lerp(1.1, 1, k) };
    },
  },
  {
    name: "chromaFlick", bands: ["high"], stagger: 0.02,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 3);
      return {
        rgbSplit: (8 + Math.sin(p * 60 + s.seed) * 8) * decay * e.intensity,
        tint: "#7c6fff", tintMode: "screen", tintAlpha: 0.28 * decay,
      };
    },
  },
  {
    name: "tileShatter", bands: ["high"], stagger: 0.025,
    transform: (p, s, e) => {
      const k = ease.outExpo(Math.min(1, p * 3.2));
      const d = dirOf(s.i);
      return { sx: lerp(1.3, 1, k), sy: lerp(0.7, 1, k), skewX: d * 0.26 * (1 - k) * e.intensity, glow: 0.4 * (1 - k) };
    },
  },
  {
    name: "vhsRoll", bands: ["high"], stagger: 0.02,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 2);
      return { roll: (p * 1.8 + s.seed * 0.1) % 1 * decay, rgbSplit: 6 * decay * e.intensity, slices: null };
    },
  },
  {
    name: "jitterPop", bands: ["high"], stagger: 0.012,
    transform: (p, s, e) => {
      const decay = Math.max(0, 1 - p * 3.4);
      const step = Math.floor(p * 24);
      const j = ((step * 9301 + s.seed * 49297) % 233280) / 233280 - 0.5;
      return { dx: j * 40 * decay * e.intensity, dy: -j * 26 * decay, sx: 1 + decay * 0.12, sy: 1 + decay * 0.12 };
    },
  },
  {
    name: "blinkGrid", bands: ["high"], stagger: 0.05,
    transform: (p, s) => {
      const on = Math.floor(p * 14 + s.i) % 2 === 0;
      return { alpha: p > 0.42 ? 1 : on ? 1 : 0.05, sx: 1.02, sy: 1.02 };
    },
  },
  {
    name: "sparkZoom", bands: ["high", "mid"], stagger: 0.03,
    transform: (p, s, e) => {
      const k = ease.outExpo(Math.min(1, p * 3));
      return { sx: lerp(0.86, 1, k), sy: lerp(0.86, 1, k), echo: 3 * (1 - k), echoScale: -0.22 * e.intensity, glow: 0.5 * (1 - k) };
    },
  },
];

const BY_BAND = { bass: [], mid: [], high: [] };
for (const fx of EFFECTS) for (const b of fx.bands) BY_BAND[b]?.push(fx);

export function pickEffect(type) {
  const list = BY_BAND[type]?.length ? BY_BAND[type] : EFFECTS;
  return pick(list);
}

/* ------------------------------------------------------------------ */
/* Sahne geneli efektler — tüm tuvale uygulanır                        */
/* ------------------------------------------------------------------ */

export const SCENE_EFFECTS = [
  {
    name: "none",
    apply: () => ({}),
  },
  {
    name: "kick", // tüm sahneyi hafifçe zoomlar
    apply: (p, e) => ({ zoom: 1 + 0.06 * e.intensity * Math.max(0, 1 - p * 3) }),
  },
  {
    name: "shake",
    apply: (p, e, s) => {
      const decay = Math.max(0, 1 - p * 3);
      return {
        dx: Math.sin(p * 120 + s.seed) * 14 * decay * e.intensity,
        dy: Math.cos(p * 97 + s.seed) * 8 * decay * e.intensity,
      };
    },
  },
  {
    name: "tilt",
    apply: (p, e, s) => ({ rot: (s.seed % 2 ? 1 : -1) * 0.03 * e.intensity * Math.max(0, 1 - p * 2.5) }),
  },
  {
    name: "invertFlash",
    apply: (p) => ({ invert: p < 0.06 }),
  },
  {
    name: "scanlines",
    apply: (p, e) => ({ scanlines: 0.35 * e.intensity * Math.max(0, 1 - p * 1.6) }),
  },
  {
    name: "rays",
    apply: (p, e) => ({ rays: Math.max(0, 1 - p * 2) * e.intensity }),
  },
  {
    name: "punchOut",
    apply: (p, e) => ({ zoom: lerp(1.14, 1, ease.outExpo(Math.min(1, p * 2.4))) * (0.98 + 0.02 * e.intensity) }),
  },
];

export function pickSceneEffect(type, strength) {
  if (strength < 0.35) return SCENE_EFFECTS[0];
  const weighted = type === "bass"
    ? ["kick", "shake", "punchOut", "rays", "invertFlash", "tilt"]
    : type === "mid"
      ? ["tilt", "scanlines", "punchOut", "none", "shake"]
      : ["none", "scanlines", "invertFlash", "tilt"];
  const name = pick(weighted);
  return SCENE_EFFECTS.find((s) => s.name === name) || SCENE_EFFECTS[0];
}

/** Sahnenin ekranda kalma süresi (ms) */
export function holdFor(type, cooldown, bpm) {
  const beatMs = bpm > 0 ? 60000 / bpm : 500;
  const base = type === "high" ? beatMs * 0.55 : type === "mid" ? beatMs * 0.9 : beatMs * 1.35;
  return clamp(Math.max(base, cooldown * 1.6), 220, 2400);
}

export { spike, rand, clamp };
