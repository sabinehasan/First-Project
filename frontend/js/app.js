const API_URL = "http://localhost:3000/api/expenses";

const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

const spinner = document.getElementById("spinner");
const alertBox = document.getElementById("alert-box");
const tableBody = document.getElementById("expenses-table-body");
const filterSelect = document.getElementById("filter-category");

let allExpenses = [];

function showSpinner() {
  spinner.style.display = "block";
}
function hideSpinner() {
  spinner.style.display = "none";
}
function showAlert(message) {
  alertBox.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}
function clearAlert() {
  alertBox.innerHTML = "";
}

async function getExpenses() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to load expenses");
  }
  return response.json();
}

async function addExpense(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to add expense");
  }
  return result;
}

async function updateExpense(id, data) {
  const response = await fetch(API_URL + "/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to update expense");
  }
  return result;
}

async function deleteExpense(id) {
  const response = await fetch(API_URL + "/" + id, { method: "DELETE" });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.message || "Failed to delete expense");
  }
}

function renderSummary(list) {
  const total = list.reduce((sum, e) => sum + e.amount, 0);
  const highest = list.length ? Math.max(...list.map(e => e.amount)) : 0;

  document.getElementById("summary-total").textContent = "$" + total.toFixed(2);
  document.getElementById("summary-count").textContent = list.length;
  document.getElementById("summary-highest").textContent = "$" + highest.toFixed(2);
}

function renderTable(list) {
  tableBody.innerHTML = "";

  list.forEach(expense => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${expense.title}</td>
      <td>$${expense.amount.toFixed(2)}</td>
      <td><span class="badge bg-secondary">${expense.category}</span></td>
      <td>${expense.date}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${expense.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${expense.id}">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => openEditModal(btn.dataset.id));
  });
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => handleDelete(btn.dataset.id));
  });
}

function applyFilter() {
  const selected = filterSelect.value;
  const filtered = selected === "All"
    ? allExpenses
    : allExpenses.filter(e => e.category === selected);
  renderTable(filtered);
}

async function refresh() {
  showSpinner();
  clearAlert();
  try {
    allExpenses = await getExpenses();
    renderSummary(allExpenses);
    applyFilter();
  } catch (error) {
    showAlert(error.message);
  } finally {
    hideSpinner();
  }
}

function validateForm(title, amount, category, date, prefix) {
  let valid = true;

  const titleEl = document.getElementById(prefix + "-title");
  const amountEl = document.getElementById(prefix + "-amount");
  const dateEl = document.getElementById(prefix + "-date");

  if (titleEl) titleEl.classList.remove("is-invalid");
  if (amountEl) amountEl.classList.remove("is-invalid");
  if (dateEl) dateEl.classList.remove("is-invalid");

  if (!title) {
    valid = false;
    if (titleEl) titleEl.classList.add("is-invalid");
  }
  if (!amount || amount <= 0) {
    valid = false;
    if (amountEl) amountEl.classList.add("is-invalid");
  }
  if (!date) {
    valid = false;
    if (dateEl) dateEl.classList.add("is-invalid");
  }

  return valid;
}

document.getElementById("add-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("input-title").value.trim();
  const amount = Number(document.getElementById("input-amount").value);
  const category = document.getElementById("input-category").value;
  const date = document.getElementById("input-date").value;

  if (!validateForm(title, amount, category, date, "input")) {
    return;
  }

  try {
    await addExpense({ title, amount, category, date });
    document.getElementById("add-form").reset();
    await refresh();
  } catch (error) {
    showAlert(error.message);
  }
});

function openEditModal(id) {
  const expense = allExpenses.find(e => e.id == id);
  if (!expense) return;

  document.getElementById("edit-id").value = expense.id;
  document.getElementById("edit-title").value = expense.title;
  document.getElementById("edit-amount").value = expense.amount;
  document.getElementById("edit-category").value = expense.category;
  document.getElementById("edit-date").value = expense.date;

  const modal = new bootstrap.Modal(document.getElementById("edit-modal"));
  modal.show();
}

document.getElementById("save-edit-btn").addEventListener("click", async () => {
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value.trim();
  const amount = Number(document.getElementById("edit-amount").value);
  const category = document.getElementById("edit-category").value;
  const date = document.getElementById("edit-date").value;

  if (!validateForm(title, amount, category, date, "edit")) {
    return;
  }

  try {
    await updateExpense(id, { title, amount, category, date });
    const modalEl = document.getElementById("edit-modal");
    bootstrap.Modal.getInstance(modalEl).hide();
    await refresh();
  } catch (error) {
    showAlert(error.message);
  }
});

async function handleDelete(id) {
  if (!confirm("Delete this expense?")) return;

  try {
    await deleteExpense(id);
    await refresh();
  } catch (error) {
    showAlert(error.message);
  }
}

filterSelect.addEventListener("change", applyFilter);

refresh();
