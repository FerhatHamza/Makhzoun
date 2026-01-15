import { entryInit } from "./entry.js";
import { openModal } from "./modal.js";
import { getItems, deleteItems, editItem, changeExpiryTrack } from "../api/itemsAPI.js";

export async function loadItemsUI() {
    const items = await getItems();
    const tbody = document.getElementById("items-table-body");
    console.log(items);
    tbody.innerHTML = "";

    if (!items.length) {
        tbody.innerHTML = `
      <tr>
        <td colspan="6" class="p-4 text-center text-gray-400">
          لا توجد مواد
        </td>
      </tr>`;
        return;
    }

    items.forEach(item => {
    const tr = document.createElement("tr");
    tr.className = "border-b";

    tr.innerHTML = `
      <td class="p-3">${item.code}</td>
      <td class="p-3">${item.name_ar}</td>
      <td class="p-3">${item.name_fr || "-"}</td>
      <td class="p-3">فئة</td>
      <td class="p-3">${item.current_stock}</td>
      <td class="p-3 text-center">
        <button
          class="expiry-toggle px-3 py-1 rounded-full text-sm font-medium
            ${item.expiry_track
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'}"
          data-id="${item.id}"
          data-value="${item.expiry_track}"
        >
          ${item.expiry_track ? 'مفعّل' : 'غير مفعّل'}
        </button>
      </td>
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
      editItemUI(item);
    });

    tr.querySelector('.deleteBtn').addEventListener('click', () => {
      deleteItem(item);
    });

    toggleExpiry();
    tbody.appendChild(tr);
  });
}

async function toggleExpiry() {

  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".expiry-toggle");
    if (!btn) return;

    const itemId = btn.dataset.id;
    const currentValue = parseInt(btn.dataset.value);
    let newValue = currentValue ? 0 : 1;

    console.log("current: ", currentValue, newValue);
    
    // if (currentValue === 1) {
    //   if (!confirm("هل تريد تعطيل انتهاء الصلاحية؟")) return;
    // }

    console.log("Toggling expiry for item", itemId, "to", newValue);
    await changeExpiryTrack(itemId, newValue);

    await loadItemsUI();
    await entryInit();
  });
}

function editItemUI(item) {
  console.log(item);
  const wrapper = document.createElement('div');

  wrapper.className = 'space-y-6 text-right';

  wrapper.innerHTML = `
    <!-- BASIC INFO -->
    <div class="grid grid-cols-2 gap-4">
      
      <div>
        <label class="block text-sm text-gray-600 mb-1">الكود</label>
        <input
          id="item-code"
          value="${item.code}"
          type="text"
          placeholder="مثال: ITM-001"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">الفئة</label>
        <input
          id="item-category"
          value="فئة"
          type="text"
          placeholder="مثال: معدات طبية"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

    </div>

    <!-- NAMES -->
    <div class="grid grid-cols-2 gap-4">
      
      <div>
        <label class="block text-sm text-gray-600 mb-1">الاسم بالعربية</label>
        <input
          id="item-name-ar"
          value="${item.name_ar}"
          type="text"
          placeholder="معدات طبية"
          dir="rtl"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">الاسم بالفرنسية</label>
        <input
          id="item-name-fr"
          value="${item.name_fr}"
          type="text"
          placeholder="Équipements médicaux"
          dir="ltr"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">الوحدة</label>
        <input
          id="item-unit"
          value="${item.unit}"
          type="text"
          placeholder="عدد/كيلو/لتر"
          dir="ltr"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

    </div>

    <!-- STOCK -->
    <div class="grid grid-cols-3 gap-4">

      <div>
        <label class="block text-sm text-gray-600 mb-1">الحد الأدنى للمخزون</label>
        <input
          id="item-min-stock"
          value="${item.min_stock}"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">المخزون الابتدائي</label>
        <input
          id="item-initial-stock"
          value="${item.initial_stock}"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">المخزون الحالي</label>
        <input
          id="item-current-stock"
          value="${item.current_stock}"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

    </div>

    <!-- EXTRA -->
    <div class="grid grid-cols-2 gap-4">

      <div>
        <label class="block text-sm text-gray-600 mb-1">المواصفات الفنية</label>
        <textarea
          id="item-specs"
          value="${item.specs}"
          rows="3"
          placeholder="وصف مختصر للمواصفات"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">تاريخ انتهاء الصلاحية</label>
        <input
          id="item-expiry"
          value="${item.expiry_date}"
          type="date"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

    </div>
  `;

  openModal({
    modalTitle: 'تعديل فئة',
    content: wrapper,
    onConfirm: async() => {
      const code = document.getElementById('item-code').value;
      const category = document.getElementById('item-category').value;
      const nameAr = document.getElementById('item-name-ar').value;
      const nameFr = document.getElementById('item-name-fr').value;
      const unit = document.getElementById('item-unit').value;
      const minStock = document.getElementById('item-min-stock').value;
      const initialStock = document.getElementById('item-initial-stock').value;
      const currentStock = document.getElementById('item-current-stock').value;
      const specs = document.getElementById('item-specs').value;
      const expiry = document.getElementById('item-expiry').value;

      console.log(item.id, code, category, nameAr, nameFr, unit, minStock, initialStock, currentStock, specs, expiry);

      await editItem(item.id, code, category, nameAr, nameFr, unit, minStock, initialStock, currentStock, specs, expiry);
      await loadItemsUI();

      await entryInit();
      // call model / api here
    }
  });
}

function deleteItem(item) {

  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
  <div class="space-y-4 text-center">
    <p class="text-xl font-bold text-red-600">
      هذا الاجراء <strong>لا يمكن التراجع عنه</strong>.
    </p>

    <p>
      اكتب <strong>${item.name_fr}</strong> لتأكيد الحذف.
    </p>
  </div>  
    <input class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" id="confirm-input" placeholder="أكتب لتأكيد الحذف" />

  `;

  const input = wrapper.querySelector('#confirm-input');

  let canDelete = false;

  input.addEventListener('input', () => {
    canDelete = input.value === item.name_fr;
    document.getElementById('saveModel').disabled = !canDelete;
  });

  openModal({
    modalTitle: 'Delete item',
    content: wrapper,
    onConfirm: async () => {
      if (!canDelete) return;
      await deleteItems(item.id);
      loadItemsUI();
    }
  });

  // disable save initially
  document.getElementById('saveModel').disabled = true;
}