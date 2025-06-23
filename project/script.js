let user = null;
let expenses = [];
const budget = 15000;

function loginAs(role) {
  user = role;
  document.getElementById("login-box").style.display = "none";
  document.getElementById("tracker").style.display = "block";
  showCurrentDay();
  updateDisplay();
}

function showCurrentDay() {
  const start = new Date("2025-07-06");
  const today = new Date();

  let currentDay = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;

  // If the trip hasn't started yet, treat it as Day 1
  if (currentDay < 1) currentDay = 1;

  // If it's past Day 8, stop expense input
  if (currentDay > 8) {
    document.getElementById("day-number").textContent = "Trip Over";
    document.getElementById("form-area").style.display = "none";
  } else {
    document.getElementById("day-number").textContent = currentDay;
    document.getElementById("form-area").style.display = "block";
  }
}


function addExpense() {
  const amount = parseFloat(document.getElementById("amount").value);
  const note = document.getElementById("note").value;

  if (!amount || !note) {
    alert("Please fill both amount and note!");
    return;
  }

  const entry = {
    id: Date.now(), // Unique ID
    by: user,
    amount: amount,
    note: note,
    date: new Date().toLocaleDateString()
  };

  expenses.push(entry);
  updateDisplay();
  document.getElementById("amount").value = "";
  document.getElementById("note").value = "";
}

function updateDisplay() {
  let total = 0;
  let husbandTotal = 0;
  let wifeTotal = 0;

  const container = document.getElementById("expenses");
  container.innerHTML = "";

  expenses.forEach(exp => {
    total += exp.amount;
    if (exp.by === "husband") husbandTotal += exp.amount;
    else wifeTotal += exp.amount;

    // Create expense entry div
    const div = document.createElement("div");
    div.className = "expense-entry";

    // Avatar image
    const img = document.createElement("img");
    img.src = `assets/${exp.by}.png`;
    img.alt = exp.by;
    img.style.height = "28px";
    img.style.width = "28px";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    img.style.marginRight = "8px";
    img.style.verticalAlign = "middle";

    // Text content
    const text = document.createElement("span");
    text.innerHTML = `<strong>${exp.by}</strong> spent ₹${exp.amount} on "${exp.note}" — <em>${exp.date}</em>`;

    // Delete button
    const button = document.createElement("button");
    button.textContent = "Delete";
    button.style.float = "right";
    button.style.background = "#ff5555";
    button.style.border = "none";
    button.style.color = "white";
    button.style.borderRadius = "5px";
    button.style.padding = "4px";
    button.onclick = () => deleteExpense(exp.id);

    // Add all to div
    div.appendChild(img);
    div.appendChild(text);
    div.appendChild(button);

    container.appendChild(div);
  });

  // Update totals
  document.getElementById("total-spent").textContent = total;
  document.getElementById("budget-left").textContent = budget - total;
  document.getElementById("husband-spent").textContent = husbandTotal;
  document.getElementById("wife-spent").textContent = wifeTotal;
}


function deleteExpense(id) {
  expenses = expenses.filter(exp => exp.id !== id);
  updateDisplay();
}
