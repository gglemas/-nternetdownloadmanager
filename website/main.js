// Mister Download Manager — site behaviour: light/dark, the download for your system, the
// split button's menu, the "What do you download?" chips and the rotating hello.
(function () {
  "use strict";
  var root = document.documentElement;
  // Words for people in the page's language: a translated page carries its own (MDM_I18N,
  // tools/website/sitei18n.py); English otherwise. Every such string goes through t().
  var I18N = window.MDM_I18N || {};
  function t(s) { return I18N[s] || s; }
  // Visitors who asked for less motion get every moving part at rest: the race at its finish,
  // the tour still, the hello on its first word.
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function each(selector, fn) {
    var els = document.querySelectorAll(selector);
    for (var i = 0; i < els.length; i++) fn(els[i]);
  }

  // ---- The crew's names ------------------------------------------------------------------------
  // A contributor's login shows over their photo on hover and focus (styles.css .face-name); at
  // the start or end of a row it slides back inside the list rather than run out of the sheet.
  function nudge(e) {
    var face = e.target && e.target.closest ? e.target.closest(".face") : null;
    var name = face && face.querySelector(".face-name");
    var list = face && face.closest(".faces");
    if (!name || !list) return;
    name.style.setProperty("--nudge", "0px");
    var r = name.getBoundingClientRect();
    var box = list.getBoundingClientRect();
    var shift = r.left < box.left ? box.left - r.left : r.right > box.right ? box.right - r.right : 0;
    name.style.setProperty("--nudge", shift + "px");
  }
  document.addEventListener("pointerover", nudge);
  document.addEventListener("focusin", nudge);

  // ---- Your language ---------------------------------------------------------------------------
  // An English page offers its copy in the visitor's language once (the first language the
  // browser asks for, unless that is English), in that language's words (the language menu's
  // data-offer/-yes/-no, sitei18n.py). Picking a language, or No, is remembered.
  (function () {
    var links = document.querySelectorAll(".lang-pick a[hreflang]");
    if (!links.length) return;
    function remember(code) { try { localStorage.setItem("mdm-lang", code); } catch (e) { /* asked again */ } }
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () { remember(this.getAttribute("hreflang")); });
    }
    var chosen = null;
    try { chosen = localStorage.getItem("mdm-lang"); } catch (e) { /* none */ }
    if (chosen || (root.getAttribute("lang") || "en").toLowerCase() !== "en") return;
    var wanted = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    var match = null;
    for (var w = 0; w < wanted.length && !match; w++) {
      var tag = String(wanted[w]).toLowerCase();
      var base = tag.split("-")[0];
      if (base === "en") return;
      // Chinese: only the simplified script's places; Portuguese: Brazil's copy for every place.
      if (base === "zh" && /-(tw|hk|mo|hant)/.test(tag)) continue;
      for (var k = 0; k < links.length; k++) {
        var h = links[k].getAttribute("hreflang").toLowerCase();
        if (h !== "en" && h.split("-")[0] === base) { match = links[k]; break; }
      }
    }
    if (!match || !match.getAttribute("data-offer")) return;
    var bar = document.createElement("div");
    bar.className = "lang-offer";
    bar.setAttribute("role", "region");
    bar.setAttribute("lang", match.getAttribute("hreflang"));
    if (/^(ar|fa)/.test(match.getAttribute("hreflang"))) bar.setAttribute("dir", "rtl");
    var p = document.createElement("p");
    p.textContent = match.getAttribute("data-offer");
    var yes = document.createElement("a");
    yes.className = "btn btn-primary";
    yes.href = match.getAttribute("href");
    yes.className = "btn btn-line";
    yes.textContent = match.getAttribute("data-yes") + " · " + match.querySelector("span").textContent;
    yes.addEventListener("click", function () { remember(match.getAttribute("hreflang")); });
    var no = document.createElement("button");
    no.type = "button";
    no.className = "btn btn-ghost";
    no.style.boxShadow = "none";
    no.textContent = match.getAttribute("data-no");
    no.addEventListener("click", function () { remember("en"); bar.parentNode.removeChild(bar); });
    bar.appendChild(p);
    bar.appendChild(yes);
    bar.appendChild(no);
    document.body.appendChild(bar);
  })();

  // ---- The language picker: a dialog over the page ------------------------------------------
  // The header's button opens it (without scripts it is a link to the languages page). The
  // browser's own modal dialog keeps the focus inside and closes on Escape; a click on the
  // backdrop closes it too, and the focus goes back to the button.
  each("[data-lang-open]", function (btn) {
    var dialog = btn.parentNode.querySelector(".lang-dialog");
    if (!dialog || typeof dialog.showModal !== "function") return;
    btn.setAttribute("role", "button");
    function open(e) {
      e.preventDefault();
      dialog.showModal();
      root.classList.add("dialog-on");
      var cur = dialog.querySelector("[aria-current]");
      if (cur) cur.focus();
    }
    btn.addEventListener("click", open);
    btn.addEventListener("keydown", function (e) { if (e.key === " ") open(e); });
    dialog.addEventListener("close", function () { root.classList.remove("dialog-on"); btn.focus(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.querySelector("[data-lang-close]").addEventListener("click", function () { dialog.close(); });
  });

  // ---- Light / dark ------------------------------------------------------------------------
  // The page follows the system until the visitor picks; the pick is remembered.
  var media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  function current() {
    var t = root.getAttribute("data-theme");
    if (t === "light" || t === "dark") return t;
    return media && media.matches ? "dark" : "light";
  }
  each(".theme", function (button) {
    button.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mdm-theme", next); } catch (e) { /* not remembered */ }
    });
  });

  // ---- The split button's menu: one open at a time, closed by a click elsewhere or Escape ----
  each(".split-more, .menu", function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) each(".split-more, .menu", function (o) { if (o !== d) o.open = false; });
    });
  });
  document.addEventListener("click", function (e) {
    each(".split-more[open], .menu[open]", function (d) { if (!d.contains(e.target)) d.open = false; });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") each(".split-more[open], .menu[open]", function (d) { d.open = false; d.querySelector("summary").focus(); });
  });

  // ---- Hello in the app's languages: each word written in, its chip lit -----------------------
  var stage = document.querySelector("[data-hello]");
  if (stage && !reduce) {
    var words = [["Hello", "en"], ["مرحبا", "ar"], ["Bonjour", "fr"], ["Hallo", "de"], ["Hola", "es"],
      ["こんにちは", "ja"], ["Olá", "pt"], ["Привет", "ru"], ["नमस्ते", "hi"], ["Merhaba", "tr"], ["你好", "zh"]];
    var chips = document.querySelectorAll("[data-hello-chips] [lang]");
    var n = 0;
    setInterval(function () {
      var old = stage.querySelector('[data-pos="current"]');
      if (old) {
        old.setAttribute("data-pos", "past");
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 450);
      }
      n = (n + 1) % words.length;
      var word = document.createElement("span");
      word.className = "hello-word";
      word.setAttribute("data-pos", "current");
      word.setAttribute("lang", words[n][1]);
      word.textContent = words[n][0];
      stage.appendChild(word);
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].getAttribute("lang") === words[n][1]) chips[i].setAttribute("data-on", "");
        else chips[i].removeAttribute("data-on");
      }
    }, 2600);
  }

  // ---- Themes: every tile in its light or its dark side, and the prompt to copy -----------------
  // The tiles follow the site's light or dark at first; the switch shows them all in the other.
  (function () {
    var grid = document.querySelector("[data-variant-grid]");
    var bar = document.querySelector("[data-variant-switch]");
    if (!grid || !bar) return;
    var buttons = bar.querySelectorAll("button[data-variant]");
    function current() {
      var set = root.getAttribute("data-theme");
      if (set === "light" || set === "dark") return set;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    function show(v) {
      grid.setAttribute("data-variant", v);
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].setAttribute("aria-pressed", String(buttons[i].getAttribute("data-variant") === v));
      }
    }
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", function () { show(this.getAttribute("data-variant")); });
    }
    show(current());
    bar.hidden = false;
  })();

  each("[data-copy]", function (btn) {
    var src = document.getElementById(btn.getAttribute("data-copy"));
    var label = btn.querySelector("[data-copy-label]");
    if (!src || !label || !navigator.clipboard) return;
    var idle = label.textContent, timer = 0;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(src.textContent.trim() + "\n").then(function () {
        label.textContent = t("Copied");
      }, function () {
        label.textContent = t("Select the text and copy it");
      }).then(function () {
        clearTimeout(timer);
        timer = setTimeout(function () { label.textContent = idle; }, 2200);
      });
    });
  });

  // ---- Lightbox: any screenshot, big ----------------------------------------------------------
  // Images in [data-lightbox] groups (and every screenshot in a help article) open over the page
  // at their full resolution, fitted to the screen. Click or double-click switches to real pixels
  // (drag or scroll to look around, the wheel zooms), arrows and swipes go through the group,
  // Escape or the backdrop closes. The day or night version shown on the page is the one opened.
  (function () {
    function visible(img) { return img.offsetParent !== null || img.getClientRects().length > 0; }
    function groupOf(img) {
      var g = img.closest("[data-lightbox]") || img.closest(".prose");
      if (!g) return [img];
      return Array.prototype.filter.call(g.querySelectorAll("img"), function (i) {
        return !i.closest(".lb-skip") && (visible(i) || i === img) && i.naturalWidth > 120;
      });
    }
    function caption(img) {
      var fig = img.closest("figure");
      var cap = fig && fig.querySelector("figcaption");
      if (!cap) return img.alt || "";
      // "Title · what it shows" when the caption leads with a bold title.
      var b = cap.querySelector("b");
      var all = cap.textContent.replace(/\s+/g, " ").trim();
      if (!b) return all;
      var t = b.textContent.trim();
      return all.indexOf(t) === 0 && all.length > t.length ? t + " · " + all.slice(t.length).trim() : all;
    }
    var box, stage, pic, capEl, countEl, prevB, nextB, list = [], at = 0, zoomed = false, opener = null;
    var scale = 1, fit = 1, tx = 0, ty = 0, drag = null, moved = false;

    function build() {
      box = document.createElement("div");
      box.className = "lb";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", t("Image viewer"));
      box.innerHTML =
        '<div class="lb-stage"><img class="lb-pic" alt=""></div>' +
        '<div class="lb-bar"><span class="lb-count"></span><p class="lb-cap"></p>' +
        '<span class="lb-hint">' + t("Click to zoom · drag to move") + '</span>' +
        '<button type="button" class="lb-btn lb-close" aria-label="' + t("Close") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
        '<button type="button" class="lb-btn lb-nav lb-prev" aria-label="' + t("Previous image") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
        '<button type="button" class="lb-btn lb-nav lb-next" aria-label="' + t("Next image") + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>';
      document.body.appendChild(box);
      stage = box.querySelector(".lb-stage");
      pic = box.querySelector(".lb-pic");
      capEl = box.querySelector(".lb-cap");
      countEl = box.querySelector(".lb-count");
      prevB = box.querySelector(".lb-prev");
      nextB = box.querySelector(".lb-next");
      box.querySelector(".lb-close").addEventListener("click", close);
      prevB.addEventListener("click", function () { go(-1); });
      nextB.addEventListener("click", function () { go(1); });
      // The backdrop closes; the picture zooms.
      stage.addEventListener("click", function (e) {
        if (moved) { moved = false; return; }
        if (e.target !== pic) return close();
        zoomAt(zoomed ? null : e);
      });
      stage.addEventListener("wheel", function (e) {
        e.preventDefault();
        var r = pic.getBoundingClientRect();
        var k = Math.exp(-e.deltaY * 0.0015);
        var next = Math.max(fit, Math.min(4, scale * k));
        // Keep the point under the pointer where it is.
        var px = e.clientX - (r.left + r.width / 2), py = e.clientY - (r.top + r.height / 2);
        tx -= px * (next / scale - 1); ty -= py * (next / scale - 1);
        scale = next; zoomed = scale > fit * 1.01;
        if (!zoomed) { tx = ty = 0; }
        apply();
      }, { passive: false });
      stage.addEventListener("pointerdown", function (e) {
        if (e.target !== pic) return;
        drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, id: e.pointerId };
        moved = false;
      });
      window.addEventListener("pointermove", function (e) {
        if (!drag || drag.id !== e.pointerId) return;
        var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) moved = true;
        if (zoomed) { tx = drag.tx + dx; ty = drag.ty + dy; apply(); }
        else pic.style.transform = "translateX(" + dx + "px) scale(" + scale + ")";
      });
      window.addEventListener("pointerup", function (e) {
        if (!drag || drag.id !== e.pointerId) return;
        var dx = e.clientX - drag.x;
        drag = null;
        // A swipe at the fitted size goes to the next or previous image.
        if (!zoomed && moved && Math.abs(dx) > 60 && list.length > 1) go(dx < 0 ? 1 : -1);
        else apply();
      });
      // Keys work wherever the focus is while the viewer is open (a click on the picture moves it).
      document.addEventListener("keydown", function (e) {
        if (!box.classList.contains("open")) return;
        if (e.key === "Escape") { e.preventDefault(); close(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        else if (e.key === "+" || e.key === "=") zoomAt(null, true);
        else if (e.key === "-" || e.key === "0") { zoomed = false; scale = fit; tx = ty = 0; apply(); }
        else if (e.key === "Tab") {
          // Focus stays in the viewer.
          var f = box.querySelectorAll("button:not([hidden])");
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
      window.addEventListener("resize", function () { if (box.classList.contains("open")) measure(); });
    }
    // The fitted scale: the whole picture on screen, never larger than its real pixels.
    function measure() {
      var w = pic.naturalWidth, h = pic.naturalHeight;
      if (!w) return;
      var room = stage.getBoundingClientRect();
      // Shown at the size the page gives it in CSS pixels (its width attribute, which
      // tools/website/screens.py keeps true): a 2x picture at half its pixels, a 1x one at its
      // own. A help page's pictures have no width: their pixels are CSS pixels.
      var css = +pic.getAttribute("data-w");
      var real = css ? css / w : 1;
      pic.style.width = w * real + "px";
      pic.style.height = h * real + "px";
      fit = Math.min(1, (room.width - 48) / (w * real), (room.height - 32) / (h * real));
      if (!zoomed) { scale = fit; tx = ty = 0; }
      apply();
    }
    function apply() {
      pic.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      box.classList.toggle("zoomed", zoomed);
    }
    function zoomAt(e, keys) {
      if (zoomed && !keys) { zoomed = false; scale = fit; tx = ty = 0; return apply(); }
      var target = Math.max(1, fit * 2);
      if (e) {
        var r = pic.getBoundingClientRect();
        var px = e.clientX - (r.left + r.width / 2), py = e.clientY - (r.top + r.height / 2);
        tx = -px * (target / scale - 1); ty = -py * (target / scale - 1);
      }
      scale = target; zoomed = true;
      apply();
    }
    function show() {
      var img = list[at];
      zoomed = false; tx = ty = 0;
      box.classList.add("loading");
      pic.onload = function () { box.classList.remove("loading"); measure(); };
      pic.src = img.currentSrc || img.src;
      pic.alt = img.alt || "";
      pic.setAttribute("data-w", img.getAttribute("width") || "");
      capEl.textContent = caption(img);
      countEl.textContent = list.length > 1 ? (at + 1) + " / " + list.length : "";
      prevB.hidden = nextB.hidden = list.length < 2;
      if (pic.complete && pic.naturalWidth) { box.classList.remove("loading"); measure(); }
    }
    function go(d) {
      if (list.length < 2) return;
      at = (at + d + list.length) % list.length;
      show();
    }
    function open(img) {
      if (!box) build();
      opener = img;
      list = groupOf(img);
      at = Math.max(0, list.indexOf(img));
      document.documentElement.classList.add("lb-on");
      box.classList.add("open");
      show();
      box.querySelector(".lb-close").focus();
    }
    function close() {
      box.classList.remove("open", "zoomed");
      document.documentElement.classList.remove("lb-on");
      if (opener) opener.focus({ preventScroll: true });
    }
    // Every image that opens: clickable, focusable, announced as a button.
    each("[data-lightbox] img, .prose img", function (img) {
      if (img.closest(".lb-skip") || img.closest("a")) return;
      img.classList.add("lb-zoomable");
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", (img.alt || "Screenshot") + " (open larger)");
      img.addEventListener("click", function () { open(img); });
      img.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(img); }
      });
    });
  })();

  // ---- The tour: the app one window at a time -----------------------------------------------
  // A tablist of features beside a stage whose panels share one spot and crossfade. While it is
  // on screen it moves on every DWELL ms by itself, the chosen tab's line filling up to show when
  // (--p, from the time spent, so a pause holds it exactly where it was). A pointer over the tour
  // or the focus inside it holds it; choosing a tab (click, Enter, arrows, a swipe) or opening a
  // picture stops it for good, as someone reading shouldn't have it change under them. Panels
  // left behind stay laid out, only faded, inert and hidden from screen readers: the stage keeps
  // its height, and the lightbox still goes through every picture. Never on its own with reduced
  // motion (`reduce`, the hello's).
  each("[data-tour]", function (tour) {
    var DWELL = 6000;
    var list = tour.querySelector('[role="tablist"]');
    var stage = tour.querySelector(".tour-stage");
    var tabs = list.querySelectorAll('[role="tab"]');
    var panels = [];
    for (var i = 0; i < tabs.length; i++) panels.push(document.getElementById(tabs[i].getAttribute("aria-controls")));
    var at = 0, auto = !reduce, seen = !("IntersectionObserver" in window), over = false, inside = false;
    var spent = 0, last = 0, frame = 0;

    function select(k) {
      at = (k + tabs.length) % tabs.length;
      for (var i = 0; i < tabs.length; i++) {
        var on = i === at;
        tabs[i].setAttribute("aria-selected", on ? "true" : "false");
        tabs[i].tabIndex = on ? 0 : -1;
        tabs[i].style.setProperty("--p", "0");
        if (on) { panels[i].setAttribute("data-on", ""); panels[i].removeAttribute("aria-hidden"); }
        else { panels[i].removeAttribute("data-on"); panels[i].setAttribute("aria-hidden", "true"); }
        panels[i].inert = !on;
      }
      spent = 0;
      // On a phone the tabs are a row of chips that scrolls: bring the chosen one into it (the
      // row only, never the page).
      if (list.scrollWidth > list.clientWidth + 1) {
        var r = list.getBoundingClientRect(), t = tabs[at].getBoundingClientRect();
        var by = t.left + t.width / 2 - (r.left + r.width / 2);
        if (list.scrollBy) list.scrollBy({ left: by, behavior: reduce ? "auto" : "smooth" });
        else list.scrollLeft += by;
      }
    }
    function running() { return auto && seen && !over && !inside && !document.hidden; }
    function tick(now) {
      frame = 0;
      if (!running()) { last = 0; return; }
      if (last) spent += now - last;
      last = now;
      if (spent >= DWELL) select(at + 1);
      tabs[at].style.setProperty("--p", Math.min(1, spent / DWELL).toFixed(4));
      frame = requestAnimationFrame(tick);
    }
    function wake() { if (running() && !frame) { last = 0; frame = requestAnimationFrame(tick); } }
    function stop() {
      auto = false;
      tour.classList.remove("is-auto");
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
    function choose(k, focus) {
      stop();
      select(k);
      if (focus) tabs[at].focus();
    }

    for (var j = 0; j < tabs.length; j++) {
      (function (k) { tabs[k].addEventListener("click", function () { choose(k); }); })(j);
    }
    // Arrows go through the tabs whichever way they're laid out (a column, or a row on a phone).
    list.addEventListener("keydown", function (e) {
      var k = { ArrowDown: at + 1, ArrowRight: at + 1, ArrowUp: at - 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (k === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      choose(k, true);
    });
    var narrow = window.matchMedia ? window.matchMedia("(max-width: 820px)") : null;
    function orient() { list.setAttribute("aria-orientation", narrow && narrow.matches ? "horizontal" : "vertical"); }
    orient();
    if (narrow && narrow.addEventListener) narrow.addEventListener("change", orient);

    // Held while a mouse is over it (a touch has no hover to end) or the focus is in it.
    tour.addEventListener("pointerenter", function (e) { if (e.pointerType !== "touch") { over = true; } });
    tour.addEventListener("pointerleave", function (e) { if (e.pointerType !== "touch") { over = false; wake(); } });
    tour.addEventListener("focusin", function () { inside = true; });
    tour.addEventListener("focusout", function (e) { inside = !!(e.relatedTarget && tour.contains(e.relatedTarget)); wake(); });
    document.addEventListener("visibilitychange", function () { last = 0; wake(); });
    // A picture opened in the lightbox: the tour stays on it, so closing comes back to it.
    stage.addEventListener("click", stop);
    stage.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") stop(); });
    // A sideways swipe on the stage goes to the next or previous feature (touch-action: pan-y
    // leaves the vertical one to the page).
    var swipe = null;
    stage.addEventListener("pointerdown", function (e) {
      swipe = e.pointerType === "touch" ? { x: e.clientX, y: e.clientY, id: e.pointerId } : null;
    });
    stage.addEventListener("pointerup", function (e) {
      if (!swipe || swipe.id !== e.pointerId) return;
      var dx = e.clientX - swipe.x, dy = e.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(at + (dx < 0 ? 1 : -1));
    });
    stage.addEventListener("pointercancel", function () { swipe = null; });

    select(0);
    if (auto) tour.classList.add("is-auto");
    // Only while it's on screen: nobody misses a feature that went by out of sight.
    if (!seen) {
      new IntersectionObserver(function (es) {
        seen = es[es.length - 1].isIntersecting;
        if (seen) wake();
      }, { threshold: 0.35 }).observe(tour);
    }
    wake();
  });

  // ---- Your system -------------------------------------------------------------------------
  // Each system's card (.os-card[data-os]) carries its main file and label; the download
  // buttons take the visitor's, and the cards mark it. Phones and tablets keep Windows and see
  // that it's a desktop app.
  function detect() {
    var uad = navigator.userAgentData;
    var platform = ((uad && uad.platform) || navigator.platform || "").toLowerCase();
    var ua = (navigator.userAgent || "").toLowerCase();
    if (/android|iphone|ipad|ipod|mobile/.test(ua) || (uad && uad.mobile)) return "mobile";
    // iPadOS reports a Mac; a touch screen gives it away.
    if (platform.indexOf("mac") === 0 && navigator.maxTouchPoints > 1) return "mobile";
    if (platform.indexOf("win") === 0 || ua.indexOf("windows") >= 0) return "windows";
    if (platform.indexOf("mac") === 0 || ua.indexOf("mac os") >= 0) return "macos";
    if (/linux|x11|cros|bsd/.test(platform + " " + ua)) return "linux";
    return "windows";
  }

  var os = detect();
  if (os === "mobile") {
    each("[data-mobile-note]", function (el) { el.hidden = false; });
    return;
  }
  var card = document.querySelector('.os-card[data-os="' + os + '"]');
  each(".os-card", function (el) { el.classList.toggle("current", el === card); });
  if (!card) return;
  each("[data-os-cta]", function (el) { el.setAttribute("href", card.getAttribute("data-href")); });
  each("[data-os-cta-icon]", function (el) { el.setAttribute("href", "#os-" + os); });
  each("[data-os-label]", function (el) { el.textContent = card.getAttribute("data-label"); });
  // The detected system's card comes first.
  if (card.parentNode && card.parentNode.firstElementChild !== card) {
    card.parentNode.insertBefore(card, card.parentNode.firstElementChild);
  }
})();
