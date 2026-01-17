import { getStatusAPI } from "../api/statusAPI.js";

function getSupplierElements() {
    return {
        addSupplierBtn: document.getElementById('addSupplierBtn'),
        statItemsTotal: document.getElementById('stat-total'),
        statLow: document.getElementById('stat-low'),
        statValue: document.getElementById('stat-value'),
        statSuppliers: document.getElementById('stat-suppliers'),
        statCategories: document.getElementById('stat-categories'),
        statUsers: document.getElementById('stat-users')
    };
}


export async function loadStatusUI() {
    const statusData = await getStatusAPI();
    if (!statusData) return;

    console.log("Loaded status data:", statusData);
    const elements = getSupplierElements();

    elements.statItemsTotal.textContent = statusData.items || '0';
    elements.statLow.textContent = statusData.low_stock_items || '0';
    elements.statValue.textContent = statusData.total_inventory_value ? `${statusData.total_inventory_value} د.م` : '0 د.م';
    elements.statSuppliers.textContent = statusData.suppliers || '0';
    elements.statCategories.textContent = statusData.categories || '0';
    elements.statUsers.textContent = statusData.users || '0';
}