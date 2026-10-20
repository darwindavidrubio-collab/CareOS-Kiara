// ============================================================================
// CareOS — Módulo 4.5: Respira (4s Inhalar / 6s Exhalar)
// ============================================================================

export const breatheModule = {
  isRunning: false,
  cycles: 0,
  phaseTimeout: null,
  secInterval: null,

  init() {
    const toggleBtn = document.getElementById("btn-breathe-toggle");
    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
      if (this.isRunning) {
        this.stop();
      } else {
        this.start();
      }
    });
  },

  start() {
    this.isRunning = true;
    this.cycles = 0;

    const toggleBtn = document.getElementById("btn-breathe-toggle");
    const metaEl = document.getElementById("breathe-meta-text");
    if (toggleBtn) {
      toggleBtn.textContent = "Pausar respiración";
      toggleBtn.setAttribute("aria-pressed", "true");
    }
    if (metaEl) {
      metaEl.textContent = "Relaja los hombros y sigue el círculo…";
    }

    this.runInhale();
  },

  runInhale() {
    if (!this.isRunning) return;
    const wrap = document.getElementById("breathe-orb-wrap");
    const phaseText = document.getElementById("breathe-phase-text");

    if (wrap) wrap.setAttribute("data-phase", "inhale");
    if (phaseText) phaseText.textContent = "Inhala…";
    this.startCountdown(4);

    this.phaseTimeout = setTimeout(() => {
      this.runExhale();
    }, 4000);
  },

  runExhale() {
    if (!this.isRunning) return;
    const wrap = document.getElementById("breathe-orb-wrap");
    const phaseText = document.getElementById("breathe-phase-text");
    const metaEl = document.getElementById("breathe-meta-text");

    if (wrap) wrap.setAttribute("data-phase", "exhale");
    if (phaseText) phaseText.textContent = "Exhala…";
    this.startCountdown(6);

    this.phaseTimeout = setTimeout(() => {
      if (!this.isRunning) return;
      this.cycles += 1;
      if (metaEl) {
        metaEl.textContent =
          this.cycles >= 3
            ? `Muy bien, mi amor 💗 (${this.cycles} ciclos completados)`
            : `Ciclos suaves completados: ${this.cycles}`;
      }
      this.runInhale();
    }, 6000);
  },

  startCountdown(seconds) {
    clearInterval(this.secInterval);
    const secText = document.getElementById("breathe-sec-text");
    let remaining = seconds;
    if (secText) secText.textContent = `${remaining}s`;

    this.secInterval = setInterval(() => {
      remaining -= 1;
      if (remaining > 0 && secText) {
        secText.textContent = `${remaining}s`;
      }
    }, 1000);
  },

  stop() {
    this.isRunning = false;
    clearTimeout(this.phaseTimeout);
    clearInterval(this.secInterval);

    const wrap = document.getElementById("breathe-orb-wrap");
    const phaseText = document.getElementById("breathe-phase-text");
    const secText = document.getElementById("breathe-sec-text");
    const toggleBtn = document.getElementById("btn-breathe-toggle");
    const metaEl = document.getElementById("breathe-meta-text");

    if (wrap) wrap.removeAttribute("data-phase");
    if (phaseText) phaseText.textContent = "Respira";
    if (secText) secText.textContent = "4s / 6s";
    if (toggleBtn) {
      toggleBtn.textContent = "Iniciar respiración guiada";
      toggleBtn.setAttribute("aria-pressed", "false");
    }
    if (metaEl) {
      metaEl.textContent =
        this.cycles > 0
          ? `Muy bien, mi amor 💗 Hiciste ${this.cycles} ${this.cycles === 1 ? "ciclo" : "ciclos"}.`
          : "Inhala en 4 segundos, exhala lento en 6 segundos.";
    }
  }
};
