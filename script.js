let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function save(){
localStorage.setItem("tenants",JSON.stringify(tenants));
localStorage.setItem("transactions",JSON.stringify(transactions));
}

function validateTenantForm(){

let name=document.getElementById("tenantName").value.trim();
let group=document.getElementById("groupName").value.trim();
let rent=document.getElementById("rent").value;
let due=document.getElementById("dueDay").value;

let btn=document.getElementById("addTenantBtn");

btn.disabled = !(name && group && rent && due);

}

function addTenant(){

let tenant={
name:document.getElementById("tenantName").value,
group:document.getElementById("groupName").value,
rent:Number(document.getElementById("rent").value),
due:Number(document.getElementById("dueDay").value)
};

tenants.push(tenant);

save();
render();

document.getElementById("tenantName").value="";
document.getElementById("groupName").value="";
document.getElementById("rent").value="";
document.getElementById("dueDay").value="";

validateTenantForm();

}

function autoFillGroup(){

let selected=document.getElementById("tenantSelect").value;

let tenant=tenants.find(t=>t.name===selected);

if(tenant){
document.getElementById("groupInput").value=tenant.group;
}

}

function addTransaction(){

let t={
date:document.getElementById("date").value,
tenant:document.getElementById("tenantSelect").value,
group:document.getElementById("groupInput").value,
amount:Number(document.getElementById("amount").value),
type:document.getElementById("type").value
};

transactions.push(t);

save();
render();

}

function deleteTenant(index){

if(confirm("Delete this tenant?")){

tenants.splice(index,1);

save();
render();

}

}

function deleteTransaction(index){

if(confirm("Delete this record?")){

transactions.splice(index,1);

save();
render();

}

}

function render(){

let select=document.getElementById("tenantSelect");
select.innerHTML="";

tenants.forEach(t=>{
let opt=document.createElement("option");
opt.text=t.name;
select.add(opt);
});

let expected=tenants.reduce((a,b)=>a+b.rent,0);

let received=transactions
.filter(t=>t.type=="Rent")
.reduce((a,b)=>a+b.amount,0);

let expenses=transactions
.filter(t=>t.type!="Rent")
.reduce((a,b)=>a+b.amount,0);

document.getElementById("expected").innerText="Expected Rent: ₹"+expected;
document.getElementById("received").innerText="Rent Received: ₹"+received;
document.getElementById("pending").innerText="Pending Rent: ₹"+(expected-received);
document.getElementById("expenses").innerText="Expenses: ₹"+expenses;

let table="<tr><th>Tenant</th><th>Group</th><th>Rent</th><th>Action</th></tr>";

tenants.forEach((t,index)=>{
table+=`<tr>
<td>${t.name}</td>
<td>${t.group}</td>
<td>${t.rent}</td>
<td><button onclick="deleteTenant(${index})">Delete</button></td>
</tr>`;
});

document.getElementById("tenantTable").innerHTML=table;

let tx="<tr><th>Date</th><th>Tenant</th><th>Group</th><th>Type</th><th>Amount</th><th>Action</th></tr>";

transactions.forEach((t,index)=>{
tx+=`<tr>
<td>${t.date}</td>
<td>${t.tenant}</td>
<td>${t.group}</td>
<td>${t.type}</td>
<td>${t.amount}</td>
<td><button onclick="deleteTransaction(${index})">Delete</button></td>
</tr>`;
});

document.getElementById("transactionTable").innerHTML=tx;

}

render();
