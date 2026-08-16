/* Kontrol paneli — tüm DOM burada, geri kalan her şey canvas. */

import { PFX, Z } from "../core/config.js";
import { el, on } from "../utils/dom.js";
import { Visualizer } from "./visualizer.js";

/** Kaydırıcı tanımları: [ayar anahtarı, etiket, min, max, adım, biçimlendirici] */
const SLIDERS = [
  ["sensitivity", "Sensitivity", 0.6, 3, 0.05, (v) => v.toFixed(2)],
  ["cooldown", "Cooldown", 40, 800, 10, (v) => v + "ms"],
  ["intensity", "Intensity", 0.2, 2, 0.05, (v) => "×" + v.toFixed(2)],
  ["sceneImages", "Images / beat", 1, 8, 1, (v) => String(v)],
  ["scrollRows", "Scroll rows", 0, 4, 1, (v) => String(v)],
];

const TOGGLES = [
  ["scroll", "Scrolling strips"],
  ["flash", "Beat flash"],
  ["shake", "Screen shake"],
  ["particles", "Particles"],
];

export class Panel {
  /**
   * @param {Object} opts
   * @param {Object} opts.settings
   * @param {(key:string, value:any)=>void} opts.onSetting
   */
  constructor({ settings, onSetting, onStart, onStop, onClear, onFile, onTab }) {
    this.settings = settings;
    this.onSetting = onSetting;
    this.onStart = onStart;
    this.onStop = onStop;
    this.onClear = onClear;
    this.onFile = onFile;
    this.onTab = onTab;
    this.isOpen = false;
    this._offs = [];
  }

  mount() {
    this._buildToggle();
    this._buildPanel();
    this._offs.push(
      on(window, "keydown", (e) => {
        if (e.altKey && (e.key === "b" || e.key === "B")) {
          e.preventDefault();
          this.toggle();
        }
      })
    );
  }

  destroy() {
    this._offs.forEach((off) => off());
    this._offs.length = 0;
    this.toggleBtn?.remove();
    this.root?.remove();
  }

  /* ---------------------------------------------------------------- */

  _buildToggle() {
    this.toggleBtn = el(
      "button",
      `${PFX}toggle`,
      `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
         <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
       </svg>`
    );
    this.toggleBtn.title = "BeatImg (Alt+B)";
    this.toggleBtn.style.zIndex = String(Z.toggle);
    this._offs.push(on(this.toggleBtn, "click", () => this.toggle()));
    document.documentElement.appendChild(this.toggleBtn);
  }

  _buildPanel() {
    const s = this.settings;
    this.root = el("div", `${PFX}panel`);
    this.root.style.zIndex = String(Z.panel);
    this.root.innerHTML = `
      <div class="${PFX}header">
        <div class="${PFX}title"><span class="${PFX}title-icon">🎵</span><span>BeatImg</span></div>
        <button class="${PFX}close-btn" title="Close (Esc)">✕</button>
      </div>

      <div class="${PFX}status-bar">
        <div class="${PFX}dot idle"></div>
        <span class="${PFX}status-text">Ready</span>
        <span class="${PFX}badge ${PFX}bpm">– BPM</span>
      </div>

      <canvas class="${PFX}visualizer"></canvas>

      <div class="${PFX}source-tabs">
        <button class="${PFX}tab${s.sourceMode === "mic" ? " active" : ""}" data-tab="mic">🎤 Microphone</button>
        <button class="${PFX}tab${s.sourceMode === "file" ? " active" : ""}" data-tab="file">📁 Audio file</button>
      </div>

      <div class="${PFX}file-zone"${s.sourceMode === "file" ? ' style="display:block"' : ""}>
        <label class="${PFX}drop-label">
          <input type="file" accept="audio/*" class="${PFX}file-input" hidden>
          <span class="${PFX}drop-icon">📂</span>
          <span class="${PFX}drop-text">Select or drop an audio file</span>
        </label>
        <div class="${PFX}audio-name"></div>
        <audio class="${PFX}audio" controls preload="metadata"></audio>
      </div>

      <div class="${PFX}controls"></div>

      <div class="${PFX}toggles"></div>

      <div class="${PFX}control-row ${PFX}quality-row">
        <label>Quality</label>
        <select class="${PFX}quality">
          <option value="auto">Auto</option>
          <option value="high">High</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div class="${PFX}btn-row">
        <button class="${PFX}start-btn">▶ Start</button>
        <button class="${PFX}stop-btn" disabled>■ Stop</button>
      </div>

      <div class="${PFX}btn-row">
        <button class="${PFX}clear-btn">🗑 Clear images (<span class="${PFX}img-count">0</span>)</button>
      </div>

      <div class="${PFX}stats">
        <span class="${PFX}stat" data-k="fps">– fps</span>
        <span class="${PFX}stat" data-k="beats">0 beats</span>
        <span class="${PFX}stat" data-k="quality">auto</span>
      </div>
      <div class="${PFX}hint">Alt+B toggles this panel · Esc stops</div>
    `;
    document.documentElement.appendChild(this.root);

    const q = (sel) => this.root.querySelector(sel);
    this.statusDot = q(`.${PFX}dot`);
    this.statusText = q(`.${PFX}status-text`);
    this.bpmEl = q(`.${PFX}bpm`);
    this.startBtn = q(`.${PFX}start-btn`);
    this.stopBtn = q(`.${PFX}stop-btn`);
    this.imgCountEl = q(`.${PFX}img-count`);
    this.audioEl = q(`.${PFX}audio`);
    this.fileZone = q(`.${PFX}file-zone`);
    this.audioNameEl = q(`.${PFX}audio-name`);
    this.qualitySel = q(`.${PFX}quality`);
    this.statEls = {};
    this.root.querySelectorAll(`.${PFX}stat`).forEach((e) => (this.statEls[e.dataset.k] = e));

    this.visualizer = new Visualizer(q(`.${PFX}visualizer`));
    this.qualitySel.value = this.settings.quality;

    this._buildSliders(q(`.${PFX}controls`));
    this._buildToggles(q(`.${PFX}toggles`));
    this._wire(q);
  }

