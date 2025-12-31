/* =========================================================
   storage.js – LocalStorage Handling für Stammrechner
   ========================================================= */

// Key unter dem alles gespeichert wird
const STORAGE_KEY = "stammrechner_customers_v1";

// ---------------------------------------------------------
// Daten aus LocalStorage laden
// ---------------------------------------------------------
export function loadCustomers() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Fehler beim Laden der Daten:", e);
    return [];
  }
}

// ---------------------------------------------------------
// Daten speichern
// ---------------------------------------------------------
export function saveCustomers(customers) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

// ---------------------------------------------------------
// Neue eindeutige ID erzeugen
// ---------------------------------------------------------
export function generateId() {
  return "id-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1_000_000).toString(36);
}

// ---------------------------------------------------------
// Neuen Kunden anlegen
// ---------------------------------------------------------
export function createCustomer(name) {
  const customers = loadCustomers();

  const newCustomer = {
    id: generateId(),
    name,
    entries: [], // Liste aller Stämme
  };

  customers.push(newCustomer);
  saveCustomers(customers);

  return newCustomer;
}

// ---------------------------------------------------------
// Kunden löschen
// ---------------------------------------------------------
export function deleteCustomer(customerId) {
  let customers = loadCustomers();
  customers = customers.filter(c => c.id !== customerId);
  saveCustomers(customers);
}

// ---------------------------------------------------------
// Eintrag hinzufügen
// ---------------------------------------------------------
export function addEntry(customerId, length, diameter, volume) {
  const customers = loadCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;

  const entry = {
    id: generateId(),
    length,
    diameter,
    volume,
    timestamp: Date.now()
  };

  customer.entries.unshift(entry); // Neueste oben
  saveCustomers(customers);

  return entry;
}

// ---------------------------------------------------------
// Eintrag löschen
// ---------------------------------------------------------
export function deleteEntry(customerId, entryId) {
  const customers = loadCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return;

  customer.entries = customer.entries.filter(e => e.id !== entryId);
  saveCustomers(customers);
}

// ---------------------------------------------------------
// Gesamtvolumen berechnen
// ---------------------------------------------------------
export function calculateTotalVolume(customerId) {
  const customers = loadCustomers();
  const customer = customers.find(c => c.id === customerId);
  if (!customer) return 0;

  const sum = customer.entries.reduce((acc, e) => acc + e.volume, 0);
  return Number(sum.toFixed(2)); // Anzeige auf 2 Nachkommastellen
}