"use strict";

/* ================= Data ================= */

var PROJECTS = [
  { id: "marwar", name: "Marwar and Co.", cat: "Jewellery", year: 2026, img: "assets/img/p1-marwar.jpg",
    result: "Online sales up 3.1x in six months.",
    tags: "gold ruby bridal jewellery jaipur",
    about: "A Jaipur jewellery house founded in 1985. The old site showed the craft but could not sell it. We rebuilt the store around the pieces: large photos, plain prices, and a checkout that takes under a minute.",
    stats: [["1985", "Founded"], ["3.1x", "Online sales"], ["6", "Months to launch"]] },
  { id: "chaisutra", name: "Chaisutra", cat: "Hospitality", year: 2025, img: "assets/img/p2-chaisutra.jpg",
    result: "Table bookings doubled after the new site.",
    tags: "chai cafe coffee mumbai",
    about: "A Mumbai cafe chain with 14 outlets and one long queue at the counter. We built table booking into the site, so regulars book before they leave home and the queue moves faster.",
    stats: [["14", "Cafes"], ["2x", "Table bookings"], ["5", "Weeks to launch"]] },
  { id: "kapaas", name: "Kapaas", cat: "E-commerce", year: 2026, img: "assets/img/p3-kapaas.jpg",
    result: "Wholesale orders now come in through the site.",
    tags: "cotton handloom weaving textile",
    about: "A handloom textile brand working with 120 weavers. The old site was a photo album. The new one takes wholesale orders, shows live stock, and pays the weavers on time.",
    stats: [["120+", "Weavers"], ["3x", "Wholesale orders"], ["8", "Weeks to launch"]] },
  { id: "paisape", name: "PaisaPe", cat: "Fintech", year: 2025, img: "assets/img/p4-paisape.jpg",
    result: "Signups up 42% in the first quarter.",
    tags: "payments banking fintech shops",
    about: "A Bengaluru fintech for small shops. The signup flow asked for too much, too soon. We cut it to three steps and wrote every line in plain language.",
    stats: [["42%", "More signups"], ["1.2 lakh", "Users"], ["7", "Weeks to launch"]] },
  { id: "haveli", name: "Haveli House", cat: "Hospitality", year: 2026, img: "assets/img/p5-haveli.jpg",
    result: "Direct bookings beat aggregators for the first time.",
    tags: "hotel stay rooms udaipur",
    about: "An 18 room boutique hotel in Udaipur. Guests found it on aggregators and paid the aggregator price. The new site gives a reason to book direct: the best room rate, and breakfast on the house.",
    stats: [["18", "Rooms"], ["61%", "Direct bookings"], ["6", "Weeks to launch"]] },
  { id: "mirchi", name: "Mirchi and Co.", cat: "E-commerce", year: 2024, img: "assets/img/p6-mirchi.jpg",
    result: "Subscription boxes sell out every month.",
    tags: "spices chilli turmeric blends",
    about: "A Kochi spice brand with 12 blends and a loyal following. We built subscriptions into the store, so regulars never run out and the brand knows next month's numbers today.",
    stats: [["9,400", "Subscribers"], ["12", "Spice blends"], ["4", "Weeks to launch"]] },
  { id: "lakdi", name: "Lakdi Studio", cat: "Furniture", year: 2025, img: "assets/img/p7-lakdi.jpg",
    result: "Custom orders up 2.4x.",
    tags: "wood furniture carpentry chairs",
    about: "A Jodhpur furniture maker with 40 craftspeople. The old site showed finished pieces only. The new one lets buyers start a custom order with sizes, wood, and finish, and get a real price in a day.",
    stats: [["2.4x", "Custom orders"], ["40", "Craftspeople"], ["9", "Weeks to launch"]] },
  { id: "raag", name: "Raag Records", cat: "Music", year: 2026, img: "assets/img/p8-raag.jpg",
    result: "Streams up 58% after the new release pages.",
    tags: "vinyl music artists label songs",
    about: "An independent music label in Mumbai with 32 artists. Each release had a different page, or no page at all. We built one release template, so every artist gets the same care and every fan finds the music fast.",
    stats: [["58%", "More streams"], ["32", "Artists"], ["5", "Weeks to launch"]] },
  { id: "adda", name: "Adda Works", cat: "Workspace", year: 2025, img: "assets/img/p9-adda.jpg",
    result: "Desks booked out two months ahead.",
    tags: "coworking desks office pune",
    about: "A Pune co-working space with 320 desks. Booking meant a phone call and a spreadsheet. The new site shows live availability, so members book a desk in under a minute.",
    stats: [["320", "Desks"], ["2", "Months booked ahead"], ["6", "Weeks to launch"]] }
];

var NOTES = [
  { id: "about", title: "About Studio Kala", date: "Nov 2026",
    html: "<p>Studio Kala is a design studio in Jaipur and Mumbai. We started in 2019 with one belief: a website should work as well as it looks.</p><p>Today we build websites, online stores and custom platforms for Indian brands. Nine of those projects live in Finder on this desktop. Open any of them to see what changed for the client.</p><p>Two studios, one team. Jaipur holds the design work. Mumbai holds the build and the clients. The clock widget on this desktop shows both.</p>" },
  { id: "how", title: "How we work", date: "Nov 2026",
    html: "<p>Four steps, in order, every time.</p><ol><li><b>Define the problem.</b> One call and one written brief. If the problem is not clear, we do not start.</li><li><b>Price the real scope.</b> A fixed price for a written scope. No hourly billing, no open-ended builds.</li><li><b>Build working software.</b> You see a working version every week, not a slide deck.</li><li><b>Launch and improve.</b> We measure what changed, then fix what did not work.</li></ol>" },
  { id: "do", title: "What we do", date: "Nov 2026",
    html: "<ul><li>Marketing websites</li><li>Shopify storefronts</li><li>Headless Shopify</li><li>Custom platforms</li><li>Brand and design systems</li><li>Ongoing care after launch</li></ul><p>If it is not on this list, ask us. We will say plainly whether we can do it well.</p>" },
  { id: "dont", title: "What we do not do", date: "Nov 2026",
    html: "<ul><li>Cheap template sites</li><li>Open-ended builds with no written scope</li><li>Daily social media and paid-media campaigns</li><li>Technology added only to sound impressive</li><li>Work where nobody owns decisions, content or budget</li></ul><p>The Trash app on this desktop holds the patterns we rejected. Open it to see why.</p>" },
  { id: "pricing", title: "Pricing", date: "Nov 2026",
    html: "<p>Clear starting points. Final price follows the real scope.</p><div class=\"price-row\"><span>Discovery</span><b>Rs. 50,000</b></div><div class=\"price-row\"><span>Marketing website</span><b>from Rs. 1,00,000</b></div><div class=\"price-row\"><span>Shopify storefront</span><b>Rs. 1,25,000</b></div><div class=\"price-row\"><span>Headless Shopify</span><b>Rs. 1,85,000</b></div><div class=\"price-row\"><span>Custom platform</span><b>Rs. 2,40,000</b></div><div class=\"price-row\"><span>Ongoing care</span><b>Rs. 18,000 / month</b></div><p>Brand work is priced separately. Write to us from the Mail app and we will quote within one business day.</p>" },
  { id: "faq", title: "Questions we always get", date: "Nov 2026",
    html: "<h3>How do we start?</h3><p>Book a 30 minute call from the widget on this desktop, or write to us in Mail. We reply with a written scope and a fixed price.</p><h3>How long does a website take?</h3><p>Most focused websites take 6 to 8 weeks. Stores and platforms take longer, and we say so before we start.</p><h3>Who owns the code?</h3><p>You do. After full payment, you get the source code, documentation and agreed deliverables.</p><h3>Do you work with our design team?</h3><p>Yes. We work with your team, or with ours, whichever fits the project.</p>" },
  { id: "why", title: "Why does this site look like a desktop?", date: "Nov 2026",
    html: "<p>Because a portfolio should be used, not scrolled. Every window here works: Finder holds the work, Notes holds the pricing, Mail sends a real message, Terminal answers commands.</p><p>If you turn JavaScript off, the same content is listed below in plain form. Nothing here depends on a trick.</p>" }
];

var TRASH = [
  { name: "Autoplay Video.mp4", size: "2.4 MB", why: "Rejected in 0.4 seconds. Nobody asked for sound they did not start." },
  { name: "Pop-up Discount!.pdf", size: "128 KB", why: "A discount that shouts before the visitor reads a word is not a welcome." },
  { name: "Chat Widget That Follows You.zip", size: "4.1 MB", why: "Help should wait to be asked for. A widget that chases the cursor is not help." },
  { name: "Cookie Banner (No Reject).txt", size: "12 KB", why: "Consent with no Reject button is not consent." },
  { name: "Hero Slider v27.mov", size: "18.9 MB", why: "Twenty seven slides and not one message. One clear line beats a carousel." },
  { name: "Countdown Timer to Nowhere.exe", size: "512 KB", why: "A timer that ends in nothing teaches visitors to ignore the next one." },
  { name: "Testimonial Carousel of Strangers.png", size: "1.2 MB", why: "Quotes we cannot verify prove nothing. Real work is better proof." }
];

var TRACKS = [
  { name: "Morning Raga", dur: 100, label: "1:40", root: 220.00, scale: [0, 2, 4, 7, 9], bpm: 72, wave: "sine" },
  { name: "Monsoon Window", dur: 78, label: "1:18", root: 261.63, scale: [0, 3, 5, 7, 10], bpm: 66, wave: "triangle" },
  { name: "Desert Dusk", dur: 111, label: "1:51", root: 146.83, scale: [0, 2, 3, 7, 8], bpm: 60, wave: "sine" },
  { name: "Night Train", dur: 162, label: "2:42", root: 164.81, scale: [0, 3, 5, 6, 10], bpm: 84, wave: "triangle" },
  { name: "Studio Hum", dur: 158, label: "2:38", root: 174.61, scale: [0, 4, 5, 7, 11], bpm: 76, wave: "sine" }
];

