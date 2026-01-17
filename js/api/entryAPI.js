import { api } from "./api.js";

export async function createEntry(entryData) {
    const entry = await api.create("documents", {
        supplier_id: entryData.supplier_id,
        doc_type: entryData.doc_type,
        doc_subtype: entryData.doc_subtype,
        ref_number: entryData.ref_number,
        date_doc: entryData.date_doc,
        destination_id: entryData.destination_id,
        notes: entryData.notes,
        status: entryData.status
    });
    return entry;
}

export async function addDocumentLine(entryId, items) {
    console.log("Adding document lines for entry ID:", entryId, "with items:", items);
    // document_id, item_id, quantity, unit_price, batch_number, expiry_date
    const promises = items.map(async (item) => {
        await api.create("documentLines", {
            document_id: entryId,
            item_id: item.material,
            quantity: item.qty,
            unit_price: item.price,
            batch_number: 'item.batch',
            expiry_date: item.expiry
        });
    });
    await Promise.all(promises);
}