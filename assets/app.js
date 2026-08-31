/* ============================================================
   ALFAR — Cerámica Artesanal · Motor de la web
   ============================================================ */

var LANG = document.documentElement.lang === "en" ? "en" : "es";

/* Datos del negocio (demo) */
window.SITE = {
  phone: "+34659463296",
  phoneDisplay: "659 46 32 96",
  whatsapp: "34659463296",
  /* Horario semanal. 0=domingo…6=sábado. Minutos desde medianoche. [] = cerrado. */
  schedule: {
    0: [],
    1: [],
    2: [[630, 840], [990, 1200]],
    3: [[630, 840], [990, 1200]],
    4: [[630, 840], [990, 1200]],
    5: [[630, 840], [990, 1200]],
    6: [[630, 870]]
  }
};

var DAYS = {
  es: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};

/* ---------------- ABIERTO / CERRADO ---------------- */
function fmtTime(min) {
  min = ((min % 1440) + 1440) % 1440;
  var h = Math.floor(min / 60), m = min % 60;
  return (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);
}

function computeStatus(now) {
  var sched = window.SITE.schedule;
  var day = now.getDay();
  var mins = now.getHours() * 60 + now.getMinutes();
  var today = sched[day] || [];
  for (var i = 0; i < today.length; i++) {
    if (mins >= today[i][0] && mins < today[i][1]) return { open: true, closeAt: today[i][1] };
  }
  for (var j = 0; j < today.length; j++) {
    if (today[j][0] > mins) return { open: false, dayIndex: day, openMin: today[j][0], daysAhead: 0 };
  }
  for (var d = 1; d <= 7; d++) {
    var idx = (day + d) % 7;
    var ranges = sched[idx] || [];
    if (ranges.length) return { open: false, dayIndex: idx, openMin: ranges[0][0], daysAhead: d };
  }
  return { open: false, dayIndex: null };
}

function statusLabel(s) {
  if (s.open) {
    return {
      open: true,
      main: LANG === "en" ? "Open now" : "Abierto ahora",
      sub: (LANG === "en" ? "Closes at " : "Cierra a las ") + fmtTime(s.closeAt)
    };
  }
  var sub = "";
  if (s.dayIndex !== null) {
    if (s.daysAhead === 0) sub = (LANG === "en" ? "Opens today at " : "Abre hoy a las ") + fmtTime(s.openMin);
    else if (s.daysAhead === 1) sub = (LANG === "en" ? "Opens tomorrow at " : "Abre mañana a las ") + fmtTime(s.openMin);
    else sub = (LANG === "en" ? "Opens " : "Abre el ") + DAYS[LANG][s.dayIndex] + (LANG === "en" ? " at " : " a las ") + fmtTime(s.openMin);
  }
  return { open: false, main: LANG === "en" ? "Closed" : "Cerrado", sub: sub };
}

function updateStatus() {
  var el = document.getElementById("openStatus");
  if (!el) return;
  var lbl = statusLabel(computeStatus(new Date()));
  el.classList.toggle("is-open", lbl.open);
  el.classList.toggle("is-closed", !lbl.open);
  var m = el.querySelector(".st-main"), s = el.querySelector(".st-sub");
  if (m) m.textContent = lbl.main;
  if (s) s.textContent = lbl.sub;
}

/* ---------------- WHATSAPP ---------------- */
function initWhatsApp() {
  var wa = document.getElementById("waFab");
  if (!wa || !window.SITE.whatsapp) return;
  var msg = LANG === "en"
    ? "Hi! I'd like some information about ALFAR."
    : "¡Hola! Me gustaría información sobre ALFAR.";
  wa.setAttribute("href", "https://wa.me/" + window.SITE.whatsapp + "?text=" + encodeURIComponent(msg));
  wa.setAttribute("target", "_blank");
  wa.setAttribute("rel", "noopener");
}

/* ---------------- NAV: scroll state + burger ---------------- */
function initNav() {
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 40); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("no-scroll", open);
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        burger.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("no-scroll");
      });
    });
  }
}

/* ---------------- REVEAL (Intersection Observer) ---------------- */
function initReveal() {
  var targets = document.querySelectorAll(".reveal, .reveal-scale, .reveal-left, .reveal-right");
  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
  targets.forEach(function (el, i) {
    el.style.transitionDelay = (Math.min(i % 4, 3) * 90) + "ms";
    obs.observe(el);
  });
}

/* ---------------- CONTADORES ---------------- */
function initCounters() {
  var els = document.querySelectorAll("[data-counter]");
  if (!els.length) return;
  var run = function (el) {
    var target = parseFloat(el.getAttribute("data-counter"));
    var decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1600;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)).toString().replace(".", ",") + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? target.toFixed(decimals) : target).toString().replace(".", ",") + suffix;
    }
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  els.forEach(function (el) { obs.observe(el); });
}

/* ---------------- PARALLAX ---------------- */
function initParallax() {
  var els = document.querySelectorAll("[data-parallax]");
  if (!els.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var run = function () {
    var y = window.scrollY;
    els.forEach(function (el) {
      var sp = parseFloat(el.getAttribute("data-parallax")) || 0.15;
      el.style.transform = "translate3d(0," + (y * sp * -1) + "px,0)";
    });
  };
  run();
  window.addEventListener("scroll", run, { passive: true });
}

/* ---------------- HERO VÍDEO EN BUCLE CONTINUO ---------------- */
function initHeroVideo() {
  var video = document.getElementById("heroVideo");
  if (!video) return;

  video.muted = true;
  video.loop = true;
  video.setAttribute("playsinline", "");
  video.preload = "auto";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return; // se queda quieto en el fotograma del poster
  }

  var p = video.play();
  if (p && p.catch) p.catch(function () {});
}

/* ---------------- FILTROS DE PRODUCTO ---------------- */
function initFilters() {
  var tabs = document.querySelectorAll("[data-filter]");
  var cards = document.querySelectorAll("[data-cat]");
  if (!tabs.length || !cards.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      tab.classList.add("active");
      var val = tab.getAttribute("data-filter");
      cards.forEach(function (card) {
        var show = val === "all" || card.getAttribute("data-cat") === val;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

/* ---------------- FORMULARIO DE CONTACTO ---------------- */
function initForm() {
  var form = document.getElementById("contactForm");
  if (!form) return;
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = document.getElementById("formSuccess");
    if (ok) ok.classList.add("show");
    form.reset();
  });
}

/* ---------------- ARRANQUE ---------------- */
document.addEventListener("DOMContentLoaded", function () {
  initNav();
  initReveal();
  initCounters();
  initParallax();
  initHeroVideo();
  initFilters();
  initForm();
  initWhatsApp();
  updateStatus();
  setInterval(updateStatus, 30000);
});
