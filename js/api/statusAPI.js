import { api } from "./api.js";

export async function getStatusAPI() {
    const status = await api.getAll("dashboard/stats");
    console.log("Status data:", status);
    return status;
}