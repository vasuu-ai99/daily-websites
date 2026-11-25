/* ============================================================
   VASU PORTFOLIO — main.js
   Intro word-flash, custom cursor, menu overlay, hero name
   personalisation (in-memory for this visit), scroll effects.
   ============================================================ */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- intro: black overlay, huge red words flashing ---------- */
  var intro = document.getElementById("intro");
  var introWord = document.getElementById("introWord");
  var words = ["MONEY", "LIFE", "CODE", "DESIGN", "DREAMS", "VASU"];
  document.documentElement.classList.add("locked");

  function endIntro() {
    if (!intro || intro.classList.contains("done")) return;
    intro.classList.add("done");
    document.documentElement.classList.remove("locked");
    setTimeout(function () { intro.style.display = "none"; }, 950);
  }
  if (intro && introWord) {
    if (reduced) {
      introWord.textContent = "VASU";
      setTimeout(endIntro, 500);
    } else {
      var i = 0;
      introWord.textContent = words[0];
      var tick = setInterval(function () {
        i++;
        if (i >= words.length) {
          clearInterval(tick);
          setTimeout(endIntro, 260);
          return;
        }
        // restart the pop animation for each word
        introWord.style.animation = "none";
        void introWord.offsetWidth;
        introWord.style.animation = "";
        introWord.textContent = words[i];
      }, 330);
      // safety: never trap the visitor behind the intro
      setTimeout(endIntro, 3600);
    }
    intro.addEventListener("click", endIntro);
    var skip = document.getElementById("introSkip");
    if (skip) skip.addEventListener("click", function (e) { e.stopPropagation(); endIntro(); });
  } else {
    document.documentElement.classList.remove("locked");
  }

  /* ---------- custom cursor: red dot ---------- */
  var dot = document.querySelector(".cursor-dot");
  if (dot && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    document.addEventListener("mousemove", function (e) {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a,button,input,.service-list li")) dot.classList.add("big");
      else dot.classList.remove("big");
    });
  }

  /* ---------- announcement marquee close ---------- */
  var bar = document.getElementById("marqueeBar");
  var closeBar = document.getElementById("marqueeClose");
  if (closeBar && bar) closeBar.addEventListener("click", function () { bar.classList.add("hidden"); });

  /* ---------- menu overlay ---------- */
  var menuBtn = document.getElementById("menuBtn");
  var overlay = document.getElementById("menuOverlay");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (overlay) {
      if (open) { overlay.removeAttribute("inert"); overlay.setAttribute("aria-hidden", "false"); }
      else { overlay.setAttribute("inert", ""); overlay.setAttribute("aria-hidden", "true"); }
    }
    document.documentElement.classList.toggle("locked", open);
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- page-transition wipe + close menu on nav ---------- */
  var wipe = document.getElementById("wipe");
  document.querySelectorAll("[data-wipe]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href") || "";
      setMenu(false);
      if (reduced || !wipe) return;
      if (href.charAt(0) === "#") {
        e.preventDefault();
        wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go");
        setTimeout(function () {
          var t = document.querySelector(href);
          if (t) t.scrollIntoView({ behavior: "smooth" });
        }, 380);
      } else if (href.indexOf("http") === 0) {
        e.preventDefault();
        wipe.classList.remove("go"); void wipe.offsetWidth; wipe.classList.add("go");
        setTimeout(function () { window.open(href, "_blank", "noopener"); }, 420);
      }
    });
  });

  /* ---------- hero name personalisation (this visit only) ---------- */
  var slot = document.getElementById("nameSlot");
  if (slot) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "name-btn";
    btn.setAttribute("aria-label", "type your first name to personalise the greeting");
    btn.innerHTML = '<span class="brace">{{</span> type your first name <span class="brace">}}</span>';
    slot.appendChild(btn);

    function showButton(label) {
      slot.innerHTML = "";
      btn.innerHTML = label;
      slot.appendChild(btn);
    }
    btn.addEventListener("click", function () {
      var input = document.createElement("input");
      input.className = "name-input";
      input.type = "text";
      input.maxLength = 14;
      input.setAttribute("aria-label", "your first name");
      input.placeholder = "your name";
      slot.innerHTML = "";
      slot.appendChild(input);
      input.focus();
      function commit() {
        var name = input.value.trim().replace(/\s+/g, " ");
        if (name) {
          slot.innerHTML = "";
          var span = document.createElement("span");
          span.className = "name-display";
          span.textContent = name.toUpperCase();
          slot.appendChild(span);
          showButtonAfter(span, name);
        } else {
          showButton('<span class="brace">{{</span> type your first name <span class="brace">}}</span>');
        }
      }
      input.addEventListener("blur", commit);
      input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); input.blur(); } });
      function showButtonAfter(displaySpan, name) {
        // keep the big name in the headline; add a small "change" control under the hero kicker
        var change = document.getElementById("changeName");
        if (change) {
          change.hidden = false;
          change.textContent = "change your name, " + name.toLowerCase();
          change.onclick = function () { btn.click(); };
        }
      }
    });
  }

  /* ---------- scroll: reveal + services blur/unblur ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  var serviceItems = document.querySelectorAll(".service-list li");
  function sweep() {
    var vh = window.innerHeight || 800;
    revealEls.forEach(function (el) {
      if (el.classList.contains("in")) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 1.05 && r.bottom > -60) el.classList.add("in");
    });
  }
  if ("IntersectionObserver" in window && !reduced) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); ro.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px 12% 0px" });
    revealEls.forEach(function (el) { ro.observe(el); });
    // belt & braces: also sweep on scroll and on a short timer, so content
    // is never stuck offset if observer callbacks are throttled
    var sweepTick = setInterval(sweep, 700);
    setTimeout(function () { clearInterval(sweepTick); }, 12000);
    window.addEventListener("scroll", sweep, { passive: true });
    setTimeout(sweep, 300); setTimeout(sweep, 1600); setTimeout(sweep, 3200);

    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) en.target.classList.add("sharp");
        else en.target.classList.remove("sharp");
      });
    }, { rootMargin: "-38% 0px -38% 0px", threshold: 0 });
    serviceItems.forEach(function (li) { so.observe(li); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
    serviceItems.forEach(function (li) { li.classList.add("sharp"); });
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
