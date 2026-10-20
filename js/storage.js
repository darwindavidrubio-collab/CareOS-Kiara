// ============================================================================
// CareOS — Storage Helper Seguro (localStorage con try/catch)
// ============================================================================

const PREFIX = "careos_v1_";

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = window.localStorage.getItem(PREFIX + key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  },

  set(key, value) {
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(PREFIX + key);
      return true;
    } catch {
      return false;
    }
  },

  getTodayKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
};
