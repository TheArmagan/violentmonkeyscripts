/* BeatImg uygulaması — parçaları birbirine bağlar. */

import { BEAT_PRIORITY } from "./core/config.js";
import { settings, setSetting } from "./core/store.js";
import { clamp, lerp } from "./utils/math.js";
import { on } from "./utils/dom.js";
import { ImageCache } from "./images/image-cache.js";
import { ImagePool } from "./images/image-pool.js";
import { AudioGraph, resumeContext } from "./audio/audio-graph.js";
import { BeatDetector } from "./audio/beat-detector.js";
import { Stage } from "./render/stage.js";
import { Panel } from "./ui/panel.js";

export class BeatImgApp {
  constructor() {
    this.cache = new ImageCache();
    this.pool = new ImagePool(this.cache);
    this.stage = new Stage({ cache: this.cache, pool: this.pool, settings });
    this.detector = new BeatDetector({ sensitivity: settings.sensitivity, cooldown: settings.cooldown });
    /** @type {AudioGraph|null} */
    this.graph = null;

    this.running = false;
    this.beats = 0;
    this.objectUrl = null;
    this._scenePriority = 0;
    this._sceneAt = 0;
    this._speed = 1;
    this._statsAt = 0;
    this._offs = [];

    this.panel = new Panel({
      settings,
      onSetting: (k, v) => this._applySetting(k, v),
      onStart: () => this.start(),
      onStop: () => this.stop(),
      onClear: () => this.pool.clear(),
      onFile: (f) => this._loadFile(f),
      onTab: () => { },
    });
  }

  /* ---------------------------------------------------------------- */

  init() {
    this.panel.mount();
    this.stage.mount();
    this.pool.onChange = (n) => this.panel.setImageCount(n);
    this.pool.start();

    this.detector.onBeat = (b) => this._onBeat(b);
    this.detector.onFrame = (f) => this._onFrame(f);
    this.stage.onTick = (now, dt) => this._onTick(now, dt);

    this._offs.push(
      on(window, "keydown", (e) => {
        if (e.key === "Escape" && this.running) this.stop();
      }),
      on(document, "visibilitychange", () => {
        if (!document.hidden) this.stage.wake();
      })
    );

    this.panel.setImageCount(this.pool.size);
    this.panel.setStatus("idle", "Ready");
  }

  destroy() {
    this.stop();
    this._offs.forEach((off) => off());
    this.pool.destroy();
    this.stage.destroy();
    this.panel.destroy();
    this.cache.clear();
  }

  /* ---------------------------------------------------------------- */
  /* Ayarlar                                                          */
  /* ---------------------------------------------------------------- */

  _applySetting(key, value) {
    setSetting(key, value);
    switch (key) {
      case "sensitivity":
        this.detector.setSensitivity(value);
        break;
      case "cooldown":
        this.detector.setCooldown(value);
        break;
      case "scrollRows":
      case "scroll":
        this.stage.setScrollRows(settings.scrollRows);
        break;
      case "particles":
        this.stage.particles.enabled = value && this.stage.quality > 0;
        if (!value) this.stage.particles.clear();
        break;
      case "quality":
        this.stage.emaFrame = 16; // otomatik moda dönüşte ölçümü tazele
        break;
    }
  }

  /* ---------------------------------------------------------------- */
  /* Başlat / Durdur                                                  */
  /* ---------------------------------------------------------------- */

  async start() {
    if (this.running) return;
    this.panel.setRunning(true);

    const mode = settings.sourceMode;
    if (mode === "file" && !this.panel.audioEl?.src) {
      this.panel.setStatus("error", "Select an audio file first");
      this.panel.setRunning(false);
      return;
    }
    this.panel.setStatus("connecting", mode === "file" ? "Connecting audio…" : "Requesting microphone…");

    const graph = new AudioGraph();
    try {
      if (mode === "file") {
        await graph.startElement(this.panel.audioEl);
        try {
          await this.panel.audioEl.play();
        } catch {
          this.panel.setStatus("error", "Press play on the audio player");
        }
      } else {
        await graph.startMic();
      }
    } catch (err) {
      graph.stop();
      this.panel.setStatus("error", this._errorText(err, mode));
      this.panel.setRunning(false);
      return;
    }

    this.graph = graph;
    this.detector.setSensitivity(settings.sensitivity);
    this.detector.setCooldown(settings.cooldown);
    this.detector.attach(graph);

    this.running = true;
    this.beats = 0;
    this._scenePriority = 0;
    this.pool.scan(true);
    this.stage.start();
    this.stage.wake();
    this.panel.setRunning(true);
    this.panel.setStatus("active", mode === "file" ? "Analyzing track…" : "Listening…");
  }

