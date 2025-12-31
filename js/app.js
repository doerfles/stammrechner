/* =========================================================
   app.js – Initialisierung der gesamten App
   ========================================================= */

import { renderCustomerList } from "./customers.js";
import { showCustomerListScreen, showCustomerDetailScreen } from "./ui.js";
import { setActiveCustomer } from "./entries.js";

/* =========================================================
   App starten
   ========================================================= */
function initApp() {
  // Kundenliste anzeigen
  renderCustomerList();

  // Standard-Screen: Kundenübersicht
  showCustomerListScreen();

  // Wenn wir später Deep-Linking wollen, können wir hier prüfen,
  // ob ein Kunde direkt geladen werden soll.
}

/* =========================================================
   Globale Events (optional)
   ========================================================= */

// Wenn ein Kunde ausgewählt wird, ruft customers.js → ui.js auf.
// ui.js ruft dann entries.js → setActiveCustomer() auf.
// Das halten wir bewusst modular und lose gekoppelt.

/* =========================================================
   App starten
   ========================================================= */
document.addEventListener("DOMContentLoaded", initApp);