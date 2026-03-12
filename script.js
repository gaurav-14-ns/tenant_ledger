let members = JSON.parse(localStorage.getItem("members")) || [];
let groups = JSON.parse(localStorage.getItem("groups")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function save(){

localStorage.setItem("members",JSON.stringify(members));
localStorage.setItem("groups",JSON.stringify(groups));
localStorage.setItem("transactions",JSON.stringify(transactions));

}

function validateGroupForm(){

let name=document.getElementById("groupName").value.trim();
let rent=document.getElementById("groupRent").value;
let mode=document.getElementById("rentMode").value;

document.getElementById("addGroupBtn").disabled = !(name && rent && mode);

}

function addGroup(){

let group={
name:document.getElementById("groupName").value,
rent:Number(document.getElementById("groupRent").value),
mode:document.getElementById("rentMode").value
};

let existing=groups.find(g=>g.name===group.name);

if(existing){

existing.rent=group.rent;
existing.mode=group.mode;

}else{

groups.push(group);

}

save();
render();

}

function validateMemberForm(){

let name=document.getElementById("memberName").value.trim();
let group=document.getElementById("memberGroup").value;

document.getElementById("addMemberBtn").disabled = !(name && group);

}

function addMember(){

let today=new Date().toISOString().split("T")[0];

members.push({

name:document.getElementById("memberName").value,
group:document.getElementById("memberGroup").value,
phone:document.getElementById("phone").value,
status:"active",
active_from:today,
inactive_on:null

});

save();
render();

}

function autoFillGroup(){

let name=document.getElementById("memberSelect").value;

let m=members.find(x=>x.name===name);

if(m){

document.getElementById("groupInput").value=m.group;

}

}

function validateTransactionForm(){

let date=document.getElementById("date").value;
let member=document.getElementById("memberSelect").value;
let amount=document.getElementById("amount").value;

document.getElementById("recordBtn").disabled = !(date && member && amount);

}

function addTransaction(){

let t={

date:document.getElementById("date").value,
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

let groupSelect=document.getElementById("memberGroup");
groupSelect.innerHTML="<option value=''>Select Group</option>";

groups.forEach(g=>{

let opt=document.createElement("option");
opt.value=g.name;
opt.textContent=g.name;

groupSelect.appendChild(opt);

});


let memberSelect=document.getElementById("memberSelect");
memberSelect.innerHTML="";

members.filter(m=>m.status==="active").forEach(m=>{

let opt=document.createElement("option");
opt.value=m.name;
opt.textContent=m.name;

memberSelect.appendChild(opt);

});


let expected=groups.reduce((sum,g)=>sum+g.rent,0);

let received=transactions.filter(t=>t.type==="Rent").reduce((a,b)=>a+b.amount,0);

document.getElementById("expected").innerText="₹"+expected;
document.getElementById("received").innerText="₹"+received;
document.getElementById("pending").innerText="₹"+(expected-received);


let statusHTML="";

groups.forEach(g=>{

statusHTML+=`<div class="groupbox"><b>Group ${g.name}</b><br>`;

if(g.mode==="GROUP"){

let paid=transactions.filter(t=>t.group===g.name && t.type==="Rent")
.reduce((a,b)=>a+b.amount,0);

let pending=g.rent-paid;

statusHTML+=`Status: ${pending<=0?"Paid":"Pending ₹"+pending}`;

}else{

members.filter(m=>m.group===g.name && m.status==="active").forEach(m=>{

let paid=transactions.filter(t=>t.member===m.name && t.type==="Rent")
.reduce((a,b)=>a+b.amount,0);

let pending=g.rent-paid;

statusHTML+=`${m.name} : ${pending<=0?"Paid":"Pending ₹"+pending}<br>`;

});

}

statusHTML+="</div>";

});

document.getElementById("statusTable").innerHTML=statusHTML;


let mtable="<tr><th>Name</th><th>Group</th><th>Status</th><th>Active From</th><th>Inactive On</th><th>Action</th></tr>";

members.forEach((m,i)=>{

mtable+=`<tr>

<td>${m.name}</td>
<td>${m.group}</td>
<td>${m.status}</td>
<td>${m.active_from}</td>
<td>${m.inactive_on||'-'}</td>

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

let data={members,groups,transactions};

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

members=data.members||[];
groups=data.groups||[];
transactions=data.transactions||[];

save();
render();

};

reader.readAsText(file);

}

render();

document.getElementById("date").value=new Date().toISOString().split("T")[0];