var FM_MOODS = [
  { name: "Rainy Window", root: 220.00, scale: [0, 3, 5, 7, 10] },
  { name: "Morning Raga", root: 261.63, scale: [0, 2, 4, 7, 9] },
  { name: "Night Desk", root: 196.00, scale: [0, 3, 5, 6, 10] }
];

var JOURNAL = [
  { id: "j1", title: "Why we build portfolios that work like desktops", date: "2026-11-20", mins: "4 min",
    html: "<p>Most portfolios are long pages that ask for a scroll and a prayer. The visitor reads the headline, skims three projects, and leaves. The work never gets a fair look.</p><p>So we built this one as a desktop. Finder holds the work. Notes holds the pricing. Mail sends a real message. Nothing here is a screenshot of a product. It is the product.</p><p>A buyer who opens Finder and clicks a project has already used the thing we are selling. That is the whole point.</p>" },
  { id: "j2", title: "Pricing a website without the awkward call", date: "2026-11-02", mins: "3 min",
    html: "<p>Most studios hide prices behind a call. The call is awkward for both sides, because neither side knows the scope yet.</p><p>We publish starting prices instead. Discovery is Rs. 50,000. A marketing website starts at Rs. 1,00,000. The final price follows the real scope, and we put that scope in writing before we start.</p><p>It costs us some calls. It saves us the wrong ones.</p>" },
  { id: "j3", title: "What we stopped building in 2026", date: "2026-10-14", mins: "5 min",
    html: "<p>This year we stopped building autoplay videos, pop-up discounts, chat widgets that follow the cursor, and countdown timers to nowhere. They are all in the Trash app on this desktop, with the reason each one was rejected.</p><p>None of them failed because they were hard to build. They failed because they treat the visitor as a target, not a person.</p><p>The work that replaced them is quieter: faster pages, plain words, and one clear thing to do next.</p>" }
];

var APPS = [
  { id: "finder", name: "Finder", letter: "F", color: "#E0311C", w: 960, h: 620, dock: true },
  { id: "notes", name: "Notes", letter: "N", color: "#D9A441", w: 860, h: 560, dock: true },
  { id: "mail", name: "Mail", letter: "M", color: "#2F6FED", w: 860, h: 560, dock: true },
  { id: "assistant", name: "Assistant", letter: "A", color: "#141413", w: 560, h: 620, dock: true },
  { id: "photos", name: "Photos", letter: "P", color: "#1E3D2F", w: 900, h: 600, dock: true },
  { id: "music", name: "Music", letter: "\u266A", color: "#0F766E", w: 720, h: 560, dock: true },
  { id: "settings", name: "Settings", letter: "S", color: "#4A4A48", w: 780, h: 540, dock: true },
  { id: "terminal", name: "Terminal", letter: ">_", color: "#141413", w: 690, h: 430, dock: true },
  { id: "trash", name: "Trash", letter: "T", color: "#8A5A2B", w: 700, h: 480, dock: true },
  { id: "journal", name: "Journal", letter: "J", color: "#D9A441", w: 640, h: 560, dock: false },
  { id: "simple", name: "Simplified View", letter: "K", color: "#141413", w: 640, h: 560, dock: false }
];

var WELCOME_MAIL = {
  from: "Studio Kala", subj: "Welcome to Studio Kala OS",
  body: "Thanks for opening Mail.\n\nThis desktop is our portfolio. Every window works. Open Finder to see the work, or reply to this note and we will get back within one business day.\n\nTeam Kala\nJaipur + Mumbai",
  date: "Today"
};

/* ================= Helpers ================= */

function $(s, r) { return (r || document).querySelector(s); }
function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function fmtTime(d) {
  var h = d.getHours(), m = d.getMinutes(), ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  return h + ":" + (m < 10 ? "0" : "") + m + " " + ap;
}
function fmtClock(d) {
  var h = d.getHours(), m = d.getMinutes();
  return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
}
function istNow() { return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })); }

var toastTimer = null;
function showToast(msg) {
  var t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
}

/* ================= Audio engine (WebAudio, real sound) ================= */

var Audio2 = {
  ctx: null, master: null, timer: null, step: 0,
  mode: null, trackIdx: 0, fmIdx: 0, muted: false, volume: 0.7,
  ensure: function () {
    if (!this.ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return true;
  },
  note: function (freq, dur, type, vol, when) {
    var t = when || this.ctx.currentTime;
    var o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine"; o.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol || 0.12, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.05);
  },
  stepDur: function () {
    if (this.mode === "music") return 60 / TRACKS[this.trackIdx].bpm / 2;
    return 0.55;
  },
  tick: function () {
    var self = Audio2;
    if (self.mode === "music") {
      var tr = TRACKS[self.trackIdx];
      var total = Math.floor(tr.dur / self.stepDur());
      if (self.step >= total) { self.nextTrack(); return; }
      var seq = [0, -1, 2, -1, 4, -1, 3, -1, 0, -1, 2, 5, 4, -1, 3, 2];
      var deg = seq[self.step % 16];
      if (deg >= 0) {
        var iv = tr.scale[deg % tr.scale.length];
        var oct = Math.floor(deg / tr.scale.length);
        var f = tr.root * Math.pow(2, iv / 12 + oct);
        self.note(f, 1.1, tr.wave, 0.10);
        if (self.step % 8 === 0) self.note(tr.root / 2, 1.6, "sine", 0.07);
      }
      self.step++;
      updateMusicTime();
    } else if (self.mode === "fm") {
      var mood = FM_MOODS[self.fmIdx];
      if (Math.random() < 0.55) {
        var iv2 = mood.scale[Math.floor(Math.random() * mood.scale.length)];
        var f2 = mood.root * Math.pow(2, iv2 / 12) * (Math.random() < 0.3 ? 2 : 1);
        self.note(f2, 2.4, "sine", 0.07);
      }
      if (self.step % 6 === 0) self.note(mood.root / 2, 3.0, "sine", 0.05);
      self.step++;
    }
  },
  start: function (mode) {
    if (!this.ensure()) { showToast("Audio is not available in this browser."); return false; }
    this.stopTimer();
    this.mode = mode; this.step = 0;
    var self = this;
    this.timer = setInterval(function () { self.tick(); }, this.stepDur() * 1000);
    updateNowPlaying();
    return true;
  },
  stopTimer: function () { if (this.timer) { clearInterval(this.timer); this.timer = null; } },
  stop: function () { this.stopTimer(); this.mode = null; this.step = 0; updateNowPlaying(); updateMusicUI(); updateFmUI(); },
  playMusic: function (i) { this.trackIdx = i; this.start("music"); updateMusicUI(); updateFmUI(); },
  nextTrack: function () { this.playMusic((this.trackIdx + 1) % TRACKS.length); },
  prevTrack: function () { this.playMusic((this.trackIdx - 1 + TRACKS.length) % TRACKS.length); },
  playFM: function () { this.start("fm"); updateMusicUI(); updateFmUI(); },
  nextFM: function () { this.fmIdx = (this.fmIdx + 1) % FM_MOODS.length; if (this.mode === "fm") { this.start("fm"); } updateFmUI(); updateNowPlaying(); },
  setVolume: function (v) { this.volume = v; if (this.master) this.master.gain.value = this.muted ? 0 : v; },
  setMuted: function (m) { this.muted = m; if (this.master) this.master.gain.value = m ? 0 : this.volume; updateMuteIcon(); },
  elapsed: function () { return this.step * this.stepDur(); }
};

function updateNowPlaying() {
  var label = "Nothing playing";
  if (Audio2.mode === "music") label = TRACKS[Audio2.trackIdx].name;
  if (Audio2.mode === "fm") label = "Studio FM - " + FM_MOODS[Audio2.fmIdx].name;
  var el = $("#ccTrack"); if (el) el.textContent = label;
  var btn = $("#ccPlay"); if (btn) btn.textContent = Audio2.mode ? "Pause" : "Play";
}
function updateMuteIcon() {
  var b = $("#muteBtn");
  if (b) b.classList.toggle("off", Audio2.muted);
  b.title = Audio2.muted ? "Unmute" : "Mute";
}

/* ================= State ================= */

var state = {
  theme: "light", wallpaper: "kala", wifi: true,
  brightness: 100, activeApp: "Finder", zTop: 100, winCount: 0
};
var wins = {};
var persist = {
  finder: { view: "grid", id: null, q: "", cat: "All" },
  notes: { id: "about" },
  mail: { folder: "inbox", msg: null, sent: null },
  photos: { album: "All", view: "grid", idx: 0 },
  settings: { pane: "appearance" },
  trash: { sel: null, emptied: false },
  journal: { id: null },
  music: { track: 0 },
  terminal: { hist: [], hi: 0 }
};

function loadPrefs() {
  try {
    var p = JSON.parse(localStorage.getItem("sk-prefs") || "{}");
    if (p.theme) state.theme = p.theme;
    if (p.wallpaper) state.wallpaper = p.wallpaper;
    if (typeof p.brightness === "number") state.brightness = p.brightness;
    var sent = JSON.parse(localStorage.getItem("sk-sent") || "[]");
    persist.mail.sent = sent;
    var drafts = JSON.parse(localStorage.getItem("sk-drafts") || "[]");
    persist.mail.drafts = drafts;
  } catch (e) { persist.mail.sent = []; persist.mail.drafts = []; }
  if (!persist.mail.sent) persist.mail.sent = [];
  if (!persist.mail.drafts) persist.mail.drafts = [];
}
function savePrefs() {
  try {
    localStorage.setItem("sk-prefs", JSON.stringify({ theme: state.theme, wallpaper: state.wallpaper, brightness: state.brightness }));
  } catch (e) {}
}
function applyTheme() {
  document.body.classList.toggle("dark", state.theme === "dark");
  var wp = $("#wallpaper");
  wp.classList.remove("wp-paper", "wp-ink");
  if (state.wallpaper === "paper") wp.classList.add("wp-paper");
  if (state.wallpaper === "ink") wp.classList.add("wp-ink");
  $("#desktop").style.filter = "brightness(" + (state.brightness / 100) + ")";
  var cc = $("#ccDark");
  if (cc) {
    cc.classList.toggle("on", state.theme === "dark");
    cc.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
    cc.querySelector(".cc-tstate").textContent = state.theme === "dark" ? "On" : "Off";
  }
  savePrefs();
}
function setTheme(t) { state.theme = t; applyTheme(); }

/* ================= Window manager ================= */

function appById(id) { for (var i = 0; i < APPS.length; i++) if (APPS[i].id === id) return APPS[i]; return null; }
function isMobile() { return window.innerWidth <= 700; }

function openApp(id, opts) {
  opts = opts || {};
  var app = appById(id);
  if (!app) return;
  if (wins[id]) {
    var w = wins[id];
    w.el.style.display = "flex";
    w.el.classList.remove("minimized");
    focusWindow(id);
    if (opts.note) { persist.notes.id = opts.note; renderAppBody(id); }
    if (opts.project) { persist.finder.view = "detail"; persist.finder.id = opts.project; renderAppBody(id); }
    if (opts.article) { persist.journal.id = opts.article; renderAppBody(id); }
    if (opts.compose) { persist.mail.folder = "compose"; renderAppBody(id); }
    if (opts.pane) { persist.settings.pane = opts.pane; renderAppBody(id); }
    return;
  }
  var el = document.createElement("section");
  el.className = "window";
  el.id = "win-" + id;
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-label", app.name);
  var vw = Math.min(window.innerWidth, app.w), vh = Math.min(window.innerHeight - 110, app.h);
  var off = (state.winCount % 5) * 28;
  var left = Math.max(8, (window.innerWidth - vw) / 2 + off - 40);
  var top = Math.max(38, (window.innerHeight - vh) / 2 + off - 30);
  el.style.width = vw + "px"; el.style.height = vh + "px";
  el.style.left = left + "px"; el.style.top = top + "px";
  el.innerHTML =
    '<div class="win-title">' +
      '<span class="lights">' +
        '<button class="light close" data-act="close" aria-label="Close"><span>x</span></button>' +
        '<button class="light min" data-act="min" aria-label="Minimize"><span>-</span></button>' +
        '<button class="light zoom" data-act="zoom" aria-label="Zoom"><span>+</span></button>' +
      '</span>' +
      '<span class="win-name">' + esc(app.name) + '</span>' +
      '<span style="width:52px"></span>' +
    '</div>' +
    '<div class="win-body" data-body></div>';
  $("#windows").appendChild(el);
  wins[id] = { el: el, app: app };
  state.winCount++;
  el.addEventListener("pointerdown", function () { focusWindow(id); }, true);
  wireTitlebar(el, id);
  renderAppBody(id);
  if (opts.note) persist.notes.id = opts.note;
  if (opts.project) { persist.finder.view = "detail"; persist.finder.id = opts.project; }
  if (opts.article) persist.journal.id = opts.article;
  if (opts.compose) persist.mail.folder = "compose";
  if (opts.pane) persist.settings.pane = opts.pane;
  if (opts.note || opts.project || opts.article || opts.compose || opts.pane) renderAppBody(id);
  focusWindow(id);
  markRunning();
  if (isMobile()) $("#springboard").style.display = "none";
}

function focusWindow(id) {
  var w = wins[id];
  if (!w) return;
  state.zTop++;
  w.el.style.zIndex = state.zTop;
  state.activeApp = w.app.name;
  $("#activeApp").textContent = w.app.name;
  $all(".window").forEach(function (el) { el.classList.remove("front"); });
  w.el.classList.add("front");
}

function closeWindow(id) {
  var w = wins[id];
  if (!w) return;
  if (id === "music" && Audio2.mode === "music") { /* keep playing in background */ }
  w.el.remove();
  delete wins[id];
  markRunning();
  var open = Object.keys(wins);
  if (open.length) focusWindow(open[open.length - 1]);
  else { state.activeApp = "Finder"; $("#activeApp").textContent = "Finder"; }
  if (isMobile() && !Object.keys(wins).length) $("#springboard").style.display = "flex";
}

function minimizeWindow(id) {
  var w = wins[id];
  if (!w) return;
  w.el.style.display = "none";
  var open = Object.keys(wins).filter(function (k) { return wins[k].el.style.display !== "none"; });
  if (open.length) focusWindow(open[open.length - 1]);
  else { state.activeApp = "Finder"; $("#activeApp").textContent = "Finder"; }
  if (isMobile() && !open.length) $("#springboard").style.display = "flex";
}

function zoomWindow(id) {
  var w = wins[id];
  if (!w) return;
  w.el.classList.toggle("zoomed");
}

function markRunning() {
  $all(".dock-app").forEach(function (el) {
    el.classList.toggle("running", !!wins[el.dataset.app]);
  });
}

function wireTitlebar(el, id) {
  var bar = el.querySelector(".win-title");
  bar.addEventListener("pointerdown", function (e) {
    if (e.target.closest(".light")) return;
    if (isMobile()) return;
    var w = wins[id]; if (!w) return;
    var r = el.getBoundingClientRect();
    var dx = e.clientX - r.left, dy = e.clientY - r.top;
    var moved = false;
    function mv(ev) {
      moved = true;
      var x = ev.clientX - dx, y = ev.clientY - dy;
      if (y < 30) y = 30;
      if (y > window.innerHeight - 60) y = window.innerHeight - 60;
      el.style.left = x + "px"; el.style.top = y + "px";
      el.classList.remove("zoomed");
    }
    function up() { document.removeEventListener("pointermove", mv); document.removeEventListener("pointerup", up); }
    document.addEventListener("pointermove", mv);
    document.addEventListener("pointerup", up);
  });
  bar.addEventListener("dblclick", function (e) {
    if (e.target.closest(".light")) return;
    zoomWindow(id);
  });
  el.addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.dataset.act;
    if (act === "close") closeWindow(id);
    if (act === "min") minimizeWindow(id);
    if (act === "zoom") zoomWindow(id);
  });
}

