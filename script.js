let user = null;
let expenses = [];
const budget = 16000;

function startApp() {
  const db = window.db;

  // 🧑‍🤝‍🧑 Login as husband or wife
  window.loginAs = function (role) {
    user = role;
    console.log(`Logged in as ${user}`);
    document.getElementById("login-box").style.display = "none";
    document.getElementById("tracker").style.display = "block";
    showCurrentDay();
    fetchExpenses();
  };

  // ➕ Add new expense
  window.addExpense = function () {
    const amount = parseFloat(document.getElementById("amount").value);
    const note = document.getElementById("note").value;

    if (!amount || !note) {
      alert("Please fill both amount and note!");
      return;
    }

    const entry = {
      by: user,
      amount,
      note,
      date: new Date().toLocaleDateString()
    };

    db.ref("expenses").push(entry);
    fireConfetti(); // 🎉 show confetti
    document.getElementById("amount").value = "";
    document.getElementById("note").value = "";
  };

  // 🗑️ Delete an expense by ID
  window.deleteExpense = function (id) {
    db.ref("expenses").child(id).remove();
  };

  // 📡 Fetch all expenses from Firebase
  function fetchExpenses() {
    db.ref("expenses").on("value", (snapshot) => {
      expenses = [];
      snapshot.forEach((child) => {
        const data = child.val();
        data.id = child.key;
        expenses.push(data);
      });
      updateDisplay();
    });
  }

  // 🧾 Update the DOM with expenses and totals
  function updateDisplay() {
    let total = 0;
    let husbandTotal = 0;
    let wifeTotal = 0;

    const container = document.getElementById("expenses");
    container.innerHTML = "";

    expenses.forEach((exp) => {
      total += exp.amount;
      exp.by === "husband"
        ? (husbandTotal += exp.amount)
        : (wifeTotal += exp.amount);

      const div = document.createElement("div");
      div.className = "expense-entry";

      const img = document.createElement("img");
      img.src = `assets/${exp.by}.png`;
      img.alt = exp.by;

      Object.assign(img.style, {
        height: "28px",
        width: "28px",
        borderRadius: "50%",
        objectFit: "cover",
        marginRight: "8px",
        verticalAlign: "middle"
      });

      const text = document.createElement("span");
      text.innerHTML = `<strong>${exp.by}</strong> spent ₹${exp.amount} on "${exp.note}" — <em>${exp.date}</em>`;

      const button = document.createElement("button");
      button.textContent = "Delete";
      Object.assign(button.style, {
        float: "right",
        background: "#ff5555",
        border: "none",
        color: "white",
        borderRadius: "5px",
        padding: "4px",
        cursor: "pointer"
      });
      button.onclick = () => window.deleteExpense(exp.id);

      div.appendChild(img);
      div.appendChild(text);
      div.appendChild(button);
      container.appendChild(div);
    });

    document.getElementById("total-spent").textContent = total;
    document.getElementById("budget-left").textContent = budget - total;
    document.getElementById("husband-spent").textContent = husbandTotal;
    document.getElementById("wife-spent").textContent = wifeTotal;
  }

  // 📅 Calculate current day of trip
  function showCurrentDay() {
    const start = new Date("2025-07-06");
    const today = new Date();
    let currentDay = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

    const dayText = document.getElementById("day-number");
    const formArea = document.getElementById("form-area");

    if (currentDay < 1) currentDay = 1;

    if (currentDay > 8) {
      dayText.textContent = "Trip Over";
      formArea.style.display = "none";
    } else {
      dayText.textContent = currentDay;
      formArea.style.display = "block";
    }
  }
}

// ✅ Start app after window load
window.addEventListener("load", () => {
  startApp();
});
