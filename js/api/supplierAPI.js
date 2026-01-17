import { api } from "./api.js";



export async function getSupplierAPI() {
    const supplier = await api.getAll("suppliers");
    return supplier;
}
export async function deleteSupplierAPI(id) {
    const Supplier = await api.remove("suppliers", id);
    return Supplier;
}

export async function createSupplierAPI(code, name_ar, name_fr, phone, address) {
    const supplier = await api.create("suppliers", {
        code, 
        name_ar: name_ar, 
        name_fr: name_fr, 
        phone: phone, 
        address: address
 });
    return supplier;
}

export async function editSupplierAPI(id, code, name_ar, name_fr, phone, address) {
    const supplier = await api.update("suppliers", id, { code, name_ar: name_ar, name_fr: name_fr, phone: phone, address: address });
    return supplier;
}
