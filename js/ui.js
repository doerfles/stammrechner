/* =========================================================
   ui.js – Screen-Steuerung & DOM-Updates
   ========================================================= */

import { loadCustomers, calculateTotalVolume } from "./storage.js";
import { renderEntriesForCustomer } from "./entries.js";
import { openDeleteCustomerModal, renderCustomerList } from "./customers.js";

/* DOM-Elemente */
const screenCustomers = document.getElementById("screen-customers");
const screenCustomerDetail = document.getElementById("screen-customer-detail");

const customerNameDisplay = document.getElementById("customer-name-display");
const btnBackToCustomers = document.getElementById("btn-back-to-customers");

const totalVolumeValue = document.getElementById("total-volume-value");

const btnDeleteCustomer = document.getElementById("btn-delete-customer");
/* Aktuell ausgewählter Kunde */
let activeCustomerId = null;

/* =========================================================
   Screen-Wechsel
   ========================================================= */
export function showCustomerListScreen() {
  screenCustomers.style.display = "block";
  screenCustomerDetail.style.display = "none";
}

export function showCustomerDetailScreen(customerId) {
  activeCustomerId = customerId;

  const customers = loadCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;

  // Kundennamen setzen
  customerNameDisplay.textContent = customer.name;

  // Gesamtvolumen aktualisieren
  updateTotalVolume();

  // Einträge rendern
  renderEntriesForCustomer(customerId);

  // Screen anzeigen
  screenCustomers.style.display = "none";
  screenCustomerDetail.style.display = "block";
}

/* =========================================================
   Gesamtvolumen aktualisieren
   ========================================================= */
export function updateTotalVolume() {
  if (!activeCustomerId) return;

  const total = calculateTotalVolume(activeCustomerId);
  totalVolumeValue.textContent = `${total.toFixed(2)} m³`;

  // Kleine Animation
  totalVolumeValue.classList.add("pulse");
  setTimeout(() => totalVolumeValue.classList.remove("pulse"), 250);
}

/* =========================================================
   Back-Button
   ========================================================= */
btnBackToCustomers.addEventListener("click", () => {
  showCustomerListScreen();
  renderCustomerList();
});


btnDeleteCustomer.addEventListener("click", () => {
  if (activeCustomerId) {
    openDeleteCustomerModal(activeCustomerId);
  }
});