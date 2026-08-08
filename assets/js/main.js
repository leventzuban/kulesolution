/* ==========================================================================
   Kule Solution — site behaviour
   Language switching · mobile nav · scroll reveal · contact form
   ========================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     CONTACT FORM ENDPOINT
     Leave empty ("") and the form opens the visitor's mail app with the
     message pre-filled — works everywhere, needs no service.
     To receive submissions straight in your inbox instead, create a free
     key at https://web3forms.com (enter sales@kulesolution.com) and paste
     it below. See DEPLOY.md, step 6.
     ------------------------------------------------------------------ */
  var WEB3FORMS_KEY = "";
  var MAIL_TO = "sales@kulesolution.com";

  var LANGS = ["sq", "en", "tr"];
  var DEFAULT_LANG = "sq";
  var STORE_KEY = "kule-lang";

  var dict = window.KULE_I18N || {};

  /* ============================== i18n ============================== */

  function pickLang() {
    var q = new URLSearchParams(window.location.search).get("lang");
    if (q && LANGS.indexOf(q) !== -1) return q;

    var saved;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* private mode */ }
    if (saved && LANGS.indexOf(saved) !== -1) return saved;

    var nav = (navigator.language || "").slice(0, 2).toLowerCase();
    if (LANGS.indexOf(nav) !== -1) return nav;

    return DEFAULT_LANG;
  }

  function t(lang, key) {
    var table = dict[lang];
    if (table && Object.prototype.hasOwnProperty.call(table, key)) return table[key];
    var fallback = dict[DEFAULT_LANG];
    if (fallback && Object.prototype.hasOwnProperty.call(fallback, key)) return fallback[key];
    return null;
  }

  function applyLang(lang) {
    if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;

    document.documentElement.setAttribute("lang", lang);

    // Text nodes
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n"));
      if (v !== null) el.textContent = v;
    });

    // Values that legitimately contain markup (e.g. <br> in an address)
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(lang, el.getAttribute("data-i18n-html"));
      if (v !== null) el.innerHTML = v;
    });

    // Attributes
    [
      ["data-i18n-placeholder", "placeholder"],
      ["data-i18n-title", "title"],
      ["data-i18n-aria", "aria-label"],
      ["data-i18n-alt", "alt"],
      ["data-i18n-content", "content"]
    ].forEach(function (pair) {
      document.querySelectorAll("[" + pair[0] + "]").forEach(function (el) {
        var v = t(lang, el.getAttribute(pair[0]));
        if (v !== null) el.setAttribute(pair[1], v);
      });
    });

    // Document title
    var titleKey = document.documentElement.getAttribute("data-title-key");
    if (titleKey) {
      var tv = t(lang, titleKey);
      if (tv !== null) document.title = tv;
    }

    // Language switcher UI
    var label = document.querySelector("[data-lang-current]");
    if (label) label.textContent = lang.toUpperCase();
    document.querySelectorAll("[data-lang-opt]").forEach(function (btn) {
      var on = btn.getAttribute("data-lang-opt") === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-current", on ? "true" : "false");
    });

    // Keep ?lang= in the URL so the page can be shared in this language
    try {
      var url = new URL(window.location.href);
      if (lang === DEFAULT_LANG) url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
    } catch (e) { /* older browsers: skip */ }

    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }

    document.dispatchEvent(new CustomEvent("kule:langchange", { detail: { lang: lang } }));
  }

  function initLangSwitcher() {
    var box = document.querySelector("[data-lang]");
    if (!box) return;
    var btn = box.querySelector("[data-lang-toggle]");

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = box.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });

    box.querySelectorAll("[data-lang-opt]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        applyLang(opt.getAttribute("data-lang-opt"));
        box.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (!box.contains(e.target)) {
        box.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        box.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ============================ mobile nav ========================== */

  function initNav() {
    var burger = document.querySelector("[data-burger]");
    var nav = document.querySelector("[data-nav]");
    if (!burger || !nav) return;

    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 960) {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* =========================== header shadow ======================== */

  function initHeader() {
    var header = document.querySelector(".header");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------------------------------------------------------
     Scroll reveal used to live here, driven by an IntersectionObserver
     that toggled elements from opacity 0. That made JavaScript
     responsible for whether content was visible at all — and when the
     observer did not fire, the page rendered blank. It is now handled
     entirely in CSS (see `.reveal` in style.css), where the content
     starts visible and only browsers supporting scroll-driven
     animations opt into the effect. Do not reintroduce a JS version.
     --------------------------------------------------------------- */

  /* =========================== contact form ========================= */

  function initForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("[type=submit]");

    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = ok ? "#1E7A4B" : "#B4232A";
      status.style.marginTop = "14px";
      status.style.fontWeight = "600";
      status.style.fontSize = ".95rem";
    }

    var MSG = {
      sq: { sending: "Duke dërguar…", ok: "Faleminderit! Mesazhi u dërgua. Ju kthehemi së shpejti.", err: "Diçka shkoi keq. Provoni sërish ose na shkruani drejtpërdrejt në " + MAIL_TO, mail: "Po hapet programi juaj i e-mailit…" },
      en: { sending: "Sending…", ok: "Thank you! Your message has been sent. We will get back to you shortly.", err: "Something went wrong. Please try again or write to us directly at " + MAIL_TO, mail: "Opening your e-mail application…" },
      tr: { sending: "Gönderiliyor…", ok: "Teşekkürler! Mesajınız gönderildi. En kısa sürede dönüş yapacağız.", err: "Bir sorun oluştu. Tekrar deneyin ya da doğrudan " + MAIL_TO + " adresine yazın.", err2: "", mail: "E-posta uygulamanız açılıyor…" }
    };

    function msg(k) {
      var lang = document.documentElement.getAttribute("lang") || DEFAULT_LANG;
      return (MSG[lang] || MSG.sq)[k];
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var data = new FormData(form);
      var name = (data.get("name") || "").toString();
      var email = (data.get("email") || "").toString();
      var phone = (data.get("phone") || "").toString();
      var subject = (data.get("subject") || "").toString();
      var message = (data.get("message") || "").toString();

      /* --- no endpoint configured: fall back to the visitor's mail app --- */
      if (!WEB3FORMS_KEY) {
        var body =
          "Name: " + name + "\n" +
          "E-mail: " + email + "\n" +
          "Phone: " + phone + "\n" +
          "Subject: " + subject + "\n\n" +
          message;
        say(msg("mail"), true);
        window.location.href =
          "mailto:" + MAIL_TO +
          "?subject=" + encodeURIComponent("Web: " + subject + " — " + name) +
          "&body=" + encodeURIComponent(body);
        return;
      }

      /* --- endpoint configured: post it --- */
      say(msg("sending"), true);
      if (submit) submit.disabled = true;

      data.append("access_key", WEB3FORMS_KEY);
      data.append("from_name", "kulesolution.com");
      data.append("subject", "Web: " + subject + " — " + name);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.success) {
            form.reset();
            say(msg("ok"), true);
          } else {
            say(msg("err"), false);
          }
        })
        .catch(function () { say(msg("err"), false); })
        .finally(function () { if (submit) submit.disabled = false; });
    });
  }

  /* ============================== misc ============================== */

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================== boot ============================== */

  function boot() {
    applyLang(pickLang());
    initLangSwitcher();
    initNav();
    initHeader();
    initForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
