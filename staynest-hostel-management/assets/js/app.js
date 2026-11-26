// StayNest app.js — Supabase-backed hostel management (no local data store)
(function(){
"use strict";
function $(s,el){ return (el||document).querySelector(s); }
function $$(s,el){ return Array.prototype.slice.call((el||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function fmt(n){ return '₹'+Number(n||0).toLocaleString('en-IN'); }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function curMonth(){ return new Date().toISOString().slice(0,7); }
function monthLabel(mk){ var d=new Date(mk+'-02T00:00:00'); return d.toLocaleString('en-IN',{month:'short', year:'numeric'}); }
function initials(name){ return String(name||'?').split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase(); }
function fmtTime(ts){ if(!ts) return '—'; var d=new Date(ts); if(isNaN(d)) return esc(ts); return d.toLocaleString('en-IN',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}); }
function fmtDate(dstr){ if(!dstr) return '—'; var d=new Date(String(dstr).slice(0,10)+'T00:00:00'); if(isNaN(d)) return esc(dstr); return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }
function toast(msg){ var w=$('#toastWrap'); var t=document.createElement('div'); t.className='toast'; t.textContent=msg; w.appendChild(t); setTimeout(function(){ t.remove(); },3000); }
function errMsg(e){ return (e && e.message) ? e.message : 'Something went wrong. Please try again.'; }

// ---------- Supabase client ----------
var sb=null;
function showBootError(msg){ $('#bootScreen').style.display='flex'; $('#authScreen').style.display='none'; $('#setupScreen').style.display='none'; $('#appLayout').style.display='none'; $('#bootMsg').innerHTML='<span style="color:var(--red);font-weight:600">'+esc(msg)+'</span>'; }
if(!window.supabase || !window.SN_CONFIG){
  showBootError('Could not load the sign-in service. Please check your internet connection and reload the page.');
  return;
}
try{ sb = window.supabase.createClient(window.SN_CONFIG.url, window.SN_CONFIG.anonKey); }
catch(e){ showBootError('Could not connect to the database. Please reload the page.'); return; }

// ---------- App state (in-memory cache of Supabase rows) ----------
var user=null;
var DB={ hostel:null, rooms:[], students:[], payments:[], complaints:[], visitors:[], notices:[], mess:{} };
function hid(){ return user ? user.id : null; }
function roomById(id){ return DB.rooms.find(function(r){return r.id===id;}) || null; }
function studentById(id){ return DB.students.find(function(s){return s.id===id;}) || null; }
function activeStudents(){ return DB.students.filter(function(s){return s.status==='active';}); }
function occupants(roomId){ return DB.students.filter(function(s){return s.status==='active' && s.room_id===roomId;}); }
function totalBeds(){ return DB.rooms.filter(function(r){return r.status!=='maintenance';}).reduce(function(a,r){return a+(r.beds||0);},0); }
function occupiedBeds(){ return activeStudents().filter(function(s){return s.room_id;}).length; }
function vacantBeds(){ return Math.max(0, totalBeds()-occupiedBeds()); }
function paidFor(studentId, month){ return DB.payments.filter(function(p){return p.student_id===studentId && p.month===month;}).reduce(function(a,p){return a+Number(p.amount||0);},0); }
function feeStatus(st, month){
  if(st.status!=='active') return 'left';
  var paid=paidFor(st.id, month); var due=Number(st.monthly_fee||0);
  if(paid>=due && due>0) return 'paid';
  if(paid>=due && due===0) return 'paid';
  var now=new Date(); var day = (month===curMonth()) ? now.getDate() : 31;
  if(month < curMonth() || (month===curMonth() && day>10)) return 'overdue';
  return 'pending';
}
function floorsList(){ var seen=[]; DB.rooms.forEach(function(r){ if(seen.indexOf(r.floor)===-1) seen.push(r.floor); }); return seen; }
function roomLabel(r){ return r ? ('Room '+r.room_no) : '—'; }
function studentRoomLabel(s){ var r=s.room_id?roomById(s.room_id):null; return r? roomLabel(r):'—'; }

// ---------- Icons (inline SVG) ----------
function icon(name){ var p={
 dashboard:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
 students:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M16 15.2c2.3.3 4 1.8 4.7 4.3"/>',
 rooms:'<path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M2 21h20"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
 fees:'<rect x="3" y="6" width="18" height="13" rx="2"/><circle cx="12" cy="12.5" r="3"/><path d="M6 9.5h.01M18 15.5h.01"/>',
 mess:'<path d="M5 3v7a2 2 0 0 0 2 2v9M5 3v4M9 3v4a2 2 0 0 1-2 2"/><path d="M19 3c-1.7 1-2.5 3-2.5 5.5 0 2 .8 3.5 2.5 3.5v9"/>',
 complaints:'<path d="M21 12a9 9 0 1 1-4.4-7.7L21 3l-1 4.2c.6 1.5 1 3.1 1 4.8z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
 visitors:'<circle cx="10" cy="8" r="3.5"/><path d="M4 20c.7-3.4 3-5.2 6-5.2 1.2 0 2.3.3 3.2.9"/><path d="M15.5 12.5l2 2 4-4"/>',
 notices:'<path d="M4 20h16M6 20V9l6-5 6 5v11"/><circle cx="12" cy="13" r="2"/>',
 reports:'<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>'};
 return '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(p[name]||'')+'</svg>';
}
var NAV=[['dashboard','Dashboard'],['students','Students'],['rooms','Rooms'],['fees','Fees'],['mess','Mess & Food'],['complaints','Complaints'],['visitors','Visitors'],['notices','Notices'],['reports','Reports']];
var currentView='dashboard';
var feesMonth=curMonth();
var roomFloorTab='All';
var charts={};

// ---------- Screen switching ----------
function showScreen(which){
  $('#bootScreen').style.display = which==='boot' ? 'flex':'none';
  $('#authScreen').style.display = which==='auth' ? 'flex':'none';
  $('#setupScreen').style.display = which==='setup' ? 'flex':'none';
  $('#appLayout').style.display = which==='app' ? 'flex':'none';
}

// ---------- Data loading ----------
function loadAll(){
  var h=hid();
  return Promise.all([
    sb.from('rooms').select('*').eq('hostel_id',h),
    sb.from('students').select('*').eq('hostel_id',h),
    sb.from('payments').select('*').eq('hostel_id',h),
    sb.from('complaints').select('*').eq('hostel_id',h),
    sb.from('visitors').select('*').eq('hostel_id',h),
    sb.from('notices').select('*').eq('hostel_id',h),
    sb.from('mess_menu').select('*').eq('hostel_id',h)
  ]).then(function(res){
    var names=['rooms','students','payments','complaints','visitors','notices','mess menu'];
    for(var i=0;i<res.length;i++){ if(res[i].error) throw new Error('Could not load '+names[i]+': '+res[i].error.message); }
    DB.rooms=res[0].data||[]; DB.students=res[1].data||[]; DB.payments=res[2].data||[];
    DB.complaints=res[3].data||[]; DB.visitors=res[4].data||[]; DB.notices=res[5].data||[];
    DB.rooms.sort(function(a,b){ return String(a.floor).localeCompare(String(b.floor)) || String(a.room_no).localeCompare(String(b.room_no),undefined,{numeric:true}); });
    DB.students.sort(function(a,b){ return String(a.student_code||'').localeCompare(String(b.student_code||'')); });
    DB.payments.sort(function(a,b){ return String(b.paid_at||'').localeCompare(String(a.paid_at||'')); });
    DB.visitors.sort(function(a,b){ return String(b.in_time||'').localeCompare(String(a.in_time||'')); });
    DB.mess={}; (res[6].data||[]).forEach(function(m){ DB.mess[m.day]=m; });
  });
}
function refreshAndRender(){ return loadAll().then(function(){ renderAll(); }).catch(function(e){ toast(errMsg(e)); renderAll(); }); }

// ---------- Auth ----------
var authMode='login';
function setAuthMode(m){
  authMode=m;
  $('#tabLogin').classList.toggle('active', m==='login');
  $('#tabSignup').classList.toggle('active', m==='signup');
  $('#authSubmit').textContent = m==='login' ? 'Login':'Create Account';
  $('#authPassword').setAttribute('autocomplete', m==='login' ? 'current-password':'new-password');
  $('#authNote').textContent = m==='login' ? 'New to StayNest? Switch to Sign Up to create your hostel account.' : 'Already have an account? Switch to Login.';
  hideAuthError();
}
function showAuthError(msg){ var e=$('#authError'); e.textContent=msg; e.style.display='block'; }
function hideAuthError(){ $('#authError').style.display='none'; }
function friendlyAuthError(e, mode){
  var m=(e&&e.message)||'';
  if(/invalid login credentials/i.test(m)) return 'Wrong email or password. Please check and try again.';
  if(/already registered|already exists/i.test(m)) return 'An account with this email already exists. Please login instead.';
  if(/password should be at least/i.test(m)) return m;
  if(/invalid email/i.test(m)) return 'Please enter a valid email address.';
  if(/network|fetch/i.test(m)) return 'Network problem — please check your connection and try again.';
  return m || (mode==='signup' ? 'Could not create the account. Please try again.' : 'Could not log in. Please try again.');
}
$('#tabLogin').addEventListener('click',function(){ setAuthMode('login'); });
$('#tabSignup').addEventListener('click',function(){ setAuthMode('signup'); });
$('#authForm').addEventListener('submit',function(e){
  e.preventDefault(); hideAuthError();
  var email=$('#authEmail').value.trim(), pw=$('#authPassword').value;
  if(!email||!pw){ showAuthError('Please enter your email and password.'); return; }
  var btn=$('#authSubmit'); btn.disabled=true; btn.textContent='Please wait…';
  var done=function(){ btn.disabled=false; btn.textContent= authMode==='login'?'Login':'Create Account'; };
  if(authMode==='login'){
    sb.auth.signInWithPassword({email:email,password:pw}).then(function(r){
      done();
      if(r.error){ showAuthError(friendlyAuthError(r.error,'login')); return; }
      user=r.data.user; afterLogin();
    }).catch(function(err){ done(); showAuthError(friendlyAuthError(err,'login')); });
  } else {
    sb.auth.signUp({email:email,password:pw}).then(function(r){
      done();
      if(r.error){ showAuthError(friendlyAuthError(r.error,'signup')); return; }
      if(r.data.user && r.data.user.identities && r.data.user.identities.length===0){ showAuthError('An account with this email already exists. Please login instead.'); return; }
      if(r.data.session){ user=r.data.user; afterLogin(); }
      else if(r.data.user){ showAuthError('Account created. If login does not start automatically, please login with your email and password.'); setAuthMode('login'); }
      else { showAuthError('Could not create the account. Please try again.'); }
    }).catch(function(err){ done(); showAuthError(friendlyAuthError(err,'signup')); });
  }
});
function doLogout(){
  sb.auth.signOut().then(function(){
    user=null; DB={ hostel:null, rooms:[], students:[], payments:[], complaints:[], visitors:[], notices:[], mess:{} };
    showScreen('auth');
  });
}
$('#logoutBtn').addEventListener('click',doLogout);
$('#wizLogout1').addEventListener('click',doLogout);

function afterLogin(){
  showScreen('boot'); $('#bootMsg').textContent='Loading your hostel…';
  sb.from('hostels').select('*').eq('id',user.id).maybeSingle().then(function(r){
    if(r.error){ showBootError('Could not load your hostel profile: '+r.error.message); return; }
    if(!r.data){ showScreen('setup'); return; }
    DB.hostel=r.data;
    loadAll().then(function(){ enterApp(); }).catch(function(e){ showBootError(errMsg(e)); });
  }).catch(function(e){ showBootError(errMsg(e)); });
}
function enterApp(){
  $('#sideHostelName').textContent = DB.hostel ? DB.hostel.hostel_name : 'Smart Hostel Management';
  $('#userEmail').textContent = user ? user.email : '';
  showScreen('app');
  renderNav(); go('dashboard');
}

// ---------- Setup wizard ----------
var wizRooms=[];
$('#wizStep1').addEventListener('submit',function(e){
  e.preventDefault();
  if(!$('#wz-name').value.trim()){ var er=$('#wizError1'); er.textContent='Please enter your hostel name.'; er.style.display='block'; return; }
  $('#wizError1').style.display='none';
  $('#wizStep1').style.display='none'; $('#wizStep2').style.display='block';
  $('#wizStepLabel').textContent='Step 2 of 2 — Add your rooms';
  renderWizRooms();
});
$('#wizBack').addEventListener('click',function(){
  $('#wizStep2').style.display='none'; $('#wizStep1').style.display='block';
  $('#wizStepLabel').textContent='Step 1 of 2 — Hostel profile';
});
function wizRoomFromForm(){
  var no=$('#wr-no').value.trim();
  if(!no) return null;
  return { room_no:no, floor:$('#wr-floor').value, type:$('#wr-type').value, beds:Math.max(1,parseInt($('#wr-beds').value,10)||1), rent:Math.max(0,parseInt($('#wr-rent').value,10)||0), status:'available' };
}
function renderWizRooms(){
  var el=$('#wizRoomList');
  if(!wizRooms.length){ el.innerHTML='<div class="empty">No rooms added yet. Add at least one room to finish setup — you can add more later from the Rooms page.</div>'; return; }
  el.innerHTML='<p style="font-size:13px;font-weight:700;margin:0 0 8px">'+wizRooms.length+' room'+(wizRooms.length===1?'':'s')+' ready</p>'+wizRooms.map(function(r,i){
    return '<div class="wiz-room-row"><span><strong>Room '+esc(r.room_no)+'</strong> · '+esc(r.floor)+' · '+esc(r.type)+' · '+r.beds+' bed'+(r.beds===1?'':'s')+' · '+fmt(r.rent)+'/bed</span><button type="button" class="icon-btn" data-wiz-del="'+i+'">Remove</button></div>';
  }).join('');
  $$('#wizRoomList [data-wiz-del]').forEach(function(b){ b.addEventListener('click',function(){ wizRooms.splice(parseInt(b.getAttribute('data-wiz-del'),10),1); renderWizRooms(); }); });
}
$('#wizAddRoom').addEventListener('click',function(){
  var r=wizRoomFromForm();
  if(!r){ toast('Enter a room number first.'); return; }
  if(wizRooms.some(function(x){return String(x.room_no)===String(r.room_no);})){ toast('Room '+r.room_no+' is already in the list.'); return; }
  wizRooms.push(r); $('#wr-no').value=''; renderWizRooms();
});
$('#wizGenRange').addEventListener('click',function(){
  var from=parseInt($('#wg-from').value,10), to=parseInt($('#wg-to').value,10);
  if(!from||!to||to<from){ toast('Enter a valid room range, e.g. 101 to 110.'); return; }
  if(to-from>200){ toast('That range is too large. Please generate up to 200 rooms at a time.'); return; }
  var added=0;
  for(var n=from;n<=to;n++){
    if(wizRooms.some(function(x){return String(x.room_no)===String(n);} )) continue;
    wizRooms.push({ room_no:String(n), floor:$('#wr-floor').value, type:$('#wr-type').value, beds:Math.max(1,parseInt($('#wr-beds').value,10)||1), rent:Math.max(0,parseInt($('#wr-rent').value,10)||0), status:'available' });
    added++;
  }
  toast(added+' room'+(added===1?'':'s')+' added to the list.'); renderWizRooms();
});
$('#wizFinish').addEventListener('click',function(){
  var er=$('#wizError2'); er.style.display='none';
  if(!wizRooms.length){ er.textContent='Please add at least one room before finishing setup.'; er.style.display='block'; return; }
  var btn=$('#wizFinish'); btn.disabled=true; btn.textContent='Saving…';
  var hostelRow={ id:user.id, hostel_name:$('#wz-name').value.trim(), owner_name:$('#wz-owner').value.trim()||null, address:$('#wz-address').value.trim()||null, phone:$('#wz-phone').value.trim()||null };
  sb.from('hostels').insert(hostelRow).then(function(r){
    if(r.error){ btn.disabled=false; btn.textContent='Finish Setup'; er.textContent='Could not save hostel profile: '+r.error.message; er.style.display='block'; return; }
    var rows=wizRooms.map(function(x){ return { hostel_id:user.id, room_no:x.room_no, floor:x.floor, type:x.type, beds:x.beds, rent:x.rent, status:x.status }; });
    sb.from('rooms').insert(rows).then(function(r2){
      btn.disabled=false; btn.textContent='Finish Setup';
      if(r2.error){ er.textContent='Hostel saved, but rooms could not be saved: '+r2.error.message+' You can add rooms from the Rooms page.'; er.style.display='block'; }
      DB.hostel=hostelRow;
      loadAll().then(function(){ toast('Setup complete. Welcome to StayNest!'); enterApp(); }).catch(function(e){ showBootError(errMsg(e)); });
    });
  });
});

// ---------- Navigation ----------
function renderNav(){
  $('#mainNav').innerHTML=NAV.map(function(n){ return '<button data-nav="'+n[0]+'" class="'+(currentView===n[0]?'active':'')+'">'+icon(n[0])+'<span>'+n[1]+'</span></button>'; }).join('');
  $$('#mainNav [data-nav]').forEach(function(b){ b.addEventListener('click',function(){ go(b.getAttribute('data-nav')); }); });
}
function go(view){
  currentView=view;
  $$('.view').forEach(function(v){ v.classList.remove('active'); });
  var el=$('#view-'+view); if(el) el.classList.add('active');
  var meta={dashboard:['Dashboard','Everything about your hostel, in one place.'],students:['Students','Search, add and manage every resident.'],rooms:['Rooms','Floor-wise rooms, beds and occupancy.'],fees:['Fees','Collect fees, track pending and overdue.'],mess:['Mess & Food','Weekly menu and daily meal counts.'],complaints:['Complaints','Track and resolve resident issues.'],visitors:['Visitors','Visitor entry and exit log.'],notices:['Notices','Announcements for residents.'],reports:['Reports','Summaries you can export and print.']};
  $('#pageTitle').textContent=meta[view][0]; $('#pageSub').textContent=meta[view][1];
  renderNav(); renderAll();
  window.scrollTo({top:0});
}
function renderAll(){
  if(currentView==='dashboard') renderDashboard();
  if(currentView==='students') renderStudents();
  if(currentView==='rooms') renderRooms();
  if(currentView==='fees') renderFees();
  if(currentView==='mess') renderMess();
  if(currentView==='complaints') renderComplaints();
  if(currentView==='visitors') renderVisitors();
  if(currentView==='notices') renderNotices();
  if(currentView==='reports') renderReports();
}
function statCard(label,val,sub){ return '<div class="stat"><div class="label">'+esc(label)+'</div><div class="val">'+esc(val)+'</div><div class="sub">'+esc(sub)+'</div></div>'; }

// ---------- DASHBOARD ----------
function recentActivity(){
  var items=[];
  DB.payments.forEach(function(p){ var s=studentById(p.student_id); items.push({text:'Fee collected from '+(s?s.name:'a student')+' — '+fmt(p.amount)+' ('+esc(p.method)+')', when:String(p.paid_at||'')}); });
  DB.students.forEach(function(s){ if(s.join_date) items.push({text:s.name+' joined — '+studentRoomLabel(s), when:String(s.join_date)}); if(s.left_date) items.push({text:s.name+' left the hostel', when:String(s.left_date)}); });
  DB.visitors.forEach(function(v){ items.push({text:'Visitor '+v.visitor_name+' checked in', when:String(v.in_time||'')}); });
  DB.complaints.forEach(function(c){ items.push({text:'Complaint: '+c.title+' ('+c.status+')', when:String(c.created_at||'')}); });
  DB.notices.forEach(function(n){ items.push({text:'Notice posted: '+n.title, when:String(n.created_at||'')}); });
  items.sort(function(a,b){ return b.when.localeCompare(a.when); });
  return items.slice(0,7);
}
function renderDashboard(){
  var active=activeStudents();
  var occ = totalBeds()? Math.round(occupiedBeds()/totalBeds()*100):0;
  var cm=curMonth();
  var collected=DB.payments.filter(function(p){return p.month===cm;}).reduce(function(a,p){return a+Number(p.amount||0);},0);
  var expected=active.reduce(function(a,s){return a+Number(s.monthly_fee||0);},0);
  var pendAll=active.map(function(s){ var paid=paidFor(s.id,cm); return {s:s, due:Number(s.monthly_fee||0)-paid, status:feeStatus(s,cm)}; }).filter(function(x){return x.due>0;}).sort(function(a,b){return b.due-a.due;});
  var pendingAmt=pendAll.reduce(function(a,x){return a+x.due;},0);
  var openC=DB.complaints.filter(function(c){return c.status!=='Resolved';}).length;
  var today=todayStr();
  var joinedToday=DB.students.filter(function(s){return s.join_date===today;});
  var leftToday=DB.students.filter(function(s){return s.left_date===today;});
  var hostelName=DB.hostel? DB.hostel.hostel_name : 'our hostel';
  var html='';
  if(!DB.rooms.length && !DB.students.length){
    html+='<div class="empty" style="margin-bottom:16px"><strong style="font-size:16px;color:var(--ink)">Welcome to StayNest</strong><br>Your hostel is set up and empty — no data yet. Start by adding rooms, then your first student.<br><br><button class="btn amber" id="dashAddRoom">Add your first room</button> <button class="btn" id="dashAddStudent">Add your first student</button></div>';
  }
  html+='<div class="grid-stats">'
    + statCard('Total Students', active.length, DB.students.filter(function(s){return s.status==='left';}).length+' left so far')
    + statCard('Occupancy', occ+'%', occupiedBeds()+' of '+totalBeds()+' beds filled')
    + statCard('Fees Collected — '+monthLabel(cm), fmt(collected), 'of '+fmt(expected)+' expected')
    + statCard('Pending Fees', fmt(pendingAmt), pendAll.length+' students with dues')
    + statCard('Vacant Beds', vacantBeds(), 'across '+DB.rooms.length+' rooms')
    + statCard('Open Complaints', openC, 'needs attention')
    +'</div>';
  html+='<div class="grid-2"><div class="card"><h3>Occupancy</h3><div style="max-width:280px;margin:0 auto"><canvas id="donutChart" height="220"></canvas></div><p style="text-align:center;color:var(--muted);font-size:13px" id="donutFallback"></p></div>'
    +'<div class="card"><h3>Fee Collection — Last 6 Months</h3><canvas id="barChart" height="220"></canvas><p style="text-align:center;color:var(--muted);font-size:13px" id="barFallback"></p></div></div>';
  html+='<div class="grid-2"><div class="card"><h3>Top Pending Fees — '+monthLabel(cm)+'</h3>'
    + (pendAll.length? pendAll.slice(0,6).map(function(x){
        var msg=encodeURIComponent('Namaste '+x.s.name+', this is a gentle reminder from '+hostelName+'. Your hostel fee of '+fmt(x.due)+' for '+monthLabel(cm)+' is pending. Please pay at the earliest. Thank you!');
        var phone=('91'+String(x.s.phone||'').replace(/\D/g,'').slice(-10));
        return '<div class="list-row"><div style="display:flex;gap:10px;align-items:center"><span class="avatar">'+initials(x.s.name)+'</span><div><strong>'+esc(x.s.name)+'</strong><div style="font-size:12px;color:var(--muted)">'+esc(studentRoomLabel(x.s))+' · '+esc(x.s.student_code||'')+'</div></div></div><div style="text-align:right"><div style="font-weight:700">'+fmt(x.due)+'</div><a class="btn sm amber" target="_blank" rel="noopener" href="https://wa.me/'+phone+'?text='+msg+'">Remind</a></div></div>';
      }).join('') : '<div class="empty">'+(active.length? 'All fees collected for this month. Great job.' : 'No students yet — pending fees will appear here.')+'</div>')
    +'</div>'
    +'<div><div class="card"><h3>Today — Joinings &amp; Leavings</h3>'
    + (joinedToday.length||leftToday.length ? joinedToday.map(function(s){return '<div class="list-row"><span>Joined: <strong>'+esc(s.name)+'</strong> — '+esc(studentRoomLabel(s))+'</span><span class="badge paid">Joined</span></div>';}).join('')+leftToday.map(function(s){return '<div class="list-row"><span>Left: <strong>'+esc(s.name)+'</strong></span><span class="badge grey">Left</span></div>';}).join('') : '<div class="empty">No joinings or leavings today.</div>')
    +'</div><div class="card"><h3>Recent Activity</h3>'
    + (recentActivity().length? recentActivity().map(function(a){ return '<div class="list-row"><span style="font-size:14px">'+esc(a.text)+'</span><span style="font-size:12px;color:var(--muted);white-space:nowrap">'+esc(a.when.slice(0,10))+'</span></div>'; }).join('') : '<div class="empty">Nothing yet — activity from fees, students and visitors will show here.</div>')
    +'</div></div></div>';
  $('#view-dashboard').innerHTML=html;
  var dar=$('#dashAddRoom'); if(dar) dar.addEventListener('click',function(){ go('rooms'); setTimeout(openRoomForm,50); });
  var das=$('#dashAddStudent'); if(das) das.addEventListener('click',function(){ openStudentModal(); });
  setTimeout(function(){
    if(window.Chart){
      var dc=$('#donutChart'); if(dc){ if(charts.donut) charts.donut.destroy(); charts.donut=new Chart(dc,{type:'doughnut',data:{labels:['Occupied','Vacant'],datasets:[{data:[occupiedBeds(), Math.max(0,totalBeds()-occupiedBeds())],backgroundColor:['#0C2B2D','#E8A33D'],borderWidth:0}]},options:{plugins:{legend:{position:'bottom'}},cutout:'68%'}}); }
      var bc=$('#barChart'); if(bc){ var labels=[],data=[]; for(var i=5;i>=0;i--){ var d=new Date(); d.setMonth(d.getMonth()-i); var mk=d.toISOString().slice(0,7); labels.push(monthLabel(mk)); data.push(DB.payments.filter(function(p){return p.month===mk;}).reduce(function(a,p){return a+Number(p.amount||0);},0)); } if(charts.bar) charts.bar.destroy(); charts.bar=new Chart(bc,{type:'bar',data:{labels:labels,datasets:[{label:'Collected (₹)',data:data,backgroundColor:'#E8A33D',borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}}); }
    } else {
      var df=$('#donutFallback'); if(df) df.textContent='Occupied: '+occupiedBeds()+' · Vacant: '+Math.max(0,totalBeds()-occupiedBeds());
      var bf=$('#barFallback'); if(bf) bf.textContent='Charts need an internet connection for the chart library.';
    }
  },30);
}

// ---------- STUDENTS ----------
var stuQuery='', stuFloor='All', stuFee='All', stuStatus='Active';
function renderStudents(){
  var floors=floorsList();
  var html='<div class="card"><div class="filters"><input type="search" id="stuSearch" placeholder="Search name, ID or phone…" value="'+esc(stuQuery)+'">'
    +'<select id="stuFloor"><option value="All">All Floors</option>'+floors.map(function(f){return '<option '+(stuFloor===f?'selected':'')+'>'+esc(f)+'</option>';}).join('')+'</select>'
    +'<select id="stuFee"><option value="All">All Fee Status</option><option '+(stuFee==='paid'?'selected':'')+' value="paid">Paid</option><option '+(stuFee==='pending'?'selected':'')+' value="pending">Pending</option><option '+(stuFee==='overdue'?'selected':'')+' value="overdue">Overdue</option></select>'
    +'<select id="stuStatus"><option '+(stuStatus==='Active'?'selected':'')+'>Active</option><option '+(stuStatus==='Left'?'selected':'')+'>Left</option><option '+(stuStatus==='All'?'selected':'')+'>All</option></select>'
    +'<button class="btn amber" id="addStudentBtn">+ Add Student</button></div>'
    +'<div class="table-wrap"><table><thead><tr><th>Student</th><th>ID</th><th>Phone</th><th>Room</th><th>Join Date</th><th>Fee Status</th><th>Actions</th></tr></thead><tbody id="stuBody"></tbody></table></div><div id="stuEmpty"></div></div>';
  $('#view-students').innerHTML=html;
  $('#stuSearch').addEventListener('input',function(e){ stuQuery=e.target.value; fillStudentRows(); });
  $('#stuFloor').addEventListener('change',function(e){ stuFloor=e.target.value; fillStudentRows(); });
  $('#stuFee').addEventListener('change',function(e){ stuFee=e.target.value; fillStudentRows(); });
  $('#stuStatus').addEventListener('change',function(e){ stuStatus=e.target.value; fillStudentRows(); });
  $('#addStudentBtn').addEventListener('click',function(){ openStudentModal(); });
  fillStudentRows();
}
function filteredStudents(){
  var cm=curMonth();
  return DB.students.filter(function(s){
    if(stuStatus==='Active' && s.status!=='active') return false;
    if(stuStatus==='Left' && s.status!=='left') return false;
    if(stuFloor!=='All'){ var r=s.room_id?roomById(s.room_id):null; if(!r||r.floor!==stuFloor) return false; }
    if(stuFee!=='All' && feeStatus(s,cm)!==stuFee) return false;
    if(stuQuery){ var q=stuQuery.toLowerCase(); if(!(String(s.name).toLowerCase().indexOf(q)>-1||String(s.student_code||'').toLowerCase().indexOf(q)>-1||String(s.phone||'').indexOf(q)>-1)) return false; }
    return true;
  });
}
function fillStudentRows(){
  var list=filteredStudents(); var cm=curMonth();
  var body=$('#stuBody'); if(!body) return;
  body.innerHTML=list.map(function(s){
    var st=feeStatus(s,cm);
    var badge= s.status==='left' ? '<span class="badge grey">Left</span>' : '<span class="badge '+st+'">'+st.charAt(0).toUpperCase()+st.slice(1)+'</span>';
    return '<tr><td><div class="student-cell"><span class="avatar">'+initials(s.name)+'</span><strong>'+esc(s.name)+'</strong></div></td><td>'+esc(s.student_code||'')+'</td><td>'+esc(s.phone||'')+'</td><td>'+esc(studentRoomLabel(s))+'</td><td>'+fmtDate(s.join_date)+'</td><td>'+badge+'</td><td><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="icon-btn" data-view-stu="'+s.id+'">View</button><button class="icon-btn" data-edit-stu="'+s.id+'">Edit</button>'+(s.status==='active'?'<button class="icon-btn" data-left-stu="'+s.id+'">Mark Left</button>':'')+'</div></td></tr>';
  }).join('');
  $('#stuEmpty').innerHTML= list.length? '' : (DB.students.length? '<div class="empty" style="margin-top:14px">No students match your search. Try a different filter.</div>' : '<div class="empty" style="margin-top:14px">No students yet.<br><br><button class="btn amber" id="stuFirstAdd">Add your first student</button></div>');
  var fa=$('#stuFirstAdd'); if(fa) fa.addEventListener('click',function(){ openStudentModal(); });
  $$('#stuBody [data-view-stu]').forEach(function(b){ b.addEventListener('click',function(){ openDrawer(b.getAttribute('data-view-stu')); }); });
  $$('#stuBody [data-edit-stu]').forEach(function(b){ b.addEventListener('click',function(){ openStudentModal(studentById(b.getAttribute('data-edit-stu'))); }); });
  $$('#stuBody [data-left-stu]').forEach(function(b){ b.addEventListener('click',function(){ confirmMarkLeft(b.getAttribute('data-left-stu')); }); });
}
function vacantRoomOptions(selected){
  var opts='<option value="">No room (assign later)</option>';
  DB.rooms.forEach(function(r){ if(r.status==='maintenance') return; var occ=occupants(r.id).length; if(occ<(r.beds||0) || r.id===selected){ opts+='<option value="'+r.id+'" '+(r.id===selected?'selected':'')+'>Room '+esc(r.room_no)+' — '+esc(r.type)+' ('+((r.beds||0)-occ)+' bed'+(((r.beds||0)-occ)===1?'':'s')+' free) · '+fmt(r.rent)+'/mo</option>'; } });
  return opts;
}
function openStudentModal(stu){
  $('#studentModalTitle').textContent= stu? 'Edit Student':'Add Student';
  $('#sf-id').value= stu? stu.id:'';
  $('#sf-name').value= stu? stu.name:''; $('#sf-phone').value= stu? stu.phone:''; $('#sf-guardian').value= stu? (stu.guardian_phone||''):'';
  $('#sf-room').innerHTML=vacantRoomOptions(stu?stu.room_id:null); if(stu) $('#sf-room').value=stu.room_id||'';
  $('#sf-join').value= stu? (stu.join_date||todayStr()): todayStr();
  $('#sf-fee').value= stu? stu.monthly_fee: 5000; $('#sf-deposit').value= stu? stu.deposit: 0;
  $('#sf-room').onchange=function(){ var r=roomById($('#sf-room').value); if(r){ $('#sf-fee').value=r.rent; } };
  $('#studentModal').classList.add('open');
}
function nextStudentCode(){
  var yr=new Date().getFullYear(); var max=0;
  DB.students.forEach(function(s){ var m=String(s.student_code||'').match(/(\d+)$/); if(m){ var n=parseInt(m[1],10); if(n>max) max=n; } });
  return 'SN-'+yr+'-'+String(max+1).padStart(3,'0');
}
function confirmMarkLeft(id){
  var s=studentById(id); if(!s) return;
  openConfirm('Mark '+s.name+' as left?', s.name+' will be marked left today ('+fmtDate(todayStr())+'). Their bed in '+studentRoomLabel(s)+' will become vacant.', function(){
    sb.from('students').update({status:'left', left_date:todayStr(), room_id:null}).eq('id',id).then(function(r){
      if(r.error){ toast('Could not mark left: '+r.error.message); return; }
      toast(s.name+' marked as left. Bed is now vacant.'); refreshAndRender();
    });
  });
}
function openDrawer(id){
  var s=studentById(id); if(!s) return;
  var pays=DB.payments.filter(function(p){return p.student_id===id;});
  var r=s.room_id?roomById(s.room_id):null;
  var html='<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:52px;height:52px;font-size:17px">'+initials(s.name)+'</span><div><h3 style="margin:0">'+esc(s.name)+'</h3><p style="margin:3px 0 0;color:var(--muted);font-size:13px">'+esc(s.student_code||'')+' · '+(s.status==='active'?'Active':'Left on '+fmtDate(s.left_date))+'</p></div></div><button class="icon-btn" id="drawerClose">Close</button></div>'
  +'<div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:14px">'
  +'<div><span style="color:var(--muted)">Phone</span><br><strong>'+esc(s.phone||'—')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Guardian</span><br><strong>'+esc(s.guardian_phone||'—')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Room</span><br><strong>'+(r? 'Room '+esc(r.room_no)+' · '+esc(r.floor)+' · '+esc(r.type) : 'No room assigned')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Join date</span><br><strong>'+fmtDate(s.join_date)+'</strong></div>'
  +'<div><span style="color:var(--muted)">Monthly fee / Deposit</span><br><strong>'+fmt(s.monthly_fee)+' / '+fmt(s.deposit)+'</strong></div></div>'
  +'<h4 style="margin:22px 0 8px">Fee Payment History</h4>'+(pays.length? pays.map(function(p){return '<div class="list-row"><span>'+monthLabel(p.month)+' · '+esc(p.method)+' · '+esc(p.receipt_no||'')+'</span><strong>'+fmt(p.amount)+'</strong></div>';}).join(''):'<div class="empty">No payments recorded yet.</div>')
  +'<div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap"><button class="btn" id="drawerCollect">Collect Fee</button><button class="btn ghost" id="drawerEdit">Edit Profile</button>'+(s.status==='active'?'<button class="btn danger" id="drawerLeft">Mark Left</button>':'')+'<button class="btn ghost" id="drawerDelete" style="color:var(--red)">Delete Student</button></div>';
  var d=$('#studentDrawer'); d.innerHTML=html; d.classList.add('open');
  $('#drawerClose').addEventListener('click',function(){ d.classList.remove('open'); });
  $('#drawerEdit').addEventListener('click',function(){ d.classList.remove('open'); openStudentModal(s); });
  $('#drawerCollect').addEventListener('click',function(){ d.classList.remove('open'); openPayModal(s.id); });
  var dl=$('#drawerLeft'); if(dl) dl.addEventListener('click',function(){ d.classList.remove('open'); confirmMarkLeft(s.id); });
  $('#drawerDelete').addEventListener('click',function(){
    openConfirm('Delete '+s.name+'?', 'This will permanently remove the student and their payment records. This cannot be undone.', function(){
      sb.from('payments').delete().eq('student_id',s.id).then(function(r1){
        if(r1.error){ toast('Could not delete payments: '+r1.error.message); return; }
        return sb.from('complaints').update({student_id:null}).eq('student_id',s.id);
      }).then(function(){
        return sb.from('visitors').update({student_id:null}).eq('student_id',s.id);
      }).then(function(){
        return sb.from('students').delete().eq('id',s.id);
      }).then(function(r){
        if(r && r.error){ toast('Could not delete student: '+r.error.message); return; }
        d.classList.remove('open'); toast('Student deleted.'); refreshAndRender();
      });
    });
  });
}

// ---------- ROOMS ----------
function renderRooms(){
  var tabs=['All'].concat(floorsList());
  if(tabs.indexOf(roomFloorTab)===-1) roomFloorTab='All';
  var html='<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px"><div class="tabs" style="margin:0">'+tabs.map(function(t){return '<button data-floor-tab="'+esc(t)+'" class="'+(roomFloorTab===t?'active':'')+'">'+esc(t)+'</button>';}).join('')+'</div><button class="btn amber" id="addRoomBtn">+ Add Room</button></div><div class="rooms-grid" id="roomsGrid"></div>';
  $('#view-rooms').innerHTML=html;
  $$('#view-rooms [data-floor-tab]').forEach(function(b){ b.addEventListener('click',function(){ roomFloorTab=b.getAttribute('data-floor-tab'); renderRooms(); }); });
  $('#addRoomBtn').addEventListener('click',openRoomForm);
  var list=DB.rooms.filter(function(r){return roomFloorTab==='All'||r.floor===roomFloorTab;});
  $('#roomsGrid').innerHTML=list.map(function(r){
    var occ=occupants(r.id);
    var status= r.status==='maintenance'? 'Maintenance' : occ.length===0? 'Vacant' : occ.length>=(r.beds||0)? 'Full':'Partial';
    var color= r.status==='maintenance'? '#C0392B' : occ.length===0? '#1B8A5A' : occ.length>=(r.beds||0)? '#C0392B':'#E8A33D';
    var beds=''; for(var i=0;i<(r.beds||0);i++){ var o=occ[i]; beds+='<div class="bed"><span>Bed '+(i+1)+'</span><strong>'+(o? esc(o.name):'<span style="color:var(--green)">Vacant</span>')+'</strong></div>'; }
    return '<div class="room-card" role="button" tabindex="0" aria-label="Open Room '+esc(r.room_no)+' details" data-room="'+r.id+'"><div class="rhead"><h4>Room '+esc(r.room_no)+'</h4><span style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700"><span class="dot" style="background:'+color+'"></span>'+status+'</span></div><p style="margin:5px 0 4px;color:var(--muted);font-size:13px">'+esc(r.floor)+' · '+esc(r.type)+' · '+fmt(r.rent)+'/bed/month</p>'+beds+'</div>';
  }).join('') || '<div class="empty" style="grid-column:1/-1">No rooms yet.<br><br><button class="btn amber" id="roomFirstAdd">Add your first room</button></div>';
  var rfa=$('#roomFirstAdd'); if(rfa) rfa.addEventListener('click',openRoomForm);
  $$('#roomsGrid [data-room]').forEach(function(c){ c.addEventListener('click',function(){ openRoomModal(c.getAttribute('data-room')); }); c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openRoomModal(c.getAttribute('data-room')); } }); });
}
function openRoomForm(){
  openForm('Add Room','<form id="rf"><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="rf-floor">Floor</label><select id="rf-floor"><option>Ground</option><option>1st Floor</option><option>2nd Floor</option><option>3rd Floor</option><option>4th Floor</option></select></div><div class="field"><label for="rf-no">Room number *</label><input id="rf-no" required placeholder="e.g. 101"></div></div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px"><div class="field"><label for="rf-type">Type</label><select id="rf-type"><option>Single</option><option selected>Double</option><option>Triple</option><option>Dormitory</option></select></div><div class="field"><label for="rf-beds">Beds</label><input type="number" id="rf-beds" min="1" value="2"></div><div class="field"><label for="rf-rent">Rent / bed (₹)</label><input type="number" id="rf-rent" min="0" value="5000"></div></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Add Room</button></div></form>');
  $('#rf').addEventListener('submit',function(e){
    e.preventDefault();
    var row={ hostel_id:hid(), room_no:$('#rf-no').value.trim(), floor:$('#rf-floor').value, type:$('#rf-type').value, beds:Math.max(1,parseInt($('#rf-beds').value,10)||1), rent:Math.max(0,parseInt($('#rf-rent').value,10)||0), status:'available' };
    if(!row.room_no){ toast('Enter a room number.'); return; }
    sb.from('rooms').insert(row).then(function(r){ if(r.error){ toast('Could not add room: '+r.error.message); return; } closeModals(); toast('Room '+row.room_no+' added.'); refreshAndRender(); });
  });
}
function openRoomModal(roomId){
  var r=roomById(roomId); if(!r) return;
  var occ=occupants(roomId);
  var unassigned=activeStudents().filter(function(s){return !s.room_id;});
  var isMaint=r.status==='maintenance';
  $('#roomModalTitle').textContent='Room '+r.room_no+' — '+r.type+' · '+r.floor;
  var html='<p style="color:var(--muted);font-size:14px;margin-top:0">Rent: <strong style="color:var(--ink)">'+fmt(r.rent)+'</strong> per bed / month · Beds: '+(r.beds||0)+' · '+(isMaint?'<span class="badge overdue">Under Maintenance</span>':'<span class="badge paid">Available</span>')+'</p>'
    +'<h4>Occupants</h4>'+(occ.length? occ.map(function(s){return '<div class="list-row"><span><strong>'+esc(s.name)+'</strong> <span style="color:var(--muted);font-size:12px">'+esc(s.student_code||'')+' · '+esc(s.phone||'')+'</span></span><button class="icon-btn" data-unassign="'+s.id+'">Remove</button></div>';}).join(''):'<div class="empty">No occupants — all beds vacant.</div>')
    +(occ.length<(r.beds||0) && !isMaint ? '<div class="field" style="margin-top:14px"><label>Assign a student (only students without a room)</label><div style="display:flex;gap:8px"><select id="assignSel" style="flex:1;padding:10px;border:1px solid var(--line);border-radius:9px">'+(unassigned.length? unassigned.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' ('+esc(s.student_code||'')+')</option>';}).join(''):'<option value="">No unassigned students</option>')+'</select><button class="btn amber" id="assignBtn">Assign</button></div></div>':'')
    +'<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-top:16px"><div class="field" style="margin:0"><label>Rent per bed (₹/month)</label><input type="number" id="roomRent" value="'+(r.rent||0)+'"></div><button class="btn" id="saveRentBtn">Save Rent</button></div>'
    +'<button class="btn '+(isMaint?'amber':'ghost')+'" id="maintBtn" style="margin-top:14px;width:100%;justify-content:center">'+(isMaint?'End Maintenance':'Mark Under Maintenance')+'</button>'
    +(occ.length===0? '<button class="btn ghost" id="delRoomBtn" style="margin-top:10px;width:100%;justify-content:center;color:var(--red)">Delete Room</button>':'');
  $('#roomModalBody').innerHTML=html;
  $('#roomModal').classList.add('open');
  $$('#roomModalBody [data-unassign]').forEach(function(b){ b.addEventListener('click',function(){ var s=studentById(b.getAttribute('data-unassign')); if(!s) return; sb.from('students').update({room_id:null}).eq('id',s.id).then(function(res){ if(res.error){ toast(res.error.message); return; } toast(s.name+' removed from Room '+r.room_no); refreshAndRender(); setTimeout(function(){ openRoomModal(roomId); },50); }); }); });
  var ab=$('#assignBtn'); if(ab) ab.addEventListener('click',function(){ var sid=$('#assignSel').value; if(!sid){ toast('No student available to assign.'); return; } var s=studentById(sid); sb.from('students').update({room_id:roomId, monthly_fee:r.rent}).eq('id',sid).then(function(res){ if(res.error){ toast(res.error.message); return; } toast((s?s.name:'Student')+' assigned to Room '+r.room_no); refreshAndRender(); setTimeout(function(){ openRoomModal(roomId); },50); }); });
  $('#saveRentBtn').addEventListener('click',function(){ var v=parseInt($('#roomRent').value,10); if(isNaN(v)||v<0){ toast('Enter a valid rent.'); return; } sb.from('rooms').update({rent:v}).eq('id',roomId).then(function(res){ if(res.error){ toast(res.error.message); return; } toast('Room '+r.room_no+' rent updated to '+fmt(v)); refreshAndRender(); setTimeout(function(){ openRoomModal(roomId); },50); }); });
  $('#maintBtn').addEventListener('click',function(){ var ns=isMaint?'available':'maintenance'; sb.from('rooms').update({status:ns}).eq('id',roomId).then(function(res){ if(res.error){ toast(res.error.message); return; } toast(isMaint? 'Maintenance ended for Room '+r.room_no : 'Room '+r.room_no+' marked under maintenance.'); refreshAndRender(); setTimeout(function(){ openRoomModal(roomId); },50); }); });
  var drb=$('#delRoomBtn'); if(drb) drb.addEventListener('click',function(){ openConfirm('Delete Room '+r.room_no+'?','This room will be permanently removed.',function(){ sb.from('rooms').delete().eq('id',roomId).then(function(res){ if(res.error){ toast(res.error.message); return; } closeModals(); toast('Room deleted.'); refreshAndRender(); }); }); });
}

// ---------- FEES ----------
function renderFees(){
  var active=activeStudents();
  var expected=active.reduce(function(a,s){return a+Number(s.monthly_fee||0);},0);
  var collected=DB.payments.filter(function(p){return p.month===feesMonth;}).reduce(function(a,p){return a+Number(p.amount||0);},0);
  var overdueAmt=0, pendingAmt=0;
  active.forEach(function(s){ var due=Number(s.monthly_fee||0)-paidFor(s.id,feesMonth); if(due<=0) return; if(feeStatus(s,feesMonth)==='overdue') overdueAmt+=due; else pendingAmt+=due; });
  var html='<div class="card"><div class="filters"><label style="font-weight:600;font-size:14px">Month</label><input type="month" id="feesMonthInput" value="'+feesMonth+'"><button class="btn amber" id="feesCollectBtn">Collect Fee</button><button class="btn ghost" id="exportFeesBtn">Export CSV</button></div>'
  +'<div class="grid-stats" style="grid-template-columns:repeat(4,1fr)">'+statCard('Expected',fmt(expected),'')+statCard('Collected',fmt(collected),'')+statCard('Pending',fmt(pendingAmt),'')+statCard('Overdue',fmt(overdueAmt),'after the 10th')+'</div>'
  +'<div class="table-wrap"><table><thead><tr><th>Student</th><th>Room</th><th>Expected</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead><tbody>'
  + active.map(function(s){ var paid=paidFor(s.id,feesMonth); var bal=Number(s.monthly_fee||0)-paid; var st=feeStatus(s,feesMonth); return '<tr><td><div class="student-cell"><span class="avatar">'+initials(s.name)+'</span><strong>'+esc(s.name)+'</strong></div></td><td>'+esc(studentRoomLabel(s))+'</td><td>'+fmt(s.monthly_fee)+'</td><td>'+fmt(paid)+'</td><td>'+fmt(Math.max(0,bal))+'</td><td><span class="badge '+st+'">'+st.charAt(0).toUpperCase()+st.slice(1)+'</span></td><td><div style="display:flex;gap:6px"><button class="icon-btn" data-collect="'+s.id+'">Collect</button><button class="icon-btn" data-history="'+s.id+'">History</button></div></td></tr>'; }).join('')
  +'</tbody></table></div>'+(active.length?'':'<div class="empty">No active students yet. Add a student to start collecting fees.</div>')+'</div>';
  $('#view-fees').innerHTML=html;
  $('#feesMonthInput').addEventListener('change',function(e){ if(e.target.value){ feesMonth=e.target.value; renderFees(); } });
  $('#feesCollectBtn').addEventListener('click',function(){ openPayModal(); });
  $('#exportFeesBtn').addEventListener('click',exportFeesCSV);
  $$('#view-fees [data-collect]').forEach(function(b){ b.addEventListener('click',function(){ openPayModal(b.getAttribute('data-collect')); }); });
  $$('#view-fees [data-history]').forEach(function(b){ b.addEventListener('click',function(){ openDrawer(b.getAttribute('data-history')); }); });
}
function nextReceiptNo(){
  var yr=new Date().getFullYear(); var max=0;
  DB.payments.forEach(function(p){ var m=String(p.receipt_no||'').match(/(\d+)$/); if(m){ var n=parseInt(m[1],10); if(n>max) max=n; } });
  return 'RCP-'+yr+'-'+String(max+1).padStart(4,'0');
}
function openPayModal(studentId){
  var active=activeStudents();
  if(!active.length){ toast('No active students to collect from.'); return; }
  $('#pf-student').innerHTML=active.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' — '+esc(studentRoomLabel(s))+' ('+fmt(s.monthly_fee)+'/mo)</option>';}).join('');
  if(studentId) $('#pf-student').value=studentId;
  $('#pf-month').value=feesMonth;
  function hint(){ var s=studentById($('#pf-student').value); var m=$('#pf-month').value||feesMonth; if(!s) return; var bal=Number(s.monthly_fee||0)-paidFor(s.id,m); $('#pf-amount').value=Math.max(0,bal); $('#pf-hint').textContent='Balance for '+monthLabel(m)+': '+fmt(Math.max(0,bal))+' of '+fmt(s.monthly_fee)+'. Partial payments are allowed.'; }
  $('#pf-student').onchange=hint; $('#pf-month').onchange=hint; hint();
  $('#payModal').classList.add('open');
}
function exportCSV(filename, rows){
  var csv=rows.map(function(r){ return r.map(function(c){ var v=String(c==null?'':c); return '"'+v.replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
  var blob=new Blob([csv],{type:'text/csv'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},500);
}
function exportFeesCSV(){
  var rows=[['Student ID','Name','Room','Month','Expected','Paid','Balance','Status']];
  activeStudents().forEach(function(s){ var paid=paidFor(s.id,feesMonth); rows.push([s.student_code||'',s.name,studentRoomLabel(s),monthLabel(feesMonth),s.monthly_fee,paid,Math.max(0,Number(s.monthly_fee||0)-paid),feeStatus(s,feesMonth)]); });
  exportCSV('staynest-fees-'+feesMonth+'.csv', rows); toast('Fees CSV downloaded.');
}
function exportStudentsCSV(){
  var rows=[['Student ID','Name','Phone','Guardian Phone','Room','Floor','Join Date','Status','Left Date','Monthly Fee','Deposit']];
  DB.students.forEach(function(s){ var r=s.room_id?roomById(s.room_id):null; rows.push([s.student_code||'',s.name,s.phone||'',s.guardian_phone||'',r?r.room_no:'',r?r.floor:'',s.join_date||'',s.status,s.left_date||'',s.monthly_fee,s.deposit]); });
  exportCSV('staynest-students.csv', rows); toast('Students CSV downloaded.');
}

// ---------- MESS ----------
var DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
function renderMess(){
  var jsDay=new Date().getDay(); var todayName=DAYS[jsDay===0?6:jsDay-1];
  var active=activeStudents();
  var html='<div class="grid-stats">'+statCard('Veg — Today','—','Diet is not tracked per student')+statCard('Non-veg — Today','—','Diet is not tracked per student')+statCard('Total Meals Today',active.length,'active residents')+'</div>'
  +'<div class="card"><h3>Weekly Menu — tap any dish to edit, changes save automatically</h3><p style="color:var(--muted);font-size:13px;margin-top:-6px">Today is <strong>'+todayName+'</strong> (highlighted).</p><div class="table-wrap"><table class="menu-table"><thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snacks</th><th>Dinner</th></tr></thead><tbody>'
  + DAYS.map(function(d){ var m=DB.mess[d]||{breakfast:'',lunch:'',snacks:'',dinner:''}; var hl=d===todayName?' style="background:#FFFBF0"':''; return '<tr'+hl+'><td><strong>'+d+'</strong></td><td><input data-menu="'+d+'|breakfast" value="'+esc(m.breakfast||'')+'" placeholder="—"></td><td><input data-menu="'+d+'|lunch" value="'+esc(m.lunch||'')+'" placeholder="—"></td><td><input data-menu="'+d+'|snacks" value="'+esc(m.snacks||'')+'" placeholder="—"></td><td><input data-menu="'+d+'|dinner" value="'+esc(m.dinner||'')+'" placeholder="—"></td></tr>'; }).join('')
  +'</tbody></table></div>'+(Object.keys(DB.mess).length?'':'<p style="color:var(--muted);font-size:13px">No menu saved yet — type a dish in any cell and it will be saved for your hostel.</p>')+'</div>'
  +'<div class="card"><h3>Today — '+todayName+'</h3><p style="font-size:15px;line-height:1.7"><strong>Breakfast:</strong> '+esc((DB.mess[todayName]||{}).breakfast||'Not set')+'<br><strong>Lunch:</strong> '+esc((DB.mess[todayName]||{}).lunch||'Not set')+'<br><strong>Snacks:</strong> '+esc((DB.mess[todayName]||{}).snacks||'Not set')+'<br><strong>Dinner:</strong> '+esc((DB.mess[todayName]||{}).dinner||'Not set')+'</p></div>';
  $('#view-mess').innerHTML=html;
  $$('#view-mess [data-menu]').forEach(function(inp){ inp.addEventListener('change',function(){
    var parts=inp.getAttribute('data-menu').split('|'); var day=parts[0], field=parts[1];
    var cur=DB.mess[day]||{breakfast:'',lunch:'',snacks:'',dinner:''};
    var row={ hostel_id:hid(), day:day, breakfast:cur.breakfast||'', lunch:cur.lunch||'', snacks:cur.snacks||'', dinner:cur.dinner||'' };
    row[field]=inp.value;
    sb.from('mess_menu').upsert(row,{onConflict:'hostel_id,day'}).then(function(r){
      if(r.error){ toast('Could not save menu: '+r.error.message); return; }
      DB.mess[day]=row; toast('Menu updated for '+day+'.'); renderMess();
    });
  }); });
}

// ---------- COMPLAINTS ----------
function renderComplaints(){
  var html='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 style="margin:0">All Complaints ('+DB.complaints.length+')</h3><button class="btn amber" id="addComplaintBtn">+ Add Complaint</button></div><div style="margin-top:10px">'
  + (DB.complaints.length? DB.complaints.map(function(c){ var bc=c.status==='Resolved'?'resolved':c.status==='In Progress'?'progress':'open'; var next=c.status==='Open'?'Start Work':c.status==='In Progress'?'Mark Resolved':''; var s=c.student_id?studentById(c.student_id):null; var roomTxt=s? studentRoomLabel(s):''; return '<div class="list-row"><div><strong>'+esc(c.title)+'</strong><div style="font-size:12px;color:var(--muted)">'+esc(c.category||'')+' · '+esc(c.priority||'')+' priority'+(s? ' · by '+esc(s.name)+(roomTxt!=='—'?' · '+esc(roomTxt):'') : '')+'</div></div><div style="display:flex;gap:6px;align-items:center"><span class="badge '+bc+'">'+esc(c.status)+'</span>'+(next?'<button class="icon-btn" data-adv="'+c.id+'">'+next+'</button>':'')+'</div></div>'; }).join('') : '<div class="empty">No complaints yet. When a resident reports an issue, add it here to track it.</div>')
  +'</div></div>';
  $('#view-complaints').innerHTML=html;
  $('#addComplaintBtn').addEventListener('click',openComplaintForm);
  $$('#view-complaints [data-adv]').forEach(function(b){ b.addEventListener('click',function(){ var c=DB.complaints.find(function(x){return x.id===b.getAttribute('data-adv');}); if(!c) return; var ns= c.status==='Open'?'In Progress':'Resolved'; sb.from('complaints').update({status:ns}).eq('id',c.id).then(function(r){ if(r.error){ toast(r.error.message); return; } toast('Complaint moved to '+ns+'.'); refreshAndRender(); }); }); });
}
function openComplaintForm(){
  var active=activeStudents();
  openForm('Add Complaint','<form id="cf"><div class="field"><label for="cf-title">Title *</label><input id="cf-title" required placeholder="e.g. Tap leaking"></div><div class="field"><label for="cf-stu">Student</label><select id="cf-stu"><option value="">— Select student —</option>'+active.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' — '+esc(studentRoomLabel(s))+'</option>';}).join('')+'</select></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="cf-cat">Category</label><select id="cf-cat"><option>Plumbing</option><option>Electrical</option><option>Cleaning</option><option>Wi-Fi</option><option>Food</option><option>Other</option></select></div><div class="field"><label for="cf-pri">Priority</label><select id="cf-pri"><option>Low</option><option selected>Medium</option><option>High</option></select></div></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Add Complaint</button></div></form>');
  $('#cf').addEventListener('submit',function(e){ e.preventDefault(); var row={ hostel_id:hid(), student_id:$('#cf-stu').value||null, title:$('#cf-title').value.trim(), category:$('#cf-cat').value, priority:$('#cf-pri').value, status:'Open' }; if(!row.title){ toast('Enter a title.'); return; } sb.from('complaints').insert(row).then(function(r){ if(r.error){ toast('Could not add complaint: '+r.error.message); return; } closeModals(); toast('Complaint added.'); refreshAndRender(); }); });
}

// ---------- VISITORS ----------
function renderVisitors(){
  var html='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 style="margin:0">Visitor Log</h3><button class="btn amber" id="addVisitorBtn">+ Add Entry</button></div><div class="table-wrap" style="margin-top:10px"><table><thead><tr><th>Visitor</th><th>Visiting</th><th>Purpose</th><th>In Time</th><th>Out Time</th><th>Action</th></tr></thead><tbody>'
  + DB.visitors.map(function(v){ var s=v.student_id?studentById(v.student_id):null; return '<tr><td><strong>'+esc(v.visitor_name)+'</strong></td><td>'+esc(s? s.name+' ('+studentRoomLabel(s)+')' : '—')+'</td><td>'+esc(v.purpose||'')+'</td><td>'+fmtTime(v.in_time)+'</td><td>'+(v.out_time? fmtTime(v.out_time):'<span class="badge pending">Inside</span>')+'</td><td>'+(v.out_time?'—':'<button class="icon-btn" data-out="'+v.id+'">Mark Out</button>')+'</td></tr>'; }).join('')
  +'</tbody></table></div>'+(DB.visitors.length?'':'<div class="empty">No visitor entries yet. Add the first entry when a guest arrives.</div>')+'</div>';
  $('#view-visitors').innerHTML=html;
  $('#addVisitorBtn').addEventListener('click',openVisitorForm);
  $$('#view-visitors [data-out]').forEach(function(b){ b.addEventListener('click',function(){ var v=DB.visitors.find(function(x){return x.id===b.getAttribute('data-out');}); if(!v) return; sb.from('visitors').update({out_time:new Date().toISOString()}).eq('id',v.id).then(function(r){ if(r.error){ toast(r.error.message); return; } toast(v.visitor_name+' marked out.'); refreshAndRender(); }); }); });
}
function openVisitorForm(){
  var active=activeStudents();
  openForm('Add Visitor Entry','<form id="vf"><div class="field"><label for="vf-name">Visitor name *</label><input id="vf-name" required placeholder="e.g. Rajesh Patel"></div><div class="field"><label for="vf-stu">Visiting student</label><select id="vf-stu">'+(active.length? active.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' — '+esc(studentRoomLabel(s))+'</option>';}).join('') : '<option value="">No active students</option>')+'</select></div><div class="field"><label for="vf-purpose">Purpose</label><input id="vf-purpose" placeholder="e.g. Family visit"></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Add Entry</button></div></form>');
  $('#vf').addEventListener('submit',function(e){ e.preventDefault(); var row={ hostel_id:hid(), visitor_name:$('#vf-name').value.trim(), student_id:$('#vf-stu').value||null, purpose:$('#vf-purpose').value.trim()||'Visit', in_time:new Date().toISOString(), out_time:null }; if(!row.visitor_name){ toast('Enter the visitor name.'); return; } sb.from('visitors').insert(row).then(function(r){ if(r.error){ toast('Could not add entry: '+r.error.message); return; } closeModals(); toast('Visitor entry added.'); refreshAndRender(); }); });
}

