// StayNest app.js — vanilla SPA with localStorage
(function(){
"use strict";
var KEY='staynest_v1';
var state;
function load(){ try{ var raw=localStorage.getItem(KEY); if(raw){ state=JSON.parse(raw); return; } }catch(e){} state=JSON.parse(JSON.stringify(window.STAYNEST_SEED)); save(); }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
function $(s,el){ return (el||document).querySelector(s); }
function $$(s,el){ return Array.prototype.slice.call((el||document).querySelectorAll(s)); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function fmt(n){ return '₹'+Number(n||0).toLocaleString('en-IN'); }
function todayStr(){ return new Date().toISOString().slice(0,10); }
function curMonth(){ return new Date().toISOString().slice(0,7); }
function initials(name){ return name.split(' ').map(function(w){return w[0];}).slice(0,2).join('').toUpperCase(); }
function toast(msg){ var w=$('#toastWrap'); var t=document.createElement('div'); t.className='toast'; t.textContent=msg; w.appendChild(t); setTimeout(function(){ t.remove(); },2800); }
function logActivity(text){ state.activity.unshift({text:text, time: todayStr()+' '+new Date().toTimeString().slice(0,5)}); state.activity=state.activity.slice(0,30); }
function roomById(id){ return state.rooms.find(function(r){return r.id===id;}); }
function studentById(id){ return state.students.find(function(s){return s.id===id;}); }
function occupants(roomId){ return state.students.filter(function(s){return s.status==='active' && s.roomId===roomId;}); }
function vacantBeds(){ var active=state.students.filter(function(s){return s.status==='active';}).length; return Math.max(0, totalBeds()-active); }
function totalBeds(){ return state.rooms.reduce(function(a,r){return a+r.capacity;},0); }
function paidFor(studentId, month){ return state.payments.filter(function(p){return p.studentId===studentId && p.month===month;}).reduce(function(a,p){return a+p.amount;},0); }
function feeStatus(st, month){
  if(st.status!=='active') return 'left';
  var paid=paidFor(st.id, month); var due=st.monthlyFee;
  if(paid>=due) return 'paid';
  var now=new Date(); var isCurrentOrPast = month <= curMonth();
  var day = (month===curMonth()) ? now.getDate() : 31;
  if(isCurrentOrPast && day>10 && paid<due) return 'overdue';
  return 'pending';
}
function monthLabel(mk){ var d=new Date(mk+'-02'); return d.toLocaleString('en-IN',{month:'short', year:'numeric'}); }

// Icons (inline SVG)
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

// ---------- DASHBOARD ----------
function renderDashboard(){
  var active=state.students.filter(function(s){return s.status==='active';});
  var occ = totalBeds()? Math.round(active.length/totalBeds()*100):0;
  var cm=curMonth();
  var collected=state.payments.filter(function(p){return p.month===cm;}).reduce(function(a,p){return a+p.amount;},0);
  var expected=active.reduce(function(a,s){return a+s.monthlyFee;},0);
  var pendingAmt=Math.max(0, expected-collected);
  var openC=state.complaints.filter(function(c){return c.status!=='Resolved';}).length;
  var pendAll=active.map(function(s){ var paid=paidFor(s.id,cm); return {s:s, due:s.monthlyFee-paid, status:feeStatus(s,cm)}; }).filter(function(x){return x.due>0;}).sort(function(a,b){return b.due-a.due;});
  var pendList=pendAll.slice(0,6);
  var today=todayStr();
  var joinedToday=state.students.filter(function(s){return s.joinDate===today;});
  var leftToday=state.students.filter(function(s){return s.leftDate===today;});
  var html='';
  html+='<div class="grid-stats">'
    + statCard('Total Students', active.length, state.students.filter(function(s){return s.status==='left';}).length+' left so far')
    + statCard('Occupancy', occ+'%', active.length+' of '+totalBeds()+' beds filled')
    + statCard('Fees Collected — '+monthLabel(cm), fmt(collected), 'of '+fmt(expected)+' expected')
    + statCard('Pending Fees', fmt(pendingAmt), pendAll.length+' students with dues')
    + statCard('Vacant Beds', vacantBeds(), 'across '+state.rooms.length+' rooms')
    + statCard('Open Complaints', openC, 'needs attention')
    +'</div>';
  html+='<div class="grid-2"><div class="card"><h3>Occupancy</h3><div style="max-width:280px;margin:0 auto"><canvas id="donutChart" height="220"></canvas></div><p style="text-align:center;color:var(--muted);font-size:13px" id="donutFallback"></p></div>'
    +'<div class="card"><h3>Fee Collection — Last 6 Months</h3><canvas id="barChart" height="220"></canvas><p style="text-align:center;color:var(--muted);font-size:13px" id="barFallback"></p></div></div>';
  html+='<div class="grid-2"><div class="card"><h3>Top Pending Fees — '+monthLabel(cm)+' (top 6 of '+pendAll.length+' with dues)</h3>'
    + (pendList.length? pendList.map(function(x){
        var msg=encodeURIComponent('Namaste '+x.s.name+', this is a gentle reminder from StayNest Hostel. Your hostel fee of '+fmt(x.due)+' for '+monthLabel(cm)+' is pending. Please pay at the earliest. Thank you!');
        var phone=('91'+String(x.s.phone).replace(/\D/g,'').slice(-10));
        return '<div class="list-row"><div style="display:flex;gap:10px;align-items:center"><span class="avatar">'+initials(x.s.name)+'</span><div><strong>'+esc(x.s.name)+'</strong><div style="font-size:12px;color:var(--muted)">Room '+esc(x.s.roomId||'—')+' · '+esc(x.s.id)+'</div></div></div><div style="text-align:right"><div style="font-weight:700">'+fmt(x.due)+'</div><a class="btn sm amber" target="_blank" rel="noopener" href="https://wa.me/'+phone+'?text='+msg+'">Remind</a></div></div>';
      }).join('') : '<div class="empty">All fees collected for this month. Great job.</div>')
    +'</div>'
    +'<div><div class="card"><h3>Today — Joinings & Leavings</h3>'
    + (joinedToday.length||leftToday.length ? joinedToday.map(function(s){return '<div class="list-row"><span>Joined: <strong>'+esc(s.name)+'</strong> — Room '+esc(s.roomId||'—')+'</span><span class="badge paid">Joined</span></div>';}).join('')+leftToday.map(function(s){return '<div class="list-row"><span>Left: <strong>'+esc(s.name)+'</strong></span><span class="badge grey">Left</span></div>';}).join('') : '<div class="empty">No joinings or leavings today.</div>')
    +'</div><div class="card"><h3>Recent Activity</h3>'
    + state.activity.slice(0,7).map(function(a){ return '<div class="list-row"><span style="font-size:14px">'+esc(a.text)+'</span><span style="font-size:12px;color:var(--muted);white-space:nowrap">'+esc(a.time)+'</span></div>'; }).join('')
    +'</div></div></div>';
  $('#view-dashboard').innerHTML=html;
  // charts
  setTimeout(function(){
    if(window.Chart){
      var dc=$('#donutChart'); if(dc){ if(charts.donut) charts.donut.destroy(); charts.donut=new Chart(dc,{type:'doughnut',data:{labels:['Occupied','Vacant'],datasets:[{data:[active.length, Math.max(0,totalBeds()-active.length)],backgroundColor:['#0C2B2D','#E8A33D'],borderWidth:0}]},options:{plugins:{legend:{position:'bottom'}},cutout:'68%'}}); }
      var bc=$('#barChart'); if(bc){ var labels=[],data=[]; for(var i=5;i>=0;i--){ var d=new Date(); d.setMonth(d.getMonth()-i); var mk=d.toISOString().slice(0,7); labels.push(monthLabel(mk)); data.push(state.payments.filter(function(p){return p.month===mk;}).reduce(function(a,p){return a+p.amount;},0)); } if(charts.bar) charts.bar.destroy(); charts.bar=new Chart(bc,{type:'bar',data:{labels:labels,datasets:[{label:'Collected (₹)',data:data,backgroundColor:'#E8A33D',borderRadius:6}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}}); }
    } else {
      var df=$('#donutFallback'); if(df) df.textContent='Occupied: '+active.length+' · Vacant: '+Math.max(0,totalBeds()-active.length);
      var bf=$('#barFallback'); if(bf) bf.textContent='Charts need an internet connection for the chart library.';
    }
  },30);
}
function statCard(label,val,sub){ return '<div class="stat"><div class="label">'+esc(label)+'</div><div class="val">'+esc(val)+'</div><div class="sub">'+esc(sub)+'</div></div>'; }

// ---------- STUDENTS ----------
var stuQuery='', stuFloor='All', stuFee='All', stuStatus='Active';
function renderStudents(){
  var floors=['All','Ground','1st Floor','2nd Floor'];
  var html='<div class="card"><div class="filters"><input type="search" id="stuSearch" placeholder="Search name, ID or phone…" value="'+esc(stuQuery)+'">'
    +'<select id="stuFloor"><option value="All">All Floors</option>'+floors.slice(1).map(function(f){return '<option '+(stuFloor===f?'selected':'')+'>'+f+'</option>';}).join('')+'</select>'
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
  return state.students.filter(function(s){
    if(stuStatus==='Active' && s.status!=='active') return false;
    if(stuStatus==='Left' && s.status!=='left') return false;
    if(stuFloor!=='All'){ var r=roomById(s.roomId); if(!r||r.floor!==stuFloor) return false; }
    if(stuFee!=='All' && feeStatus(s,cm)!==stuFee) return false;
    if(stuQuery){ var q=stuQuery.toLowerCase(); if(!(s.name.toLowerCase().indexOf(q)>-1||s.id.toLowerCase().indexOf(q)>-1||s.phone.indexOf(q)>-1)) return false; }
    return true;
  });
}
function fillStudentRows(){
  var list=filteredStudents(); var cm=curMonth();
  var body=$('#stuBody'); if(!body) return;
  body.innerHTML=list.map(function(s){
    var st=feeStatus(s,cm);
    var badge= s.status==='left' ? '<span class="badge grey">Left</span>' : '<span class="badge '+st+'">'+st.charAt(0).toUpperCase()+st.slice(1)+'</span>';
    return '<tr><td><div class="student-cell"><span class="avatar">'+initials(s.name)+'</span><strong>'+esc(s.name)+'</strong></div></td><td>'+esc(s.id)+'</td><td>'+esc(s.phone)+'</td><td>'+esc(s.roomId||'—')+'</td><td>'+esc(s.joinDate)+'</td><td>'+badge+'</td><td><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="icon-btn" data-view-stu="'+s.id+'">View</button><button class="icon-btn" data-edit-stu="'+s.id+'">Edit</button>'+(s.status==='active'?'<button class="icon-btn" data-left-stu="'+s.id+'">Mark Left</button>':'')+'</div></td></tr>';
  }).join('');
  $('#stuEmpty').innerHTML= list.length? '' : '<div class="empty" style="margin-top:14px">No students match your search. Try a different filter or add a new student.</div>';
  $$('#stuBody [data-view-stu]').forEach(function(b){ b.addEventListener('click',function(){ openDrawer(b.getAttribute('data-view-stu')); }); });
  $$('#stuBody [data-edit-stu]').forEach(function(b){ b.addEventListener('click',function(){ openStudentModal(studentById(b.getAttribute('data-edit-stu'))); }); });
  $$('#stuBody [data-left-stu]').forEach(function(b){ b.addEventListener('click',function(){ confirmMarkLeft(b.getAttribute('data-left-stu')); }); });
}
function vacantRoomOptions(selected){
  var opts='<option value="">No room (assign later)</option>';
  state.rooms.forEach(function(r){ if(r.maintenance) return; var occ=occupants(r.id).length; if(occ<r.capacity || r.id===selected){ opts+='<option value="'+r.id+'" '+(r.id===selected?'selected':'')+'>Room '+r.id+' — '+r.type+' ('+(r.capacity-occ)+' bed'+((r.capacity-occ)===1?'':'s')+' free) · '+fmt(r.rent)+'/mo</option>'; } });
  return opts;
}
function openStudentModal(stu){
  $('#studentModalTitle').textContent= stu? 'Edit Student':'Add Student';
  $('#sf-id').value= stu? stu.id:'';
  $('#sf-name').value= stu? stu.name:''; $('#sf-phone').value= stu? stu.phone:''; $('#sf-guardian').value= stu? (stu.guardianPhone||''):'';
  $('#sf-room').innerHTML=vacantRoomOptions(stu?stu.roomId:null); if(stu) $('#sf-room').value=stu.roomId||'';
  $('#sf-diet').value= stu? (stu.diet||'Veg'):'Veg';
  $('#sf-join').value= stu? stu.joinDate: todayStr();
  $('#sf-fee').value= stu? stu.monthlyFee: 6000; $('#sf-deposit').value= stu? stu.deposit: 12000;
  $('#sf-room').onchange=function(){ var r=roomById($('#sf-room').value); if(r){ $('#sf-fee').value=r.rent; } };
  $('#studentModal').classList.add('open');
}
function confirmMarkLeft(id){
  var s=studentById(id); if(!s) return;
  openConfirm('Mark '+s.name+' as left?', s.name+' will be marked left today ('+todayStr()+'). Their bed in Room '+(s.roomId||'—')+' will become vacant. This can be reviewed in the Left list.', function(){
    s.status='left'; s.leftDate=todayStr();
    if(s.roomHistory.length) s.roomHistory[s.roomHistory.length-1].to=s.leftDate;
    logActivity(s.name+' marked left — Room '+(s.roomId||''));
    s.roomId=null; save(); toast(s.name+' marked as left. Bed is now vacant.'); renderAll();
  });
}
function openDrawer(id){
  var s=studentById(id); if(!s) return;
  var pays=state.payments.filter(function(p){return p.studentId===id;}).sort(function(a,b){return b.month.localeCompare(a.month);});
  var r=roomById(s.roomId);
  var html='<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:52px;height:52px;font-size:17px">'+initials(s.name)+'</span><div><h3 style="margin:0">'+esc(s.name)+'</h3><p style="margin:3px 0 0;color:var(--muted);font-size:13px">'+esc(s.id)+' · '+(s.status==='active'?'Active':'Left on '+esc(s.leftDate||''))+'</p></div></div><button class="icon-btn" id="drawerClose">Close</button></div>'
  +'<div style="margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:14px">'
  +'<div><span style="color:var(--muted)">Phone</span><br><strong>'+esc(s.phone)+'</strong></div>'
  +'<div><span style="color:var(--muted)">Guardian</span><br><strong>'+esc(s.guardianPhone||'—')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Room</span><br><strong>'+(r? 'Room '+r.id+' · '+r.floor+' · '+r.type : 'No room assigned')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Diet</span><br><strong>'+esc(s.diet||'Veg')+'</strong></div>'
  +'<div><span style="color:var(--muted)">Join date</span><br><strong>'+esc(s.joinDate)+'</strong></div>'
  +'<div><span style="color:var(--muted)">Monthly fee / Deposit</span><br><strong>'+fmt(s.monthlyFee)+' / '+fmt(s.deposit)+'</strong></div></div>'
  +'<h4 style="margin:22px 0 8px">Fee Payment History</h4>'+(pays.length? pays.map(function(p){return '<div class="list-row"><span>'+monthLabel(p.month)+' · '+esc(p.method)+' · '+esc(p.receiptNo)+'</span><strong>'+fmt(p.amount)+'</strong></div>';}).join(''):'<div class="empty">No payments recorded yet.</div>')
  +'<h4 style="margin:22px 0 8px">Room History</h4>'+(s.roomHistory&&s.roomHistory.length? s.roomHistory.map(function(h){return '<div class="list-row"><span>Room '+esc(h.roomId)+'</span><span style="color:var(--muted);font-size:13px">'+esc(h.from)+' → '+esc(h.to||'Present')+'</span></div>';}).join(''):'<div class="empty">No room history.</div>')
  +'<div style="display:flex;gap:8px;margin-top:20px;flex-wrap:wrap"><button class="btn" id="drawerCollect">Collect Fee</button><button class="btn ghost" id="drawerEdit">Edit Profile</button>'+(s.status==='active'?'<button class="btn danger" id="drawerLeft">Mark Left</button>':'')+'<button class="btn ghost" id="drawerDelete" style="color:var(--red)">Delete Student</button></div>';
  var d=$('#studentDrawer'); d.innerHTML=html; d.classList.add('open');
  $('#drawerClose').addEventListener('click',function(){ d.classList.remove('open'); });
  $('#drawerEdit').addEventListener('click',function(){ d.classList.remove('open'); openStudentModal(s); });
  $('#drawerCollect').addEventListener('click',function(){ d.classList.remove('open'); openPayModal(s.id); });
  var dl=$('#drawerLeft'); if(dl) dl.addEventListener('click',function(){ d.classList.remove('open'); confirmMarkLeft(s.id); });
  $('#drawerDelete').addEventListener('click',function(){
    openConfirm('Delete '+s.name+'?', 'This will permanently remove the student and their payment records. This cannot be undone.', function(){
      state.students=state.students.filter(function(x){return x.id!==s.id;});
      state.payments=state.payments.filter(function(x){return x.studentId!==s.id;});
      logActivity(s.name+' deleted'); save(); d.classList.remove('open'); toast('Student deleted.'); renderAll();
    });
  });
}

// ---------- ROOMS ----------
function renderRooms(){
  var tabs=['All','Ground','1st Floor','2nd Floor'];
  var html='<div class="tabs">'+tabs.map(function(t){return '<button data-floor-tab="'+t+'" class="'+(roomFloorTab===t?'active':'')+'">'+t+'</button>';}).join('')+'</div><div class="rooms-grid" id="roomsGrid"></div>';
  $('#view-rooms').innerHTML=html;
  $$('#view-rooms [data-floor-tab]').forEach(function(b){ b.addEventListener('click',function(){ roomFloorTab=b.getAttribute('data-floor-tab'); renderRooms(); }); });
  var list=state.rooms.filter(function(r){return roomFloorTab==='All'||r.floor===roomFloorTab;});
  $('#roomsGrid').innerHTML=list.map(function(r){
    var occ=occupants(r.id);
    var status= r.maintenance? 'Maintenance' : occ.length===0? 'Vacant' : occ.length>=r.capacity? 'Full':'Partial';
    var color= r.maintenance? '#C0392B' : occ.length===0? '#1B8A5A' : occ.length>=r.capacity? '#C0392B':'#E8A33D';
    var beds=''; for(var i=0;i<r.capacity;i++){ var o=occ[i]; beds+='<div class="bed"><span>Bed '+(i+1)+'</span><strong>'+(o? esc(o.name):'<span style="color:var(--green)">Vacant</span>')+'</strong></div>'; }
    return '<div class="room-card" role="button" tabindex="0" aria-label="Open Room '+r.id+' details" data-room="'+r.id+'"><div class="rhead"><h4>Room '+r.id+'</h4><span style="display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700"><span class="dot" style="background:'+color+'"></span>'+status+'</span></div><p style="margin:5px 0 4px;color:var(--muted);font-size:13px">'+esc(r.floor)+' · '+esc(r.type)+' · '+fmt(r.rent)+'/bed/month</p>'+beds+'</div>';
  }).join('') || '<div class="empty">No rooms on this floor.</div>';
  $$('#roomsGrid [data-room]').forEach(function(c){ c.addEventListener('click',function(){ openRoomModal(c.getAttribute('data-room')); }); c.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openRoomModal(c.getAttribute('data-room')); } }); });
}
function openRoomModal(roomId){
  var r=roomById(roomId); if(!r) return;
  var occ=occupants(roomId);
  var unassigned=state.students.filter(function(s){return s.status==='active' && !s.roomId;});
  $('#roomModalTitle').textContent='Room '+r.id+' — '+r.type+' · '+r.floor;
  var html='<p style="color:var(--muted);font-size:14px;margin-top:0">Rent: <strong style="color:var(--ink)">'+fmt(r.rent)+'</strong> per bed / month · Capacity: '+r.capacity+' · '+(r.maintenance?'<span class="badge overdue">Under Maintenance</span>':'<span class="badge paid">Available</span>')+'</p>'
    +'<h4>Occupants</h4>'+(occ.length? occ.map(function(s){return '<div class="list-row"><span><strong>'+esc(s.name)+'</strong> <span style="color:var(--muted);font-size:12px">'+esc(s.id)+' · '+esc(s.phone)+'</span></span><button class="icon-btn" data-unassign="'+s.id+'">Remove</button></div>';}).join(''):'<div class="empty">No occupants — all beds vacant.</div>')
    +(occ.length<r.capacity && !r.maintenance ? '<div class="field" style="margin-top:14px"><label>Assign a student (only students without a room)</label><div style="display:flex;gap:8px"><select id="assignSel" style="flex:1;padding:10px;border:1px solid var(--line);border-radius:9px">'+(unassigned.length? unassigned.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' ('+esc(s.id)+')</option>';}).join(''):'<option value="">No unassigned students</option>')+'</select><button class="btn amber" id="assignBtn">Assign</button></div></div>':'')
    +'<div style="display:grid;grid-template-columns:1fr auto;gap:10px;align-items:end;margin-top:16px"><div class="field" style="margin:0"><label>Rent per bed (₹/month)</label><input type="number" id="roomRent" value="'+r.rent+'"></div><button class="btn" id="saveRentBtn">Save Rent</button></div>'
    +'<button class="btn '+(r.maintenance?'amber':'ghost')+'" id="maintBtn" style="margin-top:14px;width:100%;justify-content:center">'+(r.maintenance?'End Maintenance':'Mark Under Maintenance')+'</button>';
  $('#roomModalBody').innerHTML=html;
  $('#roomModal').classList.add('open');
  $$('#roomModalBody [data-unassign]').forEach(function(b){ b.addEventListener('click',function(){ var s=studentById(b.getAttribute('data-unassign')); if(s){ if(s.roomHistory.length) s.roomHistory[s.roomHistory.length-1].to=todayStr(); s.roomId=null; logActivity(s.name+' removed from Room '+r.id); save(); toast(s.name+' removed from Room '+r.id); openRoomModal(roomId); renderAll(); } }); });
  var ab=$('#assignBtn'); if(ab) ab.addEventListener('click',function(){ var sid=$('#assignSel').value; if(!sid){ toast('No student available to assign.'); return; } var s=studentById(sid); s.roomId=roomId; s.monthlyFee=r.rent; s.roomHistory.push({roomId:roomId,from:todayStr(),to:null}); logActivity(s.name+' assigned to Room '+roomId); save(); toast(s.name+' assigned to Room '+roomId); openRoomModal(roomId); renderAll(); });
  $('#saveRentBtn').addEventListener('click',function(){ var v=parseInt($('#roomRent').value,10); if(!v||v<0){ toast('Enter a valid rent.'); return; } r.rent=v; save(); toast('Room '+r.id+' rent updated to '+fmt(v)); openRoomModal(roomId); renderAll(); });
  $('#maintBtn').addEventListener('click',function(){ r.maintenance=!r.maintenance; logActivity('Room '+r.id+(r.maintenance?' marked under maintenance':' maintenance ended')); save(); toast(r.maintenance?'Room '+r.id+' marked under maintenance.':'Maintenance ended for Room '+r.id); openRoomModal(roomId); renderAll(); });
}

