let tenants = JSON.parse(localStorage.getItem("tenants")) || [];
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function save(){
localStorage.setItem("tenants",JSON.stringify(tenants));
localStorage.setItem("transactions",JSON.stringify(transactions));
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

function render(){

// tenant dropdown
let select=document.getElementById("tenantSelect");
select.innerHTML="";

tenants.forEach(t=>{
let opt=document.createElement("option");
opt.text=t.name;
select.add(opt);
});

// expected rent
let expected=tenants.reduce((a,b)=>a+b.rent,0);

// rent received
let received=transactions
.filter(t=>t.type=="Rent")
.reduce((a,b)=>a+b.amount,0);

// expenses
let expenses=transactions
.filter(t=>t.type!="Rent")
.reduce((a,b)=>a+b.amount,0);

document.getElementById("expected").innerText="Expected Rent: ₹"+expected;
document.getElementById("received").innerText="Rent Received: ₹"+received;
document.getElementById("pending").innerText="Pending Rent: ₹"+(expected-received);
document.getElementById("expenses").innerText="Expenses: ₹"+expenses;


// tenant status
let table="<tr><th>Tenant</th><th>Group</th><th>Rent</th></tr>";

tenants.forEach(t=>{
table+=`<tr>
<td>${t.name}</td>
<td>${t.group}</td>
<td>${t.rent}</td>
</tr>`;
});

document.getElementById("tenantTable").innerHTML=table;


// transaction table

let tx="<tr><th>Date</th><th>Tenant</th><th>Group</th><th>Type</th><th>Amount</th></tr>";

transactions.forEach(t=>{
tx+=`<tr>
<td>${t.date}</td>
<td>${t.tenant}</td>
<td>${t.group}</td>
<td>${t.type}</td>
<td>${t.amount}</td>
</tr>`;
});

document.getElementById("transactionTable").innerHTML=tx;

}

render();