/* ================= Dock + springboard ================= */

function buildDock() {
  var dock = $("#dock");
  dock.innerHTML = "";
  APPS.filter(function (a) { return a.dock; }).forEach(function (a, i) {
    if (i === 8) {
      var sep = document.createElement("span");
      sep.className = "dock-sep";
      dock.appendChild(sep);
    }
    var b = document.createElement("button");
    b.className = "dock-app";
    b.dataset.app = a.id;
    b.setAttribute("aria-label", "Open " + a.name);
    b.innerHTML = '<span class="dock-ico" style="background:' + a.color + '">' + esc(a.letter) + '</span><span class="tip">' + esc(a.name) + '</span><span class="dock-dot"></span>';
    b.addEventListener("click", function () {
      if (wins[a.id] && wins[a.id].el.style.display !== "none") { minimizeWindow(a.id); }
      else openApp(a.id);
    });
    dock.appendChild(b);
  });
  var sb = $("#sbGrid");
  sb.innerHTML = "";
  APPS.forEach(function (a) {
    var b = document.createElement("button");
    b.className = "sb-app";
    b.innerHTML = '<span class="dock-ico" style="background:' + a.color + '">' + esc(a.letter) + '</span><span>' + esc(a.name) + '</span>';
    b.addEventListener("click", function () { openApp(a.id); });
    sb.appendChild(b);
  });
}

/* ================= App renderers ================= */

function renderAppBody(id) {
  var w = wins[id];
  if (!w) return;
  var body = w.el.querySelector("[data-body]");
  var fn = {
    finder: renderFinder, notes: renderNotes, mail: renderMail,
    assistant: renderAssistant, photos: renderPhotos, music: renderMusic,
    settings: renderSettings, terminal: renderTerminal, trash: renderTrash,
    journal: renderJournal, simple: renderSimple
  }[id];
  if (fn) fn(body);
}

/* ---------- Finder ---------- */

function projectById(id) { for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].id === id) return PROJECTS[i]; return null; }

