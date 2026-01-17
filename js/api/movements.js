import { api } from "./api.js";

export async function createMovement(movementData) {
//    item_id, type, date, quantity, ref_doc_type, ref_doc_number, supplier_id, destination_id, notes
    console.log("Creating movements with data:", movementData);
    const promises = movementData.map(async (item) => {
        await api.create("movements", {
            item_id: parseInt(item.item_id),
            type: item.type,
            date: item.date,
            quantity: parseInt(item.quantity),
            ref_doc_type: item.ref_doc_type,
            ref_doc_number: item.ref_doc_number,
            supplier_id: parseInt(item.supplier_id),
            destination_id: parseInt(item.destination_id),
            notes: item.notes
        });
    });
    await Promise.all(promises);
}