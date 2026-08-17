/* Sabitler ve varsayılan ayarlar */

export const PFX = "beatimg-";

/** Z-index katmanları */
export const Z = {
  stage: 2147483642,
  panel: 2147483644,
  toggle: 2147483645,
};

/** Kalıcı ayarların varsayılanları */
export const DEFAULTS = {
  sourceMode: "mic", // 'mic' | 'file'
  sensitivity: 1.45, // onset eşiği çarpanı
  cooldown: 150, // ms — bantlar arası minimum aralık
  intensity: 1.0, // efekt şiddeti (0.2 – 2)
  sceneImages: 4, // sahne başına maksimum görsel
  scrollRows: 3, // arka plandaki kayan şerit sayısı
  particles: true,
  flash: true,
  shake: true,
  scroll: true,
  quality: "auto", // 'auto' | 'high' | 'low'
};

/** Analiz bantları — görselleştirme ve onset için */
export const BANDS = [
  { key: "sub", lo: 20, hi: 60 },
  { key: "bass", lo: 60, hi: 180 },
  { key: "lowMid", lo: 180, hi: 600 },
  { key: "mid", lo: 600, hi: 2000 },
  { key: "high", lo: 2000, hi: 7000 },
  { key: "air", lo: 7000, hi: 16000 },
];

/** Beat türü → öncelik (yüksek olan alttakini ezer) */
export const BEAT_PRIORITY = { bass: 3, mid: 2, high: 1 };

/** Beat türü → tema rengi */
export const BEAT_COLORS = {
  bass: { hex: "#ff3b6b", rgb: [255, 59, 107] },
  mid: { hex: "#ff9430", rgb: [255, 148, 48] },
  high: { hex: "#7c6fff", rgb: [124, 111, 255] },
};

/** Görsel havuzu limitleri */
export const POOL = {
  minNatural: 100, // px — gerçek çözünürlük alt sınırı
  minRendered: 80, // px — sayfada kapladığı alan alt sınırı
  maxImages: 500, // havuzdaki maksimum benzersiz URL
  scanDebounce: 800, // ms
  scanMinGap: 4000, // ms — tarama arası minimum süre
  bgScanUntil: 60, // havuzda bu kadar görsel varsa arka plan taraması yapılmaz
  bgScanGap: 20000, // ms — arka plan taramaları arası minimum süre
  bgScanChunk: 250, // her boşta işlenen eleman sayısı
  bgScanMax: 3000, // taranan maksimum eleman
  // Kuyruk, havuzun tamamını değil kayan bir pencereyi dolaşır. Aksi halde 400
  // görsellik bir sayfada sıradaki seçimler neredeyse hep indirilmemiş çıkar ve
  // beat'lerin çoğu boşa gider (ölçüldü: sahne başarısı %9). Pencere her turda
  // yarı yarıya kayar; zamanla havuzun tamamı gösterilir.
  window: 40, // sahne kuyruğunun aynı anda dolaştığı görsel sayısı
  warm: 14, // kuyruğun kaç adım ilerisi önceden indirilir
};

/** Görsel önbellek limitleri */
export const CACHE = {
  maxDecoded: 60, // aynı anda bellekte tutulan çözülmüş görsel
  storeMax: 2048, // saklanan görselin en uzun kenarı (px)
  maxConcurrent: 6, // eşzamanlı indirme
  tintMaxDim: 512, // kanal kopyalarının maksimum kenarı
  maxTintEntries: 16, // kaç görsel için kanal kopyası tutulur
  thumbStep: 256, // küçük kopya boyut kademesi (px)
  thumbMax: 2048, // küçük kopyanın en büyük kenarı
  maxThumbs: 48, // bellekte tutulan toplam küçük kopya
};

/** Çizim maliyetini belirleyen sınırlar */
export const RENDER = {
  maxDpr: 1.5, // 4K ekranlarda dpr 2 = 4× piksel; görsel fark yok, maliyet büyük
  qualityHoldMs: 2500, // kalite kademesi bu süreden önce değişmez (titreme önleme)
};
