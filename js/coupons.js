// ============================================================================
// CareOS — Módulo 4.8: Cupones Canjeables (Tickets + Bottom Sheet + WhatsApp)
// ============================================================================

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";
import { loveModule } from "./love.js";

const COUPONS_STORAGE_KEY = "redeemed_coupons";

export const couponsModule = {
  redeemedIds: new Set(),
  expandedId: null,
  pendingCoupon: null,
  confirmMode: "redeem", // "redeem" | "reset"

  init() {
    const today = storage.getTodayKey();
    const saved = storage.get(COUPONS_STORAGE_KEY, null);

    // Se regeneran automáticamente cada nuevo día (y mantienen el sello durante el día actual)
    if (saved && saved.date === today && Array.isArray(saved.items)) {
      this.redeemedIds = new Set(saved.items);
    } else if (Array.isArray(saved)) {
      // Migración limpia si tenía formato anterior: reiniciar hoy
      this.redeemedIds = new Set();
      this.persist();
    } else {
      this.redeemedIds = new Set();
      this.persist();
    }

    this.render();
    this.bindSheetEvents();
    this.bindResetButton();
  },

  persist() {
    storage.set(COUPONS_STORAGE_KEY, {
      date: storage.getTodayKey(),
      items: Array.from(this.redeemedIds)
    });
  },

  render() {
    const listEl = document.getElementById("coupons-list");
    const counterEl = document.getElementById("coupons-counter");
    const resetBtn = document.getElementById("btn-reset-coupons");

    if (!listEl) return;
    listEl.innerHTML = "";

    const allCoupons = CONFIG.cupones || [];
    const remaining = allCoupons.filter((c) => !this.redeemedIds.has(c.id)).length;

    if (counterEl) {
      counterEl.textContent =
        remaining === 1 ? "Te queda 1 cupón" : `Te quedan ${remaining} cupones`;
    }

    if (resetBtn) {
      resetBtn.hidden = this.redeemedIds.size === 0;
    }

    allCoupons.forEach((cupon) => {
      const isRedeemed = this.redeemedIds.has(cupon.id);
      const isExpanded = this.expandedId === cupon.id;

      const article = document.createElement("article");
      article.className = "coupon-ticket" + (isRedeemed ? " is-redeemed" : "");
      article.dataset.couponId = cupon.id;

      const mainBtn = document.createElement("button");
      mainBtn.type = "button";
      mainBtn.className = "coupon-main-btn";
      mainBtn.setAttribute("aria-expanded", String(isExpanded));
      mainBtn.setAttribute("aria-pressed", String(isExpanded));

      mainBtn.innerHTML = `
        <div class="coupon-left">
          <span class="coupon-emoji" aria-hidden="true">${cupon.emoji}</span>
          <div class="coupon-info">
            <span class="coupon-code">${cupon.codigo || cupon.id.toUpperCase()}</span>
            <span class="coupon-title">${cupon.titulo}</span>
            <span class="coupon-desc">${cupon.descripcion}</span>
          </div>
        </div>
      `;

      mainBtn.addEventListener("click", () => {
        this.expandedId = this.expandedId === cupon.id ? null : cupon.id;
        this.render();
      });

      article.appendChild(mainBtn);

      if (isRedeemed) {
        const stamp = document.createElement("span");
        stamp.className = "coupon-stamp";
        stamp.textContent = "CANJEADO";
        article.appendChild(stamp);
      }

      if (isExpanded) {
        const drawer = document.createElement("div");
        drawer.className = "coupon-drawer";

        const extra = document.createElement("p");
        extra.className = "coupon-extra-text";
        extra.textContent = cupon.detalleExtra || cupon.descripcion;
        drawer.appendChild(extra);

        const actionBtn = document.createElement("button");
        actionBtn.type = "button";
        actionBtn.className = isRedeemed ? "btn-secondary w-full" : "btn-primary w-full";
        actionBtn.textContent = isRedeemed
          ? "💬 Volver a enviar por WhatsApp"
          : "✨ Canjear este cupón";

        actionBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isRedeemed) {
            this.openWhatsAppForCoupon(cupon);
          } else {
            this.openConfirmSheet("redeem", cupon);
          }
        });

        drawer.appendChild(actionBtn);
        article.appendChild(drawer);
      }

      listEl.appendChild(article);
    });
  },

  openConfirmSheet(mode, cupon = null) {
    this.confirmMode = mode;
    this.pendingCoupon = cupon;

    const backdrop = document.getElementById("sheet-modal-backdrop");
    const titleEl = document.getElementById("sheet-modal-title");
    const descEl = document.getElementById("sheet-modal-desc");
    const confirmBtn = document.getElementById("btn-sheet-confirm");

    if (!backdrop || !titleEl || !descEl || !confirmBtn) return;

    if (mode === "redeem" && cupon) {
      titleEl.textContent = `¿Canjear tu cupón de ${cupon.emoji} ${cupon.titulo}?`;
      descEl.textContent =
        "Se marcará con el sello de canjeado y se abrirá WhatsApp con el mensaje listo para enviarme 💗";
      confirmBtn.textContent = "Sí, canjear ♡";
    } else {
      titleEl.textContent = "¿Reiniciar todos los cupones?";
      descEl.textContent =
        "Todos los cupones volverán a estar disponibles para canjear de nuevo.";
      confirmBtn.textContent = "Sí, reiniciar";
    }

    backdrop.hidden = false;
    document.body.classList.add("modal-open");
    confirmBtn.focus();
  },

  closeConfirmSheet() {
    const backdrop = document.getElementById("sheet-modal-backdrop");
    if (backdrop) backdrop.hidden = true;
    document.body.classList.remove("modal-open");
    this.pendingCoupon = null;
  },

  bindSheetEvents() {
    const backdrop = document.getElementById("sheet-modal-backdrop");
    const cancelBtn = document.getElementById("btn-sheet-cancel");
    const confirmBtn = document.getElementById("btn-sheet-confirm");

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => this.closeConfirmSheet());
    }

    if (backdrop) {
      backdrop.addEventListener("click", (e) => {
        if (e.target === backdrop) this.closeConfirmSheet();
      });
    }

    if (confirmBtn) {
      confirmBtn.addEventListener("click", () => {
        if (this.confirmMode === "redeem" && this.pendingCoupon) {
          const targetCoupon = this.pendingCoupon;
          this.closeConfirmSheet();
          this.redeemCoupon(targetCoupon);
        } else if (this.confirmMode === "reset") {
          this.redeemedIds.clear();
          this.persist();
          this.closeConfirmSheet();
          this.render();
        }
      });
    }
  },

  bindResetButton() {
    const resetBtn = document.getElementById("btn-reset-coupons");
    if (!resetBtn) return;
    resetBtn.addEventListener("click", () => {
      this.openConfirmSheet("reset", null);
    });
  },

  redeemCoupon(cupon) {
    this.redeemedIds.add(cupon.id);
    this.persist();

    if (typeof navigator.vibrate === "function") {
      try {
        navigator.vibrate(70);
      } catch {}
    }

    loveModule.spawnFloatingHearts(14);
    this.render();

    const ticketEl = document.querySelector(`.coupon-ticket[data-coupon-id="${cupon.id}"]`);
    if (ticketEl) {
      ticketEl.classList.add("just-stamped");
    }

    setTimeout(() => {
      this.openWhatsAppForCoupon(cupon);
    }, 460);
  },

  openWhatsAppForCoupon(cupon) {
    const phone = (CONFIG.whatsapp?.numero || "").replace(/\D/g, "");
    const text = cupon.mensajeWa || `Canjeé mi cupón: ${cupon.emoji} ${cupon.titulo} 💗`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
