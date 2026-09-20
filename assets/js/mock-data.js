window.HesyState = {
  settings: {
    bizName: "فروشگاه نمونه حساب‌یار",
    currency: "rial"
  },
  customers: [
    { id: 1, name: "فروشگاه نور", nameEn: "Noor Store" },
    { id: 2, name: "کافه سپهر", nameEn: "Sepehr Cafe" },
    { id: 3, name: "پخش کرمی", nameEn: "Karami Wholesale" }
  ],
  products: [
    { code: "P-101", name: "دفتر کل", nameEn: "Ledger book", unit: "جلد", unitEn: "pcs", qty: 42, reorder: 10, price: 180000 },
    { code: "P-204", name: "کاغذ A4", nameEn: "A4 paper", unit: "بسته", unitEn: "pack", qty: 8, reorder: 12, price: 95000 },
    { code: "P-310", name: "استامپ تاریخ", nameEn: "Date stamp", unit: "عدد", unitEn: "pcs", qty: 25, reorder: 5, price: 220000 },
    { code: "P-418", name: "پوشه آویز", nameEn: "Hanging file", unit: "بسته", unitEn: "pack", qty: 15, reorder: 8, price: 140000 }
  ],
  invoices: [
    { no: "INV-1405-014", customerId: 1, dateFa: "۱۴۰۵/۰۶/۲۸", dateEn: "2026-09-19", amount: 4200000, status: "paid", lines: [{ code: "P-101", qty: 10, price: 180000 }] },
    { no: "INV-1405-015", customerId: 2, dateFa: "۱۴۰۵/۰۶/۲۹", dateEn: "2026-09-20", amount: 1850000, status: "due", lines: [{ code: "P-204", qty: 12, price: 95000 }] },
    { no: "INV-1405-016", customerId: 3, dateFa: "۱۴۰۵/۰۶/۳۰", dateEn: "2026-09-21", amount: 960000, status: "draft", lines: [{ code: "P-418", qty: 4, price: 140000 }] }
  ],
  docs: [
    { no: "JE-088", dateFa: "۱۴۰۵/۰۶/۲۷", dateEn: "2026-09-18", memo: "فروش نقدی", memoEn: "Cash sales", debit: 4200000, credit: 4200000 },
    { no: "JE-089", dateFa: "۱۴۰۵/۰۶/۲۸", dateEn: "2026-09-19", memo: "خرید کالا", memoEn: "Inventory purchase", debit: 2100000, credit: 2100000 },
    { no: "JE-090", dateFa: "۱۴۰۵/۰۶/۲۹", dateEn: "2026-09-20", memo: "هزینه اجاره", memoEn: "Rent expense", debit: 8000000, credit: 8000000 }
  ],
  accounts: [
    { id: "11", label: "کل: دارایی‌های جاری", labelEn: "GL: Current assets" },
    { id: "1101", label: "معین: موجودی نقد", labelEn: "Sub: Cash" },
    { id: "110101", label: "تفصیلی: صندوق فروشگاه", labelEn: "Det: Store cash" },
    { id: "12", label: "کل: موجودی کالا", labelEn: "GL: Inventory" },
    { id: "41", label: "کل: درآمد فروش", labelEn: "GL: Sales revenue" },
    { id: "51", label: "کل: بهای تمام‌شده", labelEn: "GL: COGS" },
    { id: "61", label: "کل: هزینه‌های عملیاتی", labelEn: "GL: Operating expenses" }
  ],
  kpis: {
    assets: 186400000,
    income: 42300000,
    expenses: 18750000,
    profit: 23550000
  },
  chart: {
    labelsFa: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور"],
    labelsEn: ["Far", "Ord", "Kho", "Tir", "Mor", "Sha"],
    income: [28, 31, 29, 36, 34, 42],
    cost: [16, 18, 17, 19, 18, 19]
  },
  reports: {
    bs: [
      { fa: "موجودی نقد", en: "Cash", val: 42000000 },
      { fa: "حساب‌های دریافتنی", en: "Receivables", val: 18500000 },
      { fa: "موجودی کالا", en: "Inventory", val: 25900000 },
      { fa: "دارایی ثابت (خالص)", en: "Net fixed assets", val: 100000000 },
      { fa: "بدهی جاری", en: "Current liabilities", val: -12400000 },
      { fa: "حقوق مالکانه", en: "Equity", val: -174000000 }
    ],
    pnl: [
      { fa: "فروش خالص", en: "Net sales", val: 42300000 },
      { fa: "بهای تمام‌شده", en: "COGS", val: -12100000 },
      { fa: "هزینه اجاره", en: "Rent", val: -4000000 },
      { fa: "هزینه حقوق", en: "Payroll", val: -2650000 },
      { fa: "سود خالص", en: "Net profit", val: 23550000 }
    ]
  }
};

window.HesyFmt = {
  money(n) {
    const lang = window.HesyI18n.getLang();
    const cur = window.HesyState.settings.currency === "toman" ? n / 10 : n;
    const formatted = new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(Math.round(cur));
    const suffix = lang === "fa"
      ? (window.HesyState.settings.currency === "toman" ? " تومان" : " ریال")
      : (window.HesyState.settings.currency === "toman" ? " Toman" : " Rial");
    return formatted + suffix;
  },
  num(n) {
    const lang = window.HesyI18n.getLang();
    return new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(n);
  },
  customer(c) {
    return window.HesyI18n.getLang() === "fa" ? c.name : c.nameEn;
  },
  productName(p) {
    return window.HesyI18n.getLang() === "fa" ? p.name : p.nameEn;
  }
};

window.hesyToast = function (msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
};
