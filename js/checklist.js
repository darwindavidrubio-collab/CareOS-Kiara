// ============================================================================
// CareOS — Módulo 4.7: Checklist Diario de Mimos (Se reinicia cada día)
// ============================================================================

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";
import { loveModule } from "./love.js";

const CHECKLIST_STORAGE_KEY = "daily_checklist";

export const checklistModule = {
  doneSet: new Set(),

  init() {
    const today = storage.getTodayKey();
    const saved = storage.get(CHECKLIST_STORAGE_KEY, null);

    if (saved && saved.date === today && Array.isArray(saved.items)) {
      this.doneSet = new Set(saved.items);
    } else {
      this.doneSet = new Set();
      this.persist();
    }

    this.render();
  },

  persist() {
    storage.set(CHECKLIST_STORAGE_KEY, {
      date: storage.getTodayKey(),
      items: Array.from(this.doneSet)
    });
  },

  render() {
    const container = document.getElementById("checklist-items");
    const banner = document.getElementById("checklist-complete-banner");
    const counter = document.getElementById("checklist-progress-label");

    if (!container) return;
    container.innerHTML = "";

    const list = CONFIG.checklist || [];
    list.forEach((item) => {
      const isDone = this.doneSet.has(item.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "check-item" + (isDone ? " is-done" : "");
      btn.setAttribute("aria-pressed", String(isDone));

      btn.innerHTML = `
        <span class="check-box-ui" aria-hidden="true">
          <svg class="check-svg" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
        <span class="check-text-wrap">
          <span class="check-title">${item.texto}</span>
          <span class="check-sub">${item.detalle || ""}</span>
        </span>
      `;

      btn.addEventListener("click", () => {
        this.toggleItem(item.id, btn);
      });

      container.appendChild(btn);
    });

    this.updateStatus(list.length, banner, counter);
  },

  toggleItem(id, btnEl) {
    const wasAllDone = this.doneSet.size === (CONFIG.checklist || []).length;

    if (this.doneSet.has(id)) {
      this.doneSet.delete(id);
      btnEl.classList.remove("is-done");
      btnEl.setAttribute("aria-pressed", "false");
    } else {
      this.doneSet.add(id);
      btnEl.classList.add("is-done");
      btnEl.setAttribute("aria-pressed", "true");
    }

    this.persist();

    const total = (CONFIG.checklist || []).length;
    const banner = document.getElementById("checklist-complete-banner");
    const counter = document.getElementById("checklist-progress-label");
    this.updateStatus(total, banner, counter);

    if (!wasAllDone && this.doneSet.size === total && total > 0) {
      loveModule.spawnFloatingHearts(14);
    }
  },

  updateStatus(total, bannerEl, counterEl) {
    const count = this.doneSet.size;
    if (counterEl) {
      counterEl.textContent = `${count}/${total}`;
    }
    if (bannerEl) {
      bannerEl.hidden = !(total > 0 && count === total);
    }
  }
};
