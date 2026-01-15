import { getCategorys, deleteCategorys, editCategorys } from "../api/categoriesAPI.js";
import { openModal } from "./modal.js";

export async function loadCategoriesUI() {
    const categories = await getCategorys();
    const tbody = document.getElementById("categories-table-body");
    console.log(categories);
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
        <button class="editBtn text-blue-600">
          تعديل
        </button>
        <button class="deleteBtn text-red-600">
          حذف
        </button>
      </td>
    `;
    tr.querySelector('.editBtn').addEventListener('click', () => {
      editCategory(cat);
    });

    tr.querySelector('.deleteBtn').addEventListener('click', () => {
      deleteCategory(cat);
    });

    tbody.appendChild(tr);
  });
}

function editCategory(category) {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
    <div>
        <label class="block text-sm text-gray-600 mb-1">
          الاسم بالعربية
        </label>
        <input
          id="cat-name-ar"
          value="${category.name_ar}"
          type="text"
          placeholder="مثال: معدات طبية"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">
          الاسم بالفرنسية
        </label>
        <input
          id="cat-name-fr"
          value="${category.name_fr}"
          type="text"
          placeholder="Ex: Équipements médicaux"
          dir="ltr"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>
  `;

  openModal({
    modalTitle: 'تعديل فئة',
    content: wrapper,
    onConfirm: async() => {
      const nameAr = document.getElementById('cat-name-ar').value;
      const nameFr = document.getElementById('cat-name-fr').value;
      await editCategorys(category.id, nameAr, nameFr);
      await loadCategoriesUI();
      // call model / api here
    }
  });
}

function deleteCategory(category) {

  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
  <div class="space-y-4 text-center">
    <p class="text-xl font-bold text-red-600">
      هذا الاجراء <strong>لا يمكن التراجع عنه</strong>.
    </p>

    <p>
      اكتب <strong>${category.name_fr}</strong> لتأكيد الحذف.
    </p>
  </div>  
    <input class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" id="confirm-input" placeholder="أكتب لتأكيد الحذف" />

  `;

  const input = wrapper.querySelector('#confirm-input');

  let canDelete = false;

  input.addEventListener('input', () => {
    canDelete = input.value === category.name_fr;
    document.getElementById('saveModel').disabled = !canDelete;
  });

  openModal({
    modalTitle: 'Delete category',
    content: wrapper,
    onConfirm: async () => {
      if (!canDelete) return;
      await deleteCategorys(category.id);
      loadCategoriesUI();
    }
  });

  // disable save initially
  document.getElementById('saveModel').disabled = true;
}