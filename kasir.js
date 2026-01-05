document.addEventListener("DOMContentLoaded", () => {

const items = document.querySelectorAll(".item");
const orderList = document.getElementById("orderList");
const paymentSelect = document.getElementById("paymentMethod");
const cashSection = document.getElementById("cashSection");
const cashPaidInput = document.getElementById("cashPaid");
const changeAmount = document.getElementById("changeAmount");
/*const cashInput = document.getElementById("cashPaid");*/
const changeText = document.getElementById("changeAmount");

let currentTotal = 0;

cashInput.addEventListener("input", () => {   /* setiap kali input pada cash, trigger, input jalankan kode ini */
    const cash = Number(cashInput.value); /*membaca inputan user lalu hitung*/

    if (cash >= currentTotal) {
        changeText.innerText = cash - currentTotal; /* display change */
    } else {
        changeText.innerText = 0;
    }
}
)

paymentSelect.addEventListener("change", () => { /* setiap kali paymentmode dipilih jalankan kode ini*/
    if (paymentSelect.value === "cash") { /*jika cash maka*/
        cashSection.classList.remove("hidden"); /*jalankan ini keluar inoutan field*/
    } else {
        cashSection.classList.add("hidden"); /*kalau tidak cash sembunyikan field cash*/
        cashPaidInput.value = "";
        changeAmount.innerText = 0;
    }
});


let orders = [];
let billNumber = 1;

/* ADD ITEM */
items.forEach(item => {
    item.addEventListener("click", () => {
        const name = item.dataset.name;
        const price = Number(item.dataset.price);
        const existing = orders.find(o => o.name === name);
        if (existing) existing.qty++;
        else orders.push({ name, price, qty: 1 });

        renderOrder();
    });
});

/* UPDATE QTY */
window.updateQty = function (index, change) {
    orders[index].qty += change;
    if (orders[index].qty <= 0) orders.splice(index, 1);
    renderOrder();
};

/* RENDER ORDER */
function renderOrder() {
    orderList.innerHTML = "";
    let subtotal = 0;

    orders.forEach((o, index) => {
        subtotal += o.price * o.qty;

        orderList.innerHTML += `
        <li class="order-item">
            <span class="order-no">${index + 1}.</span>
            <span class="order-name">${o.name}</span>
            <button onclick="updateQty(${index}, -1)">−</button>
            <span>${o.qty}</span>
            <button onclick="updateQty(${index}, 1)">+</button>
            <span class="order-price">${o.price * o.qty}</span>
        </li>`;
    });

    const service = document.querySelector("input[name='service']:checked");
        if (service && service.value === "takehome") subtotal += 5000;
    const vat = subtotal * 0.11;
    const discount = (subtotal + vat) > 700000 ? 10000 : 0;

    // ✅ ONE TRUE TOTAL
    currentTotal = subtotal + vat - discount;

    document.getElementById("subtotal").innerText = subtotal;
    document.getElementById("vat").innerText = vat;
    document.getElementById("discount").innerText = discount;
    document.getElementById("total").innerText = currentTotal;

    // 🔁 recalc change if cash already typed
    const cash = Number(cashInput.value || 0);
        if (cash >= currentTotal) {
            changeText.innerText = cash - currentTotal;
        } else {
            changeText.innerText = 0;
    }};


/* CLEAR ALL */
document.getElementById("clearAll").addEventListener("click", () => {
    orders = [];
    renderOrder();

    // reset cashier
    document.getElementById("cashier").value = "";

    // reset payment method to default ---
    document.getElementById("paymentMethod").selectedIndex = 0;

    //reset table no
    document.getElementById("tableno").value = "";

    // hide cash section & reset cash
    cashSection.classList.add("hidden");
    cashPaidInput.value = "";
    changeAmount.innerText = 0;
});

/* NEXT BILL */
document.getElementById("nextBill").addEventListener("click", () => {
    orders = [];
    billNumber++;
    document.getElementById("billNo").innerText = billNumber;
    document.getElementById("cashier").value = "";
    document.getElementById("tableno").value = "";

    // reset payment
    document.getElementById("paymentMethod").selectedIndex = 0;

    // hide cash input
    cashSection.classList.add("hidden");
    cashPaidInput.value = "";
    changeAmount.innerText = 0;

    renderOrder();
});

/* DATE & TIME */
function updateDateTime() {
    const now = new Date();
    document.getElementById("datetime").innerText =
        now.toLocaleDateString() + " " + now.toLocaleTimeString();
}
updateDateTime();
setInterval(updateDateTime, 1000);

document.getElementById("paybtn").addEventListener("click", () => {

    const subtotal = Number(document.getElementById("subtotal").innerText);
    const vat = subtotal * 0.11;
    const discount = subtotal > 700000 ? 10000 : 0;
    const service = document.querySelector("input[name='service']:checked");
    const payment = document.getElementById("paymentMethod").value;
    const cashRows = document.querySelectorAll(".cash-only");

    if (payment === "cash") {
        const cashPaid = Number(document.getElementById("cashPaid").value || 0);
        const change = cashPaid - currentTotal;

        cashRows.forEach(r => r.classList.remove("hidden"));
        document.getElementById("printCashPaid").innerText = cashPaid;
        document.getElementById("printChange").innerText = change > 0 ? change : 0;
    } else {
        cashRows.forEach(r => r.classList.add("hidden"));
    }

    document.getElementById("printBillNo").innerText = billNumber;
    document.getElementById("printTableNo").innerText =
        document.getElementById("tableno").value || "-";
    document.getElementById("printDate").innerText =
        new Date().toLocaleString();
    document.getElementById("printCashier").innerText =
        document.getElementById("cashier").value || "-";
    document.getElementById("printPayment").innerText =
        document.getElementById("paymentMethod").value;
    document.getElementById("printService").innerText =
        service ? service.value : "-";
    document.getElementById("printSubtotal").innerText = subtotal;
    document.getElementById("printVAT").innerText = vat;
    document.getElementById("printdiscount").innerText = discount;
    document.getElementById("printTotal").innerText = currentTotal;


    const printList = document.getElementById("printOrderList");
        printList.innerHTML = "";

        orders.forEach(o => {
        printList.innerHTML += `
            <li class="receipt-row">
                <span>${o.name} x${o.qty}</span>
                <span class="receipt-right">Rp${o.price * o.qty}</span>
            </li>
    `;
    });

    document.getElementById("printmodal").classList.remove("hidden");
});


window.closePrint = function () {
    document.getElementById("printmodal").classList.add("hidden");
    };
    
    document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Log out from cashier system?")) {
        location.reload();
        // or: window.location.href = "login.html";
    }
});
});