// ---------- NOTICES ----------
function renderNotices(){
  var sorted=DB.notices.slice().sort(function(a,b){ return (b.pinned?1:0)-(a.pinned?1:0); });
  var html='<div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn amber" id="addNoticeBtn">+ Post Notice</button></div>'
  + (sorted.length? sorted.map(function(n){ return '<div class="notice'+(n.pinned?' pinned':'')+'"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong style="font-size:16px">'+esc(n.title)+(n.pinned?' <span class="badge pending">Pinned</span>':'')+'</strong><span style="font-size:12px;color:var(--muted)">'+(n.created_at? fmtDate(n.created_at)+' · ':'')+'For: '+esc(n.audience||'All')+'</span></div><p style="color:#3D4A4C;line-height:1.65;margin:8px 0 10px">'+esc(n.body||'')+'</p><div style="display:flex;gap:6px"><button class="icon-btn" data-pin="'+n.id+'">'+(n.pinned?'Unpin':'Pin')+'</button><button class="icon-btn" data-delnotice="'+n.id+'">Delete</button></div></div>'; }).join('') : '<div class="empty">No notices posted yet. Post your first notice for residents.</div>');
  $('#view-notices').innerHTML=html;
  $('#addNoticeBtn').addEventListener('click',openNoticeForm);
  $$('#view-notices [data-pin]').forEach(function(b){ b.addEventListener('click',function(){ var n=DB.notices.find(function(x){return x.id===b.getAttribute('data-pin');}); if(!n) return; sb.from('notices').update({pinned:!n.pinned}).eq('id',n.id).then(function(r){ if(r.error){ toast(r.error.message); return; } toast(n.pinned?'Notice unpinned.':'Notice pinned.'); refreshAndRender(); }); }); });
  $$('#view-notices [data-delnotice]').forEach(function(b){ b.addEventListener('click',function(){ var id=b.getAttribute('data-delnotice'); openConfirm('Delete this notice?','The notice will be removed from the board.',function(){ sb.from('notices').delete().eq('id',id).then(function(r){ if(r.error){ toast(r.error.message); return; } toast('Notice deleted.'); refreshAndRender(); }); }); }); });
}
function openNoticeForm(){
  var aud=['All'].concat(floorsList());
  openForm('Post Notice','<form id="nf"><div class="field"><label for="nf-title">Title *</label><input id="nf-title" required placeholder="Notice title"></div><div class="field"><label for="nf-body">Message</label><textarea id="nf-body" rows="4" placeholder="Write the notice…"></textarea></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="nf-aud">Audience</label><select id="nf-aud">'+aud.map(function(a){return '<option>'+esc(a)+'</option>';}).join('')+'</select></div><div class="field"><label for="nf-pin">Pin to top</label><select id="nf-pin"><option value="no">No</option><option value="yes">Yes</option></select></div></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Post Notice</button></div></form>');
  $('#nf').addEventListener('submit',function(e){ e.preventDefault(); var row={ hostel_id:hid(), title:$('#nf-title').value.trim(), body:$('#nf-body').value.trim()||null, audience:$('#nf-aud').value, pinned:$('#nf-pin').value==='yes' }; if(!row.title){ toast('Enter a title.'); return; } sb.from('notices').insert(row).then(function(r){ if(r.error){ toast('Could not post notice: '+r.error.message); return; } closeModals(); toast('Notice posted.'); refreshAndRender(); }); });
}

