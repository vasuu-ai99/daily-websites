/* ============ Lusion clone — main.js ============ */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var lerp = function (a, b, t) { return a + (b - a) * t; };

  /* ---------- Preloader ---------- */
  var pre = $("#preloader"), preCount = $("#preCount"), preFill = $("#preBarFill");
  var digits = preCount ? $$("span", preCount) : [];
  function setCount(n) {
    var s = ("00" + n).slice(-3);
    for (var i = 0; i < 3; i++) if (digits[i]) digits[i].textContent = s[i];
    if (preFill) preFill.style.width = n + "%";
  }
  var startT = null, PRE_MS = 1700, preFinished = false;
  /* Hard fallback: the preloader must be gone no later than 3s after this
     script runs, even if requestAnimationFrame stalls (throttled/hidden tab)
     or an asset never resolves. The normal 000→100 count stays the fast path. */
  var preFallback = setTimeout(forcePreload, 3000);
  function preStep(ts) {
    if (preFinished) return;
    if (!startT) startT = ts;
    var t = clamp((ts - startT) / PRE_MS, 0, 1);
    var eased = 1 - Math.pow(1 - t, 3);
    setCount(Math.round(eased * 100));
    if (t < 1) requestAnimationFrame(preStep);
    else finishPreload();
  }
  function hidePreloader() {
    if (pre) { pre.classList.add("done"); pre.style.pointerEvents = "none"; }
    document.body.classList.add("loaded");
    setTimeout(function () { if (pre && pre.parentNode) pre.parentNode.removeChild(pre); }, 900);
  }
  function finishPreload() {
    if (preFinished) return;
    preFinished = true;
    clearTimeout(preFallback);
    setCount(100);
    setTimeout(hidePreloader, 250);
  }
  function forcePreload() {
    if (preFinished) return;
    preFinished = true;
    setCount(100);
    hidePreloader();
  }
  window.addEventListener("load", function () { setTimeout(forcePreload, 3000); });
  if (pre) requestAnimationFrame(preStep); else { preFinished = true; clearTimeout(preFallback); document.body.classList.add("loaded"); }

  /* ---------- Split-letter headings ---------- */
  function splitLetters(el) {
    var delay = 0;
    function process(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w";
            part.split("").forEach(function (chr) {
              var s = document.createElement("span"); s.className = "ch";
              s.textContent = chr; s.style.transitionDelay = (delay * 28) + "ms"; delay++;
              w.appendChild(s);
            });
            frag.appendChild(w);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          process(child);
        }
      });
    }
    process(el);
  }
  $$(".split").forEach(splitLetters);
  /* hero lines: wrap text in a sliding span */
  $$(".hero-title .line").forEach(function (line, i) {
    var span = document.createElement("span");
    span.textContent = line.textContent; span.style.transitionDelay = (0.15 + i * 0.13) + "s";
    line.textContent = ""; line.appendChild(span);
  });

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.18 });
  $$(".split, .reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Featured work cards ---------- */
  function svgWrap(inner, bg) {
    return '<svg viewBox="0 0 800 580" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      (bg ? '<rect width="800" height="580" fill="' + bg + '"/>' : "") + inner + "</svg>";
  }
  var ART = [
    // Oryzo AI — desk scene
    svgWrap('<rect width="800" height="580" fill="#e7dfca"/>' +
      '<g fill="#cbbfa3">' + (function(){var s="";for(var y=40;y<560;y+=52)for(var x=40;x<760;x+=52)s+='<circle cx="'+x+'" cy="'+y+'" r="5"/>';return s;})() + "</g>" +
      '<rect x="90" y="330" width="430" height="170" rx="26" fill="#2e7d4f"/>' +
      '<g fill="#57a773">' + (function(){var s="";for(var r=0;r<3;r++)for(var c=0;c<9;c++)s+='<rect x="'+(115+c*44)+'" y="'+(355+r*44)+'" width="34" height="34" rx="8"/>';return s;})() + "</g>" +
      '<circle cx="640" cy="180" r="86" fill="#fff"/><circle cx="640" cy="180" r="62" fill="#6f4e37"/><circle cx="640" cy="180" r="62" fill="none" stroke="#54382a" stroke-width="6" stroke-dasharray="10 14"/>' +
      '<path d="M120 150 q60-52 120 0 q-14 44-60 44 q-46 0-60-44z" fill="#23232a"/><rect x="238" y="128" width="26" height="12" rx="6" fill="#45454f"/><rect x="96" y="128" width="26" height="12" rx="6" fill="#45454f"/><circle cx="150" cy="152" r="9" fill="#ff5d5d"/><circle cx="212" cy="152" r="9" fill="#3ae0e6"/>'),
    // Atlas Motion — painted sky
    svgWrap('<defs><linearGradient id="skyA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7db9f0"/><stop offset="1" stop-color="#dceefc"/></linearGradient></defs>' +
      '<rect width="800" height="580" fill="url(#skyA)"/>' +
      '<g fill="#ffffff" opacity="0.92"><ellipse cx="180" cy="150" rx="130" ry="44"/><ellipse cx="270" cy="128" rx="90" ry="38"/><ellipse cx="600" cy="240" rx="150" ry="48"/><ellipse cx="520" cy="410" rx="180" ry="52"/><ellipse cx="660" cy="430" rx="110" ry="40"/></g>' +
      '<g fill="#eef6fd" opacity="0.8"><ellipse cx="380" cy="330" rx="120" ry="36"/><ellipse cx="120" cy="470" rx="140" ry="42"/></g>' +
      '<text x="400" y="305" text-anchor="middle" font-family="Archivo, Arial" font-weight="900" font-size="86" letter-spacing="14" fill="#ffffff">ATLAS</text>'),
    // Devin AI — dark product UI
    svgWrap('<rect width="800" height="580" fill="#0d1117"/>' +
      '<rect x="80" y="70" width="640" height="440" rx="18" fill="#151b26"/>' +
      '<rect x="80" y="70" width="640" height="52" rx="18" fill="#1d2534"/><circle cx="112" cy="96" r="8" fill="#ff5f57"/><circle cx="140" cy="96" r="8" fill="#febc2e"/><circle cx="168" cy="96" r="8" fill="#28c840"/>' +
      '<rect x="104" y="150" width="130" height="330" rx="10" fill="#11161f"/>' +
      '<g fill="#2c3648"><rect x="122" y="172" width="94" height="12" rx="6"/><rect x="122" y="200" width="70" height="12" rx="6"/><rect x="122" y="228" width="86" height="12" rx="6"/><rect x="122" y="256" width="58" height="12" rx="6"/></g>' +
      '<text x="262" y="196" font-family="Archivo, Arial" font-weight="700" font-size="30" fill="#e8ecf4">Devin is a collaborative</text>' +
      '<text x="262" y="234" font-family="Archivo, Arial" font-weight="700" font-size="30" fill="#e8ecf4">AI teammate</text>' +
      '<g><rect x="262" y="280" width="300" height="13" rx="6" fill="#3b82f6"/><rect x="262" y="312" width="380" height="13" rx="6" fill="#334155"/><rect x="262" y="344" width="240" height="13" rx="6" fill="#a78bfa"/><rect x="262" y="376" width="330" height="13" rx="6" fill="#334155"/><rect x="262" y="408" width="180" height="13" rx="6" fill="#34d399"/></g>'),
    // Of The Oak — dark forest
    svgWrap('<rect width="800" height="580" fill="#0c1a12"/>' +
      '<defs><radialGradient id="oakGlow" cx="0.5" cy="0.34" r="0.55"><stop offset="0" stop-color="#2e5d3a" stop-opacity="0.9"/><stop offset="1" stop-color="#0c1a12" stop-opacity="0"/></radialGradient></defs>' +
      '<rect width="800" height="580" fill="url(#oakGlow)"/>' +
      '<path d="M392 580 C396 470 388 420 372 340 L360 260 L388 268 L398 210 L410 268 L442 252 L428 344 C416 424 410 480 414 580 Z" fill="#1d130b"/>' +
      '<g fill="#1d4023"><circle cx="400" cy="180" r="118"/><circle cx="300" cy="220" r="84"/><circle cx="505" cy="215" r="90"/><circle cx="352" cy="118" r="76"/><circle cx="462" cy="112" r="70"/></g>' +
      '<g fill="#2c5a33"><circle cx="372" cy="150" r="66"/><circle cx="470" cy="180" r="54"/><circle cx="300" cy="190" r="44"/></g>' +
      '<g fill="#7fae6d"><circle cx="330" cy="140" r="7"/><circle cx="452" cy="120" r="6"/><circle cx="505" cy="230" r="7"/><circle cx="286" cy="238" r="6"/><circle cx="410" cy="88" r="5"/></g>' +
      '<ellipse cx="400" cy="566" rx="330" ry="26" fill="#12291a"/>'),
    // Everswap — painted mountains
    svgWrap('<defs><linearGradient id="evSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5db2f5"/><stop offset="1" stop-color="#bfe3fd"/></linearGradient></defs>' +
      '<rect width="800" height="580" fill="url(#evSky)"/><circle cx="648" cy="104" r="46" fill="#fff3b0"/>' +
      '<path d="M0 420 L170 210 L300 350 L430 170 L580 360 L690 250 L800 380 L800 580 L0 580 Z" fill="#2f7a44"/>' +
      '<path d="M430 170 L478 236 L452 252 L430 224 L408 250 L384 232 Z" fill="#ffffff"/>' +
      '<path d="M170 210 L206 258 L184 272 L168 248 L150 268 L132 254 Z" fill="#ffffff"/>' +
      '<path d="M0 580 L0 470 Q 220 420 430 478 T 800 470 L800 580 Z" fill="#256b38"/>'),
    // Porsche: Dream Machine — flower mound on dusty pink
    svgWrap('<rect width="800" height="580" fill="#d9a79e"/>' +
      '<ellipse cx="400" cy="470" rx="300" ry="105" fill="#7a5b43"/>' +
      '<g stroke="#5d4630" stroke-width="5" stroke-linecap="round"><path d="M300 440 C290 380 270 350 240 320"/><path d="M420 430 C430 370 460 340 500 318"/><path d="M380 445 C375 395 385 360 372 322"/></g>' +
      '<g><circle cx="240" cy="312" r="27" fill="#ff5d5d"/><circle cx="500" cy="308" r="30" fill="#ffd166"/><circle cx="372" cy="312" r="24" fill="#ff8fab"/><circle cx="318" cy="356" r="20" fill="#c77dff"/><circle cx="452" cy="362" r="21" fill="#ff7b54"/><circle cx="398" cy="392" r="17" fill="#ffe66d"/><circle cx="262" cy="398" r="15" fill="#f4f1de"/><circle cx="540" cy="392" r="16" fill="#e63946"/><circle cx="352" cy="272" r="16" fill="#ffb703"/></g>' +
      '<g fill="#fff"><circle cx="240" cy="312" r="8"/><circle cx="500" cy="308" r="9"/><circle cx="372" cy="312" r="7"/><circle cx="452" cy="362" r="6"/></g>'),
    // Synthetic Human — translucent figures
    svgWrap('<rect width="800" height="580" fill="#cfc6f2"/>' +
      '<defs><linearGradient id="figA" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7aa5ff" stop-opacity="0.85"/><stop offset="1" stop-color="#5a3fd4" stop-opacity="0.55"/></linearGradient>' +
      '<linearGradient id="figB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c39bff" stop-opacity="0.8"/><stop offset="1" stop-color="#7b2ff7" stop-opacity="0.45"/></linearGradient></defs>' +
      '<g><circle cx="330" cy="128" r="42" fill="url(#figA)"/><path d="M330 178 c-40 0-58 34-58 84 l0 130 c0 16 24 16 24 0 l0-104 12 0 4 150 c1 18 30 18 30 0 l-2-140 8 0 6 140 c2 18 30 16 29 0 l-6-150 12 0 2 104 c1 16 24 14 24-2 l-4-128 c-3-50-28-84-81-84z" fill="url(#figA)"/></g>' +
      '<g opacity="0.85"><circle cx="492" cy="160" r="34" fill="url(#figB)"/><path d="M492 202 c-32 0-47 28-47 68 l0 106 c0 13 20 13 20 0 l0-84 10 0 3 122 c1 15 25 15 24 0 l-1-114 7 0 5 114 c1 15 24 13 23 0 l-5-122 10 0 2 84 c0 13 19 12 19-1 l-3-104 c-3-41-23-69-67-69z" fill="url(#figB)"/></g>' +
      '<ellipse cx="400" cy="530" rx="260" ry="18" fill="#b3a6e8"/>'),
    // Meta: Spatial Fusion — VR + crystals
    svgWrap('<rect width="800" height="580" fill="#0d0a24"/>' +
      '<g fill="#ffffff"><circle cx="90" cy="70" r="2.4"/><circle cx="220" cy="130" r="1.8"/><circle cx="700" cy="90" r="2.2"/><circle cx="620" cy="180" r="1.6"/><circle cx="140" cy="300" r="1.7"/><circle cx="730" cy="330" r="2"/></g>' +
      '<g><path d="M150 420 L205 300 L252 420 L200 462 Z" fill="#8b5cf6"/><path d="M205 300 L200 462 L252 420 Z" fill="#6d28d9"/><path d="M610 160 L652 84 L694 160 L650 196 Z" fill="#c084fc"/><path d="M652 84 L650 196 L694 160 Z" fill="#a855f7"/><path d="M636 452 L668 392 L700 452 L666 480 Z" fill="#7c3aed"/></g>' +
      '<rect x="252" y="216" width="296" height="128" rx="62" fill="#1b1440" stroke="#8b5cf6" stroke-width="4"/>' +
      '<rect x="282" y="248" width="236" height="64" rx="32" fill="#2a1e5e"/>' +
      '<path d="M252 262 C190 250 168 286 176 330" fill="none" stroke="#8b5cf6" stroke-width="10" stroke-linecap="round"/>' +
      '<path d="M548 262 C610 250 632 286 624 330" fill="none" stroke="#8b5cf6" stroke-width="10" stroke-linecap="round"/>' +
      '<circle cx="356" cy="280" r="10" fill="#3ae0e6"/><circle cx="444" cy="280" r="10" fill="#ff5d8f"/>'),
    // Spaace — starry night
    svgWrap('<rect width="800" height="580" fill="#070d2b"/>' +
      '<g fill="#ffffff">' + (function(){var s="";var pts=[[60,60],[150,180],[250,70],[340,140],[470,60],[560,150],[680,80],[740,220],[110,300],[700,330],[420,220],[40,430],[760,470],[200,470],[600,440]];pts.forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(1.4+(p[0]%3))+'"/>';});return s;})() + "</g>" +
      '<defs><radialGradient id="spaGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ff8c1a" stop-opacity="0.5"/><stop offset="1" stop-color="#ff8c1a" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="400" cy="290" r="230" fill="url(#spaGlow)"/>' +
      '<text x="400" y="322" text-anchor="middle" font-family="Archivo, Arial" font-weight="900" font-size="104" fill="#ff8c1a" style="text-shadow:0 0 34px #ff8c1a">spaace</text>'),
    // DDD 2024 — fuzzy purple D
    svgWrap('<rect width="800" height="580" fill="#0d2b33"/>' +
      '<defs><filter id="fuzz" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="13"/></filter></defs>' +
      '<text x="330" y="440" text-anchor="middle" font-family="Archivo, Arial" font-weight="900" font-size="430" fill="#8b46e8" filter="url(#fuzz)">D</text>' +
      '<text x="330" y="440" text-anchor="middle" font-family="Archivo, Arial" font-weight="900" font-size="430" fill="#9d5cff">D</text>' +
      '<text x="586" y="212" font-family="Archivo, Arial" font-weight="800" font-size="54" fill="#3ae0e6">Fall 2024</text>' +
      '<text x="586" y="262" font-family="Archivo, Arial" font-weight="700" font-size="21" letter-spacing="3" fill="#bfeef2">DIGITAL</text>' +
      '<text x="586" y="292" font-family="Archivo, Arial" font-weight="700" font-size="21" letter-spacing="3" fill="#bfeef2">DESIGN DAYS</text>'),
    // Choo Choo World — pastel hills + rainbow coaster
    svgWrap('<rect width="800" height="580" fill="#cdeffd"/>' +
      '<path d="M0 380 Q 200 290 420 366 T 800 350 L800 580 L0 580 Z" fill="#9ed99a"/>' +
      '<path d="M0 470 Q 260 400 520 460 T 800 450 L800 580 L0 580 Z" fill="#6fc76a"/>' +
      '<g fill="none" stroke-linecap="round"><path d="M60 400 Q 400 130 740 380" stroke="#ff5d5d" stroke-width="15"/><path d="M60 424 Q 400 154 740 404" stroke="#ffb703" stroke-width="15"/><path d="M60 448 Q 400 178 740 428" stroke="#3a86ff" stroke-width="15"/></g>' +
      '<g stroke="#8a6d4b" stroke-width="7"><path d="M210 330 L204 420"/><path d="M400 268 L400 372"/><path d="M590 322 L598 424"/></g>' +
      '<g transform="translate(352 196) rotate(4)"><rect x="0" y="0" width="96" height="44" rx="10" fill="#ff5d8f"/><rect x="14" y="-20" width="40" height="24" rx="6" fill="#3a86ff"/><rect x="104" y="8" width="62" height="36" rx="9" fill="#ffd166"/><circle cx="24" cy="48" r="11" fill="#333"/><circle cx="76" cy="48" r="11" fill="#333"/><circle cx="140" cy="48" r="10" fill="#333"/></g>' +
      '<g fill="#ffffff"><ellipse cx="130" cy="90" rx="70" ry="24"/><ellipse cx="660" cy="80" rx="84" ry="26"/></g>'),
    // Soda Experience — bottle on red
    svgWrap('<rect width="800" height="580" fill="#d90429"/>' +
      '<circle cx="400" cy="290" r="215" fill="#ef233c"/>' +
      '<g><path d="M376 96 h48 v54 c26 14 40 34 40 66 v238 c0 26-20 42-64 42 s-64-16-64-42 V216 c0-32 14-52 40-66 z" fill="#17130f"/>' +
      '<rect x="372" y="76" width="56" height="24" rx="5" fill="#c0c4cc"/>' +
      '<path d="M356 240 c0-14 10-22 22-22 v200 c-12 0-22-8-22-22 z" fill="#ffffff" opacity="0.22"/>' +
      '<rect x="352" y="300" width="96" height="66" rx="8" fill="#f5f0e6"/>' +
      '<text x="400" y="344" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="34" fill="#d90429">Soda</text></g>' +
      '<g><path d="M566 330 h104 l-12 130 c-1 14-12 22-40 22 s-39-8-40-22 z" fill="#ffffff" opacity="0.28"/><path d="M566 356 h104 l-3 34 H569 z" fill="#5c1a0e" opacity="0.85"/></g>')
  ];
  var PROJECTS = [
    { t: "Oryzo AI", tags: "CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION" },
    { t: "Atlas Motion", tags: "CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION" },
    { t: "Devin AI", tags: "WEB • DESIGN • DEVELOPMENT • 3D" },
    { t: "Of The Oak", tags: "WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION" },
    { t: "Everswap", tags: "CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION" },
    { t: "Porsche: Dream Machine", tags: "CONCEPT • 3D ILLUSTRATION • MOGRAPH • VIDEO" },
    { t: "Synthetic Human", tags: "WEB • DESIGN • DEVELOPMENT • 3D" },
    { t: "Meta: Spatial Fusion", tags: "WEB • DESIGN • DEVELOPMENT • 3D" },
    { t: "Spaace - NFT Marketplace", tags: "WEB • DESIGN • DEVELOPMENT • 3D • WEB3" },
    { t: "DDD 2024", tags: "WEB • DESIGN • DEVELOPMENT • 3D" },
    { t: "Choo Choo World", tags: "CONCEPT • WEB • GAME DESIGN • 3D" },
    { t: "Soda Experience", tags: "AR • DEVELOPMENT • 3D" }
  ];
  var grid = $("#workGrid");
  if (grid) {
    grid.innerHTML = PROJECTS.map(function (p, i) {
      return '<article class="card reveal"><div class="card-art">' + ART[i] + "</div>" +
        '<p class="card-tags">' + p.tags + "</p>" +
        '<h3 class="card-title">' + p.t + "</h3></article>";
    }).join("");
    $$(".card", grid).forEach(function (el) { io.observe(el); });
  }

  /* ---------- Header inversion on dark sections ---------- */
  var header = $("#siteHeader");
  var darkSections = $$("[data-theme='dark']");
  function checkHeader() {
    var inv = false;
    darkSections.forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top <= 70 && r.bottom >= 70) inv = true;
    });
    header.classList.toggle("inverted", inv);
  }

  /* ---------- Menu overlay ---------- */
  var menuBtn = $("#menuBtn"), menuOverlay = $("#menuOverlay"), menuLabel = $("#menuLabel");
  var menuOpen = false;
  function setMenu(open) {
    menuOpen = open;
    menuOverlay.classList.toggle("open", open);
    menuOverlay.setAttribute("aria-hidden", open ? "false" : "true");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuLabel.textContent = open ? "CLOSE" : "MENU";
    if (open) { header.classList.add("menu-open"); }
    else { setTimeout(function () { if (!menuOpen) header.classList.remove("menu-open"); }, 500); }
    document.body.classList.toggle("locked", open);
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { setMenu(!menuOpen); });
  $$(".menu-link", menuOverlay).forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  /* ---------- Page-transition loader (visual nod, no navigation) ---------- */
  var loader = $("#transitionLoader");
  function flashLoader(ms) {
    if (!loader) return;
    loader.classList.add("show");
    setTimeout(function () { loader.classList.remove("show"); }, ms || 650);
  }
  var nextStrip = $(".next-strip");
  if (nextStrip) nextStrip.addEventListener("click", function () { flashLoader(700); });

  /* ---------- Newsletter forms ---------- */
  $$("[data-news-form]").forEach(function (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var input = $("input", form);
      if (input && input.value && input.value.indexOf("@") > 0) {
        var wrap = form.parentNode, done = $(".news-done", wrap);
        if (done) done.hidden = false;
        form.reset();
      } else if (input) { input.focus(); }
    });
  });

  /* ---------- Back to top ---------- */
  var toTop = $("#toTop");
  if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- FX toggle + liquid iridescent trail ---------- */
  var fxBtn = $("#fxToggle"), trail = $("#trailCanvas"), tctx = trail.getContext("2d");
  var fxOn = false, trailPts = [];
  function sizeTrail() { trail.width = window.innerWidth; trail.height = window.innerHeight; }
  sizeTrail();
  if (fxBtn) fxBtn.addEventListener("click", function () {
    fxOn = !fxOn;
    fxBtn.classList.toggle("active", fxOn);
    fxBtn.setAttribute("aria-pressed", fxOn ? "true" : "false");
    document.body.classList.toggle("fx-on", fxOn);
    if (!fxOn) { trailPts = []; tctx.clearRect(0, 0, trail.width, trail.height); }
  });
  window.addEventListener("pointermove", function (e) {
    if (!fxOn) return;
    trailPts.push({ x: e.clientX, y: e.clientY, life: 1 });
    if (trailPts.length > 42) trailPts.shift();
  });
  function drawTrail(t) {
    if (!fxOn || trailPts.length < 2) return;
    tctx.clearRect(0, 0, trail.width, trail.height);
    tctx.lineCap = "round"; tctx.lineJoin = "round";
    for (var pass = 0; pass < 2; pass++) {
      for (var i = 1; i < trailPts.length; i++) {
        var p = trailPts[i], q = trailPts[i - 1];
        var hue = (t / 14 + i * 9) % 360;
        tctx.strokeStyle = "hsla(" + hue + ", 95%, 62%, " + (p.life * (pass ? 0.5 : 0.22)) + ")";
        tctx.lineWidth = (pass ? 9 : 26) * p.life + 1;
        tctx.beginPath(); tctx.moveTo(q.x, q.y); tctx.lineTo(p.x, p.y); tctx.stroke();
      }
    }
    trailPts.forEach(function (p) { p.life -= 0.016; });
    trailPts = trailPts.filter(function (p) { return p.life > 0.02; });
    if (!trailPts.length) tctx.clearRect(0, 0, trail.width, trail.height);
  }

  /* ---------- Scroll-drawn arcs ---------- */
  function prepArc(path) {
    if (!path) return 0;
    var len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = len;
    return len;
  }
  var bluePath = $("#arcBluePath"), cyanPath = $("#arcCyanPath");
  var blueLen = prepArc(bluePath), cyanLen = prepArc(cyanPath);
  function arcProgress(section) {
    if (!section) return 0;
    var r = section.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh * 0.92 - r.top) / (vh * 0.75), 0, 1);
  }
  function drawArcs() {
    if (bluePath) bluePath.style.strokeDashoffset = blueLen * (1 - arcProgress($(".intro")));
    if (cyanPath) cyanPath.style.strokeDashoffset = cyanLen * (1 - arcProgress($(".immersive")));
  }

  /* ---------- Hero: Three.js tumbling jacks ---------- */
  var heroVisible = true, mouseX = 0, mouseY = 0;
  (function initHero() { try {
    var canvas = $("#heroCanvas");
    /* If the Three.js CDN failed, THREE is undefined: skip WebGL entirely.
       The canvas keeps its black stage and no page content depends on this. */
    if (!canvas || typeof THREE === "undefined") return;
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(5, 8, 7); scene.add(key);
    var rimB = new THREE.DirectionalLight(0x4d6bff, 1.1); rimB.position.set(-7, -3, 4); scene.add(rimB);
    var rimW = new THREE.DirectionalLight(0xffffff, 0.7); rimW.position.set(0, -6, -4); scene.add(rimW);

    function makeJack(color) {
      var mat = new THREE.MeshPhysicalMaterial({ color: color, roughness: 0.22, metalness: 0.08, clearcoat: 1, clearcoatRoughness: 0.25 });
      var g = new THREE.Group();
      var armGeo = new THREE.CylinderGeometry(0.17, 0.17, 2.5, 20);
      var capGeo = new THREE.SphereGeometry(0.3, 20, 16);
      var holeMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.6 });
      [[0, 0, 0], [Math.PI / 2, 0, 0], [0, 0, Math.PI / 2]].forEach(function (rot) {
        var arm = new THREE.Mesh(armGeo, mat);
        arm.rotation.set(rot[0], rot[1], rot[2]); g.add(arm);
      });
      var dirs = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
      dirs.forEach(function (d) {
        var cap = new THREE.Mesh(capGeo, mat);
        cap.position.set(d[0] * 1.25, d[1] * 1.25, d[2] * 1.25); g.add(cap);
        var hole = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 14), holeMat);
        hole.position.set(d[0] * 1.52, d[1] * 1.52, d[2] * 1.52);
        hole.rotation.z = d[0] !== 0 ? Math.PI / 2 : 0;
        hole.rotation.x = d[2] !== 0 ? Math.PI / 2 : 0;
        g.add(hole);
      });
      var hub = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 16), mat); g.add(hub);
      return g;
    }
    var colors = [0xffffff, 0x14151a, 0x2438FF, 0xc9ccd6, 0xffffff, 0x2438FF, 0x14151a, 0xdde0e8, 0xffffff, 0x2438FF, 0xc9ccd6, 0x14151a, 0xffffff, 0x2438FF];
    var pile = new THREE.Group(); scene.add(pile);
    var jacks = [];
    colors.forEach(function (c, i) {
      var j = makeJack(c);
      var ang = (i / colors.length) * Math.PI * 2;
      j.position.set(Math.cos(ang) * (1.4 + (i % 3) * 1.15), Math.sin(ang * 1.3) * 1.5 + (i % 2 ? 0.7 : -0.8), (i % 4) - 1.6);
      var s = 0.75 + (i % 4) * 0.16; j.scale.set(s, s, s);
      j.rotation.set(i * 0.7, i * 1.1, i * 0.4);
      j.userData = { rx: 0.0016 + (i % 5) * 0.0007, ry: 0.002 + (i % 4) * 0.0008, bob: i * 1.37, y0: j.position.y };
      pile.add(j); jacks.push(j);
    });
    function sizeHero() {
      var r = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(Math.max(2, r.width), Math.max(2, r.height), false);
      camera.aspect = r.width / r.height; camera.updateProjectionMatrix();
    }
    sizeHero();
    window.__heroRender = function (t) {
      if (!heroVisible) return;
      jacks.forEach(function (j) {
        j.rotation.x += j.userData.rx; j.rotation.y += j.userData.ry;
        j.position.y = j.userData.y0 + Math.sin(t / 1600 + j.userData.bob) * 0.22;
      });
      pile.rotation.y = Math.sin(t / 9000) * 0.16;
      var push = 12.6 - (Math.sin(t / 7000) * 0.5 + 0.5) * 2.1; /* slow push-in loop */
      camera.position.z = push;
      camera.position.x += ((mouseX * 1.1) - camera.position.x) * 0.04;
      camera.position.y += ((-mouseY * 0.7) - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    window.__heroResize = sizeHero;
    var heroIO = new IntersectionObserver(function (en) { heroVisible = en[0].isIntersecting; }, { threshold: 0.02 });
    heroIO.observe(canvas);
    window.addEventListener("pointermove", function (e) {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
  } catch (e) { /* WebGL hero unavailable — black stage remains, page content unaffected */ } })();

  /* ---------- Showreel canvas ---------- */
  var reelVisible = false, reelPlaying = false;
  (function initReel() {
    var cv = $("#reelCanvas"); if (!cv) return;
    var ctx = cv.getContext("2d");
    function size() {
      var r = cv.parentElement.getBoundingClientRect();
      cv.width = Math.max(2, r.width); cv.height = Math.max(2, r.height);
    }
    size(); window.__reelResize = size;
    var io = new IntersectionObserver(function (en) { reelVisible = en[0].isIntersecting; }, { threshold: 0.05 });
    io.observe(cv);
    function blob(x, y, r, c1, c2) {
      var g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    window.__reelRender = function (t) {
      if (!reelVisible) return;
      var W = cv.width, H = cv.height, tt = t / 1000;
      var scene = Math.floor(tt / 5) % 3, fade = Math.min(1, (tt % 5));
      var bg = ctx.createLinearGradient(0, 0, W, H);
      if (scene === 0) { bg.addColorStop(0, "#1d4ed8"); bg.addColorStop(1, "#38bdf8"); }
      else if (scene === 1) { bg.addColorStop(0, "#f3e7d3"); bg.addColorStop(1, "#e8c8c8"); }
      else { bg.addColorStop(0, "#c7bdf5"); bg.addColorStop(1, "#e3dcff"); }
      ctx.globalAlpha = 1; ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      ctx.globalAlpha = 0.35 + fade * 0.65;
      var s1 = Math.sin(tt * 0.7), s2 = Math.cos(tt * 0.55);
      if (scene === 0) {
        /* coral ribbon + white sphere */
        ctx.strokeStyle = "#ff5a3c"; ctx.lineWidth = H * 0.16; ctx.lineCap = "round";
        ctx.beginPath();
        for (var x = -20; x <= W + 20; x += 14) {
          var y = H * 0.55 + Math.sin(x / W * 4.4 + tt * 1.3) * H * 0.17;
          x === -20 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.strokeStyle = "rgba(255,120,90,.55)"; ctx.lineWidth = H * 0.07;
        ctx.beginPath();
        for (var x2 = -20; x2 <= W + 20; x2 += 14) {
          var y2 = H * 0.55 + Math.sin(x2 / W * 4.4 + tt * 1.3 + 0.5) * H * 0.17;
          x2 === -20 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
        }
        ctx.stroke();
        blob(W * (0.68 + s1 * 0.03), H * (0.34 + s2 * 0.03), H * 0.17, "#ffffff", "#cfd8ea");
      } else if (scene === 1) {
        blob(W * 0.3 + s1 * 26, H * 0.42, H * 0.3, "#ffb3d9", "#e35fa0");
        blob(W * 0.62 + s2 * 30, H * 0.55, H * 0.36, "#c9a7ff", "#7b4dff");
        blob(W * 0.8 + s1 * 18, H * 0.3, H * 0.2, "#ffd9a0", "#ff8a5c");
      } else {
        blob(W * 0.36 + s2 * 24, H * 0.46, H * 0.3, "#ffffff", "#a99ae8");
        blob(W * 0.66 + s1 * 26, H * 0.4, H * 0.24, "#8fd8ff", "#5a6cff");
        blob(W * 0.52, H * 0.68 + s2 * 14, H * 0.17, "#ffe3f1", "#c99ae8");
      }
      ctx.globalAlpha = 1;
    };
    var btn = $("#reelBtn"), note = $("#reelNote");
    if (btn) btn.addEventListener("click", function () {
      reelPlaying = !reelPlaying;
      if (note) { note.hidden = !reelPlaying; }
      btn.setAttribute("aria-label", reelPlaying ? "Reel playing" : "Watch reel");
    });
  })();

  /* ---------- Pinned CTA sequence ---------- */
  var cta = { p: 0, visible: false };
  (function initCTA() {
    var section = $("#ctaScroll"), cv = $("#ctaCanvas");
    if (!section || !cv) return;
    var ctx = cv.getContext("2d");
    var giant = $("#ctaGiant"), astro = $("#ctaAstro"), astro2 = $("#ctaAstro2"), stickers = $("#stickerWorld"),
        finalBox = $("#ctaFinal"), cont = $("#ctaContinue"), fill = $("#ctaProgressFill");
    var stickerEls = stickers ? $$(".sticker", stickers) : [];
    var easeOutBack = function (x) { var c = 1.70158, u = x - 1; return 1 + (c + 1) * u * u * u + c * u * u; };
    var stars = [];
    for (var i = 0; i < 190; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.7 + 0.4, tw: Math.random() * 6.28 });
    var dust = [];
    for (var di = 0; di < 90; di++) dust.push({ a: Math.random() * 6.2832, off: Math.random(), sp: 0.5 + Math.random() * 0.9, s: Math.random() * 2.2 + 0.6, hue: Math.floor(Math.random() * 360) });
    var streaks = [];
    for (var si = 0; si < 70; si++) streaks.push({ a: Math.random() * 6.2832, off: Math.random(), sp: 0.6 + Math.random() * 1.1 });
    function size() {
      var r = cv.parentElement.getBoundingClientRect();
      cv.width = Math.max(2, r.width); cv.height = Math.max(2, r.height);
    }
    size(); window.__ctaResize = size;
    var io = new IntersectionObserver(function (en) { cta.visible = en[0].isIntersecting; }, { threshold: 0 });
    io.observe(section);

    function updateProgress() {
      var r = section.getBoundingClientRect();
      var total = section.offsetHeight - window.innerHeight;
      cta.p = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
      if (fill) fill.style.height = (cta.p * 100) + "%";
      var p = cta.p;
      /* giant headline sweep */
      if (giant) {
        var gw = giant.scrollWidth || 2000, W = window.innerWidth;
        var t = clamp((p - 0.03) / 0.55, 0, 1);
        var x = lerp(W * 0.55, -gw - W * 0.1, t);
        giant.style.transform = "translateY(-50%) translateX(" + x + "px)";
        giant.style.opacity = p > 0.62 ? String(clamp(1 - (p - 0.62) / 0.07, 0, 1)) : "1";
      }
      /* astronaut choreography — forward flight through the worlds */
      if (astro) {
        var sc = 1, ax = 0, ay = 0, op = 1, rot = 0;
        if (p < 0.14) { sc = lerp(1, 0.82, p / 0.14); rot = Math.sin(p * 40) * 1.6; }
        else if (p < 0.32) { sc = lerp(0.82, 0.42, (p - 0.14) / 0.18); rot = Math.sin(p * 30) * 3 - 2; ax = -3; }
        else if (p < 0.54) { sc = lerp(0.42, 0.3, (p - 0.32) / 0.22); ax = 14; ay = 8; rot = -5 + Math.sin(p * 46) * 2; }
        else if (p < 0.66) { op = p < 0.57 ? 1 - (p - 0.54) / 0.03 : (p - 0.6) / 0.06; op = clamp(op, 0, 1); sc = 0.55; }
        else if (p < 0.86) { sc = lerp(0.55, 1.02, (p - 0.66) / 0.2); rot = Math.sin(p * 34) * 2.4; }
        else { var wp = (p - 0.86) / 0.14; sc = lerp(1.02, 1.45, wp); rot = Math.sin(wp * 9.4) * 6.5; }
        astro.style.transform = "translate(calc(-50% + " + ax + "vw), calc(-50% + " + ay + "vh)) scale(" + sc + ") rotate(" + rot + "deg)";
        astro.style.opacity = String(op);
        astro.classList.toggle("waving", p > 0.855);
      }
      /* second astronaut: passes close and fast, diagonally across the bottom-right, mid-tunnel */
      if (astro2) {
        var t2 = clamp((p - 0.37) / 0.17, 0, 1);
        var a2o = clamp(t2 / 0.14, 0, 1) * clamp((1 - t2) / 0.16, 0, 1);
        astro2.style.transform = "translate(calc(-50% + " + lerp(46, -34, t2) + "vw), calc(-50% + " + lerp(30, -30, t2) + "vh)) scale(" + lerp(0.55, 1.85, t2 * t2) + ") rotate(" + lerp(-16, 9, t2) + "deg)";
        astro2.style.opacity = String(a2o);
      }
      if (stickers) {
        stickers.style.opacity = String(clamp((p - 0.84) / 0.07, 0, 1));
        stickers.style.transform = "translateY(" + (clamp((p - 0.9) / 0.1, 0, 1) * -26) + "px)";
        stickerEls.forEach(function (el, i) {
          var pt = clamp((p - (0.845 + i * 0.011)) / 0.028, 0, 1);
          el.style.setProperty("--pop", String(easeOutBack(pt).toFixed(3)));
        });
      }
      if (finalBox) {
        var fo = clamp((p - 0.87) / 0.08, 0, 1);
        finalBox.style.opacity = String(fo);
        finalBox.classList.toggle("show", fo > 0.6);
      }
      if (cont) cont.style.opacity = String(clamp(1 - (p - 0.78) / 0.08, 0, 1));
    }
    window.__ctaUpdate = updateProgress;
    updateProgress();

    function drawRing(cx, cy, R, alpha) {
      /* soft chromatic halo behind the ring */
      var halo = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R * 1.55);
      halo.addColorStop(0, "rgba(255,0,120,0)");
      halo.addColorStop(0.72, "rgba(255,140,0," + (0.22 * alpha) + ")");
      halo.addColorStop(0.86, "rgba(60,120,255," + (0.17 * alpha) + ")");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(cx - R * 1.55, cy - R * 1.55, R * 3.1, R * 3.1);
      /* horizontal lens flare through the centre */
      var fl = ctx.createLinearGradient(cx - R * 1.6, cy, cx + R * 1.6, cy);
      fl.addColorStop(0, "rgba(0,229,255,0)");
      fl.addColorStop(0.5, "rgba(255,255,255," + (0.55 * alpha) + ")");
      fl.addColorStop(1, "rgba(255,0,150,0)");
      ctx.fillStyle = fl;
      ctx.fillRect(cx - R * 1.6, cy - Math.max(1.5, R * 0.012), R * 3.2, Math.max(3, R * 0.024));
      /* chromatic ghost rings, slightly offset magenta / cyan */
      ctx.lineWidth = Math.max(3, R * 0.045);
      ctx.globalAlpha = alpha * 0.5; ctx.strokeStyle = "#ff2fb3";
      ctx.beginPath(); ctx.arc(cx - R * 0.02, cy, R, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = "#22d3ee";
      ctx.beginPath(); ctx.arc(cx + R * 0.02, cy, R, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
      if (typeof ctx.createConicGradient === "function") {
        var g = ctx.createConicGradient(0, cx, cy);
        g.addColorStop(0, "#ff004c"); g.addColorStop(0.2, "#ff8a00"); g.addColorStop(0.4, "#ffee00");
        g.addColorStop(0.6, "#00e676"); g.addColorStop(0.8, "#2979ff"); g.addColorStop(1, "#ff004c");
        ctx.strokeStyle = g;
      } else ctx.strokeStyle = "#ff5d8f";
      ctx.globalAlpha = alpha; ctx.lineWidth = Math.max(6, R * 0.09);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = alpha * 0.35; ctx.lineWidth = Math.max(14, R * 0.3);
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    window.__ctaRender = function (t) {
      if (!cta.visible) return;
      var W = cv.width, H = cv.height, p = cta.p, cx = W / 2, cy = H / 2;
      ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
      /* blue corridor: concentric white rings + glowing doorways on royal blue */
      if (p > 0.64 && p < 0.88) {
        var ca = clamp((p - 0.64) / 0.05, 0, 1) * clamp((0.88 - p) / 0.04, 0, 1);
        ctx.fillStyle = "rgba(24,44,235," + (0.96 * ca) + ")"; ctx.fillRect(0, 0, W, H);
        var maxR = Math.max(W, H) * 0.72;
        for (var k = 0; k < 9; k++) {
          var f = ((k / 9) + (t / 2400) % (1 / 9)) % 1;
          var cr = lerp(14, maxR, f * f);
          ctx.strokeStyle = "rgba(255,255,255," + ((0.15 + 0.85 * f) * ca) + ")";
          ctx.lineWidth = 1.5 + f * 6;
          ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 6.2832); ctx.stroke();
        }
        for (var k2 = 0; k2 < 6; k2++) {
          var f3 = ((k2 / 6) + (t / 2100) % (1 / 6)) % 1;
          var rw = lerp(40, W * 0.85, f3 * f3), rh = lerp(28, H * 0.85, f3 * f3);
          ctx.strokeStyle = "rgba(160,200,255," + (0.35 * ca * (0.3 + f3)) + ")";
          ctx.lineWidth = 10 + f3 * 16;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cx - rw / 2, cy - rh / 2, rw, rh, 30); else ctx.rect(cx - rw / 2, cy - rh / 2, rw, rh);
          ctx.stroke();
          ctx.strokeStyle = "rgba(255,255,255," + (0.9 * ca) + ")";
          ctx.lineWidth = 2 + f3 * 5;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(cx - rw / 2, cy - rh / 2, rw, rh, 30); else ctx.rect(cx - rw / 2, cy - rh / 2, rw, rh);
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255," + (0.9 * ca) + ")";
        ctx.beginPath(); ctx.arc(cx, cy, 5 + Math.sin(t / 300) * 2, 0, 6.2832); ctx.fill();
      }
      /* starfield */
      ctx.fillStyle = "#fff";
      stars.forEach(function (s) {
        ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + s.tw));
        var sx = s.x * W, sy = s.y * H;
        if (p > 0.3 && p < 0.55) { var d = (p - 0.3) / 0.25; sx = cx + (sx - cx) * (1 + d * 0.7); sy = cy + (sy - cy) * (1 + d * 0.7); }
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, 6.2832); ctx.fill();
      });
      ctx.globalAlpha = 1;
      /* rainbow ring + dust burst */
      if (p > 0.12 && p < 0.36) {
        var rt = (p - 0.12) / 0.24;
        var ringR = lerp(20, Math.max(W, H) * 0.52, Math.pow(rt, 0.7));
        var ringA = clamp(1 - Math.max(0, rt - 0.8) / 0.2, 0, 1);
        drawRing(cx, cy, ringR, ringA);
        dust.forEach(function (d) {
          var ph = (d.off + rt * 1.15 * d.sp) % 1;
          var dr = ringR * (0.35 + ph * 1.15);
          var da = ringA * (1 - ph) * 0.9;
          if (da <= 0.01) return;
          ctx.globalAlpha = da;
          ctx.fillStyle = "hsl(" + d.hue + ", 95%, 78%)";
          ctx.beginPath(); ctx.arc(cx + Math.cos(d.a) * dr, cy + Math.sin(d.a) * dr, d.s * (0.5 + ph), 0, 6.2832); ctx.fill();
        });
        ctx.globalAlpha = 1;
      }
      /* neon grid tunnel */
      if (p > 0.3 && p < 0.56) {
        var ta = clamp((p - 0.3) / 0.05, 0, 1) * clamp((0.56 - p) / 0.05, 0, 1);
        ctx.save(); ctx.globalAlpha = ta;
        for (var i2 = 0; i2 < 26; i2++) {
          var a = (i2 / 26) * 6.2832;
          ctx.strokeStyle = i2 % 2 ? "rgba(58,224,230,.5)" : "rgba(255,60,90,.5)";
          ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(a) * W, cy + Math.sin(a) * W); ctx.stroke();
        }
        for (var j = 0; j < 8; j++) {
          var f2 = ((j / 8) + (t / 1500) % (1 / 8)) % 1;
          var rr = lerp(8, W * 0.62, f2 * f2);
          ctx.strokeStyle = j % 2 ? "rgba(58,224,230,.85)" : "rgba(255,60,90,.85)";
          ctx.lineWidth = 1 + f2 * 4;
          ctx.strokeRect(cx - rr, cy - rr * 0.66, rr * 2, rr * 1.32);
        }
        /* warp speed-lines: stars streaking radially outward from centre */
        ctx.lineCap = "round";
        streaks.forEach(function (st) {
          var sph = (st.off + (t / 900) * st.sp) % 1;
          var sr1 = 20 + sph * sph * W * 0.62;
          var sr2 = sr1 + 14 + sph * 90;
          ctx.strokeStyle = "rgba(255,255,255," + (0.75 * (1 - sph * 0.4)) + ")";
          ctx.lineWidth = 1 + sph * 2.4;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(st.a) * sr1, cy + Math.sin(st.a) * sr1);
          ctx.lineTo(cx + Math.cos(st.a) * sr2, cy + Math.sin(st.a) * sr2);
          ctx.stroke();
        });
        ctx.restore();
      }
      /* energy burst */
      if (p > 0.52 && p < 0.68) {
        var bt = (p - 0.52) / 0.16, bi = Math.sin(Math.min(1, bt) * Math.PI);
        var grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
        grd.addColorStop(0, "rgba(255,255,255," + (0.98 * bi) + ")");
        grd.addColorStop(0.14, "rgba(255,190,240," + (0.9 * bi) + ")");
        grd.addColorStop(0.3, "rgba(255,70,200," + (0.82 * bi) + ")");
        grd.addColorStop(0.62, "rgba(80,120,255," + (0.45 * bi) + ")");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
        /* white-hot core flash at ignition */
        if (bt < 0.22) {
          ctx.fillStyle = "rgba(255,255,255," + ((0.22 - bt) / 0.22 * 0.85) + ")";
          ctx.beginPath(); ctx.arc(cx, cy, Math.max(10, Math.max(W, H) * 0.16 * (1 - bt * 2)), 0, 6.2832); ctx.fill();
        }
        /* expanding shockwave rings (pink, then blue) */
        for (var sw = 0; sw < 2; sw++) {
          var swt = clamp(bt * 1.3 - sw * 0.22, 0, 1);
          if (swt <= 0 || swt >= 1) continue;
          ctx.strokeStyle = sw ? "rgba(120,170,255," + (0.8 * (1 - swt) * bi) + ")" : "rgba(255,120,220," + (0.9 * (1 - swt) * bi) + ")";
          ctx.lineWidth = 10 * (1 - swt) + 1.5;
          ctx.beginPath(); ctx.arc(cx, cy, swt * Math.max(W, H) * 0.55, 0, 6.2832); ctx.stroke();
        }
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(t / 2400);
        ctx.fillStyle = "rgba(255,255,255," + (0.5 * bi) + ")";
        for (var r2 = 0; r2 < 12; r2++) { ctx.rotate(6.2832 / 12); ctx.fillRect(0, -2, W * 0.5 * bi, 4); }
        ctx.restore();
      }
    };
  })();

  /* ---------- Main loop + scroll wiring ---------- */
  function onScroll() {
    checkHeader(); drawArcs();
    if (window.__ctaUpdate) window.__ctaUpdate();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function loop(t) {
    drawTrail(t);
    if (window.__heroRender) window.__heroRender(t);
    if (window.__reelRender) window.__reelRender(t);
    if (window.__ctaRender) window.__ctaRender(t);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  var rsz;
  window.addEventListener("resize", function () {
    clearTimeout(rsz);
    rsz = setTimeout(function () {
      sizeTrail();
      if (window.__heroResize) window.__heroResize();
      if (window.__reelResize) window.__reelResize();
      if (window.__ctaResize) window.__ctaResize();
      onScroll();
    }, 160);
  });
})();
