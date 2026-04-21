/**
 * BeatDetector — Web Audio API tabanlı beat algılama
 * Elektronik müzik için bass frekans enerjisi üzerinden çalışır.
 */
export class BeatDetector {
  constructor(options = {}) {
    this.options = {
      sensitivity: 1.35,   // Mevcut enerji / ortalama enerji eşiği (yüksek = daha az hassas)
      cooldown: 200,        // Beat'ler arası minimum süre (ms)
      bassLow: 60,          // Bass bandı alt Hz
      bassHigh: 200,        // Bass bandı üst Hz
      kickLow: 200,         // Kick/snare bandı alt Hz
      kickHigh: 500,        // Kick/snare bandı üst Hz
      historySize: 52,      // Ortalama için tutulan frame sayısı (~1s @ 60fps)
      fftSize: 2048,        // FFT çözünürlüğü
      smoothing: 0.82,      // AnalyserNode smoothingTimeConstant
      ...options,
    };

    this.audioContext = null;
    this.analyser = null;
    this.source = null;
    this.stream = null;
    this.isRunning = false;
    this.lastBassTime = 0;
    this.lastMidTime = 0;
    this.lastHighTime = 0;

    // Tempo / BPM takibi (bass aralıklarından)
    this._bassIntervals = [];
    this.bpm = 0;

    // Sustained mode (elektronik müzikte ratio düşük ama enerji yüksek)
    this._sustainedAbsThreshold = 55; // mutlak enerji eşiği
    this._sustainedGap = 650;          // ms — hiç beat olmayan süre

    // Ayrı history buffer'lar — bass / mid / high
    const hs = this.options.historySize;
    this._bassHist = new Float32Array(hs); this._bassIdx = 0; this._bassFull = false;
    this._midHist = new Float32Array(hs); this._midIdx = 0; this._midFull = false;
    this._highHist = new Float32Array(hs); this._highIdx = 0; this._highFull = false;

    this._dataArray = null;
    this._rafId = null;

    /** @type {((data: {energy:number, ratio:number, instant:number}) => void)|null} */
    this.onBeat = null;
    /** @type {((data: {bass:number, avg:number, ratio:number, spectrum:Uint8Array}) => void)|null} */
    this.onEnergy = null;
    /** @type {((err:Error) => void)|null} */
    this.onError = null;
  }