// ---------- REPORTS ----------
function renderReports(){
  var active=activeStudents();
  var occ= totalBeds()? Math.round(occupiedBeds()/totalBeds()*100):0;
  var rows=''; for(var i=5;i>=0;i--){ var d=new Date(); d.setMonth(d.getMonth()-i); var mk=d.toISOString().slice(0,7); var col=DB.payments.filter(function(p){return p.month===mk;}).reduce(function(a,p){return a+Number(p.amount||0);},0); var exp=active.reduce(function(a,s){return a+Number(s.monthly_fee||0);},0); rows+='<tr><td>'+monthLabel(mk)+'</td><td>'+fmt(exp)+'</td><td>'+fmt(col)+'</td><td>'+fmt(Math.max(0,exp-col))+'</td><td>'+(exp? Math.round(col/exp*100):0)+'%</td></tr>'; }
  var floorRows=floorsList().map(function(f){ var fr=DB.rooms.filter(function(r){return r.floor===f;}); var beds=fr.reduce(function(a,r){return a+(r.beds||0);},0); var occN=fr.reduce(function(a,r){return a+occupants(r.id).length;},0); return '<tr><td>'+esc(f)+'</td><td>'+fr.length+'</td><td>'+beds+'</td><td>'+occN+'</td><td>'+(beds-occN)+'</td></tr>'; }).join('');
  $('#view-reports').innerHTML='<div class="grid-stats">'+statCard('Total Students',active.length,'')+statCard('Occupancy',occ+'%','')+statCard('Vacant Beds',vacantBeds(),'')
  +'</div><div class="card"><h3>Occupancy by Floor</h3>'+(floorRows? '<div class="table-wrap"><table style="min-width:420px"><thead><tr><th>Floor</th><th>Rooms</th><th>Beds</th><th>Occupied</th><th>Vacant</th></tr></thead><tbody>'+floorRows+'</tbody></table></div>' : '<div class="empty">No rooms yet — floor summary will appear here.</div>')+'</div>'
  +'<div class="card"><h3>Monthly Collection — Last 6 Months</h3><div class="table-wrap"><table style="min-width:420px"><thead><tr><th>Month</th><th>Expected</th><th>Collected</th><th>Pending</th><th>Collection %</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>'
  +'<div class="card no-print"><h3>Export &amp; Print</h3><p style="color:var(--muted);font-size:14px">Download your data as CSV, or print this report page.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn amber" id="expStu">Export Students CSV</button><button class="btn" id="expFee">Export Fees CSV</button><button class="btn ghost" id="printBtn">Print Report</button></div></div>';
  $('#expStu').addEventListener('click',exportStudentsCSV);
  $('#expFee').addEventListener('click',exportFeesCSV);
  $('#printBtn').addEventListener('click',function(){ toast('Use your browser print option (Ctrl/Cmd + P) to print this report.'); });
}

