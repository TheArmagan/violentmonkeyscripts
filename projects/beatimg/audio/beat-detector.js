/* Spektral akı (spectral flux) tabanlı beat/onset algılama.
 *
 * Eski sürüm "anlık enerji / ortalama enerji" oranına bakıyordu; bu yöntem
 * sürekli yüksek enerjili (elektronik, mastering'i sıkı) parçalarda ya hiç
 * tetiklenmiyor ya da sürekli tetikleniyordu. Burada her bant için pozitif
 * spektral akı hesaplanır ve eşik, akının kendi hareketli ortalaması +
 * standart sapmasının katı olarak uyarlanır. Bu yaklaşım ses seviyesinden
 * bağımsızdır ve tür fark etmeksizin çok daha kararlı çalışır.
 */

import { BANDS } from "../core/config.js";
import { clamp, median, smooth } from "../utils/math.js";

const HISTORY = 48; // ~0.8 sn @60fps

class Ring {
  constructor(n) {
    this.buf = new Float32Array(n);
    this.n = n;
    this.i = 0;
    this.count = 0;
  }
  push(v) {
    this.buf[this.i] = v;
    this.i = (this.i + 1) % this.n;
    if (this.count < this.n) this.count++;
  }
  stats() {
    const c = this.count;
    if (!c) return { mean: 0, std: 0 };
    let sum = 0;
    for (let i = 0; i < c; i++) sum += this.buf[i];
    const mean = sum / c;
    let acc = 0;
    for (let i = 0; i < c; i++) {
      const d = this.buf[i] - mean;
      acc += d * d;
    }
    return { mean, std: Math.sqrt(acc / c) };
  }
  reset() {
    this.buf.fill(0);
    this.i = 0;
    this.count = 0;
  }
}

/* Seviyeler dB ekseninde normalize edilir (0 = minDecibels, 1 = maxDecibels).
 * Lineer büyüklük kullanmak eşikleri ses seviyesine bağımlı yapıyordu: -45 dB
 * altındaki normal mikrofon/çalma seviyelerinde lineer değerler ~0.005'te kalır
 * ve aşağıdaki kapılar hiç açılmazdı (görselleştirici byte verisi kullandığı
 * için çalışmaya devam eder, efektler ise hiç tetiklenmezdi). Normalize dB ile
 * eşikler ~60 dB'lik bir aralıkta ses seviyesinden bağımsız çalışır. */

/** Onset üretecek bantlar ve dışarıya verilen beat türleri */
const TRIGGERS = [
  { type: "bass", bands: ["sub", "bass"], cdScale: 1.0, senScale: 1.0, floor: 0.2 },
  { type: "mid", bands: ["lowMid", "mid"], cdScale: 0.72, senScale: 1.12, floor: 0.16 },
  { type: "high", bands: ["high", "air"], cdScale: 0.5, senScale: 1.25, floor: 0.12 },
];

/** Tam sessizlikte hiçbir bant tetiklenmesin (normalize dB) */
const SILENCE_GATE = 0.16;

const DEFAULT_MIN_DB = -100;
const DEFAULT_MAX_DB = -12;

export class BeatDetector {
  constructor({ sensitivity = 1.45, cooldown = 150 } = {}) {
    this.sensitivity = sensitivity;
    this.cooldown = cooldown;

    /** @type {import('./audio-graph.js').AudioGraph|null} */
    this.graph = null;
    this.running = false;

    this.onBeat = null;
    this.onFrame = null;

    this._freq = null; // Float32Array — dB
    this._bytes = null; // Uint8Array — görselleştirme
    this._prevMag = null; // önceki karenin lineer büyüklükleri
    this._ranges = null; // bant → [loBin, hiBin]

    this._flux = new Map(); // bant → Ring
    this._prevFlux = new Map();
    this._levels = {}; // bant → 0..1 yumuşatılmış seviye
    this._lastBeat = { bass: 0, mid: 0, high: 0 };

    this._intervals = [];
    this.bpm = 0;
    this.bpmConfidence = 0;
    this._lastFrameTime = 0;
    this.level = 0;
    this.peak = 0;
    this.wantSpectrum = false;
  }