function renderFinder(body) {
  var p = persist.finder;
  if (p.view === "detail") {
    var pr = projectById(p.id) || PROJECTS[0];
    var others = PROJECTS.filter(function (x) { return x.id !== pr.id; }).slice(0, 3);
    body.innerHTML =
      '<div class="finder"><div class="f-main"><div class="f-tools">' +
        '<button class="f-back" data-f="back">&larr; Projects</button>' +
        '<span style="font-size:15px;color:var(--muted)">Studio Kala &rsaquo; Work &rsaquo; ' + esc(pr.name) + '</span>' +
      '</div><div class="f-detail">' +
        '<img class="hero" src="' + pr.img + '" alt="' + esc(pr.name) + '">' +
        '<div class="f-dpad"><h2>' + esc(pr.name) + '</h2>' +
        '<p class="f-lede">' + esc(pr.cat) + ' &middot; ' + pr.year + '. ' + esc(pr.result) + '</p>' +
        '<div class="f-stats">' + pr.stats.map(function (s) { return '<div class="f-stat"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join("") + '</div>' +
        '<p>' + esc(pr.about) + '</p>' +
        '<div class="f-actions"><button class="w-btn primary" data-f="photos" data-id="' + pr.id + '">See photos</button>' +
        '<button class="w-btn" data-f="copy" data-id="' + pr.id + '">Copy link</button></div>' +
        '<div class="f-thumbs">' + others.map(function (o) { return '<img src="' + o.img + '" alt="' + esc(o.name) + '" data-f="open" data-id="' + o.id + '" style="cursor:pointer">'; }).join("") + '</div>' +
        '</div></div>' +
        '<div class="f-status">Studio Kala &rsaquo; Work &rsaquo; ' + esc(pr.name) + '</div>' +
      '</div></div>';
  } else {
    var q = (p.q || "").toLowerCase();
    var list = PROJECTS.filter(function (x) {
      var okCat = p.cat === "All" || x.cat === p.cat;
      var okQ = !q || (x.name + " " + x.cat + " " + x.result + " " + (x.tags || "")).toLowerCase().indexOf(q) > -1;
      return okCat && okQ;
    });
    var cats = ["All"].concat(PROJECTS.map(function (x) { return x.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
    body.innerHTML =
      '<div class="finder">' +
      '<div class="f-side"><h4>Favorites</h4>' +
        cats.map(function (c) { return '<button data-f="cat" data-cat="' + esc(c) + '" class="' + (p.cat === c ? "on" : "") + '">' + (c === "All" ? "Projects" : esc(c)) + '</button>'; }).join("") +
      '</div>' +
      '<div class="f-main"><div class="f-tools">' +
        '<input type="search" placeholder="Search projects" value="' + esc(p.q || "") + '" data-f="search" aria-label="Search projects">' +
        '<span style="font-size:14px;color:var(--muted)">' + list.length + ' items</span>' +
      '</div>' +
      '<div class="f-grid">' + (list.length ? list.map(function (x) {
        return '<button class="f-card" data-f="open" data-id="' + x.id + '">' +
          '<img src="' + x.img + '" alt="' + esc(x.name) + '" loading="lazy">' +
          '<span class="f-meta"><span class="f-name">' + esc(x.name) + '</span><br><span class="f-cat">' + esc(x.cat) + ' &middot; ' + x.year + '</span></span>' +
        '</button>';
      }).join("") : '<p class="m-empty">No project matches that search. Try another word.</p>') + '</div>' +
      '<div class="f-status">Studio Kala &rsaquo; Work &rsaquo; Projects (' + list.length + ' items)</div>' +
      '</div></div>';
  }
  body.querySelectorAll("[data-f]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var f = el.dataset.f;
      if (f === "open") { persist.finder.view = "detail"; persist.finder.id = el.dataset.id; renderFinder(body); }
      if (f === "back") { persist.finder.view = "grid"; renderFinder(body); }
      if (f === "cat") { persist.finder.cat = el.dataset.cat; persist.finder.view = "grid"; renderFinder(body); }
      if (f === "photos") { openApp("photos"); persist.photos.album = projectById(el.dataset.id).cat; persist.photos.view = "grid"; renderAppBody("photos"); }
      if (f === "copy") {
        var link = "https://studiokala.in/work/" + el.dataset.id;
        var done = function () { showToast("Link copied."); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(done, done);
        else done();
      }
    });
  });
  var s = body.querySelector('[data-f="search"]');
  if (s) s.addEventListener("input", function () { persist.finder.q = s.value; var pos = s.selectionStart; renderFinder(body); var s2 = body.querySelector('[data-f="search"]'); if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); } });
}

/* ---------- Notes ---------- */

function noteById(id) { for (var i = 0; i < NOTES.length; i++) if (NOTES[i].id === id) return NOTES[i]; return NOTES[0]; }

function renderNotes(body) {
  var cur = noteById(persist.notes.id);
  body.innerHTML =
    '<div class="notes"><div class="n-side">' +
      NOTES.map(function (n) {
        return '<button data-n="' + n.id + '" class="' + (n.id === cur.id ? "on" : "") + '"><span class="n-title">' + esc(n.title) + '</span><br><span class="n-date">' + esc(n.date) + '</span></button>';
      }).join("") +
    '</div><div class="n-read"><div class="pad">' +
      '<h2>' + esc(cur.title) + '</h2><div class="n-meta">' + esc(cur.date) + ' &middot; Studio Kala</div>' + cur.html +
    '</div></div></div>';
  body.querySelectorAll("[data-n]").forEach(function (el) {
    el.addEventListener("click", function () { persist.notes.id = el.dataset.n; renderNotes(body); });
  });
}

/* ---------- Mail ---------- */

function mailList(folder) {
  if (folder === "sent") return persist.mail.sent || [];
  if (folder === "drafts") return persist.mail.drafts || [];
  return [WELCOME_MAIL];
}

function renderMail(body) {
  var m = persist.mail;
  var inboxCount = 1;
  var sentCount = (m.sent || []).length;
  var draftCount = (m.drafts || []).length;
  var main = "";
  if (m.folder === "compose") {
    main = '<div class="pad"><form class="m-form" id="mailForm" novalidate>' +
      '<label>To</label><input type="text" value="studio@studiokala.in" readonly aria-label="To">' +
      '<div class="m-row"><div><label for="mfName">Your name</label><input id="mfName" type="text" autocomplete="name"><div class="err" id="eName"></div></div>' +
      '<div><label for="mfEmail">Your email</label><input id="mfEmail" type="email" autocomplete="email"><div class="err" id="eEmail"></div></div></div>' +
      '<label for="mfSubj">Subject</label><input id="mfSubj" type="text" value="' + esc(m.composeSubject || "New project") + '"><div class="err" id="eSubj"></div>' +
      '<label for="mfMsg">Message</label><textarea id="mfMsg" placeholder="Tell us what needs to change, when you need it and the budget you are working with.">' + esc(m.composeBody || "") + '</textarea><div class="err" id="eMsg"></div>' +
      '<div class="m-foot"><button type="submit" class="w-btn primary">Send</button>' +
      '<button type="button" class="w-btn" id="saveDraft">Save draft</button>' +
      '<button type="button" class="w-btn" id="bookCall">Book a 30 min call</button></div>' +
      '<div id="mailOk"></div></form></div>';
  } else if (m.msg) {
    var msg = m.msg;
    main = '<div class="pad"><button class="f-back" id="mBack">&larr; ' + esc(m.folder === "sent" ? "Sent" : m.folder === "drafts" ? "Drafts" : "Inbox") + '</button>' +
      '<h2 style="font-size:26px;margin:16px 0 4px">' + esc(msg.subj) + '</h2>' +
      '<p style="color:var(--muted);font-size:15px;margin:0 0 16px">From: ' + esc(msg.from) + (msg.date ? ' &middot; ' + esc(msg.date) : '') + '</p>' +
      '<p style="white-space:pre-wrap">' + esc(msg.body) + '</p>' +
      (m.folder === "inbox" ? '<div class="m-foot"><button class="w-btn primary" id="mReply">Reply</button></div>' : '') +
      '</div>';
  } else {
    var items = mailList(m.folder);
    main = '<div class="m-list">' + (items.length ? items.map(function (it, i) {
      return '<button class="m-item" data-mi="' + i + '"><span class="m-from">' + esc(it.from) + '</span><br><span class="m-subj">' + esc(it.subj) + '</span><br><span class="m-prev">' + esc(it.body.split("\n")[0]) + '</span></button>';
    }).join("") : '<p class="m-empty">' + (m.folder === "sent" ? "Nothing sent yet. Your sent mail will appear here." : "No drafts yet.") + '</p>') + '</div>' +
    '<p class="m-empty" style="border-top:1px solid var(--soft)">Or book a 30 minute call: write to us from New Message and pick a time.</p>';
  }
  body.innerHTML =
    '<div class="mail"><div class="m-side">' +
      '<button class="w-btn primary" id="mNew">New Message</button>' +
      '<button class="m-folder ' + (m.folder === "inbox" ? "on" : "") + '" data-folder="inbox"><span>Inbox</span><span class="m-badge">' + inboxCount + '</span></button>' +
      '<button class="m-folder ' + (m.folder === "sent" ? "on" : "") + '" data-folder="sent"><span>Sent</span>' + (sentCount ? '<span class="m-badge">' + sentCount + '</span>' : '<span></span>') + '</button>' +
      '<button class="m-folder ' + (m.folder === "drafts" ? "on" : "") + '" data-folder="drafts"><span>Drafts</span>' + (draftCount ? '<span class="m-badge">' + draftCount + '</span>' : '<span></span>') + '</button>' +
    '</div><div class="m-main">' + main + '</div></div>';

  body.querySelectorAll("[data-folder]").forEach(function (el) {
    el.addEventListener("click", function () { persist.mail.folder = el.dataset.folder; persist.mail.msg = null; renderMail(body); });
  });
  var nb = $("#mNew", body);
  if (nb) nb.addEventListener("click", function () { persist.mail.folder = "compose"; persist.mail.composeSubject = "New project"; persist.mail.composeBody = ""; renderMail(body); });
  var back = $("#mBack", body);
  if (back) back.addEventListener("click", function () { persist.mail.msg = null; renderMail(body); });
  var rep = $("#mReply", body);
  if (rep) rep.addEventListener("click", function () {
    persist.mail.folder = "compose";
    persist.mail.composeSubject = "Re: " + WELCOME_MAIL.subj;
    persist.mail.composeBody = "\n\nOn your note:\n" + WELCOME_MAIL.body;
    renderMail(body);
  });
  body.querySelectorAll("[data-mi]").forEach(function (el) {
    el.addEventListener("click", function () { persist.mail.msg = mailList(m.folder)[+el.dataset.mi]; renderMail(body); });
  });
  var form = $("#mailForm", body);
  if (form) {
    var book = $("#bookCall", body);
    if (book) book.addEventListener("click", function () {
      var s = $("#mfSubj", body); if (s) s.value = "Book a 30 min call";
      var t = $("#mfMsg", body); if (t && !t.value.trim()) t.value = "Hi, I would like to book a 30 min call. I am free on ";
      if (t) t.focus();
    });
    var sd = $("#saveDraft", body);
    if (sd) sd.addEventListener("click", function () {
      var d = { from: "You", subj: $("#mfSubj", body).value.trim() || "(No subject)", body: $("#mfMsg", body).value.trim() || "(Empty draft)", date: "Today" };
      persist.mail.drafts.push(d);
      try { localStorage.setItem("sk-drafts", JSON.stringify(persist.mail.drafts)); } catch (e) {}
      showToast("Draft saved.");
      persist.mail.folder = "drafts"; persist.mail.msg = null; renderMail(body);
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#mfName", body).value.trim();
      var email = $("#mfEmail", body).value.trim();
      var subj = $("#mfSubj", body).value.trim();
      var msg = $("#mfMsg", body).value.trim();
      var ok = true;
      $("#eName", body).textContent = name ? "" : "Please add your name.";
      if (!name) ok = false;
      var emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      $("#eEmail", body).textContent = emOk ? "" : "Please add a valid email.";
      if (!emOk) ok = false;
      $("#eSubj", body).textContent = subj ? "" : "Please add a subject.";
      if (!subj) ok = false;
      $("#eMsg", body).textContent = msg.length >= 10 ? "" : "Please write at least a line or two.";
      if (msg.length < 10) ok = false;
      if (!ok) return;
      var sent = { from: name + " <" + email + ">", subj: subj, body: msg, date: "Today" };
      persist.mail.sent.push(sent);
      try { localStorage.setItem("sk-sent", JSON.stringify(persist.mail.sent)); } catch (e) {}
      $("#mailOk", body).innerHTML = '<div class="m-ok"><b>Sent.</b> Thanks, ' + esc(name) + '. We reply within one business day. Your mail is saved in Sent.</div>';
      form.reset();
      $("#mfSubj", body).value = "New project";
    });
  }
}

/* ---------- Assistant ---------- */

var ASST_LOG = [];
function asstReply(q) {
  var s = q.toLowerCase();
  if (/(price|cost|much|rupee|rs\.?|budget)/.test(s)) return "A marketing website starts at Rs. 1,00,000. Discovery is Rs. 50,000. Final price follows the real scope. The full list is in Notes, under Pricing.";
  if (/(work|project|portfolio|show)/.test(s)) return "Open Finder. There are 9 projects in there, from a Jaipur jewellery house to a Mumbai cafe chain. Pick any card to see the result.";
  if (/(do|service|build|offer|website|store|platform)/.test(s)) return "We design and build websites, online stores and custom platforms for Indian brands. Our fastest path is to open Finder and look at the work.";
  if (/(contact|mail|call|talk|human|reach)/.test(s)) return "Write to us from the Mail app, or book a 30 minute call from the date widget on the desktop. We reply within one business day.";
  if (/(desktop|this site|here|play|try)/.test(s)) return "Everything on this desktop works. Drag a window, try the Terminal, play Studio FM, search with Spotlight, or send us a mail from the Mail app.";
  if (/^(hi|hello|hey|namaste)\b/.test(s)) return "Hello. I can help with what we do, what it costs, and where the work is. Try one of the chips below.";
  return "I can help with what we do, what it costs, and where the work is. Try one of the chips below, or ask in plain words.";
}
function renderAssistant(body) {
  body.innerHTML =
    '<div class="asst"><div class="asst-head"><div class="asst-orb"></div>' +
    '<h2>Ask anything, or say what you want to build</h2><p>Answers come from the studio, not from a script on the internet.</p></div>' +
    '<div class="asst-log" id="asstLog">' +
      (ASST_LOG.length ? ASST_LOG.map(function (m) { return '<div class="bubble ' + m.who + '">' + esc(m.text) + '</div>'; }).join("") : '<div class="bubble bot">Hello, I am the Studio Kala assistant. Ask me about the work, the pricing, or what you can build here.</div>') +
    '</div>' +
    '<div class="chips" id="asstChips">' +
      ["What does Studio Kala do?", "How much does a website cost?", "Show me your work", "What can I build here?"].map(function (c) { return '<button class="chip" data-chip="' + esc(c) + '">' + esc(c) + '</button>'; }).join("") +
    '</div>' +
    '<div class="asst-input"><input id="asstIn" type="text" placeholder="Type a question" aria-label="Type a question"><button class="w-btn primary" id="asstSend">Send</button></div></div>';
  var log = $("#asstLog", body);
  function ask(text) {
    ASST_LOG.push({ who: "user", text: text });
    ASST_LOG.push({ who: "bot", text: asstReply(text) });
    renderAssistant(body);
    var l2 = $("#asstLog", body);
    if (l2) l2.scrollTop = l2.scrollHeight;
    var inp = $("#asstIn", body);
    if (inp) inp.focus();
  }
  body.querySelectorAll("[data-chip]").forEach(function (el) {
    el.addEventListener("click", function () { ask(el.dataset.chip); });
  });
  var send = $("#asstSend", body);
  var inp = $("#asstIn", body);
  function go() { var v = inp.value.trim(); if (v) ask(v); }
  send.addEventListener("click", go);
  inp.addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  if (log) log.scrollTop = log.scrollHeight;
}

/* ---------- Photos ---------- */

function renderPhotos(body) {
  var p = persist.photos;
  var albums = ["All"].concat(PROJECTS.map(function (x) { return x.cat; }).filter(function (v, i, a) { return a.indexOf(v) === i; }));
  var list = PROJECTS.filter(function (x) { return p.album === "All" || x.cat === p.album; });
  if (p.view === "viewer") {
    var cur = list[p.idx] || list[0];
    body.innerHTML =
      '<div class="photos"><div class="p-viewer" style="flex:1">' +
      '<div class="p-stage"><button class="p-nav" data-p="prev" aria-label="Previous photo">&larr;</button>' +
      '<img src="' + cur.img + '" alt="' + esc(cur.name) + '">' +
      '<button class="p-nav" data-p="next" aria-label="Next photo">&rarr;</button></div>' +
      '<div class="p-bar"><button class="f-back" data-p="grid">&larr; All photos</button>' +
      '<span>' + esc(cur.name) + ' &middot; ' + (p.idx + 1) + ' of ' + list.length + '</span>' +
      '<button class="w-btn primary" data-p="open" data-id="' + cur.id + '">Open Project</button></div>' +
      '<div class="p-strip">' + list.map(function (x, i) { return '<img src="' + x.img + '" alt="' + esc(x.name) + '" data-p="jump" data-i="' + i + '" class="' + (i === p.idx ? "on" : "") + '">'; }).join("") + '</div>' +
      '</div></div>';
  } else {
    body.innerHTML =
      '<div class="photos"><div class="p-side">' +
        albums.map(function (a) {
          var n = a === "All" ? PROJECTS.length : PROJECTS.filter(function (x) { return x.cat === a; }).length;
          return '<button data-p="album" data-a="' + esc(a) + '" class="' + (p.album === a ? "on" : "") + '"><span>' + esc(a) + '</span><span>' + n + '</span></button>';
        }).join("") +
      '</div><div class="p-grid">' +
        list.map(function (x, i) {
          return '<button class="p-cell" data-p="view" data-i="' + i + '"><img src="' + x.img + '" alt="' + esc(x.name) + '" loading="lazy"><span class="p-cap">' + esc(x.name) + ' &middot; ' + x.year + '</span></button>';
        }).join("") +
      '</div></div>';
  }
  body.querySelectorAll("[data-p]").forEach(function (el) {
    el.addEventListener("click", function () {
      var a = el.dataset.p;
      if (a === "album") { p.album = el.dataset.a; p.view = "grid"; renderPhotos(body); }
      if (a === "view") { p.idx = +el.dataset.i; p.view = "viewer"; renderPhotos(body); }
      if (a === "grid") { p.view = "grid"; renderPhotos(body); }
      if (a === "prev") { p.idx = (p.idx - 1 + list.length) % list.length; renderPhotos(body); }
      if (a === "next") { p.idx = (p.idx + 1) % list.length; renderPhotos(body); }
      if (a === "jump") { p.idx = +el.dataset.i; renderPhotos(body); }
      if (a === "open") { openApp("finder", { project: el.dataset.id }); }
    });
  });
}

/* ---------- Music ---------- */

function fmtDur(sec) {
  sec = Math.max(0, Math.floor(sec));
  return Math.floor(sec / 60) + ":" + (sec % 60 < 10 ? "0" : "") + (sec % 60);
}

function updateMusicUI() {
  var body = wins.music ? wins.music.el.querySelector("[data-body]") : null;
  if (!body) return;
  var playing = Audio2.mode === "music";
  body.querySelectorAll(".mu-track").forEach(function (el) {
    var on = playing && +el.dataset.t === Audio2.trackIdx;
    el.classList.toggle("on", on);
    var tag = el.querySelector(".mu-playtag");
    if (tag) tag.textContent = on ? "Playing" : "";
  });
  var pb = $("#muPlay", body);
  if (pb) pb.textContent = playing ? "Pause" : "Play";
  var now = $("#muNow", body);
  if (now) now.textContent = playing ? "Now playing: " + TRACKS[Audio2.trackIdx].name : "Paused. Pick a track.";
}

function updateMusicTime() {
  var body = wins.music ? wins.music.el.querySelector("[data-body]") : null;
  if (!body || Audio2.mode !== "music") return;
  var tr = TRACKS[Audio2.trackIdx];
  var el = Math.min(Audio2.elapsed(), tr.dur);
  var seek = $("#muSeek", body);
  if (seek && document.activeElement !== seek) seek.value = Math.round(el / tr.dur * 100);
  var t = $("#muTime", body);
  if (t) t.textContent = fmtDur(el) + " / " + tr.label;
}

function renderMusic(body) {
  var playing = Audio2.mode === "music";
  body.innerHTML =
    '<div class="music"><div class="mu-list">' +
      TRACKS.map(function (tr, i) {
        return '<button class="mu-track ' + (playing && Audio2.trackIdx === i ? "on" : "") + '" data-t="' + i + '">' +
          '<span class="mu-art">' + esc(tr.name.charAt(0)) + '</span>' +
          '<span><span class="mu-name">' + esc(tr.name) + '</span><br><span class="mu-meta">Studio Kala &middot; <span class="mu-playtag">' + (playing && Audio2.trackIdx === i ? "Playing" : "") + '</span></span></span>' +
          '<span class="mu-dur">' + tr.label + '</span></button>';
      }).join("") +
    '</div><div class="mu-bar">' +
      '<div class="mu-now" id="muNow">' + (playing ? "Now playing: " + TRACKS[Audio2.trackIdx].name : "Paused. Pick a track.") + '</div>' +
      '<input id="muSeek" class="mu-seek" type="range" min="0" max="100" value="0" aria-label="Seek">' +
      '<div class="mu-ctrl"><button class="w-btn" id="muPrev">Prev</button>' +
      '<button class="w-btn primary" id="muPlay">' + (playing ? "Pause" : "Play") + '</button>' +
      '<button class="w-btn" id="muNext">Next</button>' +
      '<input id="muVol" class="mu-vol" type="range" min="0" max="100" value="' + Math.round(Audio2.volume * 100) + '" aria-label="Volume">' +
      '<span class="mu-time" id="muTime">0:00 / ' + TRACKS[persist.music.track].label + '</span></div>' +
    '</div></div>';
  body.querySelectorAll(".mu-track").forEach(function (el) {
    el.addEventListener("click", function () {
      var i = +el.dataset.t;
      persist.music.track = i;
      if (Audio2.mode === "music" && Audio2.trackIdx === i) { Audio2.stop(); }
      else Audio2.playMusic(i);
      renderMusic(body);
    });
  });
  $("#muPlay", body).addEventListener("click", function () {
    if (Audio2.mode === "music") Audio2.stop();
    else Audio2.playMusic(persist.music.track);
    renderMusic(body);
  });
  $("#muPrev", body).addEventListener("click", function () { Audio2.prevTrack(); renderMusic(body); });
  $("#muNext", body).addEventListener("click", function () { Audio2.nextTrack(); renderMusic(body); });
  $("#muVol", body).addEventListener("input", function (e) { Audio2.setVolume(e.target.value / 100); });
  $("#muSeek", body).addEventListener("input", function (e) {
    if (Audio2.mode !== "music") return;
    var tr = TRACKS[Audio2.trackIdx];
    Audio2.step = Math.floor(e.target.value / 100 * tr.dur / Audio2.stepDur());
    updateMusicTime();
  });
}

/* ---------- Settings ---------- */

function renderSettings(body) {
  var pane = persist.settings.pane;
  var main = "";
  if (pane === "appearance") {
    main = '<h2 style="font-size:24px;margin:0 0 6px">Appearance</h2><p>Light or dark. The whole desktop follows.</p>' +
      '<div class="seg"><button data-th="light" class="' + (state.theme === "light" ? "on" : "") + '">Light</button>' +
      '<button data-th="dark" class="' + (state.theme === "dark" ? "on" : "") + '">Dark</button></div>' +
      '<h3 style="margin-top:26px">Wallpaper</h3><div class="wp-picks">' +
      '<button class="wp-pick ' + (state.wallpaper === "kala" ? "on" : "") + '" data-wp="kala"><img src="assets/img/wallpaper-light.jpg" alt="Kala wallpaper"><span>Kala</span></button>' +
      '<button class="wp-pick ' + (state.wallpaper === "paper" ? "on" : "") + '" data-wp="paper"><span class="wp-flat"></span><span>Paper</span></button>' +
      '<button class="wp-pick ' + (state.wallpaper === "ink" ? "on" : "") + '" data-wp="ink"><img src="assets/img/wallpaper-dark.jpg" alt="Ink wallpaper"><span>Ink</span></button>' +
      '</div><p style="color:var(--muted);font-size:15px;margin-top:16px">Kala follows your light or dark setting. Paper stays plain. Ink stays dark.</p>';
  } else if (pane === "about") {
    main = '<h2 style="font-size:24px;margin:0 0 14px">About This Studio</h2>' +
      '<dl class="kv"><dt>Name</dt><dd>Studio Kala</dd>' +
      '<dt>Version</dt><dd>1.0 (Build 2026.11)</dd>' +
      '<dt>Studios</dt><dd>Jaipur + Mumbai, India</dd>' +
      '<dt>Founded</dt><dd>2019</dd>' +
      '<dt>Serial</dt><dd>SK-2026-JPR</dd>' +
      '<dt>Contact</dt><dd>studio@studiokala.in</dd></dl>' +
      '<p style="margin-top:18px">Studio Kala OS is our portfolio, rebuilt as a working desktop. Everything you see is real work. Copyright 2026 Vasux.in.</p>' +
      '<div class="f-actions"><button class="w-btn primary" id="aboutMail">Work with us</button><button class="w-btn" id="aboutNotes">Read the notes</button></div>';
  } else {
    main = '<h2 style="font-size:24px;margin:0 0 14px">Privacy and Security</h2>' +
      '<h3>No tracking</h3><p>We do not install cookies or run third-party trackers on this desktop.</p>' +
      '<h3>Analytics</h3><p>None installed. We do not count you.</p>' +
      '<h3>Your mail</h3><p>Mail you send from the Mail app is stored only in your own browser, in local storage. It never leaves your device.</p>' +
      '<h3>Booking</h3><p>Calls are booked by mail. No calendar account is needed.</p>';
  }
  body.innerHTML =
    '<div class="settings"><div class="s-side">' +
      ["appearance", "about", "privacy"].map(function (p) {
        var label = p === "appearance" ? "Appearance" : p === "about" ? "About" : "Privacy and Security";
        return '<button data-pane="' + p + '" class="' + (pane === p ? "on" : "") + '">' + label + '</button>';
      }).join("") +
    '</div><div class="s-main"><div class="pad">' + main + '</div></div></div>';
  body.querySelectorAll("[data-pane]").forEach(function (el) {
    el.addEventListener("click", function () { persist.settings.pane = el.dataset.pane; renderSettings(body); });
  });
  body.querySelectorAll("[data-th]").forEach(function (el) {
    el.addEventListener("click", function () { setTheme(el.dataset.th); renderSettings(body); });
  });
  body.querySelectorAll("[data-wp]").forEach(function (el) {
    el.addEventListener("click", function () { state.wallpaper = el.dataset.wp; applyTheme(); renderSettings(body); });
  });
  var am = $("#aboutMail", body);
  if (am) am.addEventListener("click", function () { openApp("mail", { compose: true }); });
  var an = $("#aboutNotes", body);
  if (an) an.addEventListener("click", function () { openApp("notes"); });
}

/* ---------- Terminal ---------- */

function termPrint(body, text, cls) {
  var out = $("#termOut", body);
  if (!out) return;
  var d = document.createElement("div");
  d.className = "t-out" + (cls ? " " + cls : "");
  d.textContent = text;
  out.appendChild(d);
  var term = body.querySelector(".term");
  if (term) term.scrollTop = term.scrollHeight;
}

function termRun(cmd, body) {
  var parts = cmd.trim().split(/\s+/);
  var c = (parts[0] || "").toLowerCase();
  var arg = parts.slice(1).join(" ");
  if (c === "") return;
  if (c === "help") {
    termPrint(body, "Commands: about, ls, open <app>, contact, neofetch, whoami, date, echo, pwd, clear, exit");
    termPrint(body, "Try: open finder, open photos, neofetch", "t-dim");
  } else if (c === "about") {
    termPrint(body, "Studio Kala. A design studio in Jaipur and Mumbai. We build websites, online stores and custom platforms. Open Finder to see the work.");
  } else if (c === "ls") {
    termPrint(body, APPS.map(function (a) { return a.id; }).join("  "));
  } else if (c === "open") {
    var target = (arg || "").toLowerCase();
    var map = { finder: "finder", notes: "notes", mail: "mail", assistant: "assistant", photos: "photos", music: "music", settings: "settings", terminal: "terminal", trash: "trash", journal: "journal" };
    if (map[target]) { openApp(map[target]); termPrint(body, "Opened " + map[target] + "."); }
    else termPrint(body, "kala: no app named \"" + arg + "\". Try: ls");
  } else if (c === "contact") {
    termPrint(body, "studio@studiokala.in\nJaipur + Mumbai, India\nWe reply within one business day.");
  } else if (c === "neofetch") {
    termPrint(body, "  _  __   _    _        _    \n | |/ /  / \\  | |      / \\   \n | ' /  / _ \\ | |     / _ \\  \n | . \\ / ___ \\| |___ / ___ \\ \n |_|\\_\\/_/   \\_\\_____/_/   \\_\\");
    termPrint(body, "Studio Kala\nOS: Kala OS 1.0\nHost: Jaipur + Mumbai\nShell: kala 1.0\nUptime: shipping weekly since 2019\nChip: K1\nMemory: unlimited ideas\nAccent: #E0311C");
  } else if (c === "whoami") {
    termPrint(body, "visitor");
  } else if (c === "date") {
    termPrint(body, istNow().toString());
  } else if (c === "echo") {
    termPrint(body, arg);
  } else if (c === "pwd") {
    termPrint(body, "/Users/visitor");
  } else if (c === "clear") {
    var out = $("#termOut", body);
    if (out) out.innerHTML = "";
  } else if (c === "exit") {
    closeWindow("terminal");
  } else {
    termPrint(body, "kala: command not found: " + c + ". Type \"help\".");
  }
}

function renderTerminal(body) {
  body.innerHTML =
    '<div class="term" id="termBox"><div id="termOut"></div>' +
    '<div class="t-line"><span class="t-prompt">visitor@studio-kala ~ %</span><input id="termIn" type="text" autocomplete="off" spellcheck="false" aria-label="Terminal input"></div></div>';
  termPrint(body, "Last login: just now on ttys001", "t-dim");
  termPrint(body, "Welcome to Studio Kala OS. Type \"help\" to get started.");
  var inp = $("#termIn", body);
  inp.focus();
  inp.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var cmd = inp.value;
      termPrint(body, "visitor@studio-kala ~ % " + cmd, "t-dim");
      persist.terminal.hist.push(cmd);
      persist.terminal.hi = persist.terminal.hist.length;
      inp.value = "";
      termRun(cmd, body);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (persist.terminal.hi > 0) { persist.terminal.hi--; inp.value = persist.terminal.hist[persist.terminal.hi] || ""; }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (persist.terminal.hi < persist.terminal.hist.length) { persist.terminal.hi++; inp.value = persist.terminal.hist[persist.terminal.hi] || ""; }
    }
  });
  body.querySelector(".term").addEventListener("click", function () { inp.focus(); });
}

