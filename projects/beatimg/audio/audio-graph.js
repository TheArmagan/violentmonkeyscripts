/* Web Audio grafiği — mikrofon ve <audio> kaynaklarını yönetir.
 *
 * Önemli: bir media element için createMediaElementSource yalnızca BİR kez
 * çağrılabilir; ikinci çağrı InvalidStateError fırlatır ve sesi tamamen keser.
 * Eski sürümde durdur/başlat döngüsü bu yüzden bozuluyordu. Burada hem
 * AudioContext hem de element kaynakları önbelleğe alınır, durdurma sırasında
 * yalnızca analyser bağlantısı kesilir; hoparlör yolu korunur.
 */

/** @type {AudioContext|null} */
let sharedCtx = null;
/** @type {WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>} */
const elementSources = new WeakMap();

export function getContext() {
  if (!sharedCtx) {
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) throw new Error("Web Audio API is not supported in this browser");
    sharedCtx = new Ctor();
  }
  return sharedCtx;
}

export async function resumeContext() {
  const ctx = getContext();
  if (ctx.state === "suspended") {
    try { await ctx.resume(); } catch { }
  }
  return ctx.state === "running";
}

export class AudioGraph {
  constructor({ fftSize = 2048, smoothing = 0.62 } = {}) {
    this.fftSize = fftSize;
    this.smoothing = smoothing;
    /** @type {AnalyserNode|null} */
    this.analyser = null;
    /** @type {MediaStream|null} */
    this.stream = null;
    /** @type {AudioNode|null} */
    this.source = null;
    /** @type {'mic'|'element'|null} */
    this.mode = null;
    this.element = null;
  }

  get sampleRate() {
    return sharedCtx ? sharedCtx.sampleRate : 44100;
  }

  _makeAnalyser(ctx) {
    const a = ctx.createAnalyser();
    a.fftSize = this.fftSize;
    a.smoothingTimeConstant = this.smoothing;
    a.minDecibels = -100;
    a.maxDecibels = -12;
    return a;
  }

  /** Mikrofonu bağlar */
  async startMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Microphone API unavailable (needs HTTPS)");
    }
    const ctx = getContext();
    await resumeContext();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        channelCount: 1,
      },
      video: false,
    });
    this.analyser = this._makeAnalyser(ctx);
    this.source = ctx.createMediaStreamSource(this.stream);
    this.source.connect(this.analyser);
    this.mode = "mic";
    return true;
  }

  /** Bir <audio> elementini analize bağlar; ses hoparlörden çalmaya devam eder */
  async startElement(audioEl) {
    const ctx = getContext();
    await resumeContext();

    let src = elementSources.get(audioEl);
    if (!src) {
      src = ctx.createMediaElementSource(audioEl);
      src.connect(ctx.destination); // hoparlör yolu bir kez kurulur, hiç kesilmez
      elementSources.set(audioEl, src);
    }
    this.analyser = this._makeAnalyser(ctx);
    src.connect(this.analyser);
    this.source = src;
    this.element = audioEl;
    this.mode = "element";
    return true;
  }

  stop() {
    if (this.source && this.analyser) {
      try { this.source.disconnect(this.analyser); } catch { }
    }
    if (this.mode === "mic") {
      try { this.source?.disconnect(); } catch { }
      this.stream?.getTracks().forEach((t) => t.stop());
    }
    this.stream = null;
    this.source = null;
    this.analyser = null;
    this.element = null;
    this.mode = null;
    // AudioContext bilerek kapatılmaz — element kaynakları ona bağlı kalır.
  }
}
