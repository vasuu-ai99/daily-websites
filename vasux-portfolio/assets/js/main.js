/* Merged from the original single file: head script (reduced-motion gate) followed by the body script, in original order. Logic unchanged. */
if(!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)){document.documentElement.classList.add('anim')}

(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Rotating hero title ──
  var pairs = [['AI','Expert.'],['Growth','Engineer.'],['Product','Builder.']];
  var rotA = document.getElementById('rotA'), rotB = document.getElementById('rotB'), ri = 0;
  if(!reduceMotion && rotA && rotB){
    setInterval(function(){
      rotA.classList.add('out'); rotB.classList.add('out');
      setTimeout(function(){
        ri = (ri + 1) % pairs.length;
        rotA.textContent = pairs[ri][0]; rotB.textContent = pairs[ri][1];
        rotA.classList.add('pre'); rotB.classList.add('pre');
        rotA.classList.remove('out'); rotB.classList.remove('out');
        void rotA.offsetWidth;
        rotA.classList.remove('pre'); rotB.classList.remove('pre');
      }, 300);
    }, 2600);
  }

  // ── Marquee: duplicate for a seamless loop ──
  var track = document.getElementById('marqueeTrack');
  if(track){ track.innerHTML += track.innerHTML; }

  // ── Giant rows: light up the one at screen centre ──
  var rows = document.querySelectorAll('.irow');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('lit', e.isIntersecting); });
    }, {rootMargin:'-42% 0px -42% 0px'});
    rows.forEach(function(r){ io.observe(r); });
  }

  // ── Work rows: floating preview follows the cursor (fine pointers only) ──
  var preview = document.getElementById('preview'), previewImg = document.getElementById('previewImg');
  if(window.matchMedia && window.matchMedia('(pointer: fine)').matches && preview){
    document.querySelectorAll('.wrow').forEach(function(row){
      row.addEventListener('mouseenter', function(){
        previewImg.src = row.getAttribute('data-img');
        preview.classList.add('on');
      });
      row.addEventListener('mouseleave', function(){ preview.classList.remove('on'); });
      row.addEventListener('mousemove', function(ev){
        preview.style.left = ev.clientX + 'px';
        preview.style.top = ev.clientY + 'px';
      });
    });
  }

  // ── Scroll reveal: blocks ease in as they enter the viewport ──
  var rvEls = document.querySelectorAll('.rv, .rvT');
  if(rvEls.length){
    var seenParents = new Map();
    rvEls.forEach(function(el){
      var n = seenParents.get(el.parentElement) || 0;
      seenParents.set(el.parentElement, n + 1);
      el.style.setProperty('--d', Math.min(n * 80, 400) + 'ms');
    });
    if('IntersectionObserver' in window && !reduceMotion){
      var rio = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); rio.unobserve(e.target); }
        });
      }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
      rvEls.forEach(function(el){ rio.observe(el); });
    } else {
      rvEls.forEach(function(el){ el.classList.add('in'); });
    }
  }

  // ── Stats count up when they scroll into view ──
  var statNums = document.querySelectorAll('.stat b');
  if(statNums.length && 'IntersectionObserver' in window && !reduceMotion){
    var cio = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
    }, {threshold:.4});
    statNums.forEach(function(el){ cio.observe(el); });
  }
  function countUp(el){
    var original = el.innerHTML;
    var m = el.textContent.match(/^(\d+)([\s\S]*)$/);
    if(!m) return;
    var target = parseInt(m[1], 10), suffix = m[2], start = null;
    function step(ts){
      if(!start) start = ts;
      var pr = Math.min((ts - start) / 1000, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - pr, 3))) + suffix;
      if(pr < 1) requestAnimationFrame(step); else el.innerHTML = original;
    }
    requestAnimationFrame(step);
  }

  // ── Live IST clock ──
  var clockEl = document.getElementById('istClock');
  function pad(n){ return (n < 10 ? '0' : '') + n; }
  function tickClock(){
    if(!clockEl) return;
    var parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Asia/Kolkata', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false}).formatToParts(new Date());
    var hh = 0, mm = 0, ss = 0;
    parts.forEach(function(p){
      if(p.type === 'hour') hh = parseInt(p.value, 10) % 24;
      if(p.type === 'minute') mm = parseInt(p.value, 10);
      if(p.type === 'second') ss = parseInt(p.value, 10);
    });
    clockEl.textContent = 'India · IST ' + pad(hh) + ':' + pad(mm) + ':' + pad(ss);
  }
  tickClock();
  setInterval(tickClock, 1000);

  // ── Copy email ──
  var copyBtn = document.getElementById('copyEmail');
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var email = 'vasupareekk24@gmail.com';
      function done(){ copyBtn.textContent = 'Copied ✓'; setTimeout(function(){ copyBtn.textContent = 'Copy Email'; }, 1800); }
      if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(email).then(done).catch(done); }
      else{
        var t = document.createElement('textarea'); t.value = email; document.body.appendChild(t); t.select();
        try{ document.execCommand('copy'); }catch(e){}
        document.body.removeChild(t); done();
      }
    });
  }

  // ── Contact form -> opens the visitor's mail app with the message ready ──
  var chips = document.querySelectorAll('#typeChips .chip'), subject = document.getElementById('fSubject');
  chips.forEach(function(c){
    c.addEventListener('click', function(){
      chips.forEach(function(x){ x.classList.remove('active'); });
      c.classList.add('active');
      subject.value = c.getAttribute('data-type') + ' — Project Inquiry';
    });
  });
  var form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name = document.getElementById('fName').value.trim();
      var email = document.getElementById('fEmail').value.trim();
      var subj = subject.value.trim() || 'Project Inquiry — vasux.in';
      var msg = document.getElementById('fMsg').value.trim();
      var body = 'Hi Vasu,\n\n' + msg + '\n\n— ' + name + '\n' + email;
      var mailLink = document.createElement('a');
      mailLink.href = 'mailto:vasupareekk24@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
      document.body.appendChild(mailLink);
      mailLink.click();
      document.body.removeChild(mailLink);
      document.getElementById('formNote').textContent = 'Your email app should have opened — just press Send there. If it didn\'t, email vasupareekk24@gmail.com directly.';
    });
  }
})();
