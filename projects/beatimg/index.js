import "./styles.scss";
import gsap from "gsap";
import { BeatDetector } from "./beat-detection.js";

const PFX = "beatimg-";

/* ------------------------------------------------------------------ */
/* Yardımcı: element oluştur                                          */
/* ------------------------------------------------------------------ */
function el(tag, className, html = "") {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (html) e.innerHTML = html;
  return e;
}

/* ------------------------------------------------------------------ */
/* BeatImgApp                                                          */
/* ------------------------------------------------------------------ */
class BeatImgApp {
  constructor() {
    this.detector = null;
    this.isActive = false;
    this.isPanelOpen = false;
    this.imagePool = [];
    this.beatCount = 0;

    // DOM referansları
    this.toggleBtn = null;
    this.panel = null;
    this.overlay = null;
    this.overlayImg = null;
    this.overlayFlash = null;
    this.statusDot = null;
    this.statusText = null;
    this.beatCountEl = null;
    this.sensitivitySlider = null;
    this.sensitivityVal = null;
    this.cooldownSlider = null;
    this.cooldownVal = null;
    this.startBtn = null;
    this.stopBtn = null;
    this.energyFill = null;
    this.beatRing = null;
    this.canvas = null;
    this.ctx = null;

    this._poolTimer = null;
    this._dismissTimer = null;
    this._sceneGen = 0;  // artarak yeni sahneyi tanımlar
    this._scenePriority = 0;  // bass=3, mid=2, high=1; düşük öncelikli beat üst üste gelmez
    this._preloadCache = new Set(); // önceden yüklenen URL'ler
    this._observer = null;
    this.sourceMode = 'mic'; // 'mic' | 'file'
    this.audioEl = null;
    this.fileInputEl = null;
    this.fileZoneEl = null;
    this.audioNameEl = null;

    // Beat türüne göre animasyon havuzları
    this._beatAnimations = {
      bass: [
        this._animBassSlam.bind(this),
        this._animZoomCrush.bind(this),
        this._animFilmBurn.bind(this),
        this._animStampDrop.bind(this),
      ],
      mid: [
        this._animSplitReveal.bind(this),
        this._animDiagonalSlice.bind(this),
        this._animSideSlide.bind(this),
        this._animGlitch.bind(this),
      ],
      high: [
        this._animScatterBurst.bind(this),
        this._animStrobe.bind(this),
        this._animChromatic.bind(this),
        this._animVHSNoise.bind(this),
      ],
    };

    this._init();
  }

