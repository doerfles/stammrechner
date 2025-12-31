/* =========================================================
   customers.js – Kundenliste, Kunden anlegen, Auswahl
   ========================================================= */

import {
  loadCustomers,
  createCustomer,
  deleteCustomer
} from "./storage.js";

import { showCustomerDetailScreen, showCustomerListScreen } from "./ui.js";

/* DOM-Elemente */
const customersListEl = document.getElementById("customers-list");
const btnAddCustomer = document.getElementById("btn-add-customer");

const modalNewCustomer = document.getElementById("modal-new-customer");
const customerNameInput = document.getElementById("customer-name-input");
const customerErrorEl = document.getElementById("customer-error");
const btnCancelNewCustomer = document.getElementById("btn-cancel-new-customer");
const btnSaveNewCustomer = document.getElementById("btn-save-new-customer");

/* Lösch-Modal */
const modalConfirmDelete = document.getElementById("modal-confirm-delete-customer");
const btnCancelDeleteCustomer = document.getElementById("btn-cancel-delete-customer");
const btnConfirmDeleteCustomer = document.getElementById("btn-confirm-delete-customer");

/* Aktueller Kunde für Lösch-Modal */
let currentCustomerIdForDelete = null;

/* =========================================================
   Kundenliste rendern
   ========================================================= */
export function renderCustomerList() {
  const customers = loadCustomers();
  customersListEl.innerHTML = "";

  customers.forEach(customer => {
    const li = document.createElement("li");
    li.className = "customer-item";
    li.dataset.customerId = customer.id;

    const btn = document.createElement("button");
    btn.className = "customer-select";
    btn.innerHTML = `
      <span class="customer-name">${customer.name}</span>
      <span class="customer-total">${calculateCustomerTotal(customer)} m³</span>
    `;

    btn.addEventListener("click", () => {
      showCustomerDetailScreen(customer.id);
    });

    li.appendChild(btn);
    customersListEl.appendChild(li);
  });
}

/* Hilfsfunktion: Gesamtvolumen eines Kunden berechnen */
function calculateCustomerTotal(customer) {
  const sum = customer.entries.reduce((acc, e) => acc + e.volume, 0);
  return sum.toFixed(2);
}

/* =========================================================
   Neuer Kunde – Modal öffnen
   ========================================================= */
btnAddCustomer.addEventListener("click", () => {
  customerNameInput.value = "";
  customerErrorEl.textContent = "";
  modalNewCustomer.classList.add("show");
  customerNameInput.focus();
});

/* =========================================================
   Neuer Kunde – Abbrechen
   ========================================================= */
btnCancelNewCustomer.addEventListener("click", () => {
  modalNewCustomer.classList.remove("show");
});

/* =========================================================
   Neuer Kunde – Speichern
   ========================================================= */
btnSaveNewCustomer.addEventListener("click", () => {
  const name = customerNameInput.value.trim();

  if (name.length < 2) {
    customerErrorEl.textContent = "Bitte einen gültigen Namen eingeben.";
    return;
  }
  
  createCustomer(name);
  modalNewCustomer.classList.remove("show");

  renderCustomerList();
});

/* =========================================================
   Kunde löschen – Modal öffnen (wird von ui.js aufgerufen)
   ========================================================= */
export function openDeleteCustomerModal(customerId) {
  currentCustomerIdForDelete = customerId;
  modalConfirmDelete.classList.add("show");
}

/* =========================================================
   Kunde löschen – Abbrechen
   ========================================================= */
btnCancelDeleteCustomer.addEventListener("click", () => {
  currentCustomerIdForDelete = null;
  modalConfirmDelete.classList.remove("show");
});

/* =========================================================
   Kunde löschen – Bestätigen
   ========================================================= */
btnConfirmDeleteCustomer.addEventListener("click", () => {
  if (currentCustomerIdForDelete) {
    deleteCustomer(currentCustomerIdForDelete);
    currentCustomerIdForDelete = null;
    modalConfirmDelete.classList.remove("show");
    renderCustomerList();

    showCustomerListScreen();
  } else {
    modalConfirmDelete.classList.remove("show");
  }
});