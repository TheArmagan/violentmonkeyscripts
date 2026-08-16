/* Matematik / rastgelelik yardımcıları */

export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const norm = (v, a, b) => (b === a ? 0 : (v - a) / (b - a));

export function rand(a = 1, b) {
  return b === undefined ? Math.random() * a : a + Math.random() * (b - a);
}

export function randInt(a, b) {
  return Math.floor(rand(a, b + 1));
}

export function pick(arr) {
  return arr[(Math.random() * arr.length) | 0];
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

/** Deterministik rastgelelik — aynı seed aynı diziyi üretir (mulberry32) */
export function seeded(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Üstel yumuşatma — frame süresinden bağımsız (dt saniye) */
export function smooth(current, target, halfLife, dt) {
  if (halfLife <= 0) return target;
  const k = 1 - Math.pow(0.5, dt / halfLife);
  return current + (target - current) * k;
}

/** Dizinin medyanı (yerinde sıralamaz) */
export function median(values) {
  if (!values.length) return 0;
  const a = [...values].sort((x, y) => x - y);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

export const ease = {
  linear: (p) => p,
  outCubic: (p) => 1 - Math.pow(1 - p, 3),
  outQuint: (p) => 1 - Math.pow(1 - p, 5),
  outExpo: (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
  inCubic: (p) => p * p * p,
  inOutCubic: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
  outBack: (p, s = 1.9) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2),
  outElastic: (p) => {
    if (p <= 0 || p >= 1) return p;
    return Math.pow(2, -9 * p) * Math.sin((p * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  steps: (n) => (p) => Math.min(1, Math.floor(p * n) / (n - 1 || 1)),
};

/** 0 → 1 → 0 tepe eğrisi */
export const spike = (p, sharp = 2) => Math.pow(Math.sin(Math.PI * clamp(p, 0, 1)), sharp);
