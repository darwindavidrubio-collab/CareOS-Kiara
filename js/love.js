// ============================================================================
// CareOS — Módulo 4.4: Sobrecarga de Amor + Corazones + Cartas "Ábrelas cuando"
// ============================================================================

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";
import { themeManager } from "./theme.js";

const OPENED_LETTERS_KEY = "opened_envelopes";

export const loveModule = {
  openedIds: new Set(),
  lastFocusedElement: null,

  init() {
    const saved = storage.get(OPENED_LETTERS_KEY, []);
    if (Array.isArray(saved)) {
      this.openedIds = new Set(saved);
    }

    this.renderEnvelopes();
    this.bindMainButton();
    this.bindModalEvents();
  },

  bindMainButton() {
    const btn = document.getElementById("btn-love-overload");
    if (!btn) return;

    btn.addEventListener("click", () => {
      this.spawnFloatingHearts(26);
      const delay = themeManager.reducedMotion ? 80 : 380;
      setTimeout(() => {
        this.openLetterModal({
          titulo: CONFIG.cartaLarga.titulo,
          parrafos: CONFIG.cartaLarga.parrafos,
          firma: CONFIG.cartaLarga.firma
        }, btn);
      }, delay);
    });
  },

  renderEnvelopes() {
    const grid = document.getElementById("envelopes-grid");
    if (!grid) return;
    grid.innerHTML = "";

    (CONFIG.cartasAbrelas || []).forEach((carta) => {
      const isOpened = this.openedIds.has(carta.id);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "envelope-card" + (isOpened ? " is-opened" : "");
      btn.dataset.letterId = carta.id;

      btn.innerHTML = `
        <div class="envelope-top">
          <span class="envelope-icon" aria-hidden="true">${carta.icono || "💌"}</span>
          <span class="envelope-status">${isOpened ? "Leída ♡" : "Sellada"}</span>
        </div>
        <span class="envelope-label">${carta.etiqueta}</span>
      `;

      btn.addEventListener("click", () => {
        btn.classList.add("is-opening");
        this.markEnvelopeOpened(carta.id, btn);
        this.spawnFloatingHearts(12);

        setTimeout(() => {
          btn.classList.remove("is-opening");
          this.openLetterModal({
            titulo: carta.titulo,
            parrafos: carta.parrafos,
            firma: "Siempre contigo 💗"
          }, btn);
        }, themeManager.reducedMotion ? 50 : 280);
      });

      grid.appendChild(btn);
    });
  },

  markEnvelopeOpened(id, btnEl) {
    this.openedIds.add(id);
    storage.set(OPENED_LETTERS_KEY, Array.from(this.openedIds));
    if (btnEl) {
      btnEl.classList.add("is-opened");
      const status = btnEl.querySelector(".envelope-status");
      if (status) status.textContent = "Leída ♡";
    }
  },

  spawnFloatingHearts(count = 24) {
    const layer = document.getElementById("hearts-layer");
    if (!layer) return;

    const actualCount = themeManager.reducedMotion ? Math.min(6, count) : count;
    const symbols = ["💗", "🤍", "🌸", "✨", "💕"];

    for (let i = 0; i < actualCount; i++) {
      const heart = document.createElement("span");
      heart.className = "floating-heart";
      heart.setAttribute("aria-hidden", "true");
      heart.textContent = symbols[i % symbols.length];

      const left = 4 + Math.random() * 92;
      const size = 0.95 + Math.random() * 1.15;
      const dur = 3.2 + Math.random() * 2.4;
      const delay = Math.random() * 0.75;
      const drift = (Math.random() - 0.5) * 90;
      const rot = (Math.random() - 0.5) * 40;
      const opacity = 0.35 + Math.random() * 0.35;

      heart.style.left = `${left}%`;
      heart.style.fontSize = `${size}rem`;
      heart.style.animationDelay = `${delay}s`;
      heart.style.setProperty("--heart-dur", `${dur}s`);
      heart.style.setProperty("--heart-drift", `${drift}px`);
      heart.style.setProperty("--heart-rot", `${rot}deg`);
      heart.style.setProperty("--heart-opacity", String(opacity));

      layer.appendChild(heart);
      setTimeout(() => {
        heart.remove();
      }, (dur + delay) * 1000 + 200);
    }
  },

  openLetterModal({ titulo, parrafos, firma }, triggerEl = null) {
    this.lastFocusedElement = triggerEl || document.activeElement;
    const backdrop = document.getElementById("letter-modal-backdrop");
    const titleEl = document.getElementById("letter-modal-title");
    const bodyEl = document.getElementById("letter-modal-body");
    const closeBtn = document.getElementById("btn-close-letter");

    if (!backdrop || !titleEl || !bodyEl) return;

    titleEl.textContent = titulo;
    bodyEl.innerHTML = "";

    (parrafos || []).forEach((pText, idx) => {
      const p = document.createElement("p");
      p.className = "letter-paragraph";
      p.style.animationDelay = `${idx * 140}ms`;
      p.textContent = pText
        .replace(/\{NOMBRE\}/g, CONFIG.nombre)
        .replace(/\{APODO\}/g, CONFIG.apodo);
      bodyEl.appendChild(p);
    });

    if (firma) {
      const sig = document.createElement("p");
      sig.className = "letter-paragraph letter-signature";
      sig.style.animationDelay = `${(parrafos?.length || 1) * 140}ms`;
      sig.textContent = firma;
      bodyEl.appendChild(sig);
    }

    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    bodyEl.scrollTop = 0;
    if (closeBtn) closeBtn.focus();
  },

  closeLetterModal() {
    const backdrop = document.getElementById("letter-modal-backdrop");
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === "function") {
      this.lastFocusedElement.focus();
    }
  },

  bindModalEvents() {
    const backdrop = document.getElementById("letter-modal-backdrop");
    const closeBtn = document.getElementById("btn-close-letter");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.closeLetterModal());
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) {
          this.closeLetterModal();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeLetterModal();
      }
    });
  }
};