// ---------- Generic helpers ----------
var confirmCb=null;
function openConfirm(title,text,cb){ $('#confirmTitle').textContent=title; $('#confirmText').textContent=text; confirmCb=cb; $('#confirmModal').classList.add('open'); }
function openForm(title,html){ $('#formModalTitle').textContent=title; $('#formModalBody').innerHTML=html; $('#formModal').classList.add('open'); bindCloseButtons(); }
function closeModals(){ $$('.modal-overlay').forEach(function(m){ m.classList.remove('open'); }); }
function bindCloseButtons(){ $$('[data-close]').forEach(function(b){ b.onclick=function(){ closeModals(); }; }); }

// ---------- Form submissions ----------
$('#studentForm').addEventListener('submit',function(e){
  e.preventDefault();
  var id=$('#sf-id').value; var name=$('#sf-name').value.trim(); if(!name){ toast('Please enter a name.'); return; }
  var roomId=$('#sf-room').value||null; var fee=parseInt($('#sf-fee').value,10)||0; var dep=parseInt($('#sf-deposit').value,10)||0;
  var payload={ name:name, phone:$('#sf-phone').value.trim(), guardian_phone:$('#sf-guardian').value.trim()||null, room_id:roomId, join_date:$('#sf-join').value||todayStr(), monthly_fee:fee, deposit:dep };
  if(id){
    sb.from('students').update(payload).eq('id',id).then(function(r){ if(r.error){ toast('Could not save: '+r.error.message); return; } closeModals(); toast('Student updated.'); refreshAndRender(); });
  } else {
    payload.hostel_id=hid(); payload.student_code=nextStudentCode(); payload.status='active'; payload.left_date=null;
    sb.from('students').insert(payload).then(function(r){ if(r.error){ toast('Could not add student: '+r.error.message); return; } closeModals(); toast(name+' added — ID '+payload.student_code); refreshAndRender(); if(currentView!=='students') go('students'); });
  }
});
$('#payForm').addEventListener('submit',function(e){
  e.preventDefault();
  var sid=$('#pf-student').value; var month=$('#pf-month').value||feesMonth; var amt=parseInt($('#pf-amount').value,10);
  if(!sid||!amt||amt<=0){ toast('Enter a valid amount.'); return; }
  var rcp=nextReceiptNo();
  var row={ hostel_id:hid(), student_id:sid, month:month, amount:amt, method:$('#pf-method').value, receipt_no:rcp, paid_at:new Date().toISOString() };
  sb.from('payments').insert(row).then(function(r){
    if(r.error){ toast('Could not record payment: '+r.error.message); return; }
    feesMonth=month; closeModals(); toast('Payment recorded. Receipt '+rcp); refreshAndRender(); if(currentView!=='fees') go('fees');
  });
});

// ---------- Init ----------
bindCloseButtons();
$$('.modal-overlay').forEach(function(m){ m.addEventListener('click',function(e){ if(e.target===m) closeModals(); }); });
$('#confirmYes').addEventListener('click',function(){ closeModals(); if(confirmCb){ var cb=confirmCb; confirmCb=null; cb(); } });
$('#quickAddStudent').addEventListener('click',function(){ openStudentModal(); });
$('#quickCollect').addEventListener('click',function(){ openPayModal(); });
document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeModals(); $('#studentDrawer').classList.remove('open'); } });
setAuthMode('login');
showScreen('boot');
var booted=false;
sb.auth.getSession().then(function(r){
  if(booted) return; booted=true;
  if(r.data && r.data.session){ user=r.data.session.user; afterLogin(); }
  else showScreen('auth');
}).catch(function(){ if(!booted){ booted=true; showScreen('auth'); } });
sb.auth.onAuthStateChange(function(event, session){
  if(event==='SIGNED_OUT'){ user=null; showScreen('auth'); }
});
})();