  /** @param {import('./audio-graph.js').AudioGraph} graph */
  attach(graph) {
    this.graph = graph;
    const a = graph.analyser;
    if (!a) throw new Error("AudioGraph has no analyser");
    const bins = a.frequencyBinCount;
    // Analyser'ın dB penceresi — byte spektrumuyla aynı normalizasyon kullanılır
    this._minDb = isFinite(a.minDecibels) ? a.minDecibels : DEFAULT_MIN_DB;
    this._dbRange = Math.max(1, (isFinite(a.maxDecibels) ? a.maxDecibels : DEFAULT_MAX_DB) - this._minDb);
    this._freq = new Float32Array(bins);
    this._bytes = new Uint8Array(bins);
    this._prevMag = new Float32Array(bins);

    const nyquist = graph.sampleRate / 2;
    this._ranges = {};
    for (const b of BANDS) {
      const lo = clamp(Math.floor((b.lo / nyquist) * bins), 0, bins - 1);
      const hi = clamp(Math.ceil((b.hi / nyquist) * bins), lo + 1, bins - 1);
      this._ranges[b.key] = [lo, hi];
      this._flux.set(b.key, new Ring(HISTORY));
      this._prevFlux.set(b.key, 0);
      this._levels[b.key] = 0;
    }
    this.reset();
    this.running = true;
  }

  reset() {
    for (const r of this._flux.values()) r.reset();
    for (const k of this._prevFlux.keys()) this._prevFlux.set(k, 0);
    for (const k of Object.keys(this._levels)) this._levels[k] = 0;
    this._prevMag?.fill(0);
    this._lastBeat = { bass: 0, mid: 0, high: 0 };
    this._intervals.length = 0;
    this._lastIntervalTime = 0;
    this.bpm = 0;
    this.bpmConfidence = 0;
    this.level = 0;
    this.peak = 0;
    this._lastFrameTime = 0;
  }

  detach() {
    this.running = false;
    this.graph = null;
  }

  setSensitivity(v) {
    this.sensitivity = clamp(parseFloat(v) || 1.45, 0.4, 4);
  }

  setCooldown(v) {
    this.cooldown = clamp(parseInt(v, 10) || 150, 20, 1500);
  }

  /**
   * Her ekran karesinde çağrılır.
   * @param {number} now performance.now()
   */
  tick(now) {
    const a = this.graph?.analyser;
    if (!this.running || !a) return;

    const dt = this._lastFrameTime ? clamp((now - this._lastFrameTime) / 1000, 0.001, 0.1) : 0.016;
    this._lastFrameTime = now;

    a.getFloatFrequencyData(this._freq);
    // Bayt spektrumu yalnızca panel açıkken (görselleştirici için) gerekir
    if (this.wantSpectrum) a.getByteFrequencyData(this._bytes);

    const freq = this._freq;
    const prev = this._prevMag;
    const minDb = this._minDb;
    const dbRange = this._dbRange;
    const bands = {};
    const fluxes = {};
    let total = 0;

    for (const b of BANDS) {
      const [lo, hi] = this._ranges[b.key];
      let energy = 0;
      let flux = 0;
      for (let i = lo; i <= hi; i++) {
        // dB → 0..1 (minDecibels = 0, maxDecibels = 1); ses seviyesinden bağımsız
        const db = freq[i];
        const mag = isFinite(db) ? clamp((db - minDb) / dbRange, 0, 1) : 0;
        energy += mag;
        const d = mag - prev[i];
        if (d > 0) flux += d;
        prev[i] = mag;
      }
      const n = hi - lo + 1;
      energy /= n;
      flux /= Math.sqrt(n); // bant genişliğinden bağımsızlaştır
      bands[b.key] = energy;
      fluxes[b.key] = flux;
      this._levels[b.key] = smooth(this._levels[b.key], clamp(energy * 1.25, 0, 1), 0.08, dt);
      total += energy;
    }

    this.level = smooth(this.level, clamp(total / BANDS.length, 0, 1), 0.1, dt);
    this.peak = Math.max(this.peak * 0.94, this.level);

    this.onFrame?.({
      levels: this._levels,
      bands,
      spectrum: this._bytes,
      level: this.level,
      peak: this.peak,
      bpm: this.bpm,
      bpmConfidence: this.bpmConfidence,
      dt,
    });

    this._detect(now, bands, fluxes);
  }

