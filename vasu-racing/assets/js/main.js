/* ============ VASU RACING — shared JS ============ */
(function(){
"use strict";
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Loader ---------- */
var loaderDone = false;
function dismissLoader(){
  if(loaderDone) return; loaderDone = true;
  var l = document.getElementById("loader");
  document.body.classList.remove("loading");
  if(l){ l.classList.add("done"); setTimeout(function(){ if(l.parentNode) l.parentNode.removeChild(l); }, 1100); }
}
if(document.getElementById("loader")){
  document.body.classList.add("loading");
  document.body.style.overflow = "hidden";
  var unlock = function(){ document.body.style.overflow = ""; };
  setTimeout(function(){ dismissLoader(); unlock(); }, 2000);
  setTimeout(function(){ dismissLoader(); unlock(); }, 3800); /* safety fallback */
}

/* ---------- Header scroll state ---------- */
var header = document.querySelector("header.site");
function onScroll(){ if(header) header.classList.toggle("scrolled", window.scrollY > 40); }
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();

/* ---------- Menu overlay ---------- */
var burger = document.getElementById("burger");
function setMenu(open){
  document.body.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-locked", open);
  if(burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
}
if(burger){
  burger.addEventListener("click", function(){ setMenu(!document.body.classList.contains("menu-open")); });
}
document.addEventListener("keydown", function(e){ if(e.key === "Escape") setMenu(false); });
var menuEl = document.getElementById("menu");
if(menuEl){
  menuEl.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", function(){ setMenu(false); }); });
}

/* ---------- Marquee duplicate ---------- */
document.querySelectorAll(".marquee-track").forEach(function(t){ t.innerHTML += t.innerHTML; });

/* ---------- Seeded random ---------- */
function mulberry(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* ---------- Helmet SVG generator ---------- */
var SHELL = "M30 160 L30 108 C30 58 68 24 122 24 C174 24 210 58 216 106 L219 132 C220 148 212 160 196 160 Z";
var VISOR = "M104 64 C142 58 190 67 209 81 C215 85 217 92 216 100 C215 109 208 113 198 112 L114 100 C102 98 95 89 96 77 C97 69 99 65 104 64 Z";

function flower(cx, cy, s, col){
  var p = "";
  for(var i=0;i<5;i++){
    var a = (i/5)*Math.PI*2;
    p += '<circle cx="'+(cx+Math.cos(a)*7*s).toFixed(1)+'" cy="'+(cy+Math.sin(a)*7*s).toFixed(1)+'" r="'+(5.2*s)+'" fill="'+col+'" opacity="0.85"/>';
  }
  return p + '<circle cx="'+cx+'" cy="'+cy+'" r="'+(3.4*s)+'" fill="#173a8f"/>';
}

function helmetArt(design, uid){
  var rand = mulberry(uid * 7919 + 13);
  var base = "#C8FF00", inner = "", defs = "";
  var i, x, y;
  switch(design){
    case "blob":
      base = "#C8FF00";
      inner = '<path d="M40 120 C30 70 80 40 110 62 C135 80 120 105 145 118 C168 130 205 118 208 148 L30 160 Z" fill="#14170F" opacity="0.9"/>'
            + '<circle cx="80" cy="70" r="16" fill="#F5F6F0"/><circle cx="172" cy="52" r="10" fill="#14170F"/>';
      break;
    case "season":
      base = "#C8FF00";
      inner = '<path d="M30 128 L219 96 L220 122 L30 152 Z" fill="#14170F"/>'
            + '<text x="52" y="88" font-family="Anton, sans-serif" font-size="34" fill="#14170F">VP</text>';
      break;
    case "disco":
      defs = '<linearGradient id="dg'+uid+'" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f5f8"/><stop offset=".5" stop-color="#a9adb8"/><stop offset="1" stop-color="#e8eaef"/></linearGradient>';
      base = "url(#dg"+uid+")";
      var cols = ["#ffffff","#c9ccd4","#9fa3ae","#eef0f4"];
      for(y=34; y<160; y+=17){ for(x=36+((y/17)%2)*8; x<216; x+=17){
        inner += '<circle cx="'+x+'" cy="'+y+'" r="6.4" fill="'+cols[Math.floor(rand()*4)]+'" opacity="0.8"/>';
      }}
      inner += '<path d="M170 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#fff"/>';
      break;
    case "glitter":
      base = "#191C13";
      var gcols = ["#C8FF00","#ffffff","#d7dae0","#8fce00"];
      for(i=0;i<70;i++){
        inner += '<circle cx="'+(34+rand()*180).toFixed(0)+'" cy="'+(28+rand()*128).toFixed(0)+'" r="'+(0.8+rand()*1.8).toFixed(1)+'" fill="'+gcols[Math.floor(rand()*4)]+'" opacity="'+(0.35+rand()*0.6).toFixed(2)+'"/>';
      }
      inner += '<ellipse cx="90" cy="120" rx="52" ry="26" fill="#C8FF00" opacity="0.16"/>';
      break;
    case "porcelain":
      base = "#F4F1E6";
      inner = flower(76,64,1.15,"#2B50C8") + flower(150,110,0.95,"#2B50C8") + flower(178,52,0.7,"#5B7FE0")
            + '<path d="M44 132 C80 112 120 140 160 118" stroke="#2B50C8" stroke-width="3" fill="none" opacity="0.7"/>'
            + '<path d="M52 44 C84 30 118 44 150 32" stroke="#2B50C8" stroke-width="2.4" fill="none" opacity="0.55"/>';
      break;
    case "snake":
      base = "#232B18";
      inner = '<path d="M44 138 C90 96 60 84 108 66 C146 52 138 96 196 74" stroke="#7AC74F" stroke-width="17" fill="none" stroke-linecap="round"/>'
            + '<path d="M44 138 C90 96 60 84 108 66 C146 52 138 96 196 74" stroke="#A8E063" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.8"/>'
            + '<circle cx="200" cy="72" r="12" fill="#7AC74F"/><circle cx="204" cy="69" r="2.6" fill="#14170F"/>'
            + '<path d="M210 76 l12 4 M210 76 l11 -5" stroke="#E5484D" stroke-width="2.4" stroke-linecap="round"/>';
      break;
    case "pixel":
      base = "#1D2016";
      var pal = ["#C8FF00","#FF5DA2","#39C2FF","#FFD23F","#F5F6F0","#FF7A1A"];
      for(y=28; y<158; y+=18){ for(x=32; x<216; x+=18){
        if(rand() > 0.42) inner += '<rect x="'+x+'" y="'+y+'" width="16" height="16" fill="'+pal[Math.floor(rand()*pal.length)]+'"/>';
      }}
      break;
    case "darkmode":
      base = "#101208";
      inner = '<path d="M30 118 L218 92 L219 112 L30 140 Z" fill="#232A17"/>'
            + '<circle cx="66" cy="66" r="7" fill="#C8FF00"/>';
      break;
    case "sticker":
      base = "#E9EBE2";
      var scol = ["#C8FF00","#FF5DA2","#39C2FF","#FFD23F","#14170F","#FF7A1A"];
      for(i=0;i<13;i++){
        var sx = 44+rand()*150, sy = 38+rand()*105, rot = Math.floor(rand()*50-25);
        if(i%3===0) inner += '<circle cx="'+sx.toFixed(0)+'" cy="'+sy.toFixed(0)+'" r="'+(8+rand()*8).toFixed(0)+'" fill="'+scol[i%scol.length]+'" stroke="#fff" stroke-width="2.4"/>';
        else inner += '<rect x="'+sx.toFixed(0)+'" y="'+sy.toFixed(0)+'" width="'+(20+rand()*22).toFixed(0)+'" height="'+(12+rand()*10).toFixed(0)+'" rx="4" fill="'+scol[i%scol.length]+'" stroke="#fff" stroke-width="2.4" transform="rotate('+rot+' '+sx.toFixed(0)+' '+sy.toFixed(0)+')"/>';
      }
      break;
    case "vegas":
      base = "#0C0C0C";
      inner = '<text x="46" y="86" font-family="Anton, sans-serif" font-size="27" fill="#C8FF00" transform="rotate(-7 46 86)">LAS VEGAS</text>'
            + '<text x="120" y="140" font-family="Anton, sans-serif" font-size="30" fill="none" stroke="#C8FF00" stroke-width="1.4">VP</text>';
      for(i=0;i<7;i++){
        var vx = 46+rand()*160, vy = 34+rand()*110;
        inner += '<path d="M'+vx+' '+vy+' l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4 Z" fill="#F5F6F0" opacity="0.9"/>';
      }
      break;
    case "chrome":
      defs = '<linearGradient id="cg'+uid+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAFBFD"/><stop offset=".45" stop-color="#A9ADB6"/><stop offset=".62" stop-color="#E9EBEF"/><stop offset="1" stop-color="#84888F"/></linearGradient>';
      base = "url(#cg"+uid+")";
      inner = '<path d="M36 96 C80 60 160 56 210 84 L212 100 C150 74 84 80 38 112 Z" fill="#ffffff" opacity="0.5"/>';
      break;
    case "beachball":
      base = "#F5F6F0";
      inner = '<path d="M122 24 L122 160 L64 160 C50 118 44 66 122 24 Z" fill="#FFD23F"/>'
            + '<path d="M122 24 C176 34 206 66 214 108 L218 140 L160 160 L122 160 Z" fill="#39C2FF" opacity="0"/>'
            + '<path d="M122 24 C168 30 200 58 212 100 L160 160 L122 160 Z" fill="#39C2FF"/>'
            + '<path d="M30 108 C44 60 78 32 122 24 L104 160 L34 160 C31 142 30 124 30 108 Z" fill="#FF5D5D"/>'
            + '<circle cx="122" cy="26" r="9" fill="#F5F6F0" stroke="#d8dcd0"/>';
      break;
    case "basketball":
      base = "#E8720C";
      inner = '<path d="M30 92 L218 92" stroke="#14170F" stroke-width="4"/>'
            + '<path d="M122 24 C100 70 100 116 122 160" stroke="#14170F" stroke-width="4" fill="none"/>'
            + '<path d="M52 40 C96 84 96 104 56 152" stroke="#14170F" stroke-width="4" fill="none"/>'
            + '<path d="M196 38 C156 84 156 106 198 152" stroke="#14170F" stroke-width="4" fill="none"/>';
      break;
    case "union":
      base = "#EEF0EA";
      inner = '<path d="M30 84 L218 66 L219 88 L30 106 Z" fill="#C8102E"/>'
            + '<path d="M104 26 L126 26 L132 160 L110 160 Z" fill="#012169" opacity="0.85"/>'
            + '<path d="M30 128 L219 108 L220 124 L30 146 Z" fill="#C8FF00"/>';
      break;
    case "debut":
      base = "#F5F6F0";
      inner = '<path d="M30 118 L218 92 L219 116 L30 142 Z" fill="#14170F"/>'
            + '<circle cx="86" cy="66" r="20" fill="#C8FF00"/><circle cx="86" cy="66" r="20" fill="none" stroke="#14170F" stroke-width="3"/>';
      break;
    default: /* lime */
      base = "#C8FF00";
      inner = '<path d="M30 122 L219 96 L220 118 L30 146 Z" fill="#14170F"/>';
  }
  return '<svg viewBox="0 0 250 186" role="img" aria-label="Racing helmet illustration">'
    + '<defs><clipPath id="hc'+uid+'"><path d="'+SHELL+'"/></clipPath>'+defs+'</defs>'
    + '<g clip-path="url(#hc'+uid+')">'
    + '<rect x="0" y="0" width="250" height="186" fill="'+base+'"/>'
    + inner
    + '<path d="'+VISOR+'" fill="#14170F" opacity="0.94"/>'
    + '<path d="M104 64 C142 58 190 67 209 81" stroke="#F5F6F0" stroke-width="3" fill="none" opacity="0.35"/>'
    + '<rect x="164" y="126" width="36" height="9" rx="4.5" fill="#14170F" opacity="0.4"/>'
    + '<rect x="0" y="158" width="250" height="10" fill="#14170F" opacity="0.22"/>'
    + '</g>'
    + '<path d="'+SHELL+'" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="2"/>'
    + '</svg>';
}

var HELMETS = [
  {name:"Season 2026",  year:"2026", design:"blob"},
  {name:"Discoball",    year:"2025", design:"disco"},
  {name:"Dark Glitter", year:"2025", design:"glitter"},
  {name:"Season 2025",  year:"2025", design:"season"},
  {name:"Porcelain",    year:"2025", design:"porcelain"},
  {name:"Japan Snake",  year:"2025", design:"snake"},
  {name:"Pixel",        year:"2024", design:"pixel"},
  {name:"Dark Mode",    year:"2024", design:"darkmode"},
  {name:"Stickerbomb",  year:"2024", design:"sticker"},
  {name:"Las Vegas",    year:"2024", design:"vegas"},
  {name:"Chrome",       year:"2023", design:"chrome"},
  {name:"Beachball",    year:"2023", design:"beachball"},
  {name:"Basketball",   year:"2022", design:"basketball"},
  {name:"Season 2022",  year:"2022", design:"season"},
  {name:"Season 2021",  year:"2021", design:"lime"},
  {name:"Silverstone",  year:"2021", design:"union"},
  {name:"Debut 2019",   year:"2019", design:"debut"}
];
document.querySelectorAll(".helmet-grid").forEach(function(grid){
  var html = "";
  HELMETS.forEach(function(h, i){
    html += '<article class="helmet-card">' + helmetArt(h.design, i+1)
      + '<div class="helmet-tab"><span class="h-name">'+h.name+'</span><span class="h-year">'+h.year+'</span></div></article>';
  });
  grid.innerHTML = html;
});
document.querySelectorAll("[data-helmet]").forEach(function(el, i){
  el.innerHTML = helmetArt(el.getAttribute("data-helmet") || "blob", 500+i);
});

/* ---------- Countdown (Lusail GP, 29 Nov 2026 16:00) ---------- */
var cdEls = {
  d: document.getElementById("cd-d"), h: document.getElementById("cd-h"),
  m: document.getElementById("cd-m"), s: document.getElementById("cd-s")
};
if(cdEls.d){
  var target = new Date(2026, 10, 29, 16, 0, 0).getTime();
  var pad = function(n){ return (n<10 ? "0" : "") + n; };
  var tick = function(){
    var diff = Math.max(0, target - Date.now());
    var d = Math.floor(diff/86400000), h = Math.floor(diff/3600000)%24, m = Math.floor(diff/60000)%60, s = Math.floor(diff/1000)%60;
    cdEls.d.textContent = pad(d); cdEls.h.textContent = pad(h); cdEls.m.textContent = pad(m); cdEls.s.textContent = pad(s);
  };
  tick(); setInterval(tick, 1000);
}

/* ---------- Stat counters ---------- */
var counters = document.querySelectorAll("[data-count]");
if(counters.length){
  var cio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      var el = en.target; cio.unobserve(el);
      var end = parseInt(el.getAttribute("data-count"), 10) || 0;
      var suffix = el.getAttribute("data-suffix") || "";
      if(reduced){ el.textContent = end + suffix; return; }
      var t0 = null, dur = 1500;
      var step = function(ts){
        if(!t0) t0 = ts;
        var p = Math.min(1, (ts - t0)/dur), e = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(end * e) + suffix;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, {threshold: 0.4});
  counters.forEach(function(el){ el.textContent = "0" + (el.getAttribute("data-suffix")||""); cio.observe(el); });
}

/* ---------- Collage counter (native-scroll fallback) ---------- */
var vp = document.querySelector(".collage-viewport");
var cCount = document.querySelector(".collage-count");
var cBar = document.querySelector(".collage-progress i");
var cItems = document.querySelectorAll(".collage-item");
function setCollage(p){
  if(cCount && cItems.length) cCount.textContent = 1 + Math.round(p * (cItems.length - 1));
  if(cBar) cBar.style.width = (8 + p * 92) + "%";
}
if(vp && window.matchMedia("(max-width: 760px)").matches){
  vp.addEventListener("scroll", function(){
    var max = vp.scrollWidth - vp.clientWidth;
    setCollage(max > 0 ? vp.scrollLeft / max : 0);
  }, {passive:true});
}

/* ---------- GSAP animations ---------- */
if(window.gsap && window.ScrollTrigger && !reduced){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray("[data-reveal]").forEach(function(el){
    gsap.from(el, {y: 46, opacity: 0, duration: 0.95, ease: "power3.out",
      scrollTrigger: {trigger: el, start: "top 88%"}});
  });
  /* Hero portrait drift */
  var hp = document.querySelector(".hero-portrait img");
  if(hp){
    gsap.to(hp, {yPercent: 7, ease: "none",
      scrollTrigger: {trigger: ".hero", start: "top top", end: "bottom top", scrub: true}});
  }
  /* Horizontal collage on desktop */
  var track = document.querySelector(".collage-track");
  if(track && window.matchMedia("(min-width: 761px)").matches){
    var dist = function(){ return Math.max(0, track.scrollWidth - window.innerWidth + 40); };
    gsap.to(track, {x: function(){ return -dist(); }, ease: "none",
      scrollTrigger: {
        trigger: ".collage-sec", start: "top top", end: function(){ return "+=" + dist(); },
        pin: true, scrub: 0.6, invalidateOnRefresh: true,
        onUpdate: function(self){ setCollage(self.progress); }
      }});
    /* gentle per-photo parallax */
    gsap.utils.toArray(".collage-item img").forEach(function(img, i){
      gsap.fromTo(img, {scale: 1.12, xPercent: -2.5}, {scale: 1.12, xPercent: 2.5, ease: "none",
        scrollTrigger: {trigger: ".collage-sec", start: "top top", end: function(){ return "+=" + dist(); }, scrub: true}});
    });
  }
  window.addEventListener("load", function(){ ScrollTrigger.refresh(); });
}
})();
