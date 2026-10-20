// ============================================================================
// CareOS — Fase 1.5: Chequeo de Ánimo Diario
// ============================================================================

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";
import { themeManager } from "./theme.js";

const MOOD_STORAGE_KEY = "daily_mood";

export const moodCheck = {
  selectedMood: null,
  onContinue: null,

  hasCompletedToday() {
    const saved = storage.get(MOOD_STORAGE_KEY, null);
    if (!saved || saved.date !== storage.getTodayKey()) return false;
    const found = CONFIG.moods.find((m) => m.id === saved.moodId);
    if (found) {
      this.selectedMood = found;
      return true;
    }
    return false;
  },

  show(onContinueCallback) {
    this.onContinue = onContinueCallback;
    const screen = document.getElementById("phase-mood");
    const grid = document.getElementById("mood-options-grid");
    const feedbackBox = document.getElementById("mood-feedback-box");

    if (!screen || !grid) {
      if (this.onContinue) this.onContinue(this.selectedMood);
      return;
    }

    screen.hidden = false;
    feedbackBox.hidden = true;
    grid.innerHTML = "";

    CONFIG.moods.forEach((mood) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mood-option";
      if (this.selectedMood && this.selectedMood.id === mood.id) {
        btn.classList.add("is-selected");
      }
      btn.innerHTML = `
        <span class="mood-emoji" aria-hidden="true">${mood.emoji}</span>
        <span class="mood-label">${mood.label}</span>
      `;
      btn.addEventListener("click", (ev) => this.selectMood(mood, btn, ev));
      grid.appendChild(btn);
    });
  },

  selectMood(mood, buttonEl, clickEvent) {
    this.selectedMood = mood;
    storage.set(MOOD_STORAGE_KEY, {
      date: storage.getTodayKey(),
      moodId: mood.id
    });

    document.querySelectorAll(".mood-option").forEach((el) => {
      el.classList.toggle("is-selected", el === buttonEl);
    });

    const feedbackBox = document.getElementById("mood-feedback-box");
    const responseText = document.getElementById("mood-response-text");
    const suggestBtn = document.getElementById("btn-mood-theme-suggest");
    const continueBtn = document.getElementById("btn-mood-continue");

    if (responseText) {
      responseText.textContent = mood.response
        .replace(/\{NOMBRE\}/g, CONFIG.nombre)
        .replace(/\{APODO\}/g, CONFIG.apodo);
    }

    // Mostrar sugerencia de tema solo si el tema actual es diferente al sugerido
    if (suggestBtn) {
      if (mood.themeSuggestion && mood.themeSuggestion !== themeManager.current) {
        const label = mood.themeSuggestion === "lluvia" ? "🌧️ Pasar a modo Lluvia" : "🌸 Pasar a modo Rosado";
        suggestBtn.textContent = label;
        suggestBtn.hidden = false;
        suggestBtn.onclick = (e) => {
          themeManager.setThemeWithTransition(mood.themeSuggestion, e || clickEvent);
          suggestBtn.hidden = true;
        };
      } else {
        suggestBtn.hidden = true;
      }
    }

    if (continueBtn) {
      continueBtn.onclick = () => this.finish();
    }

    if (feedbackBox) {
      feedbackBox.hidden = false;
    }
  },

  finish() {
    const screen = document.getElementById("phase-mood");
    if (!screen) {
      if (this.onContinue) this.onContinue(this.selectedMood);
      return;
    }
    screen.classList.add("phase-fade-out");
    setTimeout(() => {
      screen.hidden = true;
      screen.classList.remove("phase-fade-out");
      if (this.onContinue) this.onContinue(this.selectedMood);
    }, 380);
  },

  applyDashboardRecommendation(mood) {
    // Actualizar barra de estado en el Dashboard y resaltar módulo recomendado
    const statusText = document.getElementById("active-mood-text");
    if (statusText && mood) {
      statusText.textContent = `Estado de hoy: ${mood.emoji} ${mood.label}`;
    }

    document.querySelectorAll(".care-card").forEach((card) => {
      card.classList.remove("is-recommended");
    });

    if (mood && mood.recommendedModule) {
      const target = document.getElementById(mood.recommendedModule);
      if (target) {
        target.classList.add("is-recommended");
      }
    }
  }
};
