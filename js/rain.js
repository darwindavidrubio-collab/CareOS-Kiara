// ============================================================================
// CareOS — Canvas de Lluvia en 2 Capas + Sonido Ambiental Opcional
// ============================================================================

import { themeManager } from "./theme.js";

export const rainSystem = {
  canvas: null,
  ctx: null,
  farDrops: [],
  nearDrops: [],
  splashes: [],
  rafId: null,
  isRunning: false,
  width: 0,
  height: 0,

  // Sonido de lluvia (Web Audio + soporte para assets/audio/rain.mp3 si existe)
  audioCtx: null,
  noiseNode: null,
  gainNode: null,
  audioElement: null,
  isSoundPlaying: false,

  init() {
    this.canvas = document.getElementById("rain-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopLoop();
      } else if (themeManager.current === "lluvia") {
        this.startLoop();
      }
    });

    themeManager.onChange((theme) => {
      this.populateDrops();
      if (theme === "lluvia" && !document.hidden) {
        this.startLoop();
      } else {
        this.stopLoop();
      }
    });

    this.bindSoundButton();

    if (themeManager.current === "lluvia") {
      this.startLoop();
    }
  },

  resize() {
    if (!this.canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.populateDrops();
  },

  populateDrops() {
    const reduced = themeManager.reducedMotion;
    const densityFactor = reduced ? 0.45 : 1;
    const speedFactor = reduced ? 0.55 : 1;

    // Cantidad proporcional al ancho de pantalla
    const baseCount = Math.max(24, Math.min(90, Math.floor(this.width / 11)));
    const farCount = Math.floor(baseCount * 0.65 * densityFactor);
    const nearCount = Math.floor(baseCount * 0.35 * densityFactor);

    this.farDrops = Array.from({ length: farCount }, () =>
      this.createDrop("far", speedFactor)
    );
    this.nearDrops = Array.from({ length: nearCount }, () =>
      this.createDrop("near", speedFactor)
    );
    this.splashes = [];
  },

  createDrop(layer, speedFactor = 1) {
    const isNear = layer === "near";
    return {
      x: Math.random() * (this.width + 60) - 30,
      y: Math.random() * this.height,
      len: isNear ? 16 + Math.random() * 12 : 8 + Math.random() * 7,
      speedY: (isNear ? 5.2 + Math.random() * 2.5 : 2.6 + Math.random() * 1.4) * speedFactor,
      windX: (isNear ? 0.65 : 0.32) * speedFactor,
      alpha: isNear ? 0.22 + Math.random() * 0.14 : 0.08 + Math.random() * 0.08,
      width: isNear ? 1.35 : 0.9
    };
  },

  startLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    const tick = () => {
      if (!this.isRunning) return;
      this.renderFrame();
      this.rafId = window.requestAnimationFrame(tick);
    };
    this.rafId = window.requestAnimationFrame(tick);
  },

  stopLoop() {
    this.isRunning = false;
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  renderFrame() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.lineCap = "round";

    const drawLayer = (drops, allowSplash) => {
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.strokeStyle = `rgba(200, 194, 255, ${d.alpha})`;
        ctx.lineWidth = d.width;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.windX * 3, d.y + d.len);
        ctx.stroke();

        d.x += d.windX;
        d.y += d.speedY;

        if (d.y > this.height - 8) {
          if (
            allowSplash &&
            !themeManager.reducedMotion &&
            this.splashes.length < 18 &&
            Math.random() < 0.22
          ) {
            this.splashes.push({
              x: d.x,
              y: this.height - (4 + Math.random() * 14),
              r: 1,
              maxR: 4 + Math.random() * 4,
              alpha: 0.24
            });
          }
          d.y = -20;
          d.x = Math.random() * (this.width + 60) - 30;
        }
      }
    };

    drawLayer(this.farDrops, false);
    drawLayer(this.nearDrops, true);

    // Salpicaduras sutiles
    for (let i = this.splashes.length - 1; i >= 0; i--) {
      const s = this.splashes[i];
      ctx.strokeStyle = `rgba(200, 194, 255, ${s.alpha})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(s.x, s.y, s.r * 1.8, s.r * 0.55, 0, 0, Math.PI * 2);
      ctx.stroke();

      s.r += 0.22;
      s.alpha -= 0.014;
      if (s.alpha <= 0 || s.r >= s.maxR) {
        this.splashes.splice(i, 1);
      }
    }
  },

  bindSoundButton() {
    const soundBtn = document.getElementById("btn-rain-sound");
    if (!soundBtn) return;

    soundBtn.addEventListener("click", () => {
      if (this.isSoundPlaying) {
        this.stopRainSound();
      } else {
        this.startRainSound();
      }
    });
  },

  startRainSound() {
    const soundBtn = document.getElementById("btn-rain-sound");
    const soundIcon = document.getElementById("rain-sound-icon");

    // Generador de lluvia suave rosada/marrón con Web Audio API (funciona 100% offline sin depender de descargas pesadas, o usa rain.mp3 si se prefiere)
    try {
      if (!this.audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContextClass();
      }
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const bufferSize = this.audioCtx.sampleRate * 3;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 0.18;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;
      whiteNoise.loop = true;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 950;

      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(0.32, this.audioCtx.currentTime + 1.2);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.audioCtx.destination);

      whiteNoise.start(0);
      this.noiseNode = whiteNoise;
      this.isSoundPlaying = true;

      if (soundBtn && soundIcon) {
        soundBtn.setAttribute("aria-pressed", "true");
        soundIcon.textContent = "🔈";
      }
    } catch {
      // Fallback en caso de restricción de audio del navegador
    }
  },

  stopRainSound() {
    const soundBtn = document.getElementById("btn-rain-sound");
    const soundIcon = document.getElementById("rain-sound-icon");

    if (this.audioCtx && this.gainNode && this.noiseNode) {
      try {
        const now = this.audioCtx.currentTime;
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        const nodeToStop = this.noiseNode;
        setTimeout(() => {
          try {
            nodeToStop.stop();
            nodeToStop.disconnect();
          } catch {}
        }, 480);
      } catch {}
    }

    this.noiseNode = null;
    this.isSoundPlaying = false;

    if (soundBtn && soundIcon) {
      soundBtn.setAttribute("aria-pressed", "false");
      soundIcon.textContent = "🔇";
    }
  }
};
