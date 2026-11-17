// Shared helpers for the Kartly Test Lab pages.
(function () {
  var TOPICS = [
    ["lab-forms.html", "Forms and inputs", "Validation, masks, disabled and read-only fields, selects, custom dropdowns, switches, date and range inputs.", ["forms", "validation", "inputs"]],
    ["lab-alerts.html", "Alerts, dialogs and overlays", "JS alert, confirm and prompt, native dialog, toasts, cookie banner, blocking overlays.", ["alerts", "dialogs", "overlay"]],
    ["lab-frames.html", "Frames and Shadow DOM", "Iframes, nested iframes, named frames, open and closed shadow roots, slots.", ["iframe", "shadow-dom"]],
    ["lab-windows.html", "Windows, tabs and navigation", "New tab, popup window, history API, hash changes, title changes, multi-tab messages.", ["windows", "tabs", "history"]],
    ["lab-dynamic.html", "Dynamic content and waits", "Delayed elements, disappearing elements, random IDs, stale elements, spinners, flaky actions.", ["waits", "dynamic", "flaky"]],
    ["lab-tables.html", "Tables, lists and scrolling", "Sorting, filtering, pagination, inline edit, sticky headers, infinite scroll, colspan and rowspan.", ["tables", "pagination", "scroll"]],
    ["lab-mouse.html", "Mouse, keyboard and clipboard", "Hover, double and right click, drag and drop, long press, key events, shortcuts, copy and paste.", ["mouse", "keyboard", "dnd"]],
    ["lab-files.html", "Files: upload and download", "Single and multiple upload, drag-drop zone, image preview, generated downloads.", ["upload", "download"]],
    ["lab-storage.html", "Cookies and storage", "Cookies with expiry, local and session storage, IndexedDB, session expiry timer.", ["cookies", "storage", "session"]],
    ["lab-network.html", "Network and console", "200, 404 and slow responses, timeouts, retries, offline mode, console errors, uncaught exceptions.", ["network", "console", "errors"]],
    ["lab-visual.html", "Visual and media", "Broken and lazy images, canvas, SVG, animations, carousel, overlapping elements, text edge cases.", ["visual", "canvas", "svg"]],
    ["lab-a11y.html", "Accessibility and display", "Landmarks, ARIA live, tabs and accordion patterns, focus trap, dark mode, RTL, text size.", ["a11y", "i18n", "themes"]],
    ["lab-auth.html", "Authentication scenarios", "Locked and slow users, random failures, MFA code, session timeout, captcha-style challenge.", ["auth", "mfa", "session"]],
    ["index.html", "Store flow", "Search, filter, sort, product page, cart, coupons, multi-step checkout, orders.", ["e-commerce", "checkout"]]
  ];

  var L = window.Lab = {
    topics: TOPICS,
    $: function (s, r) { return (r || document).querySelector(s); },
    $$: function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); },
    log: function (id, msg) { var el = document.getElementById(id); if (!el) return; el.textContent += (el.textContent ? "\n" : "") + new Date().toLocaleTimeString() + "  " + msg; el.scrollTop = el.scrollHeight; },
    set: function (id, msg, cls) { var el = document.getElementById(id); if (!el) return; el.textContent = msg; el.className = "result" + (cls ? " " + cls : ""); },
    toast: function (msg, ms) {
      var t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.setAttribute("data-testid", "toast"); t.textContent = msg;
      document.body.appendChild(t); setTimeout(function () { t.remove(); }, ms || 3000);
    },
    sleep: function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); },
    prefs: function () {
      try {
        var p = JSON.parse(localStorage.getItem("kartly_prefs") || "{}");
        if (p.dark) document.body.classList.add("dark");
        if (p.hc) document.body.classList.add("hc");
        if (p.nomotion) document.body.classList.add("nomotion");
        if (p.big) document.body.classList.add("big-text");
        if (p.rtl) document.documentElement.setAttribute("dir", "rtl");
      } catch (e) {}
    },
    savePref: function (k, v) { try { var p = JSON.parse(localStorage.getItem("kartly_prefs") || "{}"); p[k] = v; localStorage.setItem("kartly_prefs", JSON.stringify(p)); } catch (e) {} }
  };
  document.addEventListener("DOMContentLoaded", L.prefs);
  if (document.readyState !== "loading") L.prefs();
})();
