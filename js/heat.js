// ============================================================================
// CareOS — Módulo 4.6: Compresa Caliente (Temporizador exacto con Date.now())
// ============================================================================

import { storage } from "./storage.js";

const HEAT_STORAGE_KEY = "heat_timer_state";
const CIRCUMFERENCE = 2 * Math.PI * 74; // r = 74 -> ~464.95

export const heatModule = {
  selectedMinutes: 15,
  totalMs: 15 * 60 * 1000,
  endTime: null,
  remainingMs: 15 * 60 * 1000,
  isRunning: false,
  tickInterval: null,

  init() {
    const circle = document.getElementById("heat-progress-ring");
    if (circle) {
      circle.style.strokeDasharray = `${CIRCUMFERENCE}`;
      circle.style.strokeDashoffset = "0";
    }

    this.bindPresetButtons();
    this.bindActionButtons();

    // Restaurar si había un temporizador corriendo en segundo plano
    const saved = storage.get(HEAT_STORAGE_KEY, null);
    if (saved && saved.isRunning && saved.endTime) {
      const now = Date.now();
      this.selectedMinutes = saved.selectedMinutes || 15;
      this.totalMs = this.selectedMinutes * 60 * 1000;
      if (saved.endTime > now) {
        this.endTime = saved.endTime;
        this.startLoop();
      } else {
        storage.remove(HEAT_STORAGE_KEY);
        this.onTimerFinished();
      }
    } else {
      this.selectPreset(15);
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && this.isRunning) {
        this.updateTick();
      }
    });
  },

  bindPresetButtons() {
    document.querySelectorAll("[data-heat-min]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const mins = Number(btn.getAttribute("data-heat-min")) || 15;
        this.selectPreset(mins);
      });
    });
  },

  bindActionButtons() {
    const startBtn = document.getElementById("btn-heat-toggle");
    const resetBtn = document.getElementById("btn-heat-reset");

    if (startBtn) {
      startBtn.addEventListener("click", () => {
        if (this.isRunning) {
          this.pause();
        } else {
          this.start();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.reset();
      });
    }
  },

  selectPreset(minutes) {
    this.pause(false);
    this.selectedMinutes = minutes;
    this.totalMs = minutes * 60 * 1000;
    this.remainingMs = this.totalMs;

    document.querySelectorAll("[data-heat-min]").forEach((btn) => {
      const isMatch = Number(btn.getAttribute("data-heat-min")) === minutes;
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    const statusMsg = document.getElementById("heat-status-msg");
    if (statusMsg) {
      statusMsg.textContent = "Acomoda la compresa tibia sobre tu pancita ♡";
    }

    this.renderDisplay(this.remainingMs);
  },

  start() {
    if (this.remainingMs <= 0) {
      this.remainingMs = this.totalMs;
    }
    this.endTime = Date.now() + this.remainingMs;
    storage.set(HEAT_STORAGE_KEY, {
      isRunning: true,
      endTime: this.endTime,
      selectedMinutes: this.selectedMinutes
    });

    const statusMsg = document.getElementById("heat-status-msg");
    if (statusMsg) {
      statusMsg.textContent = "Calorcito en curso… descansa tranquila 💗";
    }

    this.startLoop();
  },

  startLoop() {
    this.isRunning = true;
    const container = document.getElementById("heat-ring-container");
    const startBtn = document.getElementById("btn-heat-toggle");

    if (container) container.classList.add("is-running");
    if (startBtn) startBtn.textContent = "Pausar";

    clearInterval(this.tickInterval);
    this.updateTick();
    this.tickInterval = setInterval(() => this.updateTick(), 500);
  },

  pause(saveState = true) {
    this.isRunning = false;
    clearInterval(this.tickInterval);

    const container = document.getElementById("heat-ring-container");
    const startBtn = document.getElementById("btn-heat-toggle");

    if (container) container.classList.remove("is-running");
    if (startBtn) startBtn.textContent = "Iniciar";

    if (saveState) {
      storage.remove(HEAT_STORAGE_KEY);
    }
  },

  reset() {
    this.pause(true);
    this.remainingMs = this.totalMs;
    this.renderDisplay(this.remainingMs);
    const statusMsg = document.getElementById("heat-status-msg");
    if (statusMsg) {
      statusMsg.textContent = "Temporizador reiniciado ♡";
    }
  },

  updateTick() {
    if (!this.isRunning || !this.endTime) return;
    const now = Date.now();
    const diff = Math.max(0, this.endTime - now);
    this.remainingMs = diff;
    this.renderDisplay(diff);

    if (diff <= 0) {
      this.pause(true);
      this.onTimerFinished();
    }
  },

  renderDisplay(ms) {
    const totalSecs = Math.ceil(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;

    const timeEl = document.getElementById("heat-time-display");
    if (timeEl) {
      timeEl.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    const circle = document.getElementById("heat-progress-ring");
    if (circle && this.totalMs > 0) {
      const ratio = Math.max(0, Math.min(1, ms / this.totalMs));
      const offset = CIRCUMFERENCE * (1 - ratio);
      circle.style.strokeDashoffset = `${offset}`;
    }
  },

  onTimerFinished() {
    this.remainingMs = 0;
    this.renderDisplay(0);

    const statusMsg = document.getElementById("heat-status-msg");
    if (statusMsg) {
      statusMsg.textContent = "Ya puedes retirar la compresa, ¿cómo vas mi amor? 💗";
    }

    if (typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate([120, 80, 120]);
      } catch {}
    }

    this.playSoftChime();
  },

  playSoftChime() {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.95);
    } catch {}
  }
};
