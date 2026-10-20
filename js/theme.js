// ============================================================================
// CareOS — Tema (Rosado / Lluvia), View Transitions & Reducción de Animaciones
// ============================================================================

import { storage } from "./storage.js";

const THEME_KEY = "theme";
const MOTION_KEY = "reduced_motion";

const THEME_COLORS = {
  rosado: "#FFF8F5",
  lluvia: "#0F1226"
};

export const themeManager = {
  current: "rosado",
  reducedMotion: false,
  listeners: new Set(),

  init() {
    // 1. Detectar preferencia de animaciones reducidas
    const savedMotion = storage.get(MOTION_KEY, null);
    const mediaMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.reducedMotion = savedMotion !== null ? Boolean(savedMotion) : mediaMotion;
    this.applyReducedMotion(this.reducedMotion);

    // 2. Detectar tema guardado o automático según hora local (18:00 - 06:00 -> lluvia)
    const savedTheme = storage.get(THEME_KEY, null);
    if (savedTheme === "rosado" || savedTheme === "lluvia") {
      this.current = savedTheme;
    } else {
      const hour = new Date().getHours();
      this.current = hour >= 18 || hour < 6 ? "lluvia" : "rosado";
    }

    this.applyTheme(this.current);
    this.bindControls();
  },

  bindControls() {
    const themeBtn = document.getElementById("btn-theme-toggle");
    if (themeBtn) {
      themeBtn.addEventListener("click", (e) => {
        const next = this.current === "rosado" ? "lluvia" : "rosado";
        this.setThemeWithTransition(next, e);
      });
    }

    const motionBtn = document.getElementById("btn-motion-toggle");
    if (motionBtn) {
      motionBtn.addEventListener("click", () => {
        this.reducedMotion = !this.reducedMotion;
        storage.set(MOTION_KEY, this.reducedMotion);
        this.applyReducedMotion(this.reducedMotion);
      });
    }
  },

  applyReducedMotion(enabled) {
    document.documentElement.setAttribute("data-reduced-motion", String(enabled));
    const motionBtn = document.getElementById("btn-motion-toggle");
    if (motionBtn) {
      motionBtn.setAttribute("aria-pressed", String(enabled));
      motionBtn.title = enabled ? "Activar animaciones normales" : "Bajar animaciones";
    }
    this.notify();
  },

  applyTheme(themeName) {
    this.current = themeName;
    document.documentElement.setAttribute("data-theme", themeName);

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", THEME_COLORS[themeName] || THEME_COLORS.rosado);
    }

    const themeBtn = document.getElementById("btn-theme-toggle");
    const themeIcon = document.getElementById("theme-toggle-icon");
    const themeLabel = document.getElementById("theme-toggle-label");

    if (themeBtn && themeIcon && themeLabel) {
      const isRain = themeName === "lluvia";
      themeBtn.setAttribute("aria-pressed", String(isRain));
      themeIcon.textContent = isRain ? "🌧️" : "🌸";
      themeLabel.textContent = isRain ? "Lluvia" : "Rosado";
    }

    this.notify();
  },

  setThemeWithTransition(nextTheme, clickEvent = null) {
    if (nextTheme === this.current) return;
    storage.set(THEME_KEY, nextTheme);

    const canViewTransition =
      typeof document.startViewTransition === "function" &&
      !this.reducedMotion &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canViewTransition || !clickEvent) {
      this.applyTheme(nextTheme);
      return;
    }

    const x = clickEvent.clientX ?? window.innerWidth - 40;
    const y = clickEvent.clientY ?? 36;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      this.applyTheme(nextTheme);
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 520,
            easing: "cubic-bezier(0.22, 0.8, 0.3, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      })
      .catch(() => {
        // Fallback silencioso si la transición se interrumpe
      });
  },

  onChange(callback) {
    this.listeners.add(callback);
  },

  notify() {
    this.listeners.forEach((cb) => cb(this.current, this.reducedMotion));
  }
};
