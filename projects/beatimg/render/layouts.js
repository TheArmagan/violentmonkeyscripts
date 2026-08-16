/* Sahne yerleşimleri — hepsi 0..1 aralığında normalize dikdörtgen üretir.
 * Üretilen kutular asla üst üste binmez; boşluk (gap) sonradan uygulanır.
 */

import { pick, rand, randInt } from "../utils/math.js";

const R = (x, y, w, h) => ({ x, y, w, h });

function grid(n, cols) {
  const rows = Math.ceil(n / cols);
  const out = [];
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const r = (i / cols) | 0;
    // Son satır eksik kalırsa kutuları genişleterek boşluğu kapat
    const inRow = Math.min(cols, n - r * cols);
    const w = 1 / inRow;
    out.push(R(c * w, r / rows, w, 1 / rows));
  }
  return out;
}

function stripsH(n) {
  return Array.from({ length: n }, (_, i) => R(0, i / n, 1, 1 / n));
}

function stripsV(n) {
  return Array.from({ length: n }, (_, i) => R(i / n, 0, 1 / n, 1));
}

function bigSide(n, side = "left") {
  if (n < 2) return null;
  const bw = n <= 3 ? 0.64 : 0.58;
  const rest = n - 1;
  const out = [];
  const bx = side === "left" ? 0 : 1 - bw;
  const sx = side === "left" ? bw : 0;
  out.push(R(bx, 0, bw, 1));
  for (let i = 0; i < rest; i++) out.push(R(sx, i / rest, 1 - bw, 1 / rest));
  return out;
}

function centerCorners(n) {
  if (n < 5) return null;
  const out = [R(0.22, 0.2, 0.56, 0.6)];
  const ring = [
    R(0, 0, 0.22, 0.5), R(0.78, 0, 0.22, 0.5),
    R(0, 0.5, 0.22, 0.5), R(0.78, 0.5, 0.22, 0.5),
    R(0.22, 0, 0.56, 0.2), R(0.22, 0.8, 0.56, 0.2),
  ];
  for (let i = 0; i < n - 1 && i < ring.length; i++) out.push(ring[i]);
  return out.length === n ? out : null;
}

/** İkili bölme — herhangi bir n için çakışmasız, her seferinde farklı bir mozaik */
function mosaic(n) {
  let rects = [R(0, 0, 1, 1)];
  while (rects.length < n) {
    // En büyük alanlı kutuyu böl (çok ince şeritler oluşmasın)
    let bi = 0;
    for (let i = 1; i < rects.length; i++) {
      if (rects[i].w * rects[i].h > rects[bi].w * rects[bi].h) bi = i;
    }
    const b = rects.splice(bi, 1)[0];
    const t = rand(0.36, 0.64);
    if (b.w >= b.h) {
      rects.push(R(b.x, b.y, b.w * t, b.h), R(b.x + b.w * t, b.y, b.w * (1 - t), b.h));
    } else {
      rects.push(R(b.x, b.y, b.w, b.h * t), R(b.x, b.y + b.h * t, b.w, b.h * (1 - t)));
    }
  }
  return rects;
}

const CANDIDATES = [
  (n) => (n === 1 ? [R(0, 0, 1, 1)] : null),
  (n) => (n >= 2 && n <= 6 ? stripsH(n) : null),
  (n) => (n >= 2 && n <= 5 ? stripsV(n) : null),
  (n) => (n >= 2 ? bigSide(n, "left") : null),
  (n) => (n >= 2 ? bigSide(n, "right") : null),
  (n) => (n >= 4 ? grid(n, 2) : null),
  (n) => (n >= 5 ? grid(n, 3) : null),
  (n) => (n >= 7 ? grid(n, 4) : null),
  (n) => centerCorners(n),
  (n) => (n >= 2 ? mosaic(n) : null),
  (n) => (n >= 3 ? mosaic(n) : null),
];

/**
 * n adet çakışmayan kutu üretir.
 * @param {number} n
 * @param {{w:number,h:number,gap:number,pad:number}} view
 * @returns {{x:number,y:number,w:number,h:number}[]} piksel cinsinden
 */
export function layoutFor(n, view) {
  const count = Math.max(1, n);
  const options = CANDIDATES.map((fn) => fn(count)).filter(Boolean);
  const rects = options.length ? pick(options) : mosaic(count);

  const gap = view.gap ?? 6;
  const pad = view.pad ?? 4;
  const iw = view.w - pad * 2;
  const ih = view.h - pad * 2;

  return rects.slice(0, count).map((r) => ({
    x: pad + r.x * iw + gap / 2,
    y: pad + r.y * ih + gap / 2,
    w: Math.max(24, r.w * iw - gap),
    h: Math.max(24, r.h * ih - gap),
  }));
}

/** Sahnedeki görsel sayısını beat türü ve şiddetine göre seçer */
export function sceneCount(type, strength, max) {
  const base = { bass: 3, mid: 4, high: 5 }[type] ?? 3;
  const n = base + randInt(-1, 1) + (strength > 0.75 ? 1 : 0);
  return Math.max(1, Math.min(max, n));
}
