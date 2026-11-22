(function () {
  const data = window.BIO_DATA;
  let currentLang = localStorage.getItem("roj_bio_lang") || "ar";
  if (currentLang !== "ar" && currentLang !== "en") currentLang = "ar";

  const ICONS = {
    tiktok: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>`,
    "tiktok-bot": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    "all-bot": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    stories: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    news: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    memes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
    arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`
  };

  const els = {
    html: document.documentElement,
    langBtn: document.getElementById("langBtn"),
    langLabel: document.getElementById("langLabel"),
    shareBtn: document.getElementById("shareBtn"),
    shareLabel: document.getElementById("shareLabel"),
    profileName: document.getElementById("profileName"),
    profileHandle: document.getElementById("profileHandle"),
    profileBio: document.getElementById("profileBio"),
    statsBar: document.getElementById("statsBar"),
    featuredContainer: document.getElementById("featuredContainer"),
    sectionsContainer: document.getElementById("sectionsContainer"),
    footerNote: document.getElementById("footerNote"),
    footerCopyBtn: document.getElementById("footerCopyBtn"),
    footerCopyLabel: document.getElementById("footerCopyLabel"),
    year: document.getElementById("year"),
    toast: document.getElementById("toast")
  };

  let toastTimer = null;
  function showToast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      els.toast.classList.remove("show");
    }, 2200);
  }

  async function copyOrShare(preferNativeShare) {
    const url = window.location.href;
    const ui = data.ui[currentLang];
    if (preferNativeShare && navigator.share) {
      try {
        await navigator.share({
          title: `${data.profile.name} | Bio`,
          text: data.profile.bio[currentLang],
          url
        });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      showToast(ui.copied);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      showToast(ui.copied);
    }
  }

  function render() {
    const lang = currentLang;
    const ui = data.ui[lang];

    els.html.lang = lang;
    els.html.dir = lang === "ar" ? "rtl" : "ltr";

    els.langLabel.textContent = ui.langToggle;
    els.shareLabel.textContent = ui.share;
    els.profileName.textContent = data.profile.name;
    els.profileHandle.textContent = data.profile.handle;
    els.profileBio.textContent = data.profile.bio[lang];
    els.footerNote.textContent = ui.footerNote;
    els.footerCopyLabel.textContent = ui.copyLink;
    els.year.textContent = new Date().getFullYear();

    // إحصائيات سريعة
    els.statsBar.innerHTML = data.profile.stats
      .map(
        (stat) => `
        <div class="stat-pill">
          <span class="stat-value">${stat.value}</span>
          <span class="stat-label">${stat.label[lang]}</span>
        </div>
      `
      )
      .join("");

    // البطاقة المميزة لتيك توك
    const feat = data.featured;
    els.featuredContainer.innerHTML = `
      <a class="featured-card" href="${feat.url}" target="_blank" rel="noopener noreferrer">
        <div class="featured-icon-box">${ICONS.tiktok}</div>
        <div class="card-body">
          <div class="card-top-row">
            <span class="card-title">${feat.title[lang]}</span>
            <span class="card-badge badge-tiktok">${feat.badge[lang]}</span>
          </div>
          <span class="card-subtitle">${feat.subtitle[lang]}</span>
          <span class="card-handle">${feat.handle}</span>
        </div>
        <span class="card-arrow" aria-hidden="true">${ICONS.arrow}</span>
      </a>
    `;

    // الأقسام
    els.sectionsContainer.innerHTML = data.sections
      .map((section, sIdx) => {
        const cardsHtml = section.items
          .map((item) => {
            const badgeClass = item.highlight ? "card-badge badge-amber" : "card-badge";
            const highlightClass = item.highlight ? " is-highlight" : "";
            return `
              <a class="link-card${highlightClass}" href="${item.url}" target="_blank" rel="noopener noreferrer">
                <div class="card-icon accent-${item.accent}">${ICONS[item.icon] || ICONS["all-bot"]}</div>
                <div class="card-body">
                  <div class="card-top-row">
                    <span class="card-title">${item.title[lang]}</span>
                    ${item.badge ? `<span class="${badgeClass}">${item.badge[lang]}</span>` : ""}
                  </div>
                  <span class="card-subtitle">${item.subtitle[lang]}</span>
                  <span class="card-handle">${item.handle}</span>
                </div>
                <span class="card-arrow" aria-hidden="true">${ICONS.arrow}</span>
              </a>
            `;
          })
          .join("");

        return `
          <section class="link-section" style="animation-delay: ${0.14 + sIdx * 0.08}s">
            <div class="section-header">
              <h2 class="section-title">${section.title[lang]}</h2>
              <span class="section-line" aria-hidden="true"></span>
            </div>
            <div class="cards-grid">${cardsHtml}</div>
          </section>
        `;
      })
      .join("");
  }

  els.langBtn.addEventListener("click", () => {
    currentLang = currentLang === "ar" ? "en" : "ar";
    localStorage.setItem("roj_bio_lang", currentLang);
    render();
  });

  els.shareBtn.addEventListener("click", () => copyOrShare(true));
  els.footerCopyBtn.addEventListener("click", () => copyOrShare(false));

  render();
})();
