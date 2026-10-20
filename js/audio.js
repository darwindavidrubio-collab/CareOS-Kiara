// ============================================================================
// CareOS — Módulo 4.3: Terapia de Audio (Spotify Embed + Chips + Enlace propio)
// ============================================================================

import { CONFIG } from "./config.js";
import { storage } from "./storage.js";
import { themeManager } from "./theme.js";

const AUDIO_STORAGE_KEY = "last_spotify_selection";

// Regex oficial para validar enlaces de Spotify (playlist, album, track, artist, show, episode)
const SPOTIFY_REGEX = /open\.spotify\.com\/(?:intl-[a-z]{2}\/)?(playlist|album|track|artist|show|episode)\/([a-zA-Z0-9]+)/i;

export const audioModule = {
  currentSelection: null,

  init() {
    this.renderChips();
    this.bindCustomForm();

    // Recuperar última selección guardada o usar la sugerida por el tema actual
    const saved = storage.get(AUDIO_STORAGE_KEY, null);
    if (saved && saved.embedUrl && saved.webUrl) {
      this.loadSelection(saved, false);
    } else {
      const preferred = this.getDefaultPlaylistForTheme(themeManager.current);
      if (preferred) {
        this.selectPreset(preferred, false);
      }
    }
  },

  getDefaultPlaylistForTheme(theme) {
    const list = CONFIG.playlists || [];
    return (
      list.find((p) => p.defaultForTheme === theme) ||
      list[0] ||
      null
    );
  },

  parseSpotifyUrl(rawInput) {
    const trimmed = (rawInput || "").trim();
    if (!trimmed) {
      return { error: "Escribe o pega un enlace de Spotify primero 💗" };
    }

    if (/spotify\.link|spoti\.fi/i.test(trimmed)) {
      return {
        error: "Ese es un enlace corto (`spotify.link`). Ábrelo un segundo y pega aquí el enlace largo de `open.spotify.com` 🥺"
      };
    }

    const match = trimmed.match(SPOTIFY_REGEX);
    if (!match) {
      return {
        error: "Ese enlace no parece de Spotify 🥺, ¿lo intentamos de nuevo?"
      };
    }

    const [, type, id] = match;
    return {
      type: type.toLowerCase(),
      id,
      webUrl: `https://open.spotify.com/${type.toLowerCase()}/${id}`,
      embedUrl: `https://open.spotify.com/embed/${type.toLowerCase()}/${id}?utm_source=generator&theme=0`
    };
  },

  renderChips() {
    const container = document.getElementById("audio-chips-row");
    if (!container) return;
    container.innerHTML = "";

    (CONFIG.playlists || []).forEach((item) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip-btn";
      btn.dataset.playlistId = item.id;
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<span aria-hidden="true">${item.emoji}</span><span>${item.etiqueta}</span>`;
      btn.addEventListener("click", () => {
        this.setFeedback("");
        this.selectPreset(item, true);
      });
      container.appendChild(btn);
    });
  },

  selectPreset(item, persist = true) {
    const parsed = this.parseSpotifyUrl(item.url);
    if (parsed.error) return;

    const selection = {
      presetId: item.id,
      label: item.etiqueta,
      webUrl: parsed.webUrl,
      embedUrl: parsed.embedUrl
    };

    this.loadSelection(selection, persist);
  },

  loadSelection(selection, persist = true) {
    this.currentSelection = selection;
    if (persist) {
      storage.set(AUDIO_STORAGE_KEY, selection);
    }

    // Actualizar estado activo de los chips
    document.querySelectorAll("#audio-chips-row .chip-btn").forEach((btn) => {
      const isMatch = Boolean(selection.presetId && btn.dataset.playlistId === selection.presetId);
      btn.setAttribute("aria-pressed", String(isMatch));
    });

    // Actualizar botón "Abrir en Spotify"
    const openLink = document.getElementById("btn-open-spotify");
    if (openLink && selection.webUrl) {
      openLink.href = selection.webUrl;
    }

    // Cargar iframe con transición suave
    const wrap = document.getElementById("spotify-frame-wrap");
    const iframe = document.getElementById("spotify-iframe");
    if (!wrap || !iframe) return;

    if (iframe.src === selection.embedUrl) return;

    wrap.classList.add("is-loading");
    iframe.onload = () => {
      wrap.classList.remove("is-loading");
    };
    iframe.src = selection.embedUrl;
  },

  bindCustomForm() {
    const form = document.getElementById("custom-spotify-form");
    const input = document.getElementById("custom-spotify-input");
    if (!form || !input) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const parsed = this.parseSpotifyUrl(input.value);
      if (parsed.error) {
        this.setFeedback(parsed.error);
        return;
      }

      this.setFeedback("¡Listo! Cargando tu música favorita ✨");
      input.value = "";
      this.loadSelection(
        {
          presetId: null,
          label: "Tu selección",
          webUrl: parsed.webUrl,
          embedUrl: parsed.embedUrl
        },
        true
      );
    });
  },

  setFeedback(msg) {
    const msgEl = document.getElementById("audio-feedback-msg");
    if (msgEl) {
      msgEl.textContent = msg;
    }
  }
};