/* ---------- Trash ---------- */

function renderTrash(body) {
  var t = persist.trash;
  if (t.emptied) {
    body.innerHTML = '<div class="pad"><div class="tr-head"><p>Trash is empty.</p><button class="w-btn" id="trRestore">Restore the files</button></div>' +
      '<p style="color:var(--muted);padding:0 18px">The rejected patterns are gone. They were never going to come back anyway.</p></div>';
    $("#trRestore", body).addEventListener("click", function () { t.emptied = false; t.sel = null; renderTrash(body); });
    return;
  }
  var sel = t.sel !== null ? TRASH[t.sel] : null;
  body.innerHTML = '<div class="pad" style="padding-bottom:0"><div class="tr-head"><p><b>' + TRASH.length + ' files here.</b> These are patterns clients asked for, and we rejected.</p>' +
    '<button class="w-btn" id="trEmpty">Empty Trash</button></div></div>' +
    '<div class="trash-list">' + TRASH.map(function (f, i) {
      return '<button class="tr-row ' + (t.sel === i ? "on" : "") + '" data-tr="' + i + '"><span class="tr-ico">x</span><span class="tr-name">' + esc(f.name) + '</span><span class="tr-size">' + esc(f.size) + '</span></button>';
    }).join("") + '</div>' +
    (sel ? '<div class="tr-why"><b>Why it is here:</b> ' + esc(sel.why) + '</div>' :
      '<p style="color:var(--muted);padding:4px 18px 22px;font-size:15px">' + TRASH.length + ' items &middot; select a file to see why it was rejected.</p>');
  body.querySelectorAll("[data-tr]").forEach(function (el) {
    el.addEventListener("click", function () { t.sel = +el.dataset.tr; renderTrash(body); });
  });
  $("#trEmpty", body).addEventListener("click", function () {
    t.emptied = true; t.sel = null; renderTrash(body); showToast("Trash emptied.");
  });
}

