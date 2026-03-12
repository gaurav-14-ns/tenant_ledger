let members = JSON.parse(localStorage.getItem("members")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function save(){

localStorage.setItem("members",JSON.stringify(members));
localStorage.setItem("transactions",JSON.stringify(transactions));

}

function validateMemberForm(){

let name=document.getElementById("memberName").value.trim();
let group=document.getElementById("groupName").value.trim();

document.getElementById("addMemberBtn").disabled = !(name && group);

}

function addMember(){

let today=new Date().toISOString().split("T")[0];

let member={

name:document.getElementById("memberName").value,
group:document.getElementById("groupName").value,
status:"active",
active_from:today,
inactive_on:null

};

members.push(member);

save();
render();

document.getElementById("memberName").value="";
document.getElementById("groupName").value="";

}

function autoFillGroup(){

let name=document.getElementById("memberSelect").value;

let m=members.find(x=>x.name===name);

if(m){

document.getElementById("groupInput").value=m.group;

}

}

function addTransaction(){

let date=document.getElementById("date").value;

let today=new Date().toISOString().split("T")[0];

if(date>today){

alert("Future date not allowed");
return;

}

let t={

date:date,
member:document.getElementById("memberSelect").value,
group:document.getElementById("groupInput").value,
amount:Number(document.getElementById("amount").value),
type:document.getElementById("type").value

};

transactions.push(t);

save();
render();

document.getElementById("amount").value="";

}

function deactivateMember(i){

let today=new Date().toISOString().split("T")[0];

members[i].status="inactive";
members[i].inactive_on=today;

save();
render();

}

function deleteMember(i){

if(confirm("Delete member?")){

members.splice(i,1);

save();
render();

}

}

function deleteTransaction(i){

if(confirm("Delete record?")){

transactions.splice(i,1);

save();
render();

}

}

function render(){

let select=document.getElementById("memberSelect");

select.innerHTML="";

members
.filter(m=>m.status==="active")
.forEach(m=>{

let opt=document.createElement("option");
opt.text=m.name;
select.add(opt);

});

let expected = members.filter(m=>m.status==="active").length * 3000;

let received=transactions
.filter(t=>t.type==="Rent")
.reduce((a,b)=>a+b.amount,0);

document.getElementById("expected").innerText="₹"+expected;
document.getElementById("received").innerText="₹"+received;
document.getElementById("pending").innerText="₹"+(expected-received);



let mtable="<tr><th>Name</th><th>Group</th><th>Status</th><th>Active From</th><th>Inactive On</th><th>Action</th></tr>";

members.forEach((m,i)=>{

mtable+=`<tr class="${m.status==='inactive'?'inactive':''}">

<td>${m.name}</td>
<td>${m.group}</td>
<td>${m.status}</td>
<td>${m.active_from}</td>
<td>${m.inactive_on || '-'}</td>

<td>

${m.status==='active'
? `<button onclick="deactivateMember(${i})">Deactivate</button>`
: ''}

<button onclick="deleteMember(${i})">Delete</button>

</td>

</tr>`;

});

document.getElementById("memberTable").innerHTML=mtable;



let range=document.getElementById("rangeFilter").value;

let list=[...transactions].reverse();

if(range!=="all"){

list=list.slice(0,Number(range));

}

let tx="<tr><th>Date</th><th>Member</th><th>Group</th><th>Type</th><th>Amount</th><th>Action</th></tr>";

list.forEach((t,i)=>{

tx+=`<tr>

<td>${t.date}</td>
<td>${t.member}</td>
<td>${t.group}</td>
<td>${t.type}</td>
<td>${t.amount}</td>

<td><button onclick="deleteTransaction(${i})">Delete</button></td>

</tr>`;

});

document.getElementById("transactionTable").innerHTML=tx;

}

function exportData(){

let data={members,transactions};

let blob=new Blob([JSON.stringify(data)],{type:"application/json"});

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="tenant-ledger-backup.json";

a.click();

}

function importData(){

let file=document.getElementById("importFile").files[0];

let reader=new FileReader();

reader.onload=function(){

let data=JSON.parse(reader.result);

members=data.members || [];
transactions=data.transactions || [];

save();
render();

};

reader.readAsText(file);

}

render();

document.getElementById("date").value=new Date().toISOString().split("T")[0];
