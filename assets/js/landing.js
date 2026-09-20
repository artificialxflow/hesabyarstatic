document.addEventListener("DOMContentLoaded", () => {
  window.HesyI18n.apply();
  const syncLangBtns = () => {
    const label = window.HesyI18n.t("langBtn");
    document.getElementById("langToggle").textContent = label;
    document.querySelectorAll(".lang-footer").forEach((b) => (b.textContent = label));
  };
  syncLangBtns();
  document.getElementById("langToggle").addEventListener("click", () => {
    window.HesyI18n.toggle();
    syncLangBtns();
  });
  document.querySelectorAll(".lang-footer").forEach((b) => {
    b.addEventListener("click", () => {
      window.HesyI18n.toggle();
      syncLangBtns();
    });
  });
  document.getElementById("mobileNavBtn").addEventListener("click", () => {
    document.getElementById("mobileNav").classList.toggle("hidden");
  });

  const screen = document.getElementById("mockScreen");
  const views = {
    home: () => `<div class="space-y-2 text-xs">
      <div class="rounded-xl border-2 border-slate-900 p-2 bg-blue-100"><div class="font-bold">💰</div><div>${window.HesyFmt.money(42300000)}</div></div>
      <div class="rounded-xl border-2 border-slate-900 p-2 bg-rose-100">${window.HesyI18n.t("expenses")}: ${window.HesyFmt.money(18750000)}</div>
      <div class="rounded-xl border-2 border-slate-900 p-2 bg-emerald-100">${window.HesyI18n.t("netProfit")}: ${window.HesyFmt.money(23550000)}</div>
    </div>`,
    inv: () => `<div class="text-xs space-y-2">
      <div class="rounded-xl border-2 border-blue-800 p-2 bg-blue-50">INV-014 · ${window.HesyI18n.t("paid")}</div>
      <div class="rounded-xl border-2 border-red-800 p-2 bg-red-50">INV-015 · ${window.HesyI18n.t("due")}</div>
      <div class="rounded-xl border-2 border-slate-700 p-2 bg-slate-100">INV-016 · ${window.HesyI18n.t("draft")}</div>
    </div>`,
    stock: () => `<div class="text-xs space-y-2">
      <div class="rounded-xl border-2 border-amber-800 p-2 bg-amber-50">A4 · ${window.HesyI18n.t("lowStock")}</div>
      <div class="rounded-xl border-2 border-emerald-800 p-2 bg-emerald-50">${window.HesyI18n.t("okStock")} · 42</div>
    </div>`
  };
  let tab = "home";
  const renderMock = () => { screen.innerHTML = views[tab](); };
  renderMock();
  document.querySelectorAll(".mock-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      tab = btn.getAttribute("data-tab");
      renderMock();
    });
  });
  document.addEventListener("hesy:lang", renderMock);

  document.getElementById("apkLink").addEventListener("click", (e) => {
    e.preventDefault();
    window.hesyToast(window.HesyI18n.t("downloadToast"));
  });
});
