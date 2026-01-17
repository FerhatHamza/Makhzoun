import { api } from "./api.js";



export async function getItems() {
    const items = await api.getAll("items");
    return items;
}
export async function deleteItems(id) {
    const items = await api.remove("items", id);
    return items;
}
export async function createItems(code ,category_id ,name_ar ,name_fr ,unit ,min_stock ,initial_stock ,current_stock, technical_specs) {
    const items = await api.create("items", {
        code, 
        category_id: category_id, 
        name_ar: name_ar, 
        name_fr: name_fr, 
        unit: unit, 
        min_stock: min_stock, 
        initial_stock: initial_stock, 
        current_stock: current_stock, 
        technical_specs: technical_specs, 
        expiry_track: false });
    return items;
}
export async function editItem(id, code, categoryId, nameAr, nameFr, unit, minStock, initialStock, currentStock, specs, expiryTrack) {
    const items = await api.update("items", id, { code, category_id: categoryId, name_ar: nameAr, name_fr: nameFr, unit, min_stock: minStock, initial_stock: initialStock, current_stock: currentStock, technical_specs: specs, expiry_track: expiryTrack });
    return items;
}

export async function changeExpiryTrack(id, expiryTrack) {
    const items = await api.update("expiry-track", id, { expiry_track: expiryTrack });
    return items;
}

export async function getSuppliers() {
    const suppliers = await api.getAll("suppliers");
    return suppliers;
}