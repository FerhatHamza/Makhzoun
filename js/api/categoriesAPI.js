import { api } from "./api.js";



export async function getCategorys() {
    const categories = await api.getAll("categories");
    return categories;
}
export async function deleteCategorys(id) {
    const categories = await api.remove("categories", id);
    return categories;
}
export async function createCategorys(nameAr, nameFr) {
    const categories = await api.create("categories", { name_ar: nameAr, name_fr: nameFr });
    return categories;
}
export async function editCategorys(id,nameAr, nameFr) {
    const categories = await api.update("categories", id, { name_ar: nameAr, name_fr: nameFr });
    return categories;
}

export async function getCategoriesNames() {
  const categories = await api.getAll("categories");

  return categories.map(cat => ({
    id: cat.id,
    name_ar: cat.name_ar,
    name_fr: cat.name_fr
  }));
}