  /* ---------------------------------------------------------------- */
  /* Init                                                             */
  /* ---------------------------------------------------------------- */
  _init() {
    this._buildToggleBtn();
    this._buildPanel();
    this._buildOverlay();
    this._refreshPool();

    this._observer = new MutationObserver(() => {
      clearTimeout(this._poolTimer);
      this._poolTimer = setTimeout(() => this._refreshPool(), 900);
    });
    this._observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src", "style"],
    });
  }

  /* ---------------------------------------------------------------- */
  /* Toggle Button                                                    */
  /* ---------------------------------------------------------------- */
  _buildToggleBtn() {
    this.toggleBtn = el(
      "button",
      `${PFX}toggle`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
         <path d="M9 18V5l12-2v13"/>
         <circle cx="6" cy="18" r="3"/>
         <circle cx="18" cy="16" r="3"/>
       </svg>`
    );
    this.toggleBtn.title = "BeatImg";
    this.toggleBtn.addEventListener("click", () => this._togglePanel());
    document.body.appendChild(this.toggleBtn);
  }

  /* ---------------------------------------------------------------- */
  /* Control Panel                                                    */
  /* ---------------------------------------------------------------- */
  _buildPanel() {
    this.panel = el("div", `${PFX}panel`);
    this.panel.innerHTML = `
      <div class="${PFX}header">
        <div class="${PFX}title">
          <span class="${PFX}title-icon">🎵</span>
          <span>BeatImg</span>
        </div>
        <button class="${PFX}close-btn" title="Close">✕</button>
      </div>

      <div class="${PFX}status-bar">
        <div class="${PFX}dot idle"></div>
        <span class="${PFX}status-text">Ready</span>
        <span class="${PFX}beat-count">0 beat</span>
      </div>

      <canvas class="${PFX}visualizer" width="240" height="50"></canvas>

      <div class="${PFX}energy-wrap">
        <div class="${PFX}energy-fill"></div>
      </div>

      <div class="${PFX}source-tabs">
        <button class="${PFX}tab active" data-tab="mic">🎤 Microphone</button>
        <button class="${PFX}tab" data-tab="file">📁 MP3</button>
      </div>

      <div class="${PFX}file-zone">
        <label class="${PFX}drop-label">
          <input type="file" accept="audio/*" class="${PFX}file-input" style="display:none">
          <span class="${PFX}drop-icon">📂</span>
          <span class="${PFX}drop-text">Select or drop a file</span>
        </label>
        <div class="${PFX}audio-info">
          <span class="${PFX}audio-name"></span>
        </div>
        <audio class="${PFX}audio" controls></audio>
      </div>

      <div class="${PFX}controls">
        <div class="${PFX}control-row">
          <label>Sensitivity</label>
          <div class="${PFX}slider-row">
            <input type="range" class="${PFX}sensitivity" min="1.1" max="3.0" step="0.05" value="1.35">
            <span class="${PFX}sval">1.35</span>
          </div>
        </div>
        <div class="${PFX}control-row">
          <label>Cooldown (ms)</label>
          <div class="${PFX}slider-row">
            <input type="range" class="${PFX}cooldown" min="20" max="1000" step="10" value="180">
            <span class="${PFX}sval">180ms</span>
          </div>
        </div>
      </div>

      <div class="${PFX}btn-row">
        <button class="${PFX}start-btn">▶ Start</button>
        <button class="${PFX}stop-btn" disabled>■ Stop</button>
      </div>

      <div class="${PFX}beat-ring"></div>
    `;

    document.body.appendChild(this.panel);

    // Referanslar
    this.statusDot = this.panel.querySelector(`.${PFX}dot`);
    this.statusText = this.panel.querySelector(`.${PFX}status-text`);
    this.beatCountEl = this.panel.querySelector(`.${PFX}beat-count`);
    this.sensitivitySlider = this.panel.querySelector(`.${PFX}sensitivity`);
    this.cooldownSlider = this.panel.querySelector(`.${PFX}cooldown`);
    const svals = this.panel.querySelectorAll(`.${PFX}sval`);
    this.sensitivityVal = svals[0];
    this.cooldownVal = svals[1];
    this.startBtn = this.panel.querySelector(`.${PFX}start-btn`);
    this.stopBtn = this.panel.querySelector(`.${PFX}stop-btn`);
    this.energyFill = this.panel.querySelector(`.${PFX}energy-fill`);
    this.beatRing = this.panel.querySelector(`.${PFX}beat-ring`);
    this.canvas = this.panel.querySelector(`.${PFX}visualizer`);
    this.ctx = this.canvas.getContext("2d");
    this.fileZoneEl = this.panel.querySelector(`.${PFX}file-zone`);
    this.fileInputEl = this.panel.querySelector(`.${PFX}file-input`);
    this.audioNameEl = this.panel.querySelector(`.${PFX}audio-name`);
    this.audioEl = this.panel.querySelector(`.${PFX}audio`);

    // Olaylar
    this.panel.querySelector(`.${PFX}close-btn`).addEventListener("click", () => this._closePanel());
    this.startBtn.addEventListener("click", () => this._start());
    this.stopBtn.addEventListener("click", () => this._stop());

    // Kaynak sekmeleri
    this.panel.querySelectorAll(`.${PFX}tab`).forEach((btn) => {
      btn.addEventListener("click", () => {
        const tab = btn.dataset.tab;
        this.sourceMode = tab;
        this.panel.querySelectorAll(`.${PFX}tab`).forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.fileZoneEl.style.display = tab === "file" ? "block" : "none";
      });
    });

    // Dosya seçici
    this.fileInputEl.addEventListener("change", (e) => this._loadAudioFile(e.target.files[0]));

    // Drag & drop
    this.fileZoneEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      this.fileZoneEl.classList.add("dragover");
    });
    this.fileZoneEl.addEventListener("dragleave", () => this.fileZoneEl.classList.remove("dragover"));
    this.fileZoneEl.addEventListener("drop", (e) => {
      e.preventDefault();
      this.fileZoneEl.classList.remove("dragover");
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("audio/")) this._loadAudioFile(file);
    });

    this.sensitivitySlider.addEventListener("input", (e) => {
      this.sensitivityVal.textContent = parseFloat(e.target.value).toFixed(2);
      if (this.detector) this.detector.setSensitivity(e.target.value);
    });

    this.cooldownSlider.addEventListener("input", (e) => {
      this.cooldownVal.textContent = e.target.value + "ms";
      if (this.detector) this.detector.setCooldown(e.target.value);
    });
  }

  /* ---------------------------------------------------------------- */
  /* Overlay                                                          */
  /* ---------------------------------------------------------------- */
  _buildOverlay() {
    this.overlay = el("div", `${PFX}overlay`);
    this.overlayFlash = el("div", `${PFX}flash`);
    this.overlay.appendChild(this.overlayFlash);
    this.overlay.addEventListener("click", () => this._clearScene(true));
    document.body.appendChild(this.overlay);
  }

  /* ---------------------------------------------------------------- */
  /* Panel aç / kapat                                                 */
  /* ---------------------------------------------------------------- */
  _togglePanel() {
    this.isPanelOpen ? this._closePanel() : this._openPanel();
  }

  _openPanel() {
    this.isPanelOpen = true;
    this.panel.classList.add("open");
    gsap.fromTo(
      this.panel,
      { opacity: 0, scale: 0.88, y: -8, transformOrigin: "top right" },
      { opacity: 1, scale: 1, y: 0, duration: 0.28, ease: "back.out(1.7)" }
    );
    this.toggleBtn.classList.add("active");
  }

  _closePanel() {
    this.isPanelOpen = false;
    gsap.to(this.panel, {
      opacity: 0, scale: 0.9, y: -6, duration: 0.18, ease: "power2.in",
      onComplete: () => this.panel.classList.remove("open"),
    });
    this.toggleBtn.classList.remove("active");
  }

  /* ---------------------------------------------------------------- */
  /* Status                                                           */
  /* ---------------------------------------------------------------- */
  _setStatus(state, text) {
    this.statusDot.className = `${PFX}dot ${state}`;
    this.statusText.textContent = text;
  }

  /* ---------------------------------------------------------------- */
  /* Image Pool                                                       */
  /* ---------------------------------------------------------------- */
  _refreshPool() {
    const pool = new Set();

    // <img> etiketleri
    document.querySelectorAll("img").forEach((img) => {
      if (!img.src) return;
      if (img.src.startsWith("data:image/svg")) return;
      if (img.naturalWidth < 120 || img.naturalHeight < 120) return;
      const r = img.getBoundingClientRect();
      if (r.width < 100 || r.height < 100) return;
      // Kendi overlay image'ımız değilse ekle
      if (img.closest(`.${PFX}overlay, .${PFX}panel, .${PFX}toggle`)) return;
      pool.add(img.src);
    });

    // Background-image olan elementler
    document.querySelectorAll("*").forEach((node) => {
      if (node.closest(`.${PFX}overlay, .${PFX}panel, .${PFX}toggle`)) return;
      const bg = getComputedStyle(node).backgroundImage;
      if (!bg || bg === "none") return;
      const m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (!m || !m[1]) return;
      const url = m[1];
      if (url.startsWith("data:image/svg")) return;
      const r = node.getBoundingClientRect();
      if (r.width < 100 || r.height < 100) return;
      pool.add(url);
    });

    this.imagePool = [...pool];
    this._preloadImages();
  }

  _preloadImages() {
    // Pool'daki tüm görselleri tarayıcı cache'ine al
    this.imagePool.forEach(src => {
      if (this._preloadCache.has(src)) return;
      this._preloadCache.add(src);
      const img = new Image();
      img.src = src;
    });
  }

  _randomImage() {
    if (!this.imagePool.length) return null;
    return this.imagePool[Math.floor(Math.random() * this.imagePool.length)];
  }

  _pickImages(count) {
    if (!this.imagePool.length) return [];
    const pool = [...this.imagePool].sort(() => Math.random() - 0.5);
    return pool.slice(0, Math.min(count, pool.length));
  }

  /* ---------------------------------------------------------------- */
  /* Start / Stop                                                     */
  /* ---------------------------------------------------------------- */
  async _start() {
    if (this.isActive) return;
    this.startBtn.disabled = true;

    if (this.sourceMode === "file") {
      if (!this.audioEl || !this.audioEl.src) {
        this._setStatus("error", "Please select an audio file first");
        this.startBtn.disabled = false;
        return;
      }
      this._setStatus("connecting", "Starting audio analysis...");
    } else {
      this._setStatus("connecting", "Waiting for microphone permission...");
    }

    this.detector = new BeatDetector({
      sensitivity: parseFloat(this.sensitivitySlider.value),
      cooldown: parseInt(this.cooldownSlider.value),
    });

    this.detector.onBeat = (data) => this._onBeat(data);
    this.detector.onEnergy = (data) => this._onEnergy(data);
    this.detector.onError = (err) => {
      this._setStatus("error", "Error: " + err.message);
      this.startBtn.disabled = false;
    };

    let ok;
    if (this.sourceMode === "file") {
      ok = await this.detector.startFromAudio(this.audioEl);
    } else {
      ok = await this.detector.start();
    }

    if (ok) {
      this.isActive = true;
      this._setStatus("active", this.sourceMode === "file" ? "Analyzing file..." : "Listening...");
      this.stopBtn.disabled = false;
    } else {
      this._setStatus("error", this.sourceMode === "file" ? "Could not connect audio source" : "Microphone access failed");
      this.startBtn.disabled = false;
    }
  }

  _stop() {
    if (!this.isActive) return;
    if (this.detector) { this.detector.stop(); this.detector = null; }
    this.isActive = false;
    this._setStatus("idle", "Stopped");
    this.startBtn.disabled = false;
    this.stopBtn.disabled = true;
    this.energyFill.style.width = "0%";
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  _loadAudioFile(file) {
    if (!file) return;
    const oldUrl = this.audioEl.src;
    if (oldUrl && oldUrl.startsWith("blob:")) URL.revokeObjectURL(oldUrl);
    this.audioEl.src = URL.createObjectURL(file);
    this.audioNameEl.textContent = file.name;
    this.audioEl.load();
  }

  /* ---------------------------------------------------------------- */
  /* Beat olayı                                                       */
  /* ---------------------------------------------------------------- */
  _onBeat({ energy, ratio, type = 'bass' }) {
    const priority = { bass: 3, mid: 2, high: 1 };
    const myPriority = priority[type] || 1;
    if (myPriority < this._scenePriority) return;  // Daha öncelikli sahne devam ediyor, atla

    this.beatCount++;
    this.beatCountEl.textContent = `${this.beatCount} beat`;

    this._refreshPool();
    const countMap = { bass: 2, mid: 3, high: 4 };
    const images = this._pickImages(countMap[type] || 1);
    if (images.length) {
      const pool = this._beatAnimations[type] || this._beatAnimations.bass;
      const animFn = pool[Math.floor(Math.random() * pool.length)];
      this._scenePriority = myPriority;
      this._showBeatScene(images, animFn, energy, type);
    }

    const colorMap = { bass: ['#ff3b6b', 'rgba(255,59,107,'], mid: ['#ff8800', 'rgba(255,136,0,'], high: ['#7c6fff', 'rgba(124,111,255,'] };
    const [ringColor, shadowBase] = colorMap[type] || colorMap.bass;
    gsap.killTweensOf(this.beatRing);
    gsap.fromTo(this.beatRing,
      { scale: 0.4, opacity: 0.95, backgroundColor: ringColor },
      { scale: 3.5, opacity: 0, backgroundColor: ringColor, duration: 0.55, ease: 'power2.out' }
    );
    gsap.killTweensOf(this.toggleBtn, 'boxShadow');
    gsap.fromTo(this.toggleBtn,
      { boxShadow: `0 0 0 0 ${shadowBase}0.9)` },
      { boxShadow: `0 0 0 22px ${shadowBase}0)`, duration: 0.55, ease: 'power2.out' }
    );
  }

  /* ---------------------------------------------------------------- */
  /* Energy olayı (her frame)                                         */
  /* ---------------------------------------------------------------- */
  _onEnergy({ ratio, spectrum }) {
    // Enerji barı
    const pct = Math.min(100, Math.max(0, (ratio - 1) * 130));
    this.energyFill.style.width = pct + "%";

    // Frekans spektrumu görsel
    this._drawSpectrum(spectrum);
  }

  _drawSpectrum(spectrum) {
    const { width, height } = this.canvas;
    this.ctx.clearRect(0, 0, width, height);

    const bars = 40;
    const barW = width / bars;
    const step = Math.floor(spectrum.length / bars);

    for (let i = 0; i < bars; i++) {
      let val = 0;
      for (let j = 0; j < step; j++) val += spectrum[i * step + j];
      val /= step;

      const barH = (val / 255) * height;
      const hue = 260 - (val / 255) * 160; // mor → kırmızı

      // Glow efekti
      this.ctx.shadowColor = `hsl(${hue}, 90%, 65%)`;
      this.ctx.shadowBlur = 4;
      this.ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
      this.ctx.fillRect(i * barW + 1, height - barH, barW - 2, barH);
    }
    this.ctx.shadowBlur = 0;
  }

  /* ================================================================ */
  /* Beat Sahne Sistemi                                               */
  /* ================================================================ */

  _showBeatScene(srcs, animFn, energy, beatType) {
    clearTimeout(this._dismissTimer);
    this._screenFlash(energy, beatType);
    this._clearScene(false);
    const gen = ++this._sceneGen;
    if (gen !== this._sceneGen) return;

    // Görseller preload edildiğinden div'leri aninda oluştur
    const els = srcs.map(src => {
      const e = document.createElement('div');
      e.className = `${PFX}scene-img`;
      e.style.backgroundImage = `url("${src.replace(/"/g, '%22')}")`;
      return e;
    });
    if (els.length) this._renderScene(els, animFn, energy, beatType);
  }

  _renderScene(els, animFn, energy, beatType) {
    this._applyLayout(els);          // önce yerleştir
    els.forEach(e => this.overlay.appendChild(e));
    this.overlay.classList.add('visible');
    animFn(els, energy, beatType);
    const cd = this.detector?.options.cooldown ?? 400;
    // Bass/mid: en az 800ms, high: en az 500ms — cooldown ne olursa olsun
    const hold = beatType === 'high' ? Math.max(500, cd * 1.2) : Math.max(800, cd * 1.8);
    this._dismissTimer = setTimeout(() => this._clearScene(false), hold);
  }

  /* Eleman sayısına göre üst üste gelmeyen rastgele layout atar */
  _applyLayout(els) {
    const n = Math.min(els.length, 4);
    // l=left, t=top, w=width, h=height (vw/vh string)
    const L = {
      1: [
        [{ l: '5vw', t: '5vh', w: '90vw', h: '90vh' }],
        [{ l: '8vw', t: '8vh', w: '84vw', h: '84vh' }],
      ],
      2: [
        // Eşit yan yana
        [{ l: '1vw', t: '6vh', w: '49vw', h: '88vh' }, { l: '51vw', t: '6vh', w: '48vw', h: '88vh' }],
        // Büyük sol + küçük sağ
        [{ l: '2vw', t: '5vh', w: '63vw', h: '90vh' }, { l: '67vw', t: '18vh', w: '30vw', h: '64vh' }],
        // Büyük sağ + küçük sol
        [{ l: '35vw', t: '5vh', w: '63vw', h: '90vh' }, { l: '2vw', t: '18vh', w: '30vw', h: '64vh' }],
        // Üst geniş + alt dar
        [{ l: '5vw', t: '2vh', w: '90vw', h: '60vh' }, { l: '20vw', t: '65vh', w: '60vw', h: '30vh' }],
      ],
      3: [
        // Büyük sol + 2 sağ üst üste
        [{ l: '1vw', t: '5vh', w: '62vw', h: '90vh' }, { l: '65vw', t: '5vh', w: '33vw', h: '43vh' }, { l: '65vw', t: '52vh', w: '33vw', h: '43vh' }],
        // Büyük sağ + 2 sol üst üste
        [{ l: '35vw', t: '5vh', w: '63vw', h: '90vh' }, { l: '1vw', t: '5vh', w: '32vw', h: '43vh' }, { l: '1vw', t: '52vh', w: '32vw', h: '43vh' }],
        // Üst geniş + 2 alt yan yana
        [{ l: '5vw', t: '2vh', w: '90vw', h: '57vh' }, { l: '1vw', t: '62vh', w: '48vw', h: '35vh' }, { l: '51vw', t: '62vh', w: '48vw', h: '35vh' }],
        // 3 yatay şerit
        [{ l: '1vw', t: '2vh', w: '98vw', h: '30vh' }, { l: '1vw', t: '35vh', w: '98vw', h: '30vh' }, { l: '1vw', t: '68vh', w: '98vw', h: '28vh' }],
      ],
      4: [
        // 2x2 ızgara
        [{ l: '1vw', t: '2vh', w: '48vw', h: '47vh' }, { l: '51vw', t: '2vh', w: '48vw', h: '47vh' }, { l: '1vw', t: '51vh', w: '48vw', h: '47vh' }, { l: '51vw', t: '51vh', w: '48vw', h: '47vh' }],
        // Büyük sol + 3 sağ üst üste
        [{ l: '1vw', t: '5vh', w: '62vw', h: '90vh' }, { l: '65vw', t: '2vh', w: '33vw', h: '28vh' }, { l: '65vw', t: '34vh', w: '33vw', h: '28vh' }, { l: '65vw', t: '66vh', w: '33vw', h: '28vh' }],
        // Büyük sağ + 3 sol üst üste
        [{ l: '36vw', t: '5vh', w: '62vw', h: '90vh' }, { l: '1vw', t: '2vh', w: '33vw', h: '28vh' }, { l: '1vw', t: '34vh', w: '33vw', h: '28vh' }, { l: '1vw', t: '66vh', w: '33vw', h: '28vh' }],
      ],
    };
    const opts = L[n];
    const chosen = opts[Math.floor(Math.random() * opts.length)];
    els.forEach((e, i) => {
      const pos = chosen[i] || chosen[chosen.length - 1];
      Object.assign(e.style, { left: pos.l, top: pos.t, width: pos.w, height: pos.h });
    });
  }

  _clearScene(instant = true) {
    const snapGen = this._sceneGen;
    const imgs = [...this.overlay.querySelectorAll(`.${PFX}scene-img`)];
    if (!imgs.length) { this.overlay.classList.remove('visible'); this._scenePriority = 0; return; }
    if (instant) {
      imgs.forEach(e => e.remove());
      this.overlay.classList.remove('visible');
      this._scenePriority = 0;
      return;
    }
    let done = 0;
    imgs.forEach(e => {
      gsap.to(e, {
        opacity: 0, duration: 0.16, ease: 'power2.in',
        onComplete: () => {
          e.remove();
          if (++done === imgs.length && snapGen === this._sceneGen) {
            this.overlay.classList.remove('visible');
            this._scenePriority = 0;
          }
        },
      });
    });
  }

  _screenFlash(energy, beatType = 'bass') {
    const intensity = Math.min(0.7, (energy - 1) * 0.28 + 0.15);
    const colors = { bass: '#ffffff', mid: '#ff7030', high: '#8070ff' };
    this.overlayFlash.style.background = colors[beatType] || '#ffffff';
    this.overlayFlash.style.opacity = intensity;
    gsap.killTweensOf(this.overlayFlash);
    gsap.to(this.overlayFlash, { opacity: 0, duration: 0.32, ease: 'power3.out' });
  }

  /* ================================================================ */
  /* BASS animasyonları — sert konum/transform                        */
  /* ================================================================ */

  _animBassSlam(els) {
    els.forEach((e, i) => {
      gsap.from(e, { scale: 0.06, rotate: i % 2 === 0 ? -5 : 5, duration: 0.28, ease: 'back.out(3)', delay: i * 0.04 });
    });
    gsap.fromTo(this.overlay, { x: -10 }, { x: 10, duration: 0.03, repeat: 7, yoyo: true, ease: 'none', onComplete: () => gsap.set(this.overlay, { x: 0 }) });
  }

  _animZoomCrush(els) {
    els.forEach((e, i) => {
      gsap.from(e, { scale: 2.6, duration: 0.36, ease: 'expo.out', delay: i * 0.05 });
    });
  }

  _animFilmBurn(els) {
    els.forEach((e, i) => {
      gsap.from(e, { scale: 0.3, rotate: i % 2 === 0 ? 160 : -160, duration: 0.32, ease: 'power3.out', delay: i * 0.05 });
    });
  }

  _animStampDrop(els) {
    els.forEach((e, i) => {
      gsap.from(e, { y: -window.innerHeight, rotate: i % 2 === 0 ? -3 : 3, duration: 0.26, ease: 'back.out(2)', delay: i * 0.05 });
    });
  }

  /* ================================================================ */
  /* MID animasyonları — wipe / split                                 */
  /* ================================================================ */

  _animSplitReveal(els) {
    els.forEach((e, i) => {
      const fromX = i % 2 === 0 ? -window.innerWidth : window.innerWidth;
      gsap.from(e, { x: fromX, duration: 0.28, ease: 'expo.out', delay: i * 0.03 });
    });
  }

  _animDiagonalSlice(els) {
    els.forEach((e, i) => {
      gsap.from(e, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', duration: 0.26, ease: 'power4.out', delay: i * 0.04 });
    });
  }

  _animSideSlide(els) {
    els.forEach((e, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      gsap.from(e, { x: dir * window.innerWidth, rotate: dir * 10, duration: 0.26, ease: 'expo.out', delay: i * 0.04 });
    });
  }

  _animGlitch(els) {
    els.forEach((e, i) => {
      gsap.timeline({ delay: i * 0.04 })
        .from(e, { skewX: 22, skewY: 4, scale: 1.1, duration: 0.1, ease: 'steps(4)' })
        .to(e, { x: -10, skewX: -6, duration: 0.04 })
        .to(e, { x: 7, skewX: 4, duration: 0.04 })
        .to(e, { x: 0, skewX: 0, duration: 0.04 });
    });
  }

  /* ================================================================ */
  /* HIGH animasyonları — scatter / pop / bounce                      */
  /* ================================================================ */

  _animScatterBurst(els) {
    els.forEach((e, i) => {
      gsap.from(e, { scale: 0.06, rotate: (Math.random() - 0.5) * 60, duration: 0.24, ease: 'back.out(2.5)', delay: i * 0.04 });
    });
  }

  _animStrobe(els) {
    // Scale-pop: yüksek hızda scale bounce
    els.forEach((e, i) => {
      gsap.timeline({ delay: i * 0.04 })
        .from(e, { scale: 1.5, duration: 0.06, ease: 'power3.out' })
        .to(e, { scale: 0.94, duration: 0.05 })
        .to(e, { scale: 1.0, duration: 0.07, ease: 'back.out(2)' });
    });
  }

  _animChromatic(els) {
    // Y ekseninden stagger slide
    els.forEach((e, i) => {
      const fromY = i % 2 === 0 ? window.innerHeight * 0.35 : -window.innerHeight * 0.35;
      gsap.from(e, { y: fromY, scale: 0.88, duration: 0.3, ease: 'expo.out', delay: i * 0.04 });
    });
  }

  _animVHSNoise(els) {
    els.forEach((e, i) => {
      gsap.timeline({ delay: i * 0.04 })
        .from(e, { scaleY: 1.1, skewX: 10, duration: 0.1, ease: 'steps(4)' })
        .to(e, { x: -7, skewX: -4, duration: 0.04 })
        .to(e, { x: 5, skewX: 3, duration: 0.04 })
        .to(e, { x: 0, skewX: 0, duration: 0.04 });
    });
  }
}

/* ------------------------------------------------------------------ */
/* Başlat                                                              */
/* ------------------------------------------------------------------ */
let _instance = null;
function boot() {
  if (_instance) return;
  _instance = new BeatImgApp();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => setTimeout(boot, 600));
} else {
  setTimeout(boot, 600);
}
