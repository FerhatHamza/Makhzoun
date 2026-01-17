import { loadComponents } from "./ui/index.js";
import { getCategorys } from "./api/categoriesAPI.js";
import { loadItemsUI } from "./ui/items.js"; 
import { entryInit } from "./ui/entry.js";
import { suppliersInit } from "./ui/supplier.js";
import { loadStatusUI } from "./ui/statusUI.js";

async function initApp() {
  await loadComponents()
  await getCategorys()
  await loadItemsUI()
  await entryInit()
  await suppliersInit()
  await loadStatusUI()

}


document.addEventListener('DOMContentLoaded', () => {
        initApp(); // Call your app initialization function here
  });