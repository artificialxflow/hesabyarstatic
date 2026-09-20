(() => {
  const S = window.HesyState;
  const t = (k) => window.HesyI18n.t(k);
  const app = () => document.getElementById("app");
  let view = "dash";
  let invFilter = "all";
  let invQuery = "";
  let reportTab = "bs";
  let reportMonth = "6";

  function statusBadge(st) {
    const map = { paid: "badge-paid", due: "badge-due", draft: "badge-draft", voided: "badge-void" };
    return `<span class="badge ${map[st] || "badge-draft"}">${t(st)}</span>`;
  }

  function customerName(id) {
    const c = S.customers.find((x) => x.id === id);
    return c ? window.HesyFmt.customer(c) : "—";
  }

  function accountLabel(id) {
    const a = S.accounts.find((x) => x.id === id);
    if (!a) return id;
    return window.HesyI18n.getLang() === "fa" ? a.label : a.labelEn;
  }

  function emptyRow(cols) {
    return `<tr><td colspan="${cols}" class="text-center py-8 text-slate-500">${t("noRows")}</td></tr>`;
  }

  function drawChart() {
    const c = document.getElementById("trendChart");
    if (!c) return;
    const ctx = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);
    const series = [S.chart.income, S.chart.cost];
    const colors = ["#2563eb", "#dc2626"];
    const max = 50;
    series.forEach((arr, si) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[si];
      ctx.lineWidth = 3;
      arr.forEach((v, i) => {
        const x = 40 + (i * (w - 70)) / (arr.length - 1);
        const y = h - 30 - (v / max) * (h - 60);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
    ctx.fillStyle = "#334155";
    ctx.font = "12px Vazirmatn, sans-serif";
    const labels = window.HesyI18n.getLang() === "fa" ? S.chart.labelsFa : S.chart.labelsEn;
    labels.forEach((lb, i) => {
      const x = 32 + (i * (w - 70)) / (labels.length - 1);
      ctx.fillText(lb, x, h - 8);
    });
  }

  function renderDash() {
    const k = S.kpis;
    app().innerHTML = `
      <div class="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        <div class="box p-4 bg-sky-100 border-sky-800 stat-card"><div class="text-sm font-bold">💎 ${t("totalAssets")}</div><div class="text-2xl font-extrabold mt-2">${window.HesyFmt.money(k.assets)}</div></div>
        <div class="box p-4 bg-blue-100 border-blue-800 stat-card"><div class="text-sm font-bold">📥 ${t("monthlyIncome")}</div><div class="text-2xl font-extrabold mt-2">${window.HesyFmt.money(k.income)}</div></div>
        <div class="box p-4 bg-rose-100 border-rose-800 stat-card"><div class="text-sm font-bold">📤 ${t("expenses")}</div><div class="text-2xl font-extrabold mt-2">${window.HesyFmt.money(k.expenses)}</div></div>
        <div class="box p-4 bg-emerald-100 border-emerald-800 stat-card"><div class="text-sm font-bold">✅ ${t("netProfit")}</div><div class="text-2xl font-extrabold mt-2">${window.HesyFmt.money(k.profit)}</div></div>
      </div>
      <div class="box p-4 mb-4">
        <h3 class="font-extrabold mb-2">${t("chartTitle")}</h3>
        <p class="text-xs mb-2"><span class="text-blue-700 font-bold">${t("income")}</span> / <span class="text-red-700 font-bold">${t("cost")}</span></p>
        <canvas id="trendChart" width="900" height="240" class="w-full max-h-60"></canvas>
      </div>
      <div class="grid lg:grid-cols-2 gap-4">
        <div>
          <h3 class="font-extrabold mb-2">${t("recentInvoices")}</h3>
          ${invoiceTable(S.invoices.slice(0, 5))}
        </div>
        <div>
          <h3 class="font-extrabold mb-2">${t("recentDocs")}</h3>
          ${docTable(S.docs.slice(0, 5), true)}
        </div>
      </div>`;
    drawChart();
  }

  function invoiceTable(list) {
    const rows = list.map((inv) => `
      <tr>
        <td class="font-bold">${inv.no}</td>
        <td>${customerName(inv.customerId)}</td>
        <td>${window.HesyI18n.getLang() === "fa" ? inv.dateFa : inv.dateEn}</td>
        <td>${window.HesyFmt.money(inv.amount)}</td>
        <td>${statusBadge(inv.status)}</td>
        <td><button class="btn py-1 text-xs" data-preview="${inv.no}">${t("preview")}</button></td>
      </tr>`).join("");
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>${t("number")}</th><th>${t("customer")}</th><th>${t("date")}</th><th>${t("amount")}</th><th>${t("status")}</th><th>${t("actions")}</th></tr></thead>
      <tbody>${rows || emptyRow(6)}</tbody></table></div>`;
  }

  function docTable(list, compact) {
    const rows = list.map((d) => `
      <tr>
        <td class="font-bold">${d.no}</td>
        <td>${window.HesyI18n.getLang() === "fa" ? d.dateFa : d.dateEn}</td>
        <td>${window.HesyI18n.getLang() === "fa" ? d.memo : d.memoEn}</td>
        <td>${window.HesyFmt.money(d.debit)}</td>
        ${compact ? "" : `<td>${window.HesyFmt.money(d.credit)}</td>`}
        <td><span class="badge badge-ok">${t("balanced")}</span></td>
      </tr>`).join("");
    return `<div class="table-wrap"><table class="data">
      <thead><tr><th>${t("number")}</th><th>${t("date")}</th><th>${t("desc")}</th><th>${t("debit")}</th>${compact ? "" : `<th>${t("credit")}</th>`}<th>${t("status")}</th></tr></thead>
      <tbody>${rows || emptyRow(compact ? 5 : 6)}</tbody></table></div>`;
  }

  function renderInvoices() {
    const q = (invQuery || document.getElementById("globalSearch")?.value || "").toLowerCase();
    const list = S.invoices.filter((inv) => {
      const st = invFilter === "all" || inv.status === invFilter;
      const name = customerName(inv.customerId).toLowerCase();
      return st && (!q || name.includes(q) || inv.no.toLowerCase().includes(q));
    });
    app().innerHTML = `
      <div class="flex flex-wrap gap-2 mb-3">
        <button class="btn btn-primary" id="btnNewInv">➕ ${t("newInvoice")}</button>
        ${["all", "paid", "due", "draft"].map((f) => `<button class="btn ${invFilter === f ? "btn-dark" : "btn-ghost"} inv-f" data-f="${f}">${t(f)}</button>`).join("")}
      </div>
      ${invoiceTable(list)}`;
  }

  function renderJournal() {
    app().innerHTML = `
      <div class="mb-3"><button class="btn btn-primary" id="btnNewDoc">➕ ${t("newDoc")}</button></div>
      ${docTable(S.docs, false)}`;
  }

  function renderStock() {
    const rows = S.products.map((p) => {
      const low = p.qty <= p.reorder;
      return `<tr>
        <td>${p.code}</td>
        <td>${window.HesyFmt.productName(p)}</td>
        <td>${window.HesyI18n.getLang() === "fa" ? p.unit : p.unitEn}</td>
        <td>${window.HesyFmt.num(p.qty)}</td>
        <td>${window.HesyFmt.num(p.reorder)}</td>
        <td>${window.HesyFmt.money(p.qty * p.price)}</td>
        <td>${low ? `<span class="badge badge-warn">${t("lowStock")}</span>` : `<span class="badge badge-ok">${t("okStock")}</span>`}</td>
      </tr>`;
    }).join("");
    app().innerHTML = `
      <div class="mb-3"><button class="btn btn-amber" id="btnNewItem">➕ ${t("newItem")}</button></div>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>${t("code")}</th><th>${t("name")}</th><th>${t("unit")}</th><th>${t("qtyOnHand")}</th><th>${t("reorder")}</th><th>${t("value")}</th><th>${t("status")}</th></tr></thead>
        <tbody>${rows || emptyRow(7)}</tbody>
      </table></div>`;
  }

  function renderReports() {
    const src = reportTab === "pnl" ? S.reports.pnl : S.reports.bs;
    const factor = reportMonth === "6" ? 1 : 0.82;
    const rows = src.map((r) => `<tr>
      <td>${window.HesyI18n.getLang() === "fa" ? r.fa : r.en}</td>
      <td class="font-bold">${window.HesyFmt.money(Math.round(r.val * factor))}</td>
    </tr>`).join("");
    const dayRows = S.docs.map((d) => `<tr>
      <td>${d.no}</td>
      <td>${window.HesyI18n.getLang() === "fa" ? d.dateFa : d.dateEn}</td>
      <td>${window.HesyI18n.getLang() === "fa" ? d.memo : d.memoEn}</td>
      <td>${window.HesyFmt.money(d.debit)}</td>
      <td>${window.HesyFmt.money(d.credit)}</td>
    </tr>`).join("");
    app().innerHTML = `
      <div class="flex flex-wrap gap-2 mb-3 no-print">
        <button class="btn ${reportTab === "bs" ? "btn-dark" : "btn-ghost"} rtab" data-r="bs">${t("balanceSheet")}</button>
        <button class="btn ${reportTab === "day" ? "btn-dark" : "btn-ghost"} rtab" data-r="day">${t("daybook")}</button>
        <button class="btn ${reportTab === "pnl" ? "btn-dark" : "btn-ghost"} rtab" data-r="pnl">${t("pnl")}</button>
        <select id="monthFilter" class="field w-auto">
          <option value="6" ${reportMonth === "6" ? "selected" : ""}>${window.HesyI18n.getLang() === "fa" ? "شهریور ۱۴۰۵" : "Shahrivar 2026"}</option>
          <option value="5" ${reportMonth === "5" ? "selected" : ""}>${window.HesyI18n.getLang() === "fa" ? "مرداد ۱۴۰۵" : "Mordad 2026"}</option>
        </select>
        <button class="btn btn-ghost" id="btnPrint">🖨️ ${t("print")}</button>
      </div>
      ${reportTab === "day"
        ? `<div class="table-wrap"><table class="data"><thead><tr><th>${t("number")}</th><th>${t("date")}</th><th>${t("desc")}</th><th>${t("debit")}</th><th>${t("credit")}</th></tr></thead><tbody>${dayRows}</tbody></table></div>`
        : `<div class="table-wrap"><table class="data"><thead><tr><th>${t("ledger")}</th><th>${t("amount")}</th></tr></thead><tbody>${rows}</tbody></table></div>`}
    `;
  }

  function renderSettings() {
    app().innerHTML = `
      <form id="setForm" class="box p-5 max-w-xl space-y-4">
        <label class="block font-bold">${t("bizName")}<input name="biz" class="field mt-1" value="${S.settings.bizName}" /></label>
        <label class="block font-bold">${t("currency")}
          <select name="cur" class="field mt-1">
            <option value="rial" ${S.settings.currency === "rial" ? "selected" : ""}>${t("rial")}</option>
            <option value="toman" ${S.settings.currency === "toman" ? "selected" : ""}>${t("toman")}</option>
          </select>
        </label>
        <label class="block font-bold">${t("defaultLang")}
          <select name="lang" class="field mt-1">
            <option value="fa" ${window.HesyI18n.getLang() === "fa" ? "selected" : ""}>فارسی</option>
            <option value="en" ${window.HesyI18n.getLang() === "en" ? "selected" : ""}>English</option>
          </select>
        </label>
        <p class="text-sm text-slate-600 border-2 border-slate-400 rounded-xl p-3 bg-slate-50">${t("staticNote")}</p>
        <button class="btn btn-ok" type="submit">${t("save")}</button>
      </form>`;
  }

  function openModal(html) {
    const m = document.getElementById("modal");
    m.innerHTML = `<div class="box p-5 max-w-2xl w-full max-h-[90vh] overflow-auto" role="dialog">${html}</div>`;
    m.classList.add("show");
    const first = m.querySelector("input, select, button");
    first?.focus();
  }
  function closeModal() {
    const m = document.getElementById("modal");
    m.classList.remove("show");
    m.innerHTML = "";
  }

  function invoiceForm() {
    const optsC = S.customers.map((c) => `<option value="${c.id}">${window.HesyFmt.customer(c)}</option>`).join("");
    const optsP = S.products.map((p) => `<option value="${p.code}">${window.HesyFmt.productName(p)}</option>`).join("");
    openModal(`
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-extrabold">${t("newInvoice")}</h3>
        <button class="btn btn-ghost" data-close>${t("close")}</button>
      </div>
      <form id="invForm" class="space-y-3">
        <label class="block font-bold">${t("customer")}<select name="customer" class="field mt-1">${optsC}</select></label>
        <div id="invLines" class="space-y-2"></div>
        <button type="button" class="btn btn-ghost" id="addInvLine">${t("addRow")}</button>
        <div class="font-bold">${t("tax")}: <span id="taxVal">0</span></div>
        <div class="font-extrabold text-lg">${t("grand")}: <span id="grandVal">0</span></div>
        <div class="flex gap-2">
          <button class="btn btn-ok" type="submit">${t("save")}</button>
          <button class="btn btn-ghost" type="button" data-close>${t("cancel")}</button>
        </div>
      </form>`);
    const linesEl = document.getElementById("invLines");
    const addLine = () => {
      const row = document.createElement("div");
      row.className = "grid grid-cols-12 gap-2 items-center";
      row.innerHTML = `<select class="field col-span-5 line-item">${optsP}</select>
        <input type="number" min="1" value="1" class="field col-span-3 line-qty" />
        <button type="button" class="btn btn-danger col-span-4 del-line">×</button>`;
      linesEl.appendChild(row);
      row.querySelector(".del-line").onclick = () => { row.remove(); sumInv(); };
      row.querySelectorAll("input,select").forEach((el) => el.addEventListener("input", sumInv));
      sumInv();
    };
    const sumInv = () => {
      let sum = 0;
      linesEl.querySelectorAll(".grid").forEach((row) => {
        const code = row.querySelector(".line-item").value;
        const qty = Number(row.querySelector(".line-qty").value || 0);
        const p = S.products.find((x) => x.code === code);
        sum += qty * (p?.price || 0);
      });
      const tax = Math.round(sum * 0.09);
      document.getElementById("taxVal").textContent = window.HesyFmt.money(tax);
      document.getElementById("grandVal").textContent = window.HesyFmt.money(sum + tax);
    };
    document.getElementById("addInvLine").onclick = addLine;
    addLine();
    document.getElementById("invForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      let sum = 0;
      const lines = [];
      linesEl.querySelectorAll(".grid").forEach((row) => {
        const code = row.querySelector(".line-item").value;
        const qty = Number(row.querySelector(".line-qty").value || 0);
        const p = S.products.find((x) => x.code === code);
        if (p) {
          p.qty = Math.max(0, p.qty - qty);
          sum += qty * p.price;
          lines.push({ code, qty, price: p.price });
        }
      });
      const tax = Math.round(sum * 0.09);
      const n = S.invoices.length + 14;
      S.invoices.unshift({
        no: `INV-1405-0${n}`,
        customerId: Number(fd.get("customer")),
        dateFa: "۱۴۰۵/۰۶/۳۱",
        dateEn: "2026-09-22",
        amount: sum + tax,
        status: "paid",
        lines
      });
      closeModal();
      window.hesyToast(t("toastInvoice"));
      render();
    };
  }

  function docForm() {
    const opts = S.accounts.map((a) => `<option value="${a.id}">${accountLabel(a.id)}</option>`).join("");
    openModal(`
      <div class="flex justify-between mb-3">
        <h3 class="font-extrabold">${t("newDoc")}</h3>
        <button class="btn btn-ghost" data-close>${t("close")}</button>
      </div>
      <form id="docForm" class="space-y-3">
        <label class="block font-bold">${t("desc")}<input name="memo" class="field mt-1" required /></label>
        <div id="docLines"></div>
        <button type="button" class="btn btn-ghost" id="addDocLine">${t("addRow")}</button>
        <p id="balMsg" class="text-sm font-bold"></p>
        <button class="btn btn-ok" type="submit">${t("save")}</button>
      </form>`);
    const box = document.getElementById("docLines");
    const add = (side) => {
      const row = document.createElement("div");
      row.className = "grid grid-cols-12 gap-2 mb-2";
      row.innerHTML = `<select class="field col-span-6 acc">${opts}</select>
        <select class="field col-span-3 side"><option value="d">${t("debit")}</option><option value="c">${t("credit")}</option></select>
        <input type="number" min="1" class="field col-span-3 amt" value="1000000" />`;
      if (side) row.querySelector(".side").value = side;
      box.appendChild(row);
      row.querySelectorAll("input,select").forEach((el) => el.addEventListener("input", checkBal));
      checkBal();
    };
    const checkBal = () => {
      let d = 0, c = 0;
      box.querySelectorAll(".grid").forEach((row) => {
        const v = Number(row.querySelector(".amt").value || 0);
        if (row.querySelector(".side").value === "d") d += v;
        else c += v;
      });
      const ok = d === c && d > 0;
      const msg = document.getElementById("balMsg");
      msg.textContent = ok ? t("balanced") : t("unbalanced");
      msg.className = "text-sm font-bold " + (ok ? "text-emerald-700" : "text-red-700");
      return { d, c, ok };
    };
    document.getElementById("addDocLine").onclick = () => add("d");
    add("d");
    add("c");
    document.getElementById("docForm").onsubmit = (e) => {
      e.preventDefault();
      const { d, c, ok } = checkBal();
      if (!ok) return;
      const memo = e.target.memo.value;
      const n = 90 + S.docs.length;
      S.docs.unshift({
        no: `JE-${n}`,
        dateFa: "۱۴۰۵/۰۶/۳۱",
        dateEn: "2026-09-22",
        memo,
        memoEn: memo,
        debit: d,
        credit: c
      });
      closeModal();
      window.hesyToast(t("toastDoc"));
      render();
    };
  }

  function itemForm() {
    openModal(`
      <h3 class="font-extrabold mb-3">${t("newItem")}</h3>
      <form id="itemForm" class="space-y-3">
        <input name="code" class="field" placeholder="${t("code")}" required />
        <input name="name" class="field" placeholder="${t("name")}" required />
        <input name="qty" type="number" class="field" value="1" />
        <input name="price" type="number" class="field" value="100000" />
        <button class="btn btn-ok" type="submit">${t("save")}</button>
        <button class="btn btn-ghost" type="button" data-close>${t("cancel")}</button>
      </form>`);
    document.getElementById("itemForm").onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      S.products.push({
        code: fd.get("code"),
        name: fd.get("name"),
        nameEn: fd.get("name"),
        unit: "عدد",
        unitEn: "pcs",
        qty: Number(fd.get("qty")),
        reorder: 5,
        price: Number(fd.get("price"))
      });
      closeModal();
      window.hesyToast(t("toastItem"));
      render();
    };
  }

  function previewInvoice(no) {
    const inv = S.invoices.find((x) => x.no === no);
    if (!inv) return;
    const lines = (inv.lines || []).map((l) => {
      const p = S.products.find((x) => x.code === l.code);
      return `<tr><td>${p ? window.HesyFmt.productName(p) : l.code}</td><td>${l.qty}</td><td>${window.HesyFmt.money(l.price)}</td><td>${window.HesyFmt.money(l.qty * l.price)}</td></tr>`;
    }).join("");
    openModal(`
      <div class="border-4 border-slate-900 p-5 rounded-2xl bg-white">
        <div class="flex justify-between font-extrabold text-xl mb-4">
          <span>📘 ${S.settings.bizName}</span>
          <span>${t("invoiceTitle")}</span>
        </div>
        <p>${t("number")}: ${inv.no}</p>
        <p>${t("customer")}: ${customerName(inv.customerId)}</p>
        <div class="table-wrap mt-3"><table class="data">
          <thead><tr><th>${t("item")}</th><th>${t("qty")}</th><th>${t("price")}</th><th>${t("total")}</th></tr></thead>
          <tbody>${lines}</tbody>
        </table></div>
        <p class="text-end font-extrabold mt-3">${t("grand")}: ${window.HesyFmt.money(inv.amount)}</p>
        <button class="btn btn-ghost mt-4" data-close>${t("close")}</button>
      </div>`);
  }

  const views = { dash: renderDash, invoices: renderInvoices, journal: renderJournal, stock: renderStock, reports: renderReports, settings: renderSettings };

  function render() {
    document.getElementById("pageTitle").textContent = t(view === "dash" ? "dash" : view);
    views[view]();
    document.querySelectorAll(".sidebar-link").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-view") === view);
    });
    document.getElementById("langToggle").textContent = t("langBtn");
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.HesyI18n.apply();
    render();
    document.getElementById("langToggle").onclick = () => {
      window.HesyI18n.toggle();
      render();
    };
    document.querySelectorAll(".sidebar-link").forEach((b) => {
      b.onclick = () => {
        view = b.getAttribute("data-view");
        closeSidebar();
        render();
      };
    });
    document.getElementById("openSidebar").onclick = () => {
      document.getElementById("sidebar").classList.remove("hidden");
      document.getElementById("sidebarMask").classList.remove("hidden");
    };
    document.getElementById("sidebarMask").onclick = closeSidebar;
    document.getElementById("globalSearch").addEventListener("input", (e) => {
      invQuery = e.target.value;
      if (view === "invoices") renderInvoices();
    });
    document.getElementById("app").addEventListener("click", (e) => {
      const f = e.target.closest(".inv-f");
      if (f) { invFilter = f.getAttribute("data-f"); renderInvoices(); }
      if (e.target.closest("#btnNewInv")) invoiceForm();
      if (e.target.closest("#btnNewDoc")) docForm();
      if (e.target.closest("#btnNewItem")) itemForm();
      const pv = e.target.closest("[data-preview]");
      if (pv) previewInvoice(pv.getAttribute("data-preview"));
      const rt = e.target.closest(".rtab");
      if (rt) { reportTab = rt.getAttribute("data-r"); renderReports(); }
      if (e.target.closest("#btnPrint")) window.print();
    });
    document.getElementById("app").addEventListener("change", (e) => {
      if (e.target.id === "monthFilter") {
        reportMonth = e.target.value;
        renderReports();
      }
    });
    document.getElementById("app").addEventListener("submit", (e) => {
      if (e.target.id === "setForm") {
        e.preventDefault();
        const fd = new FormData(e.target);
        S.settings.bizName = fd.get("biz");
        S.settings.currency = fd.get("cur");
        window.HesyI18n.setLang(fd.get("lang"));
        window.hesyToast(t("toastSettings"));
        render();
      }
    });
    document.getElementById("modal").addEventListener("click", (e) => {
      if (e.target.id === "modal" || e.target.closest("[data-close]")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
    document.addEventListener("hesy:lang", render);
  });

  function closeSidebar() {
    const sb = document.getElementById("sidebar");
    if (window.matchMedia("(max-width: 1023px)").matches) sb.classList.add("hidden");
    document.getElementById("sidebarMask").classList.add("hidden");
  }
})();