/* ---------- Journal ---------- */

function renderJournal(body) {
  var j = persist.journal;
  if (j.id) {
    var a = null;
    JOURNAL.forEach(function (x) { if (x.id === j.id) a = x; });
    if (a) {
      body.innerHTML = '<div class="pad j-art"><button class="f-back" id="jBack">&larr; Journal</button>' +
        '<div class="j-eyebrow" style="font-family:\'IBM Plex Mono\',monospace;font-size:11px;letter-spacing:0.14em;color:var(--accent);margin:16px 0 6px">INSIGHTS</div>' +
        '<h2>' + esc(a.title) + '</h2><div class="n-meta">' + esc(a.date) + ' &middot; ' + esc(a.mins) + ' &middot; Studio Kala</div>' + a.html +
        '<div class="f-actions" style="margin-top:20px"><button class="w-btn primary" id="jFinder">Open Finder</button></div></div>';
      $("#jBack", body).addEventListener("click", function () { j.id = null; renderJournal(body); });
      $("#jFinder", body).addEventListener("click", function () { openApp("finder"); });
      return;
    }
  }
  body.innerHTML = '<div class="pad" style="padding-bottom:6px"><h2 style="font-size:24px;margin:0">Journal</h2><p style="color:var(--muted);margin:6px 0 0">Notes from the studio. Plain words, no noise.</p></div>' +
    '<div class="j-list">' + JOURNAL.map(function (a) {
      return '<button class="j-item" data-j="' + a.id + '"><span class="j-eyebrow">INSIGHTS</span><h3>' + esc(a.title) + '</h3><span class="j-meta">' + esc(a.date) + ' &middot; ' + esc(a.mins) + '</span></button>';
    }).join("") + '</div>';
  body.querySelectorAll("[data-j]").forEach(function (el) {
    el.addEventListener("click", function () { j.id = el.dataset.j; renderJournal(body); });
  });
}

