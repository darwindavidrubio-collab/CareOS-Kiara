// ============================================================================
// CareOS — Módulo 4.10: Easter Egg `git log --oneline --love`
// ============================================================================

import { CONFIG } from "./config.js";

export const gitlogModule = {
  init() {
    const listEl = document.getElementById("gitlog-list");
    const sectionEl = document.getElementById("module-gitlog");
    if (!listEl || !sectionEl) return;

    listEl.innerHTML = "";

    (CONFIG.gitLog || []).forEach((commit) => {
      const li = document.createElement("li");
      li.className = "gitlog-item";
      li.innerHTML = `
        <span class="git-hash">${commit.hash}</span>
        ${commit.fecha ? `<span class="git-date">[${commit.fecha}]</span>` : ""}
        <span class="git-msg">${commit.mensaje}</span>
      `;
      listEl.appendChild(li);
    });

    const items = listEl.querySelectorAll(".gitlog-item");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              items.forEach((item, idx) => {
                setTimeout(() => {
                  item.classList.add("is-visible");
                }, idx * 170);
              });
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(sectionEl);
    } else {
      items.forEach((item) => item.classList.add("is-visible"));
    }
  }
};
