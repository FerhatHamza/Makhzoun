import { loadCategoriesUI } from "./category.js";
import { loadItemsUI } from "./items.js";
import { openModal } from "./modal.js";
import { createCategorys, getCategoriesNames } from "../api/categoriesAPI.js";
import { createItems } from "../api/itemsAPI.js";

const asideIds = [
    "btn-dashboard",
    "btn-suppliers",
    "btn-categories",
    "btn-inventory",
    "btn-entry",
    "btn-exit",
    "btn-reports",
]
const componentsIds = [
    "dashboardContent",
    "categoriesContent",
    "inventoryContent",
    "entryContent",
    "viewExitContent",
]
const viewIds = [
    "view-categories",
    "view-dashboard",
    "view-inventory",
    "view-entry",
    "view-exit",
    "view-reports",
]

async function loadComponent(id, path) {
    const res = await fetch(path)
    const html = await res.text()
    document.getElementById(id).innerHTML = html
}

async function showView(viewId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('aside nav button').forEach(el => el.classList.remove('active-tab', 'bg-emerald-50', 'text-emerald-700'));

    // Show selected
    const view = document.getElementById(`view-${viewId}`);
    if (view) view.classList.remove('hidden');

    // Update active tab style
    const btn = document.getElementById(`btn-${viewId}`);
    if (btn) {
        btn.classList.add('active-tab');
        btn.classList.remove('text-gray-600');
    }

    if (viewId === 'dashboard') loadCategoriesUI();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    // Toggle Translate Class
    // In RTL, translate-x-full means move right (hide), translate-x-0 means show
    if (sidebar.classList.contains('translate-x-full')) {
        sidebar.classList.remove('translate-x-full');
        sidebar.classList.add('translate-x-0');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('hidden');
    }
}

async function initAside() {
    asideIds.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                const viewId = id.replace('btn-', '');
                showView(viewId);
            });
        }
    });
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar);
    }
    const toggleBtn2 = document.getElementById('headerToggle');
    if (toggleBtn2) {
        toggleBtn2.addEventListener('click', toggleSidebar);
    }
}


export async function loadComponents() {
    await loadComponent("header", "/components/header.html")
    await loadComponent("aside", "/components/aside.html")

    await loadComponent("dashboardContent", "/components/dashboard.html")
    await loadComponent("categoriesContent", "/components/categories.html")
    await loadComponent("suppliersContent", "/components/supplier.html")
    await loadComponent("inventoryContent", "/components/items.html")
    await loadComponent("entryContent", "/components/entry.html")
    await loadComponent("viewExitContent", "/components/viewExit.html")

    await loadComponent("footer", "/components/footer.html")
    await initAside();
    await showView('dashboard');
    addModels();
    

}

function addModels() {
    const addBtn = document.getElementById('addCategories');
    addBtn.addEventListener('click', createCategoryForm);

    const addBtn2 = document.getElementById('addItemModal');
    addBtn2.addEventListener('click', createItemsForm);
}



export async function loadCategoriesIntoCombo(id) {
  const select = document.getElementById(id);
  const categories = await getCategoriesNames();

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name_ar + ' (' + cat.name_fr + ')';
    select.appendChild(option);
  });
}


async function createItemsForm() {
  const wrapper = document.createElement('div');

  wrapper.className = 'space-y-6 text-right';

  wrapper.innerHTML = `
    <!-- BASIC INFO -->
    <div class="grid grid-cols-2 gap-4">
      
      <div>
        <label class="block text-sm text-gray-600 mb-1">الكود</label>
        <input
          id="item-code"
          type="text"
          placeholder="مثال: ITM-001"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>


      <div>
        <label class="block text-sm text-gray-600 mb-1">الفئة</label>
        <select
          id="item-category"
          class="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">— اختر الفئة —</option>
        </select>
      </div>

    </div>

    <!-- NAMES -->
    <div class="grid grid-cols-2 gap-4">
      
      <div>
        <label class="block text-sm text-gray-600 mb-1">الاسم بالعربية</label>
        <input
          id="item-name-ar"
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
          type="text"
          placeholder="Équipements médicaux"
          dir="ltr"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">الوحدة</label>
        
        <select
          id="item-unit"
          class="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="">— اختر الفئة —</option>
          <option value="number"> عدد </option>
          <option value="kilogram"> كيلو </option>
          <option value="liter"> لتر </option>
          <option value="meter"> متر </option>
          <option value="box"> علبة </option>
          <option value="packet"> كيس </option>
          <option value="piece"> قطعة </option>
          <option value="set"> طقم </option>
          <option value="other"> أخرى </option>
        </select>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">هل لديه تاريخ انتهاء الصلاحية</label>
        <select
          id="item-expiry"
          class="w-full border p-3 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
        >
          <option value="yes">نعم</option>
          <option value="no"> لا </option>
        </select>
      </div>

    </div>

    <!-- STOCK -->
    <div class="grid grid-cols-3 gap-4">

      <div>
        <label class="block text-sm text-gray-600 mb-1">الحد الأدنى للمخزون</label>
        <input
          id="item-min-stock"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">المخزون الابتدائي</label>
        <input
          id="item-initial-stock"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">المخزون الحالي</label>
        <input
          id="item-current-stock"
          type="number"
          min="0"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

    </div>

    <!-- EXTRA -->
    <div class="">

      <div>
        <label class="block text-sm text-gray-600 mb-1">المواصفات الفنية</label>
        <textarea
          id="item-specs"
          rows="3"
          placeholder="وصف مختصر للمواصفات"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
        ></textarea>
      </div>
      
    </div>
  `;
 
  await openModal({
    modalTitle: 'إضافة مادة جديدة',
    content: wrapper,
    onConfirm: async () => {

      const data = {
        code: document.getElementById('item-code').value.trim(),
        category_id: document.getElementById('item-category').value.trim(),
        name_ar: document.getElementById('item-name-ar').value.trim(),
        name_fr: document.getElementById('item-name-fr').value.trim(),
        unit: document.getElementById('item-unit').value.trim(),
        min_stock: (document.getElementById('item-min-stock').value),
        initial_stock: (document.getElementById('item-initial-stock').value),
        current_stock: (document.getElementById('item-current-stock').value),
        technical_specs: document.getElementById('item-specs').value.trim(),
        expiry_track: document.getElementById('item-expiry').value
      };
      // code, category_id, name_ar, name_fr, unit, min_stock, initial_stock, current_stock, technical_specs, expiry_track
      await createItems(
        data.code,
        data.category_id,
        data.name_ar,
        data.name_fr,
        data.unit,
        data.min_stock,
        data.initial_stock,
        data.current_stock,
        data.technical_specs,
        false
      );
      await loadItemsUI();
      
      // call model / api here
    }
  });

  await loadCategoriesIntoCombo('item-category');
}


function createCategoryForm() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div>
      <label class="block text-sm text-gray-600 mb-1">
          الاسم بالعربية
      </label>
      <input
          id="cat-name-ar"
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
          type="text"
          placeholder="Ex: Équipements médicaux"
          dir="ltr"
          class="w-full border p-3 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
      />
      </div>
  `;

  openModal({
    modalTitle: 'اضافة فئة جديدة',
    content: wrapper, // Add your content here
    onConfirm: async () => {
      const nameAr = document.getElementById('cat-name-ar').value;
      const nameFr = document.getElementById('cat-name-fr').value;
      await createCategorys(nameAr, nameFr);
      await loadCategoriesUI();
      console.log('Adding new category: ', nameAr, nameFr);
      // call model / api here
    }
    });
}