  stop() {
    if (!this.running) {
      this.panel.setRunning(false);
      return;
    }
    this.running = false;
    this.detector.detach();
    this.graph?.stop();
    this.graph = null;
    this.stage.stop();
    this.stage.wake();
    this.panel.setRunning(false);
    this.panel.setStatus("idle", "Stopped");
    this.panel.setBpm(0, 0);
    this.panel.visualizer.clear();
  }

  _errorText(err, mode) {
    const name = err?.name || "";
    if (name === "NotAllowedError") return "Microphone permission denied";
    if (name === "NotFoundError") return "No microphone found";
    if (name === "InvalidStateError") return "Audio element already in use — reload the page";
    if (mode === "file") return "Could not connect the audio source";
    return err?.message ? String(err.message).slice(0, 60) : "Audio start failed";
  }

  _loadFile(file) {
    const audio = this.panel.audioEl;
    if (!audio) return;
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(file);
    audio.src = this.objectUrl;
    audio.load();
    this.panel.setAudioName(file.name);
    if (settings.sourceMode !== "file") this._applySetting("sourceMode", "file");
  }

  /* ---------------------------------------------------------------- */
  /* Döngü                                                            */
  /* ---------------------------------------------------------------- */

  _onTick(now, dt) {
    if (this.running) {
      this.detector.wantSpectrum = this.panel.isOpen;
      resumeSafe(this.graph);
      this.detector.tick(now);
    }
    if (now - this._statsAt > 400) {
      this._statsAt = now;
      this.panel.setStats({
        fps: this.stage.fps,
        beats: this.beats,
        quality: settings.quality === "auto" ? `auto·${["low", "mid", "high"][this.stage.quality]}` : settings.quality,
      });
    }
  }

  _onFrame(f) {
    // Kayan şerit hızı: tempo + anlık enerji
    const bpmScale = f.bpm > 0 ? clamp(f.bpm / 120, 0.5, 1.9) : 1;
    const energyScale = clamp(0.45 + f.level * 2.6, 0.35, 3.2);
    this._speed = lerp(this._speed, bpmScale * energyScale, 0.15);
    this.stage.setSpeedScale(this._speed);

    if (this.panel.isOpen) {
      this.panel.visualizer.draw(f.spectrum, f.dt);
      this.panel.setBpm(f.bpm, f.bpmConfidence);
    }
  }

  _onBeat(beat) {
    const now = performance.now();
    const prio = BEAT_PRIORITY[beat.type] || 1;
    // Daha güçlü bir sahne henüz tazeyken zayıf beat onu ezmesin
    if (prio < this._scenePriority && now - this._sceneAt < 220) return;

    this.beats++;
    this.panel.pulse(beat.type);
    this.stage.beat(beat);

    if (this.stage.spawnScene(beat.type, beat.strength, settings.cooldown, this.detector.bpm)) {
      this._scenePriority = prio;
      this._sceneAt = now;
      this.panel.setStatus("active", settings.sourceMode === "file" ? "Analyzing track…" : "Listening…");
    } else if (!this.pool.size) {
      this.panel.setStatus("active", "No images found on this page yet");
      this.pool.scan();
    }
  }
}

/** AudioContext tarayıcı tarafından askıya alındıysa sessizce geri döndür */
let resumeAt = 0;
function resumeSafe(graph) {
  if (!graph) return;
  const now = performance.now();
  if (now - resumeAt < 2000) return;
  resumeAt = now;
  resumeContext();
}