  _detect(now, bands, fluxes) {
    const silent = this.level < SILENCE_GATE;
    for (const trig of TRIGGERS) {
      if (silent) continue;
      let flux = 0;
      let energy = 0;
      let threshold = 0;
      let spread = 0;

      for (const key of trig.bands) {
        const f = fluxes[key];
        flux += f;
        energy += bands[key];
        const ring = this._flux.get(key);
        const { mean, std } = ring.stats();
        threshold += mean + std * 1.2;
        spread += std;
        ring.push(f);
      }
      flux /= trig.bands.length;
      energy /= trig.bands.length;
      threshold /= trig.bands.length;
      spread /= trig.bands.length;

      const sen = this.sensitivity * trig.senScale;
      const limit = threshold * sen + 1e-5;
      const prevFlux = this._prevFlux.get(trig.type) || 0;
      this._prevFlux.set(trig.type, flux);

      const cd = this.cooldown * trig.cdScale;
      if (now - this._lastBeat[trig.type] < cd) continue;
      if (energy < trig.floor) continue; // sessizlikte tetiklenme
      if (flux <= limit) continue;
      if (flux < prevFlux) continue; // yerel tepe noktası bekle

      this._lastBeat[trig.type] = now;
      if (trig.type === "bass") this._registerInterval(now);

      const strength = clamp((flux - limit) / (limit + spread + 1e-5), 0, 1);
      this.onBeat?.({
        type: trig.type,
        strength: 0.35 + strength * 0.65,
        energy,
        flux,
        level: this.level,
        bpm: this.bpm,
      });
    }

    // Dayanıklılık ağı: uzun süre onset yoksa ama ses varsa tempoya uygun beat üret
    const last = Math.max(this._lastBeat.bass, this._lastBeat.mid, this._lastBeat.high);
    const gap = this.bpm > 0 ? clamp(60000 / this.bpm, 250, 1200) : 800;
    if (this.level > SILENCE_GATE * 1.25 && now - last > gap * 1.6) {
      const type = bands.bass >= bands.mid && bands.bass >= bands.high ? "bass" : bands.mid >= bands.high ? "mid" : "high";
      this._lastBeat[type] = now;
      this.onBeat?.({
        type,
        strength: clamp(0.3 + this.level, 0, 1),
        energy: bands[type] ?? this.level,
        flux: 0,
        level: this.level,
        bpm: this.bpm,
        synthetic: true,
      });
    }
  }

  _registerInterval(now) {
    const last = this._lastIntervalTime || 0;
    this._lastIntervalTime = now;
    if (!last) return;
    const iv = now - last;
    if (iv < 200 || iv > 2000) return; // 30–300 BPM dışını at
    this._intervals.push(iv);
    if (this._intervals.length > 16) this._intervals.shift();
    if (this._intervals.length < 4) return;

    // Medyan etrafındaki tutarlı aralıklardan BPM — tek tük kaçak vuruşlara dayanıklı
    const med = median(this._intervals);
    const inliers = this._intervals.filter((v) => Math.abs(v - med) < med * 0.22);
    if (inliers.length < 3) {
      this.bpmConfidence = Math.max(0, this.bpmConfidence - 0.1);
      return;
    }
    const avg = inliers.reduce((a, b) => a + b, 0) / inliers.length;
    let bpm = 60000 / avg;
    while (bpm < 70) bpm *= 2; // yarım/çift tempo düzeltmesi
    while (bpm > 190) bpm /= 2;
    this.bpm = Math.round(bpm);
    this.bpmConfidence = clamp(inliers.length / this._intervals.length, 0, 1);
  }
}
