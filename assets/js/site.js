(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector("[data-theme-toggle]");
  const storage = {
    get(key) {
      try { return localStorage.getItem(key); } catch { return null; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* Theme still works for this visit. */ }
    }
  };
  const savedTheme = storage.get("shinkai-site-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    if (themeButton) {
      const dark = theme === "dark";
      themeButton.textContent = dark ? "浅色" : "深色";
      themeButton.setAttribute("aria-label", dark ? "切换至浅色主题" : "切换至深色主题");
    }
  };

  applyTheme(initialTheme);

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    storage.set("shinkai-site-theme", nextTheme);
    applyTheme(nextTheme);
  });

  const search = document.querySelector("[data-paper-search]");
  const cards = [...document.querySelectorAll("[data-paper-card]")];
  const resultCount = document.querySelector("[data-result-count]");

  if (search && cards.length) {
    const updateResults = () => {
      const query = search.value.trim().toLocaleLowerCase();
      let visible = 0;

      cards.forEach((card) => {
        const matches = card.textContent.toLocaleLowerCase().includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });

      if (resultCount) resultCount.textContent = `显示 ${visible} / ${cards.length} 篇`;
    };

    search.addEventListener("input", updateResults);
    updateResults();
  }

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