  /** Mikrofon bağlantısını başlatır. Başarı durumunda true döner. */
  async start() {
    if (this.isRunning) return true;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
        video: false,
      });

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.options.fftSize;
      this.analyser.smoothingTimeConstant = this.options.smoothing;

      this.source = this.audioContext.createMediaStreamSource(this.stream);
      this.source.connect(this.analyser);

      this._dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this._resetHistory();
      this.isRunning = true;
      this._loop();
      return true;
    } catch (err) {
      if (this.onError) this.onError(err);
      return false;
    }
  }

  /** Tüm kaynakları serbest bırakır. */
  stop() {
    this.isRunning = false;
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this.source) { try { this.source.disconnect(); } catch (_) { } this.source = null; }
    if (this.stream) { this.stream.getTracks().forEach(t => t.stop()); this.stream = null; }
    if (this.audioContext) { this.audioContext.close().catch(() => { }); this.audioContext = null; }
    this.analyser = null;
    this._dataArray = null;
    this._resetHistory();
  }

  _resetHistory() {
    this._bassHist.fill(0); this._bassIdx = 0; this._bassFull = false;
    this._midHist.fill(0); this._midIdx = 0; this._midFull = false;
    this._highHist.fill(0); this._highIdx = 0; this._highFull = false;
    this.lastBassTime = 0; this.lastMidTime = 0; this.lastHighTime = 0;
    this._bassIntervals.length = 0;
    this.bpm = 0;
  }

  _registerBassInterval(now) {
    if (this.lastBassTime <= 0) return;
    const interval = now - this.lastBassTime;
    if (interval < 180 || interval > 1500) return; // 40–333 BPM aralığı dışını reddet
    this._bassIntervals.push(interval);
    if (this._bassIntervals.length > 8) this._bassIntervals.shift();
    const avg = this._bassIntervals.reduce((a, b) => a + b, 0) / this._bassIntervals.length;
    this.bpm = Math.round(60000 / avg);
  }

  /** Hz değerini FFT bin indeksine dönüştürür. */
  _binFor(hz) {
    const nyquist = this.audioContext.sampleRate / 2;
    return Math.min(
      this._dataArray.length - 1,
      Math.round((hz / nyquist) * (this.analyser.fftSize / 2))
    );
  }

  /** Belirtilen frekans bandındaki RMS enerjisini döner. */
  _bandEnergy(lowHz, highHz) {
    const lo = Math.max(0, this._binFor(lowHz));
    const hi = Math.min(this._dataArray.length - 1, this._binFor(highHz));
    if (hi <= lo) return 0;
    let sum = 0;
    for (let i = lo; i <= hi; i++) sum += this._dataArray[i] ** 2;
    return Math.sqrt(sum / (hi - lo + 1));
  }

  _loop() {
    if (!this.isRunning) return;

    this.analyser.getByteFrequencyData(this._dataArray);

    // Üç bantlı enerji
    const bass = this._bandEnergy(this.options.bassLow, this.options.bassHigh);
    const mid = this._bandEnergy(200, 1500);
    const high = this._bandEnergy(1500, 8000);

    // History güncelle (her bant)
    const hs = this.options.historySize;
    const _upd = (hist, val, idxRef, fullRef) => {
      hist[idxRef[0]] = val;
      idxRef[0] = (idxRef[0] + 1) % hs;
      if (idxRef[0] === 0) fullRef[0] = true;
    };
    const bi = [this._bassIdx], bf = [this._bassFull];
    const mi = [this._midIdx], mf = [this._midFull];
    const hi = [this._highIdx], hf = [this._highFull];
    _upd(this._bassHist, bass, bi, bf); this._bassIdx = bi[0]; this._bassFull = bf[0];
    _upd(this._midHist, mid, mi, mf); this._midIdx = mi[0]; this._midFull = mf[0];
    _upd(this._highHist, high, hi, hf); this._highIdx = hi[0]; this._highFull = hf[0];

    // Hareketli ortalamalar
    const avg = (hist, n) => { let s = 0; for (let i = 0; i < n; i++) s += hist[i]; return s / n; };
    const bassN = this._bassFull ? hs : Math.max(1, this._bassIdx);
    const midN = this._midFull ? hs : Math.max(1, this._midIdx);
    const highN = this._highFull ? hs : Math.max(1, this._highIdx);
    const bassAvg = avg(this._bassHist, bassN);
    const midAvg = avg(this._midHist, midN);
    const highAvg = avg(this._highHist, highN);
    const bassRatio = bass / (bassAvg || 1);
    const midRatio = mid / (midAvg || 1);
    const highRatio = high / (highAvg || 1);

    if (this.onEnergy) {
      this.onEnergy({ bass, avg: bassAvg, ratio: bassRatio, spectrum: this._dataArray, mid, high, midRatio, highRatio, bpm: this.bpm });
    }

    const now = performance.now();
    const cd = this.options.cooldown;
    const sen = this.options.sensitivity;

    // Bass beat — kick drum (60-200 Hz)
    if (bassRatio >= sen && bass > 8 && now - this.lastBassTime >= cd) {
      this._registerBassInterval(now);
      this.lastBassTime = now;
      if (this.onBeat) this.onBeat({ energy: bass, ratio: bassRatio, instant: now, type: 'bass', bpm: this.bpm });
    }
    // Mid beat — snare / chord stab (200-1500 Hz)
    if (midRatio >= sen * 1.15 && mid > 6 && now - this.lastMidTime >= cd * 0.6) {
      this.lastMidTime = now;
      if (this.onBeat) this.onBeat({ energy: mid, ratio: midRatio, instant: now, type: 'mid', bpm: this.bpm });
    }
    // High beat — hi-hat / treble hit (1500-8000 Hz)
    if (highRatio >= sen * 1.28 && high > 4 && now - this.lastHighTime >= cd * 0.38) {
      this.lastHighTime = now;
      if (this.onBeat) this.onBeat({ energy: high, ratio: highRatio, instant: now, type: 'high', bpm: this.bpm });
    }

    // Sustained fallback — elektronik müzikte ratio düşük ama enerji yoğun ise beat firılat
    const lastAnyBeat = Math.max(this.lastBassTime, this.lastMidTime, this.lastHighTime);
    if (now - lastAnyBeat > this._sustainedGap) {
      // Hangi bant şu an dominant? Onu fire et.
      let type = null, energy = 0, ratio = 1;
      if (bass > this._sustainedAbsThreshold && bass >= mid && bass >= high) { type = 'bass'; energy = bass; ratio = bassRatio; }
      else if (mid > this._sustainedAbsThreshold * 0.8 && mid >= high) { type = 'mid'; energy = mid; ratio = midRatio; }
      else if (high > this._sustainedAbsThreshold * 0.6) { type = 'high'; energy = high; ratio = highRatio; }
      if (type) {
        if (type === 'bass') { this._registerBassInterval(now); this.lastBassTime = now; }
        else if (type === 'mid') this.lastMidTime = now;
        else this.lastHighTime = now;
        if (this.onBeat) this.onBeat({ energy, ratio, instant: now, type, bpm: this.bpm, sustained: true });
      }
    }

    this._rafId = requestAnimationFrame(() => this._loop());
  }

  /** Audio element'ten (MP3/WAV/OGG vb.) beat analizi başlatır. */
  async startFromAudio(audioElement) {
    if (this.isRunning) return true;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.options.fftSize;
      this.analyser.smoothingTimeConstant = this.options.smoothing;

      // Ses dosyasını hem analiz et hem de hoparlörden çal
      this.source = this.audioContext.createMediaElementSource(audioElement);
      this.source.connect(this.analyser);
      this.source.connect(this.audioContext.destination);

      this._dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this._resetHistory();
      this.isRunning = true;
      this._loop();
      return true;
    } catch (err) {
      if (this.onError) this.onError(err);
      return false;
    }
  }

  setSensitivity(val) { this.options.sensitivity = parseFloat(val); }
  setCooldown(val) { this.options.cooldown = parseInt(val); }
}