  _buildSliders(host) {
    this.sliderLabels = {};
    for (const [key, label, min, max, step, fmt] of SLIDERS) {
      const row = el("div", `${PFX}control-row`);
      row.innerHTML = `
        <label>${label}</label>
        <div class="${PFX}slider-row">
          <input type="range" min="${min}" max="${max}" step="${step}" value="${this.settings[key]}">
          <span class="${PFX}sval">${fmt(this.settings[key])}</span>
        </div>`;
      const input = row.querySelector("input");
      const out = row.querySelector(`.${PFX}sval`);
      this.sliderLabels[key] = out;
      this._offs.push(
        on(input, "input", () => {
          const v = step < 1 ? parseFloat(input.value) : parseInt(input.value, 10);
          out.textContent = fmt(v);
          this.onSetting?.(key, v);
        })
      );
      host.appendChild(row);
    }
  }

  _buildToggles(host) {
    for (const [key, label] of TOGGLES) {
      const row = el("label", `${PFX}toggle-row`);
      row.innerHTML = `<span>${label}</span><input type="checkbox"${this.settings[key] ? " checked" : ""}>`;
      const input = row.querySelector("input");
      this._offs.push(on(input, "change", () => this.onSetting?.(key, input.checked)));
      host.appendChild(row);
    }
  }

  _wire(q) {
    this._offs.push(
      on(q(`.${PFX}close-btn`), "click", () => this.close()),
      on(this.startBtn, "click", () => this.onStart?.()),
      on(this.stopBtn, "click", () => this.onStop?.()),
      on(q(`.${PFX}clear-btn`), "click", () => this.onClear?.()),
      on(this.qualitySel, "change", () => this.onSetting?.("quality", this.qualitySel.value)),
      on(q(`.${PFX}file-input`), "change", (e) => {
        const f = e.target.files?.[0];
        if (f) this.onFile?.(f);
      })
    );

    this.root.querySelectorAll(`.${PFX}tab`).forEach((btn) => {
      this._offs.push(
        on(btn, "click", () => {
          const tab = btn.dataset.tab;
          this.root.querySelectorAll(`.${PFX}tab`).forEach((b) => b.classList.toggle("active", b === btn));
          this.fileZone.style.display = tab === "file" ? "block" : "none";
          this.onSetting?.("sourceMode", tab);
          this.onTab?.(tab);
        })
      );
    });

    const dz = this.fileZone;
    this._offs.push(
      on(dz, "dragover", (e) => {
        e.preventDefault();
        dz.classList.add("dragover");
      }),
      on(dz, "dragleave", () => dz.classList.remove("dragover")),
      on(dz, "drop", (e) => {
        e.preventDefault();
        dz.classList.remove("dragover");
        const f = e.dataTransfer?.files?.[0];
        if (f && f.type.startsWith("audio/")) this.onFile?.(f);
      })
    );
  }

  /* ---------------------------------------------------------------- */

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.root.classList.add("open");
    this.toggleBtn.classList.add("active");
    this.visualizer.enabled = true;
  }

  close() {
    this.isOpen = false;
    this.root.classList.remove("open");
    this.toggleBtn.classList.remove("active");
    this.visualizer.enabled = false;
    this.visualizer.clear();
  }

  setStatus(state, text) {
    if (this._status === state + text) return; // gereksiz DOM yazımı yok
    this._status = state + text;
    this.statusDot.className = `${PFX}dot ${state}`;
    this.statusText.textContent = text;
  }

  setRunning(running) {
    this.startBtn.disabled = running;
    this.stopBtn.disabled = !running;
  }

  setImageCount(n) {
    this.imgCountEl.textContent = String(n);
  }

  setBpm(bpm, confidence) {
    this.bpmEl.textContent = bpm > 0 ? `${bpm} BPM` : "– BPM";
    this.bpmEl.style.opacity = bpm > 0 ? String(0.55 + (confidence || 0) * 0.45) : "0.5";
  }

  setStats({ fps, beats, quality }) {
    if (fps != null) this.statEls.fps.textContent = `${fps} fps`;
    if (beats != null) this.statEls.beats.textContent = `${beats} beats`;
    if (quality != null) this.statEls.quality.textContent = quality;
  }

  setAudioName(name) {
    this.audioNameEl.textContent = name || "";
  }

  /** Beat anında butonu nabızlandırır (CSS animasyonu) */
  pulse(type) {
    if (!this.toggleBtn) return;
    this.toggleBtn.classList.remove("pulse-bass", "pulse-mid", "pulse-high");
    // reflow — aynı sınıf art arda eklendiğinde animasyon yeniden başlasın
    void this.toggleBtn.offsetWidth;
    this.toggleBtn.classList.add(`pulse-${type}`);
  }
}