// ---------- FEES ----------
function renderFees(){
  var active=state.students.filter(function(s){return s.status==='active';});
  var expected=active.reduce(function(a,s){return a+s.monthlyFee;},0);
  var collected=state.payments.filter(function(p){return p.month===feesMonth;}).reduce(function(a,p){return a+p.amount;},0);
  var overdueAmt=0, pendingAmt=0;
  active.forEach(function(s){ var due=s.monthlyFee-paidFor(s.id,feesMonth); if(due<=0) return; if(feeStatus(s,feesMonth)==='overdue') overdueAmt+=due; else pendingAmt+=due; });
  var html='<div class="card"><div class="filters"><label style="font-weight:600;font-size:14px">Month</label><input type="month" id="feesMonthInput" value="'+feesMonth+'"><button class="btn amber" id="feesCollectBtn">Collect Fee</button><button class="btn ghost" id="exportFeesBtn">Export CSV</button></div>'
  +'<div class="grid-stats" style="grid-template-columns:repeat(4,1fr)">'+statCard('Expected',fmt(expected),'')+statCard('Collected',fmt(collected),'')+statCard('Pending',fmt(pendingAmt),'')+statCard('Overdue',fmt(overdueAmt),'after the 10th')+'</div>'
  +'<div class="table-wrap"><table><thead><tr><th>Student</th><th>Room</th><th>Expected</th><th>Paid</th><th>Balance</th><th>Status</th><th>Action</th></tr></thead><tbody>'
  + active.map(function(s){ var paid=paidFor(s.id,feesMonth); var bal=s.monthlyFee-paid; var st=feeStatus(s,feesMonth); return '<tr><td><div class="student-cell"><span class="avatar">'+initials(s.name)+'</span><strong>'+esc(s.name)+'</strong></div></td><td>'+esc(s.roomId||'—')+'</td><td>'+fmt(s.monthlyFee)+'</td><td>'+fmt(paid)+'</td><td>'+fmt(Math.max(0,bal))+'</td><td><span class="badge '+st+'">'+st.charAt(0).toUpperCase()+st.slice(1)+'</span></td><td><div style="display:flex;gap:6px"><button class="icon-btn" data-collect="'+s.id+'">Collect</button><button class="icon-btn" data-history="'+s.id+'">History</button></div></td></tr>'; }).join('')
  +'</tbody></table></div>'+(active.length?'':'<div class="empty">No active students.</div>')+'</div>';
  $('#view-fees').innerHTML=html;
  $('#feesMonthInput').addEventListener('change',function(e){ if(e.target.value){ feesMonth=e.target.value; renderFees(); } });
  $('#feesCollectBtn').addEventListener('click',function(){ openPayModal(); });
  $('#exportFeesBtn').addEventListener('click',exportFeesCSV);
  $$('#view-fees [data-collect]').forEach(function(b){ b.addEventListener('click',function(){ openPayModal(b.getAttribute('data-collect')); }); });
  $$('#view-fees [data-history]').forEach(function(b){ b.addEventListener('click',function(){ openDrawer(b.getAttribute('data-history')); }); });
}
function openPayModal(studentId){
  var active=state.students.filter(function(s){return s.status==='active';});
  if(!active.length){ toast('No active students to collect from.'); return; }
  $('#pf-student').innerHTML=active.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' — Room '+esc(s.roomId||'—')+' ('+fmt(s.monthlyFee)+'/mo)</option>';}).join('');
  if(studentId) $('#pf-student').value=studentId;
  $('#pf-month').value=feesMonth;
  function hint(){ var s=studentById($('#pf-student').value); var m=$('#pf-month').value||feesMonth; if(!s) return; var bal=s.monthlyFee-paidFor(s.id,m); $('#pf-amount').value=Math.max(0,bal); $('#pf-hint').textContent='Balance for '+monthLabel(m)+': '+fmt(Math.max(0,bal))+' of '+fmt(s.monthlyFee)+'. Partial payments are allowed.'; }
  $('#pf-student').onchange=hint; $('#pf-month').onchange=hint; hint();
  $('#payModal').classList.add('open');
}
function exportCSV(filename, rows){
  var csv=rows.map(function(r){ return r.map(function(c){ var v=String(c==null?'':c); return '"'+v.replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
  var blob=new Blob([csv],{type:'text/csv'}); var url=URL.createObjectURL(blob); var a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){URL.revokeObjectURL(url);},500);
}
function exportFeesCSV(){
  var rows=[['Student ID','Name','Room','Month','Expected','Paid','Balance','Status']];
  state.students.filter(function(s){return s.status==='active';}).forEach(function(s){ var paid=paidFor(s.id,feesMonth); rows.push([s.id,s.name,s.roomId||'',monthLabel(feesMonth),s.monthlyFee,paid,Math.max(0,s.monthlyFee-paid),feeStatus(s,feesMonth)]); });
  exportCSV('staynest-fees-'+feesMonth+'.csv', rows); toast('Fees CSV downloaded.');
}
function exportStudentsCSV(){
  var rows=[['Student ID','Name','Phone','Guardian Phone','Room','Floor','Join Date','Status','Left Date','Monthly Fee','Deposit','Diet']];
  state.students.forEach(function(s){ var r=roomById(s.roomId); rows.push([s.id,s.name,s.phone,s.guardianPhone||'',s.roomId||'',r?r.floor:'',s.joinDate,s.status,s.leftDate||'',s.monthlyFee,s.deposit,s.diet||'']); });
  exportCSV('staynest-students.csv', rows); toast('Students CSV downloaded.');
}

// ---------- MESS ----------
function renderMess(){
  var days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var jsDay=new Date().getDay(); var todayName=days[jsDay===0?6:jsDay-1];
  var active=state.students.filter(function(s){return s.status==='active';});
  var veg=active.filter(function(s){return (s.diet||'Veg')==='Veg';}).length;
  var nonveg=active.length-veg;
  var html='<div class="grid-stats">'+statCard('Veg — Today',veg,'students')+statCard('Non-veg — Today',nonveg,'students')+statCard('Total Meals Today',active.length,'active residents')+'</div>'
  +'<div class="card"><h3>Weekly Menu — tap any dish to edit, changes save automatically</h3><p style="color:var(--muted);font-size:13px;margin-top:-6px">Today is <strong>'+todayName+'</strong> (highlighted). Mess fee is included in the monthly hostel fee — no separate mess charge.</p><div class="table-wrap"><table class="menu-table"><thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead><tbody>'
  + days.map(function(d){ var m=state.messMenu[d]||{breakfast:'',lunch:'',dinner:''}; var hl=d===todayName?' style="background:#FFFBF0"':''; return '<tr'+hl+'><td><strong>'+d+'</strong></td><td><input data-menu="'+d+'|breakfast" value="'+esc(m.breakfast)+'"></td><td><input data-menu="'+d+'|lunch" value="'+esc(m.lunch)+'"></td><td><input data-menu="'+d+'|dinner" value="'+esc(m.dinner)+'"></td></tr>'; }).join('')
  +'</tbody></table></div></div>'
  +'<div class="card"><h3>Today — '+todayName+'</h3><p style="font-size:15px;line-height:1.7"><strong>Breakfast:</strong> '+esc((state.messMenu[todayName]||{}).breakfast||'')+'<br><strong>Lunch:</strong> '+esc((state.messMenu[todayName]||{}).lunch||'')+'<br><strong>Dinner:</strong> '+esc((state.messMenu[todayName]||{}).dinner||'')+'</p></div>';
  $('#view-mess').innerHTML=html;
  $$('#view-mess [data-menu]').forEach(function(inp){ inp.addEventListener('change',function(){ var parts=inp.getAttribute('data-menu').split('|'); if(!state.messMenu[parts[0]]) state.messMenu[parts[0]]={}; state.messMenu[parts[0]][parts[1]]=inp.value; save(); toast('Menu updated for '+parts[0]+'.'); renderMess(); }); });
}

// ---------- COMPLAINTS ----------
function renderComplaints(){
  var html='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 style="margin:0">All Complaints ('+state.complaints.length+')</h3><button class="btn amber" id="addComplaintBtn">+ Add Complaint</button></div><div style="margin-top:10px">'
  + (state.complaints.length? state.complaints.map(function(c){ var bc=c.status==='Resolved'?'resolved':c.status==='In Progress'?'progress':'open'; var next=c.status==='Open'?'Start Work':c.status==='In Progress'?'Mark Resolved':''; return '<div class="list-row"><div><strong>'+esc(c.title)+'</strong><div style="font-size:12px;color:var(--muted)">Room '+esc(c.room)+' · '+esc(c.category)+' · '+esc(c.priority)+' priority · by '+esc(c.by)+' · '+esc(c.date)+'</div></div><div style="display:flex;gap:6px;align-items:center"><span class="badge '+bc+'">'+esc(c.status)+'</span>'+(next?'<button class="icon-btn" data-adv="'+c.id+'">'+next+'</button>':'')+'</div></div>'; }).join('') : '<div class="empty">No complaints. All good.</div>')
  +'</div></div>';
  $('#view-complaints').innerHTML=html;
  $('#addComplaintBtn').addEventListener('click',openComplaintForm);
  $$('#view-complaints [data-adv]').forEach(function(b){ b.addEventListener('click',function(){ var c=state.complaints.find(function(x){return x.id===b.getAttribute('data-adv');}); if(!c) return; c.status= c.status==='Open'?'In Progress':'Resolved'; logActivity('Complaint "'+c.title+'" → '+c.status); save(); toast('Complaint moved to '+c.status+'.'); renderAll(); }); });
}
function openComplaintForm(){
  openForm('Add Complaint','<form id="cf"><div class="field"><label for="cf-title">Title *</label><input id="cf-title" required placeholder="e.g. Tap leaking"></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="cf-room">Room</label><input id="cf-room" placeholder="e.g. 204"></div><div class="field"><label for="cf-cat">Category</label><select id="cf-cat"><option>Plumbing</option><option>Electrical</option><option>Cleaning</option><option>Wi-Fi</option><option>Food</option><option>Other</option></select></div></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="cf-pri">Priority</label><select id="cf-pri"><option>Low</option><option selected>Medium</option><option>High</option></select></div><div class="field"><label for="cf-by">Raised by</label><input id="cf-by" placeholder="Student name"></div></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Add Complaint</button></div></form>');
  $('#cf').addEventListener('submit',function(e){ e.preventDefault(); state.complaints.unshift({id:'C'+Date.now(), title:$('#cf-title').value.trim(), room:$('#cf-room').value.trim()||'—', category:$('#cf-cat').value, priority:$('#cf-pri').value, status:'Open', date:todayStr(), by:$('#cf-by').value.trim()||'Resident'}); logActivity('New complaint: '+$('#cf-title').value.trim()); save(); closeModals(); toast('Complaint added.'); renderAll(); });
}

// ---------- VISITORS ----------
function renderVisitors(){
  var html='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px"><h3 style="margin:0">Visitor Log</h3><button class="btn amber" id="addVisitorBtn">+ Add Entry</button></div><div class="table-wrap" style="margin-top:10px"><table><thead><tr><th>Visitor</th><th>Visiting</th><th>Purpose</th><th>In Time</th><th>Out Time</th><th>Action</th></tr></thead><tbody>'
  + state.visitors.map(function(v){ var s=studentById(v.studentId); return '<tr><td><strong>'+esc(v.name)+'</strong></td><td>'+esc(s? s.name+' (Room '+(s.roomId||'—')+')' : v.studentId)+'</td><td>'+esc(v.purpose)+'</td><td>'+esc(v.inTime)+'</td><td>'+(v.outTime? esc(v.outTime):'<span class="badge pending">Inside</span>')+'</td><td>'+(v.outTime?'—':'<button class="icon-btn" data-out="'+v.id+'">Mark Out</button>')+'</td></tr>'; }).join('')
  +'</tbody></table></div>'+(state.visitors.length?'':'<div class="empty">No visitor entries yet.</div>')+'</div>';
  $('#view-visitors').innerHTML=html;
  $('#addVisitorBtn').addEventListener('click',openVisitorForm);
  $$('#view-visitors [data-out]').forEach(function(b){ b.addEventListener('click',function(){ var v=state.visitors.find(function(x){return x.id===b.getAttribute('data-out');}); if(!v) return; v.outTime=todayStr()+' '+new Date().toTimeString().slice(0,5); logActivity('Visitor '+v.name+' checked out'); save(); toast(v.name+' marked out.'); renderAll(); }); });
}
function openVisitorForm(){
  var active=state.students.filter(function(s){return s.status==='active';});
  openForm('Add Visitor Entry','<form id="vf"><div class="field"><label for="vf-name">Visitor name *</label><input id="vf-name" required placeholder="e.g. Rajesh Patel"></div><div class="field"><label for="vf-stu">Visiting student</label><select id="vf-stu">'+active.map(function(s){return '<option value="'+s.id+'">'+esc(s.name)+' — Room '+esc(s.roomId||'—')+'</option>';}).join('')+'</select></div><div class="field"><label for="vf-purpose">Purpose</label><input id="vf-purpose" placeholder="e.g. Family visit"></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Add Entry</button></div></form>');
  $('#vf').addEventListener('submit',function(e){ e.preventDefault(); state.visitors.unshift({id:'V'+Date.now(), name:$('#vf-name').value.trim(), studentId:$('#vf-stu').value, purpose:$('#vf-purpose').value.trim()||'Visit', inTime:todayStr()+' '+new Date().toTimeString().slice(0,5), outTime:null}); logActivity('Visitor '+$('#vf-name').value.trim()+' checked in'); save(); closeModals(); toast('Visitor entry added.'); renderAll(); });
}

// ---------- NOTICES ----------
function renderNotices(){
  var sorted=state.notices.slice().sort(function(a,b){ return (b.pinned?1:0)-(a.pinned?1:0) || b.date.localeCompare(a.date); });
  var html='<div style="display:flex;justify-content:flex-end;margin-bottom:12px"><button class="btn amber" id="addNoticeBtn">+ Post Notice</button></div>'
  + (sorted.length? sorted.map(function(n){ return '<div class="notice'+(n.pinned?' pinned':'')+'"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap"><strong style="font-size:16px">'+esc(n.title)+(n.pinned?' <span class="badge pending">Pinned</span>':'')+'</strong><span style="font-size:12px;color:var(--muted)">'+esc(n.date)+' · For: '+esc(n.audience)+'</span></div><p style="color:#3D4A4C;line-height:1.65;margin:8px 0 10px">'+esc(n.body)+'</p><div style="display:flex;gap:6px"><button class="icon-btn" data-pin="'+n.id+'">'+(n.pinned?'Unpin':'Pin')+'</button><button class="icon-btn" data-delnotice="'+n.id+'">Delete</button></div></div>'; }).join('') : '<div class="empty">No notices posted yet.</div>');
  $('#view-notices').innerHTML=html;
  $('#addNoticeBtn').addEventListener('click',openNoticeForm);
  $$('#view-notices [data-pin]').forEach(function(b){ b.addEventListener('click',function(){ var n=state.notices.find(function(x){return x.id===b.getAttribute('data-pin');}); n.pinned=!n.pinned; save(); toast(n.pinned?'Notice pinned.':'Notice unpinned.'); renderAll(); }); });
  $$('#view-notices [data-delnotice]').forEach(function(b){ b.addEventListener('click',function(){ openConfirm('Delete this notice?','The notice will be removed from the board.',function(){ state.notices=state.notices.filter(function(x){return x.id!==b.getAttribute('data-delnotice');}); save(); toast('Notice deleted.'); renderAll(); }); }); });
}
function openNoticeForm(){
  openForm('Post Notice','<form id="nf"><div class="field"><label for="nf-title">Title *</label><input id="nf-title" required placeholder="Notice title"></div><div class="field"><label for="nf-body">Message</label><textarea id="nf-body" rows="4" placeholder="Write the notice…"></textarea></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><div class="field"><label for="nf-aud">Audience</label><select id="nf-aud"><option>All</option><option>Ground</option><option>1st Floor</option><option>2nd Floor</option></select></div><div class="field"><label for="nf-pin">Pin to top</label><select id="nf-pin"><option value="no">No</option><option value="yes">Yes</option></select></div></div><div style="display:flex;gap:8px;justify-content:flex-end"><button type="button" class="btn ghost" data-close>Cancel</button><button class="btn amber">Post Notice</button></div></form>');
  $('#nf').addEventListener('submit',function(e){ e.preventDefault(); state.notices.unshift({id:'N'+Date.now(), title:$('#nf-title').value.trim(), body:$('#nf-body').value.trim(), audience:$('#nf-aud').value, pinned:$('#nf-pin').value==='yes', date:todayStr()}); logActivity('Notice posted: '+$('#nf-title').value.trim()); save(); closeModals(); toast('Notice posted.'); renderAll(); });
}

// ---------- REPORTS ----------
function renderReports(){
  var active=state.students.filter(function(s){return s.status==='active';});
  var occ= totalBeds()? Math.round(active.length/totalBeds()*100):0;
  var rows=''; for(var i=5;i>=0;i--){ var d=new Date(); d.setMonth(d.getMonth()-i); var mk=d.toISOString().slice(0,7); var col=state.payments.filter(function(p){return p.month===mk;}).reduce(function(a,p){return a+p.amount;},0); var exp=active.reduce(function(a,s){return a+s.monthlyFee;},0); rows+='<tr><td>'+monthLabel(mk)+'</td><td>'+fmt(exp)+'</td><td>'+fmt(col)+'</td><td>'+fmt(Math.max(0,exp-col))+'</td><td>'+(exp? Math.round(col/exp*100):0)+'%</td></tr>'; }
  var floorRows=['Ground','1st Floor','2nd Floor'].map(function(f){ var fr=state.rooms.filter(function(r){return r.floor===f;}); var beds=fr.reduce(function(a,r){return a+r.capacity;},0); var occN=fr.reduce(function(a,r){return a+occupants(r.id).length;},0); return '<tr><td>'+f+'</td><td>'+fr.length+'</td><td>'+beds+'</td><td>'+occN+'</td><td>'+(beds-occN)+'</td></tr>'; }).join('');
  $('#view-reports').innerHTML='<div class="grid-stats">'+statCard('Total Students',active.length,'')+statCard('Occupancy',occ+'%','')+statCard('Vacant Beds',vacantBeds(),'')
  +'</div><div class="card"><h3>Occupancy by Floor</h3><div class="table-wrap"><table style="min-width:420px"><thead><tr><th>Floor</th><th>Rooms</th><th>Beds</th><th>Occupied</th><th>Vacant</th></tr></thead><tbody>'+floorRows+'</tbody></table></div></div>'
  +'<div class="card"><h3>Monthly Collection — Last 6 Months</h3><div class="table-wrap"><table style="min-width:420px"><thead><tr><th>Month</th><th>Expected</th><th>Collected</th><th>Pending</th><th>Collection %</th></tr></thead><tbody>'+rows+'</tbody></table></div></div>'
  +'<div class="card no-print"><h3>Export & Print</h3><p style="color:var(--muted);font-size:14px">Download your data as CSV, or print this report page.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn amber" id="expStu">Export Students CSV</button><button class="btn" id="expFee">Export Fees CSV</button><button class="btn ghost" id="printBtn">Print Report</button></div></div>';
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

// ---------- Init ----------
load();
renderNav(); go('dashboard'); bindCloseButtons();
$$('.modal-overlay').forEach(function(m){ m.addEventListener('click',function(e){ if(e.target===m) closeModals(); }); });
$('#confirmYes').addEventListener('click',function(){ closeModals(); if(confirmCb){ var cb=confirmCb; confirmCb=null; cb(); } });
$('#resetBtn').addEventListener('click',function(){ openConfirm('Reset demo data?','All your changes will be cleared and the original demo data will come back.',function(){ state=JSON.parse(JSON.stringify(window.STAYNEST_SEED)); save(); toast('Demo data reset.'); go('dashboard'); }); });
$('#quickAddStudent').addEventListener('click',function(){ openStudentModal(); });
$('#quickCollect').addEventListener('click',function(){ openPayModal(); });
$('#studentForm').addEventListener('submit',function(e){
  e.preventDefault();
  var id=$('#sf-id').value; var name=$('#sf-name').value.trim(); if(!name){ toast('Please enter a name.'); return; }
  var roomId=$('#sf-room').value||null; var fee=parseInt($('#sf-fee').value,10)||0; var dep=parseInt($('#sf-deposit').value,10)||0;
  if(id){ var s=studentById(id); var oldRoom=s.roomId; s.name=name; s.phone=$('#sf-phone').value.trim(); s.guardianPhone=$('#sf-guardian').value.trim(); s.diet=$('#sf-diet').value; s.joinDate=$('#sf-join').value||s.joinDate; s.monthlyFee=fee; s.deposit=dep;
    if(oldRoom!==roomId){ if(s.roomHistory.length && !s.roomHistory[s.roomHistory.length-1].to) s.roomHistory[s.roomHistory.length-1].to=todayStr(); s.roomId=roomId; if(roomId) s.roomHistory.push({roomId:roomId,from:todayStr(),to:null}); }
    logActivity(name+' profile updated'); toast('Student updated.');
  } else {
    var max=0; state.students.forEach(function(x){ var n=parseInt(x.id.split('-').pop(),10); if(n>max) max=n; });
    var nid='SN-2026-'+String(max+1).padStart(3,'0');
    var ns={id:nid,name:name,phone:$('#sf-phone').value.trim(),guardianPhone:$('#sf-guardian').value.trim(),roomId:roomId,joinDate:$('#sf-join').value||todayStr(),monthlyFee:fee,deposit:dep,status:'active',leftDate:null,diet:$('#sf-diet').value,roomHistory: roomId?[{roomId:roomId,from:$('#sf-join').value||todayStr(),to:null}]:[]};
    state.students.unshift(ns); logActivity('New student added: '+name); toast(name+' added successfully.');
  }
  save(); closeModals(); renderAll(); if(currentView!=='students') go('students');
});
$('#payForm').addEventListener('submit',function(e){
  e.preventDefault();
  var sid=$('#pf-student').value; var month=$('#pf-month').value||feesMonth; var amt=parseInt($('#pf-amount').value,10);
  if(!sid||!amt||amt<=0){ toast('Enter a valid amount.'); return; }
  state.receiptSeq=(state.receiptSeq||1000)+1;
  var rcp='RCP-2026-'+state.receiptSeq;
  state.payments.push({id:'P'+Date.now(), studentId:sid, month:month, amount:amt, method:$('#pf-method').value, date:todayStr(), receiptNo:rcp});
  var s=studentById(sid); feesMonth=month;
  logActivity('Fee collected from '+(s?s.name:sid)+' — '+fmt(amt)+' ('+$('#pf-method').value+')');
  save(); closeModals(); toast('Payment recorded. Receipt '+rcp); renderAll(); if(currentView!=='fees') go('fees'); else renderFees();
});
document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ closeModals(); $('#studentDrawer').classList.remove('open'); } });
})();
