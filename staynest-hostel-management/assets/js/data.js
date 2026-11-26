// StayNest seed data
window.STAYNEST_SEED = (function(){
  function iso(d){ return d.toISOString().slice(0,10); }
  function monthsAgo(n, day){ var d=new Date(); d.setMonth(d.getMonth()-n); d.setDate(day||10); return iso(d); }
  var today = iso(new Date());
  var floors=[{name:'Ground',prefix:1},{name:'1st Floor',prefix:2},{name:'2nd Floor',prefix:3}];
  var types=[{t:'Single',cap:1,rent:7500},{t:'Double',cap:2,rent:6000},{t:'Triple',cap:3,rent:4500}];
  var pattern=[0,1,2,1,2,0,1,2]; // per floor 8 rooms
  var rooms=[];
  floors.forEach(function(f){
    pattern.forEach(function(pi,i){
      var tp=types[pi];
      rooms.push({id: String(f.prefix*100 + i+1), floor:f.name, type:tp.t, capacity:tp.cap, rent:tp.rent, maintenance:false});
    });
  });
  // one room under maintenance
  rooms[7].maintenance=true;

  var names=["Aarav Patel","Priya Sharma","Rohan Mehta","Sneha Iyer","Karan Singh","Ananya Gupta","Vikram Reddy","Divya Nair","Arjun Joshi","Kavya Menon","Rahul Verma","Ishita Bose","Nikhil Rao","Pooja Desai","Aditya Kulkarni","Meera Pillai","Sahil Khan","Riya Chatterjee","Manish Tiwari","Shreya Kulkarni","Varun Malhotra","Neha Agarwal","Kunal Shah","Aisha Sheikh","Deepak Yadav","Simran Kaur","Harsh Vardhan","Tanvi Bhatt","Mohammed Faiz","Lakshmi Prasad","Gaurav Chauhan","Nidhi Saxena","Rohit Bansal","Anjali Mishra","Suresh Kumar","Kritika Jain","Yash Thakur","Farhan Ahmed","Pallavi Kulkarni","Naveen Chandra","Ritu Malhotra","Akash Gupta","Shubham Pandey","Zoya Ansari","Pranav Deshmukh","Isha Kapoor","Vivek Anand","Chandni Rao"];
  var students=[]; var payments=[]; var receiptSeq=1000;
  // Build beds list
  var beds=[];
  rooms.forEach(function(r){ if(r.maintenance) return; for(var b=0;b<r.capacity;b++) beds.push(r.id); });
  // Assign first 43 students active, next 5 left
  names.forEach(function(name,idx){
    var sid='SN-2026-'+String(idx+1).padStart(3,'0');
    var isLeft = idx>=43;
    var roomId = isLeft ? null : beds[idx];
    var room = rooms.find(function(r){return r.id===roomId;});
    var fee = room ? room.rent : [4500,6000,7500][idx%3];
    var join;
    if(idx===0||idx===1) join=today;
    else join = monthsAgo( (idx%14)+1, (idx%27)+1 );
    if(join>today) join=monthsAgo(1,5);
    var st={id:sid, name:name, phone:'98'+String(10000000+idx*137913).slice(0,8), guardianPhone:'97'+String(20000000+idx*99173).slice(0,8), roomId:roomId, joinDate:join, monthlyFee:fee, deposit:fee*2, status:isLeft?'left':'active', leftDate:isLeft?monthsAgo(idx-42,12):null, diet:(idx%3===0?'Non-veg':'Veg'), roomHistory: roomId?[{roomId:roomId,from:join,to:null}]:[]};
    students.push(st);
    // payments: past 5 months mostly paid for active + left (until left)
    if(!isLeft){
      for(var m=5;m>=1;m--){
        var d=new Date(); d.setMonth(d.getMonth()-m); var mk=d.toISOString().slice(0,7);
        if(idx%11===m) continue; // a few missed in past
        receiptSeq++;
        payments.push({id:'P'+receiptSeq, studentId:sid, month:mk, amount:fee, method:['UPI','Cash','Bank'][idx%3], date:mk+'-0'+((idx%8)+1), receiptNo:'RCP-2026-'+receiptSeq});
      }
      // current month: idx% patterns -> paid / partial / unpaid
      var now=new Date(); var cm=now.toISOString().slice(0,7);
      if(idx%5===0||idx%5===1||idx%5===2){ receiptSeq++; payments.push({id:'P'+receiptSeq, studentId:sid, month:cm, amount:fee, method:'UPI', date:cm+'-03', receiptNo:'RCP-2026-'+receiptSeq}); }
      else if(idx%5===3){ receiptSeq++; payments.push({id:'P'+receiptSeq, studentId:sid, month:cm, amount:Math.round(fee/2), method:'Cash', date:cm+'-05', receiptNo:'RCP-2026-'+receiptSeq}); }
    }
  });

  var complaints=[
    {id:'C1', title:'Tap leaking in bathroom', room:'204', category:'Plumbing', priority:'High', status:'Open', date:monthsAgo(0,20), by:'Rohan Mehta'},
    {id:'C2', title:'Wi-Fi very slow on 2nd floor', room:'305', category:'Wi-Fi', priority:'Medium', status:'In Progress', date:monthsAgo(0,18), by:'Kavya Menon'},
    {id:'C3', title:'Fan not working', room:'102', category:'Electrical', priority:'High', status:'Open', date:monthsAgo(0,22), by:'Priya Sharma'},
    {id:'C4', title:'Room cleaning missed twice', room:'207', category:'Cleaning', priority:'Low', status:'Resolved', date:monthsAgo(0,10), by:'Divya Nair'},
    {id:'C5', title:'Dinner quality needs improvement', room:'301', category:'Food', priority:'Medium', status:'In Progress', date:monthsAgo(0,15), by:'Arjun Joshi'},
    {id:'C6', title:'Hot water not coming in morning', room:'108', category:'Plumbing', priority:'Medium', status:'Open', date:monthsAgo(0,24), by:'Sahil Khan'}
  ];
  var visitors=[
    {id:'V1', name:'Rajesh Patel', studentId:'SN-2026-001', purpose:'Family visit', inTime:monthsAgo(0,24)+' 11:00', outTime:monthsAgo(0,24)+' 13:30'},
    {id:'V2', name:'Sunita Sharma', studentId:'SN-2026-002', purpose:'Family visit', inTime:monthsAgo(0,23)+' 10:15', outTime:monthsAgo(0,23)+' 12:00'},
    {id:'V3', name:'Imran Sheikh', studentId:'SN-2026-024', purpose:'Friend visit', inTime:monthsAgo(0,22)+' 16:00', outTime:null},
    {id:'V4', name:'Geeta Reddy', studentId:'SN-2026-007', purpose:'Delivery of books', inTime:monthsAgo(0,21)+' 09:30', outTime:monthsAgo(0,21)+' 09:50'},
    {id:'V5', name:'Anil Verma', studentId:'SN-2026-011', purpose:'Family visit', inTime:monthsAgo(0,20)+' 14:00', outTime:monthsAgo(0,20)+' 17:00'},
    {id:'V6', name:'Farah Khan', studentId:'SN-2026-017', purpose:'Friend visit', inTime:today+' 10:00', outTime:null},
    {id:'V7', name:'Mohan Iyer', studentId:'SN-2026-004', purpose:'Guardian meeting', inTime:monthsAgo(0,19)+' 11:30', outTime:monthsAgo(0,19)+' 12:15'},
    {id:'V8', name:'Kiran Bose', studentId:'SN-2026-012', purpose:'Family visit', inTime:monthsAgo(0,18)+' 15:00', outTime:monthsAgo(0,18)+' 16:20'}
  ];
  var notices=[
    {id:'N1', title:'Mess closed on Sunday evening for deep cleaning', body:'Dear residents, the mess will remain closed on Sunday evening for deep cleaning. Dinner will be served as a packed meal at 6 PM. Please collect from the counter.', audience:'All', pinned:true, date:monthsAgo(0,22)},
    {id:'N2', title:'Fee payment deadline — 10th of every month', body:'Please pay your monthly hostel fee by the 10th. Payments after the 10th are marked overdue. Pay via UPI, cash or bank transfer at the office.', audience:'All', pinned:true, date:monthsAgo(0,5)},
    {id:'N3', title:'Water supply maintenance on 2nd Floor', body:'Water supply on the 2nd floor will be paused on Saturday from 10 AM to 1 PM for tank cleaning. Please store water in advance.', audience:'2nd Floor', pinned:false, date:monthsAgo(0,16)},
    {id:'N4', title:'Guest policy reminder', body:'Visitors are allowed between 9 AM and 7 PM only. All visitors must sign the register at reception and mark their exit time.', audience:'All', pinned:false, date:monthsAgo(0,12)}
  ];
  var days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  var messMenu={};
  var menus=[
    ['Poha & Tea','Dal, Rice, Roti, Sabzi','Paneer Butter Masala & Roti'],
    ['Idli Sambar','Rajma, Rice, Salad','Veg Biryani & Raita'],
    ['Aloo Paratha','Chole, Rice, Roti','Dal Tadka, Jeera Rice'],
    ['Upma & Tea','Kadhi, Rice, Papad','Aloo Gobi & Roti'],
    ['Puri Sabzi','Sambar Rice','Mix Veg & Dal, Roti'],
    ['Masala Dosa','Veg Pulao, Dal','Chole Bhature'],
    ['Bread & Eggs / Jam','Khichdi, Kadhi','Special Thali']
  ];
  days.forEach(function(d,i){ messMenu[d]={breakfast:menus[i][0], lunch:menus[i][1], dinner:menus[i][2]}; });

  var activity=[
    {text:'Fee collected from Aarav Patel — UPI', time:today+' 09:12'},
    {text:'New complaint raised for Room 204 — Plumbing', time:today+' 08:40'},
    {text:'Visitor Farah Khan checked in', time:today+' 10:00'},
    {text:'Notice posted: Fee payment deadline', time:monthsAgo(0,5)+' 11:00'},
    {text:'Room 108 marked under maintenance check completed', time:monthsAgo(0,3)+' 15:20'}
  ];
  return {students:students, rooms:rooms, payments:payments, complaints:complaints, visitors:visitors, notices:notices, messMenu:messMenu, activity:activity, receiptSeq:receiptSeq};
})();