/* ---------- Simplified view ---------- */

function renderSimple(body) {
  body.innerHTML = '<div class="pad">' +
    '<h2 style="font-size:26px;margin:0 0 6px">Simplified View</h2>' +
    '<p>The full desktop needs JavaScript. This is the same content, in plain form.</p>' +
    '<h3>Work</h3><ul>' + PROJECTS.map(function (x) { return '<li><b>' + esc(x.name) + '</b> (' + esc(x.cat) + ', ' + x.year + '). ' + esc(x.result) + '</li>'; }).join("") + '</ul>' +
    '<h3>Pricing</h3><ul><li>Discovery: Rs. 50,000</li><li>Marketing website: from Rs. 1,00,000</li><li>Shopify storefront: Rs. 1,25,000</li><li>Headless Shopify: Rs. 1,85,000</li><li>Custom platform: Rs. 2,40,000</li><li>Ongoing care: Rs. 18,000 per month</li></ul>' +
    '<h3>Journal</h3><ul>' + JOURNAL.map(function (a) { return '<li>' + esc(a.title) + ' (' + esc(a.date) + ')</li>'; }).join("") + '</ul>' +
    '<h3>Contact</h3><p>Write to studio@studiokala.in. We reply within one business day. Jaipur and Mumbai, India.</p>' +
    '<p style="color:var(--muted);font-size:15px">Copyright 2026 Vasux.in. Crafted by vasux.in.</p></div>';
}

/* ================= FM widget ================= */

function updateFmUI() {
  var btn = $("#fmPlay");
  if (btn) btn.textContent = Audio2.mode === "fm" ? "Pause" : "Play";
  var st = $("#fmState");
  if (st) st.textContent = Audio2.mode === "fm" ? "Playing" : "Paused";
  var t = $("#wFm .w-title");
  if (t) t.textContent = FM_MOODS[Audio2.fmIdx].name;
}

/* ================= Menus ================= */

function frontWindowId() {
  var best = null, bestZ = -1;
  Object.keys(wins).forEach(function (id) {
    var z = parseInt(wins[id].el.style.zIndex || "0", 10);
    if (wins[id].el.style.display !== "none" && z > bestZ) { bestZ = z; best = id; }
  });
  return best;
}

function restartOS() {
  closeMenus();
  var boot = $("#boot");
  boot.classList.remove("gone");
  var fill = $("#bootFill");
  fill.style.width = "0";
  var p = 0;
  var iv = setInterval(function () {
    p += 14;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(finishBoot, 200); }
    fill.style.width = p + "%";
  }, 110);
  setTimeout(finishBoot, 3500);
}
function shutdownOS() {
  closeMenus();
  $("#shutdown").hidden = false;
}

function menuItems(name) {
  if (name === "logo") return [
    { label: "About This Studio", act: function () { openApp("settings", { pane: "about" }); } },
    { label: "Restart", act: restartOS },
    { label: "Shut Down", act: shutdownOS },
    { label: "Simplified View", act: function () { openApp("simple"); } }
  ];
  if (name === "file") return [
    { label: "New Window", key: "N", act: function () { openApp("finder"); } },
    { label: "Close Window", key: "W", act: function () { var f = frontWindowId(); if (f) closeWindow(f); }, disabled: !frontWindowId() },
    { label: "About This Studio", act: function () { openApp("settings", { pane: "about" }); } }
  ];
  if (name === "edit") return [
    { label: "Copy", key: "C", act: function () {
      var sel = window.getSelection();
      if (sel && sel.toString()) { try { document.execCommand("copy"); showToast("Copied."); } catch (e) { showToast("Nothing to copy."); } }
      else showToast("Nothing selected to copy.");
    } },
    { label: "Select All", key: "A", act: function () {
      var f = frontWindowId();
      if (f) { var b = wins[f].el.querySelector("[data-body]"); var sel = window.getSelection(); sel.removeAllRanges(); var r = document.createRange(); r.selectNodeContents(b); sel.addRange(r); }
    } }
  ];
  if (name === "go") return [
    { label: "Projects", act: function () { openApp("finder"); } },
    { label: "Photos", act: function () { openApp("photos"); } },
    { label: "Trash", act: function () { openApp("trash"); } },
    { label: "Notes", act: function () { openApp("notes"); } },
    { label: "Mail", act: function () { openApp("mail"); } },
    { label: "Journal", act: function () { openApp("journal"); } }
  ];
  if (name === "window") {
    var items = [{ label: "Minimize", key: "M", act: function () { var f = frontWindowId(); if (f) minimizeWindow(f); }, disabled: !frontWindowId() }];
    Object.keys(wins).forEach(function (id) {
      items.push({ label: wins[id].app.name, act: function () { wins[id].el.style.display = "flex"; focusWindow(id); } });
    });
    return items;
  }
  if (name === "help") return [
    { label: "Studio Kala Help", act: function () { openApp("notes", { note: "faq" }); } },
    { label: "Talk to a Human", act: function () { openApp("mail", { compose: true }); } }
  ];
  return [];
}

var openMenuName = null;
function closeMenus() {
  var d = $("#menudrop");
  if (d) d.hidden = true;
  openMenuName = null;
  $all(".mb-menu").forEach(function (b) { b.classList.remove("open"); });
}
function openMenu(name, anchor) {
  var d = $("#menudrop");
  var items = menuItems(name);
  if (openMenuName === name) { closeMenus(); return; }
  d.innerHTML = items.map(function (it, i) {
    return '<button data-mi="' + i + '"' + (it.disabled ? " disabled" : "") + '><span>' + esc(it.label) + '</span>' + (it.key ? '<span class="key">' + esc(it.key) + '</span>' : "") + '</button>';
  }).join("");
  var r = anchor.getBoundingClientRect();
  d.style.left = Math.max(8, r.left) + "px";
  d.hidden = false;
  openMenuName = name;
  anchor.classList.add("open");
  d.querySelectorAll("[data-mi]").forEach(function (el) {
    el.addEventListener("click", function () {
      var it = items[+el.dataset.mi];
      closeMenus();
      if (it && it.act) it.act();
    });
  });
}

/* ================= Spotlight ================= */

var spotIndex = [];
var spotSel = 0;

