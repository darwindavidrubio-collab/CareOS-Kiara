// ============================================================================
// CareOS — Orquestación Principal (Fases 1 -> 1.5 -> 2 Dashboard)
// ============================================================================

import { CONFIG } from "./config.js";
import { themeManager } from "./theme.js";
import { rainSystem } from "./rain.js";
import { bootScreen } from "./boot.js";
import { moodCheck } from "./mood.js";
import { audioModule } from "./audio.js";
import { loveModule } from "./love.js";
import { breatheModule } from "./breathe.js";
import { heatModule } from "./heat.js";
import { checklistModule } from "./checklist.js";
import { couponsModule } from "./coupons.js";
import { gitlogModule } from "./gitlog.js";

function populateStaticGreetings() {
  const titleEl = document.getElementById("dashboard-greeting-title");
  const versionEl = document.getElementById("system-version-label");
  const moodTitleEl = document.getElementById("mood-screen-title");

  if (titleEl) {
    titleEl.textContent = `Hola, mi princesa ${CONFIG.nombre} ♡`;
  }
  if (versionEl) {
    versionEl.textContent = `CareOS ${CONFIG.version || "v1.0"} · activo`;
  }
  if (moodTitleEl) {
    moodTitleEl.textContent = `¿Cómo estás hoy, mi ${CONFIG.apodo} <3?`;
  }

  // Configurar botón de Canal de Emergencia (WhatsApp SOS)
  const sosBtn = document.getElementById("btn-emergency-sos");
  if (sosBtn) {
    sosBtn.addEventListener("click", () => {
      const phone = (CONFIG.whatsapp?.numero || "").replace(/\D/g, "");
      const msg =
        CONFIG.whatsapp?.mensajeEmergencia ||
        "Soporte técnico, necesito que mi novio me consienta ya mismo 🥺";
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // Botón para volver a cambiar el estado de ánimo desde el Dashboard
  const changeMoodBtn = document.getElementById("btn-change-mood");
  if (changeMoodBtn) {
    changeMoodBtn.addEventListener("click", () => {
      const dashboard = document.getElementById("phase-dashboard");
      if (dashboard) dashboard.hidden = true;
      moodCheck.show((selectedMood) => {
        showDashboard(selectedMood);
      });
    });
  }
}

let dashboardInitialized = false;

function showDashboard(selectedMood) {
  const dashboard = document.getElementById("phase-dashboard");
  if (dashboard) {
    dashboard.hidden = false;
  }

  if (!dashboardInitialized) {
    dashboardInitialized = true;
    audioModule.init();
    loveModule.init();
    breatheModule.init();
    heatModule.init();
    checklistModule.init();
    couponsModule.init();
    gitlogModule.init();
  }

  if (selectedMood) {
    moodCheck.applyDashboardRecommendation(selectedMood);
  }
}

function initCareOS() {
  themeManager.init();
  rainSystem.init();
  populateStaticGreetings();

  // Si ya eligió su ánimo hoy, saltar directo al Dashboard tras un arranque corto o inmediato
  if (moodCheck.hasCompletedToday()) {
    const bootEl = document.getElementById("phase-boot");
    const moodEl = document.getElementById("phase-mood");
    if (bootEl) bootEl.hidden = true;
    if (moodEl) moodEl.hidden = true;
    showDashboard(moodCheck.selectedMood);
    return;
  }

  // Fase 1 -> Fase 1.5 -> Fase 2
  bootScreen.start(() => {
    moodCheck.show((selectedMood) => {
      showDashboard(selectedMood);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCareOS);
} else {
  initCareOS();
}
