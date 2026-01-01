/* =========================================================
   entries.js – Einträge hinzufügen, löschen, rendern
   ========================================================= */

import {
  loadCustomers,
  addEntry,
  deleteEntry
} from "./storage.js";

import { updateTotalVolume } from "./ui.js";

/* DOM-Elemente */
const lengthSelect = document.getElementById("length-select");
const lengthCustomGroup = document.getElementById("length-custom-group");
const lengthCustomInput = document.getElementById("length-custom");

const diameterSelect = document.getElementById("diameter-select");
const diameterCustomGroup = document.getElementById("diameter-custom-group");
const diameterCustomInput = document.getElementById("diameter-custom");

const entryErrorEl = document.getElementById("entry-error");
const btnAddEntry = document.getElementById("btn-add-entry");

const entriesListContainer = document.getElementById("entries-list-container");
const entriesListEl = document.getElementById("entries-list");
const btnToggleEntries = document.getElementById("btn-toggle-entries");

/* Aktiver Kunde */
let activeCustomerId = null;

/* Wird von ui.js gesetzt */
export function setActiveCustomer(id) {
  activeCustomerId = id;
}

/* =========================================================
   Custom-Felder ein-/ausblenden
   ========================================================= */
lengthSelect.addEventListener("change", () => {
  lengthCustomGroup.style.display = lengthSelect.value === "custom" ? "block" : "none";
});

diameterSelect.addEventListener("change", () => {
  diameterCustomGroup.style.display = diameterSelect.value === "custom" ? "block" : "none";
});

/* =========================================================
   Volumenberechnung
   ========================================================= */
function calculateVolume(length, diameter) {
  const radius = diameter / 200; // cm → m → Radius
  const volume = Math.PI * radius * radius * length;
  return Number(volume.toFixed(3)); // 3 Nachkommastellen
}

/* =========================================================
   Eintrag hinzufügen
   ========================================================= */
btnAddEntry.addEventListener("click", () => {
  entryErrorEl.textContent = "";

  if (!activeCustomerId) {
    entryErrorEl.textContent = "Kein Kunde ausgewählt.";
    return;
  }

  // Länge bestimmen
  let length = lengthSelect.value;
  if (length === "custom") {
    length = parseFloat(lengthCustomInput.value);
  } else {
    length = parseFloat(length);
  }

  // Durchmesser bestimmen
  let diameter = diameterSelect.value;
  if (diameter === "custom") {
    diameter = parseFloat(diameterCustomInput.value);
  } else {
    diameter = parseFloat(diameter);
  }

  // Validierung
  if (!length || length <= 0) {
    entryErrorEl.textContent = "Bitte eine gültige Länge eingeben.";
    return;
  }

  if (!diameter || diameter <= 0) {
    entryErrorEl.textContent = "Bitte einen gültigen Durchmesser eingeben.";
    return;
  }

  // Volumen berechnen
  const volume = calculateVolume(length, diameter);

  // Speichern
  addEntry(activeCustomerId, length, diameter, volume);

  // UI aktualisieren
  renderEntriesForCustomer(activeCustomerId);
  updateTotalVolume();

  // Felder zurücksetzen
  lengthCustomGroup.style.display = "none";
  diameterCustomGroup.style.display = "none";
});

/* =========================================================
   Einträge rendern
   ========================================================= */
export function renderEntriesForCustomer(customerId) {
  activeCustomerId = customerId;

  const customers = loadCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;

  entriesListEl.innerHTML = "";

  customer.entries.forEach(entry => {
    const li = document.createElement("li");
    li.className = "entry-item";
    li.dataset.entryId = entry.id;

    li.innerHTML = `
      <div class="entry-main">
        <span class="entry-values">${entry.length} m × ${entry.diameter} cm → ${entry.volume} m³</span>
        <span class="entry-date">${formatTimestamp(entry.timestamp)}</span>
      </div>
      <button class="entry-delete">Löschen</button>
    `;

    // Löschen-Button
    li.querySelector(".entry-delete").addEventListener("click", () => {
      deleteEntry(customerId, entry.id);
      renderEntriesForCustomer(customerId);
      updateTotalVolume();
    });

    entriesListEl.appendChild(li);
  });
}

/* =========================================================
   Datum formatieren
   ========================================================= */
function formatTimestamp(ts) {
  const d = new Date(ts);
  return `(${d.toLocaleDateString()} – ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })})`;
}

/* =========================================================
   Einträge ein-/ausklappen
   ========================================================= */
btnToggleEntries.addEventListener("click", () => {
  const visible = entriesListContainer.style.display === "block";
  entriesListContainer.style.display = visible ? "none" : "block";
  btnToggleEntries.textContent = visible ? "Einträge anzeigen" : "Einträge ausblenden";
});