function buildSpotIndex() {
  spotIndex = [];
  APPS.forEach(function (a) { spotIndex.push({ kind: "App", name: a.name, sub: "Open " + a.name, run: function () { openApp(a.id); } }); });
  PROJECTS.forEach(function (p) { spotIndex.push({ kind: "Project", name: p.name, sub: p.cat + " · " + p.year, run: function () { openApp("finder", { project: p.id }); } }); });
  NOTES.forEach(function (n) { spotIndex.push({ kind: "Note", name: n.title, sub: "Notes", run: function () { openApp("notes", { note: n.id }); } }); });
  JOURNAL.forEach(function (j) { spotIndex.push({ kind: "Journal", name: j.title, sub: j.date, run: function () { openApp("journal", { article: j.id }); } }); });
}
function renderSpot(q) {
  q = (q || "").toLowerCase();
  var list = spotIndex.filter(function (it) { return !q || (it.name + " " + it.sub).toLowerCase().indexOf(q) > -1; }).slice(0, 9);
  var box = $("#spotResults");
  if (!list.length) { box.innerHTML = '<p class="m-empty">No results for that search.</p>'; return; }
  if (spotSel >= list.length) spotSel = 0;
  box.innerHTML = list.map(function (it, i) {
    return '<button class="spot-item ' + (i === spotSel ? "sel" : "") + '" data-si="' + i + '"><span class="spot-kind">' + it.kind + '</span><span><span class="spot-name">' + esc(it.name) + '</span><br><span class="spot-sub">' + esc(it.sub) + '</span></span></button>';
  }).join("");
  box.querySelectorAll("[data-si]").forEach(function (el) {
    el.addEventListener("click", function () { var it = list[+el.dataset.si]; closeSpotlight(); if (it) it.run(); });
    el.addEventListener("mousemove", function () { spotSel = +el.dataset.si; renderSpot($("#spotInput").value); });
  });
  window._spotList = list;
}
function openSpotlight() {
  buildSpotIndex();
  spotSel = 0;
  $("#spotlight").hidden = false;
  var inp = $("#spotInput");
  inp.value = "";
  renderSpot("");
  setTimeout(function () { inp.focus(); }, 30);
}
function closeSpotlight() { $("#spotlight").hidden = true; }

/* ================= Control Center ================= */

function toggleCC(show) {
  var cc = $("#controlcenter");
  if (typeof show === "boolean") cc.hidden = !show;
  else cc.hidden = !cc.hidden;
}
function setWifi(on) {
  state.wifi = on;
  var t = $("#ccWifi");
  t.classList.toggle("on", on);
  t.setAttribute("aria-pressed", on ? "true" : "false");
  t.querySelector(".cc-tstate").textContent = on ? "On" : "Off";
  $("#wifiBtn").classList.toggle("off", !on);
  showToast(on ? "Wi-Fi on." : "Wi-Fi off. The desktop keeps working offline.");
}

/* ================= Widgets ================= */

function wireWidgets() {
  $all(".widget").forEach(function (w) {
    w.addEventListener("pointerdown", function (e) {
      if (e.target.closest("button")) return;
      if (isMobile()) return;
      var r = w.getBoundingClientRect();
      var parent = w.parentElement.getBoundingClientRect();
      var dx = e.clientX - r.left, dy = e.clientY - r.top;
      var moved = false;
      w.classList.add("dragging");
      function mv(ev) {
        var x = ev.clientX - parent.left - dx, y = ev.clientY - parent.top - dy;
        x = Math.round(Math.max(0, Math.min(x, parent.width - r.width)) / 8) * 8;
        y = Math.round(Math.max(0, Math.min(y, parent.height - r.height)) / 8) * 8;
        if (Math.abs(ev.clientX - (r.left + dx)) > 4 || Math.abs(ev.clientY - (r.top + dy)) > 4) moved = true;
        w.style.position = "absolute";
        w.style.left = x + "px"; w.style.top = y + "px";
      }
      function up() {
        document.removeEventListener("pointermove", mv);
        document.removeEventListener("pointerup", up);
        w.classList.remove("dragging");
        if (!moved) widgetTap(w);
      }
      document.addEventListener("pointermove", mv);
      document.addEventListener("pointerup", up);
    });
    w.addEventListener("keydown", function (e) { if (e.key === "Enter") widgetTap(w); });
  });
}
function widgetTap(w) {
  var k = w.dataset.widget;
  if (k === "call") openApp("mail", { compose: true });
  if (k === "journal") openApp("journal", { article: "j1" });
  if (k === "finder") openApp("finder");
  if (k === "fm") openApp("music");
  if (k === "clocks") {
    var j = $("#clkJaipur");
    if (j) {
      var d = istNow();
      var h = d.getHours();
      var is12 = j.textContent.indexOf("M") > -1;
      j.textContent = is12 ? fmtClock(d) : fmtTime(d);
      var m = $("#clkMumbai");
      if (m) m.textContent = is12 ? fmtClock(d) : fmtTime(d);
    }
  }
}

/* ================= Clocks ================= */

function tickClocks() {
  var d = istNow();
  var c = $("#clock");
  if (c) {
    c.textContent = d.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata", weekday: "short", month: "short", day: "numeric" }) + "  " + fmtTime(d);
  }
  var j = $("#clkJaipur"), m = $("#clkMumbai");
  var is12 = j && j.textContent.indexOf("M") > -1;
  if (j) j.textContent = is12 ? fmtTime(d) : fmtClock(d);
  if (m) m.textContent = is12 ? fmtTime(d) : fmtClock(d);
  var t = $("#todayLine");
  if (t) t.textContent = d.toLocaleDateString("en-US", { timeZone: "Asia/Kolkata", weekday: "long", day: "numeric", month: "long" }).toUpperCase();
}

/* ================= Boot + init ================= */

function finishBoot() {
  var boot = $("#boot");
  if (boot.classList.contains("gone")) return;
  boot.classList.add("gone");
  $("#desktop").setAttribute("aria-hidden", "false");
}

function runBoot(first) {
  var boot = $("#boot");
  boot.classList.remove("gone");
  var fill = $("#bootFill");
  fill.style.width = "0";
  var p = 0;
  var iv = setInterval(function () {
    p += 14;
    if (p >= 100) { p = 100; clearInterval(iv); setTimeout(function () { finishBoot(); if (first) showToast("Double-click Projects to see the work."); }, 220); }
    fill.style.width = p + "%";
  }, 110);
  setTimeout(function () { finishBoot(); if (first) showToast("Double-click Projects to see the work."); }, 3500);
}

function init() {
  loadPrefs();
  applyTheme();
  buildDock();
  tickClocks();
  setInterval(tickClocks, 1000);
  updateNowPlaying();
  updateMuteIcon();
  updateFmUI();
  wireWidgets();

  $("#logoBtn").addEventListener("click", function (e) { e.stopPropagation(); openMenu("logo", e.currentTarget); });
  $all(".mb-menu").forEach(function (b) {
    b.addEventListener("click", function (e) { e.stopPropagation(); openMenu(b.dataset.menu, b); });
  });
  $("#spotBtn").addEventListener("click", openSpotlight);
  $("#ccBtn").addEventListener("click", function (e) { e.stopPropagation(); toggleCC(); });
  $("#spotClose").addEventListener("click", closeSpotlight);
  $("#spotlight").addEventListener("click", function (e) { if (e.target === e.currentTarget) closeSpotlight(); });
  $("#spotInput").addEventListener("input", function (e) { spotSel = 0; renderSpot(e.target.value); });
  $("#spotInput").addEventListener("keydown", function (e) {
    var list = window._spotList || [];
    if (e.key === "ArrowDown") { e.preventDefault(); spotSel = Math.min(spotSel + 1, list.length - 1); renderSpot(e.target.value); }
    if (e.key === "ArrowUp") { e.preventDefault(); spotSel = Math.max(spotSel - 1, 0); renderSpot(e.target.value); }
    if (e.key === "Enter") { var it = list[spotSel]; closeSpotlight(); if (it) it.run(); }
    if (e.key === "Escape") closeSpotlight();
  });
  $("#muteBtn").addEventListener("click", function () { Audio2.setMuted(!Audio2.muted); showToast(Audio2.muted ? "Sound muted." : "Sound on."); });
  $("#wifiBtn").addEventListener("click", function () { setWifi(!state.wifi); });
  $("#wakeBtn").addEventListener("click", function () { $("#shutdown").hidden = true; runBoot(false); });

  $("#ccWifi").addEventListener("click", function () { setWifi(!state.wifi); });
  $("#ccDark").addEventListener("click", function () { setTheme(state.theme === "dark" ? "light" : "dark"); });
  $("#ccBright").addEventListener("input", function (e) { state.brightness = +e.target.value; applyTheme(); });
  $("#ccVol").addEventListener("input", function (e) { Audio2.setVolume(e.target.value / 100); });
  $("#ccPlay").addEventListener("click", function () {
    if (Audio2.mode) Audio2.stop(); else Audio2.playFM();
    updateNowPlaying();
  });
  $("#ccNext").addEventListener("click", function () {
    if (Audio2.mode === "music") Audio2.nextTrack();
    else { if (Audio2.mode !== "fm") Audio2.playFM(); Audio2.nextFM(); }
    updateNowPlaying();
  });

  $("#fmPlay").addEventListener("click", function () {
    if (Audio2.mode === "fm") Audio2.stop(); else Audio2.playFM();
  });
  $("#fmNext").addEventListener("click", function () { Audio2.nextFM(); });

  $all(".dicon").forEach(function (ic) {
    ic.addEventListener("click", function () {
      $all(".dicon").forEach(function (x) { x.classList.remove("selected"); });
      ic.classList.add("selected");
    });
    ic.addEventListener("dblclick", function () {
      var k = ic.dataset.open;
      if (k === "finder") openApp("finder");
      if (k === "journal") openApp("journal");
      if (k === "readme") openApp("notes", { note: "why" });
    });
  });
  $("#wallpaper").addEventListener("click", function () {
    closeMenus(); toggleCC(false);
    $all(".dicon").forEach(function (x) { x.classList.remove("selected"); });
  });
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#menudrop") && !e.target.closest(".mb-menu") && !e.target.closest("#logoBtn")) closeMenus();
    if (!e.target.closest("#controlcenter") && !e.target.closest("#ccBtn")) toggleCC(false);
  });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSpotlight(); }
    if (e.key === "Escape") { closeSpotlight(); toggleCC(false); closeMenus(); }
  });

  runBoot(true);
}

init();
