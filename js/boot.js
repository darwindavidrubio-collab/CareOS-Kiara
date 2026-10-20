// ============================================================================
// CareOS — Fase 1: Terminal de Arranque (Máquina de Escribir)
// ============================================================================

import { CONFIG } from "./config.js";
import { themeManager } from "./theme.js";

export const bootScreen = {
  aborted: false,
  onComplete: null,

  start(onCompleteCallback) {
    this.onComplete = onCompleteCallback;
    const screen = document.getElementById("phase-boot");
    const output = document.getElementById("boot-output");
    const skipBtn = document.getElementById("btn-skip-boot");

    if (!screen || !output) {
      this.finish();
      return;
    }

    screen.hidden = false;
    output.innerHTML = "";

    // Mostrar botón "saltar" tras 1 segundo
    const skipTimer = setTimeout(() => {
      if (skipBtn) skipBtn.classList.add("is-visible");
    }, 1000);

    if (skipBtn) {
      skipBtn.onclick = () => {
        clearTimeout(skipTimer);
        this.aborted = true;
        this.finish();
      };
    }

    this.runSequence(output, skipTimer);
  },

  replacePlaceholders(str) {
    return str
      .replace(/\{NOMBRE\}/g, CONFIG.nombre)
      .replace(/\{APODO\}/g, CONFIG.apodo);
  },

  async runSequence(container, skipTimer) {
    const lines = CONFIG.bootLines || [];
    const fastMode = themeManager.reducedMotion;

    for (let i = 0; i < lines.length; i++) {
      if (this.aborted) return;

      const item = lines[i];
      const lineEl = document.createElement("div");
      lineEl.className = "boot-line" + (item.highlight ? " boot-line--highlight" : "");

      const textSpan = document.createElement("span");
      const cursor = document.createElement("span");
      cursor.className = "boot-cursor";

      lineEl.appendChild(textSpan);
      textSpan.appendChild(cursor);
      container.appendChild(lineEl);

      const fullText = this.replacePlaceholders(item.text);

      if (fastMode) {
        textSpan.textContent = fullText;
      } else {
        for (let c = 0; c < fullText.length; c++) {
          if (this.aborted) return;
          textSpan.textContent = fullText.slice(0, c + 1);
          textSpan.appendChild(cursor);
          const delay = 20 + Math.floor(Math.random() * 24);
          await this.wait(delay);
        }
      }

      if (this.aborted) return;

      if (item.status) {
        await this.wait(fastMode ? 40 : 180);
        const statusSpan = document.createElement("span");
        statusSpan.className = "boot-status";
        statusSpan.textContent = item.status;
        lineEl.appendChild(statusSpan);
      }

      // Quitar cursor de líneas anteriores excepto la última
      if (i < lines.length - 1) {
        cursor.remove();
      }

      await this.wait(fastMode ? 80 : 280);
    }

    clearTimeout(skipTimer);
    await this.wait(fastMode ? 180 : 650);
    if (!this.aborted) {
      this.finish();
    }
  },

  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  },

  finish() {
    const screen = document.getElementById("phase-boot");
    if (!screen) {
      if (this.onComplete) this.onComplete();
      return;
    }
    screen.classList.add("phase-fade-out");
    setTimeout(() => {
      screen.hidden = true;
      screen.classList.remove("phase-fade-out");
      if (this.onComplete) this.onComplete();
    }, 420);
  }
};
