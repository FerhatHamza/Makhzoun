const API_BASE = `${"https://makhzoun-api.ferhathamza17.workers.dev"}/api/categories`;

// Utilities

const qs = (id) => document.getElementById(id);

const notify = (msg, type = "success") => {
  alert(msg); // replace later with toast if needed
};

/* =========================
   Fetch & Render
========================= */

async function loadCategories() {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();

    console.log("Categories data:", data);

    renderCategories(data);
  } catch (err) {
    console.error(err);
    notify("فشل تحميل الفئات", "error");
  }
}

function renderCategories(categories) {
  const tbody = qs("categories-table-body");
  tbody.innerHTML = "";

  if (!categories.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="p-4 text-center text-gray-400">
          لا توجد فئات
        </td>
      </tr>`;
    return;
  }

  categories.forEach(cat => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="p-3">${cat.id}</td>
      <td class="p-3">${cat.name_ar}</td>
      <td class="p-3">${cat.name_fr || "-"}</td>
      <td class="p-3 space-x-2 space-x-reverse">
        <button onclick="editCategory(${cat.id}, '${escape(cat.name_ar)}', '${escape(cat.name_fr || "")}')" class="text-blue-600">
          تعديل
        </button>
        <button onclick="deleteCategory(${cat.id})" class="text-red-600">
          حذف
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

/* =========================
   Add / Update
========================= */

async function saveCategory() {
  const id = qs("cat-id").value;
  const name_ar = qs("cat-name-ar").value.trim();
  const name_fr = qs("cat-name-fr").value.trim();

  if (!name_ar) {
    notify("الاسم العربي إجباري", "error");
    return;
  }

  const payload = { name_ar, name_fr };

  try {
    const res = await fetch(
      id ? `${API_BASE}/${id}` : API_BASE,
      {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) throw new Error("Request failed");

    notify(id ? "تم التحديث بنجاح" : "تمت الإضافة بنجاح");
    closeCategoryModal();
    loadCategories();
  } catch (err) {
    console.error(err);
    notify("حدث خطأ أثناء الحفظ", "error");
  }
}

function editCategory(id, name_ar, name_fr) {
  qs("cat-id").value = id;
  qs("cat-name-ar").value = unescape(name_ar);
  qs("cat-name-fr").value = unescape(name_fr);

  openCategoryModal();
}

/* =========================
   Delete
========================= */

async function deleteCategory(id) {
  if (!confirm("هل أنت متأكد من الحذف؟")) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    notify("تم الحذف");
    loadCategories();
  } catch (err) {
    console.error(err);
    notify("فشل الحذف", "error");
  }
}

/* =========================
   Modal Helpers
========================= */

function openCategoryModal() {
  qs("category-modal").classList.remove("hidden");
}

function closeCategoryModal() {
  qs("category-modal").classList.add("hidden");
  qs("cat-id").value = "";
  qs("cat-name-ar").value = "";
  qs("cat-name-fr").value = "";
}

/* =========================
   Init
========================= */

document.addEventListener("DOMContentLoaded", loadCategories);
