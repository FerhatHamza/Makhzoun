import { getItems, getSuppliers } from "./../api/itemsAPI.js";
import { createMovement } from "./../api/movements.js";

// متغيرات عامة
let itemCount = 1;

// الحصول على العناصر عند الحاجة بدلاً من التخزين العام
function getElements() {
    return {
        btnAddRow: document.getElementById('addEntryRow'),
        container: document.getElementById('entry-items-container'),
        
        totalCostDisplay: document.getElementById('total-cost'),
        notification: document.getElementById('notification'),
        notificationText: document.getElementById('notification-text'),
        entrySupplier: document.getElementById('entry-supplier'),
        entryRef: document.getElementById('entry-ref')
    };
}

// دالة إضافة صف مادة جديد
async function addEntryRow() {
    
    const { container } = getElements();
    const newRow = document.createElement('div');
    newRow.className = 'item-row bg-white p-4 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end';
    
    // تاريخ افتراضي (سنة من اليوم)
   
    const items = await getItemsData();
    const today = new Date().toISOString().split('T')[0];
    newRow.innerHTML = `
        <div class="md:col-span-4">
            <label class="block text-xs text-gray-500 mb-1 md:hidden">المادة</label>
            <div class="relative">
                <select class="w-full border p-3 rounded-lg form-input focus:border-emerald-500 item-select-entry appearance-none pr-10">
                    <option value="" disabled selected>اختر المادة...</option>
                    ${items.map(item => `<option value="${item.id}">${item.name_ar}</option>`).join('')}
                </select>
                </select>
                <div class="absolute left-3 top-3.5 text-gray-400">
                    <i class="fas fa-pills"></i>
                </div>
            </div>
        </div>
        <div class="md:col-span-2">
            <label class="block text-xs text-gray-500 mb-1 md:hidden">الكمية</label>
            <input type="number" placeholder="الكمية" class="w-full border p-3 rounded-lg form-input focus:border-emerald-500 entry-qty" min="1" value="1">
        </div>
        <div class="md:col-span-2">
            <label class="block text-xs text-gray-500 mb-1 md:hidden">السعر (دج)</label>
            <div class="relative">
                <input type="number" placeholder="السعر" class="w-full border p-3 rounded-lg form-input focus:border-emerald-500 entry-price pr-10" min="0" step="0.01" value="0">
                <div class="absolute left-3 top-3.5 text-gray-400">دج</div>
            </div>
        </div>
        <div class="md:col-span-3">
            <label class="block text-xs text-gray-500 mb-1 md:hidden">تاريخ الصلاحية</label>
            <div class="relative">
                <input type="date" class="w-full border p-3 rounded-lg form-input focus:border-emerald-500 entry-expiry" value="${today}">
                <div class="absolute left-3 top-3.5 text-gray-400">
                    <i class="far fa-calendar"></i>
                </div>
            </div>
        </div>
        <div class="md:col-span-1 flex justify-center">
            <button type="button" class="remove-btn text-gray-400 hover:text-red-500 p-2" onclick="removeEntryRow(this)">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
        </div>
    `;
    
    container.appendChild(newRow);

    // تحديث عداد المواد
    itemCount++;
    

    // إضافة مستمعات الأحداث لحقول الصف الجديد لحساب التكلفة
    const qtyInput = newRow.querySelector('.entry-qty');
    const priceInput = newRow.querySelector('.entry-price');
    
    qtyInput.addEventListener('input', calculateTotal);
    priceInput.addEventListener('input', calculateTotal);

    // عرض إشعار
    showNotification('تمت إضافة مادة جديدة');

    // حساب التكلفة الإجمالية
    calculateTotal();
}

// دالة حذف صف مادة
function removeEntryRow(button) {
    const row = button.closest('.item-row');
    row.remove();

    // تحديث عداد المواد
    itemCount = Math.max(1, itemCount - 1);
    

    // حساب التكلفة الإجمالية
    calculateTotal();

    // عرض إشعار
    showNotification('تم حذف المادة');
}

// دالة حساب التكلفة الإجمالية
function calculateTotal() {
    let total = 0;
    
    // الحصول على جميع الصفوف الحالية (بما في ذلك الجديدة)
    const rows = document.querySelectorAll('.item-row');
    
    rows.forEach(row => {
        const qtyInput = row.querySelector('.entry-qty');
        const priceInput = row.querySelector('.entry-price');
        
        const qty = parseFloat(qtyInput?.value) || 0;
        const price = parseFloat(priceInput?.value) || 0;
        total += qty * price;
    });

    // تحديث عرض التكلفة الإجمالية
    const { totalCostDisplay } = getElements();
    totalCostDisplay.textContent = `${total.toFixed(2)} دج`;
}

// دالة عرض إشعار
function showNotification(message) {
    const { notification, notificationText } = getElements();
    
    if (!notification || !notificationText) return;
    
    notificationText.textContent = message;
    notification.classList.remove('hidden');

    // إخفاء الإشعار بعد 3 ثوان
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

// دالة مسح النموذج
function resetForm(vif) {
   
    if (vif === true || confirm('هل أنت متأكد من رغبتك في مسح جميع البيانات؟')) {
        const { entrySupplier, entryRef, container, totalCostDisplay } = getElements();
        
        entrySupplier.selectedIndex = 0;
        entryRef.value = 'FAC-001';

        // إعادة تعيين العناصر (الاحتفاظ بعنصر واحد فقط)
        container.innerHTML = '';

        // إضافة عنصر واحد فارغ
        addEntryRow();

        // إعادة تعيين العداد
        itemCount = 1;
        

        // إعادة تعيين التكلفة الإجمالية
        totalCostDisplay.textContent = '0 دج';

        // عرض إشعار
        showNotification('تم مسح النموذج بنجاح');
    }
}

// دالة حفظ الوصل
async function submitEntry() {
    const { entrySupplier, entryRef } = getElements();
    const supplier = entrySupplier.value;
    const ref = entryRef.value.trim();

    // التحقق من البيانات
    if (!supplier) {
        alert('الرجاء اختيار المورد');
        return;
    }

    if (!ref) {
        alert('الرجاء إدخال مرجع الوثيقة');
        return;
    }

    // جمع بيانات المواد
    const items = [];
    const rows = document.querySelectorAll('.item-row');
    let hasError = false;

    rows.forEach((row, index) => {
        const materialSelect = row.querySelector('.item-select-entry');
        const qtyInput = row.querySelector('.entry-qty');
        const priceInput = row.querySelector('.entry-price');
        const expiryInput = row.querySelector('.entry-expiry');

        const material = materialSelect?.value;
        const qty = qtyInput?.value;
        const price = priceInput?.value;
        const expiry = expiryInput?.value;

        if (!material) {
            alert(`الرجاء اختيار المادة في السطر ${index + 1}`);
            hasError = true;
            return;
        }

        if (!qty || qty <= 0) {
            alert(`الرجاء إدخال كمية صحيحة في السطر ${index + 1}`);
            hasError = true;
            return;
        }

        items.push({
            material,
            qty,
            price,
            expiry
        });
    });

    if (hasError) return;

    // هنا يمكن إرسال البيانات إلى الخادم
    console.log({
        supplier,
        ref,
        items,
        total: document.getElementById('total-cost')?.textContent || '0 دج'
    });

    const movementsPayload = items.map(item => ({
        item_id: item.material,
        quantity: item.qty,
        unit_price: item.price,
        ref_doc_type: 'bill',
        ref_doc_number: ref,
        // shared movement data
        type: 'IN',
        date: item.expiry,
        destination_id: null,
        supplier_id: supplier,
        notes: ''
    }));

    const movement = createMovement(movementsPayload).then(() => {
        showNotification('تم حفظ الوصل بنجاح!');
        resetForm(true);
    }).catch(err => {
        showNotification('حدث خطأ أثناء حفظ الوصل.');
        console.error("Error creating movements:", err);
    });
    // عرض إشعار النجاح
    showNotification('تم حفظ الوصل بنجاح!');
}

// تهيئة قسم الوصل
export async function entryInit() {
    const { btnAddRow, entrySupplier } = getElements();
    
    if (btnAddRow) {
        btnAddRow.addEventListener('click', addEntryRow);
    }
    
    // تعيين تاريخ اليوم
    const currentDateElement = document.getElementById('current-date');
    if (currentDateElement) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-GB');
        currentDateElement.textContent = formattedDate;
    }
    
    // إضافة مستمعات الأحداث للحقول الموجودة
    const inputs = document.querySelectorAll('.entry-qty, .entry-price');
    inputs.forEach(input => {
        input.addEventListener('input', calculateTotal);
    });

    // إضافة مستمعات الأزرار إذا كانت غير موجودة في HTML
    const resetBtn = document.querySelector('button[onclick="resetForm()"]');
    const submitBtn = document.querySelector('button[onclick="submitEntry()"]');
    
    if (resetBtn && !resetBtn.onclick) {
        resetBtn.addEventListener('click', resetForm);
    }
    
    if (submitBtn && !submitBtn.onclick) {
        submitBtn.addEventListener('click', submitEntry);
    }
    
    const items = await getItemsData();
    const firstRowSelect = document.getElementById('firstRow');
    if (firstRowSelect) {
        firstRowSelect.innerHTML = `
            <option value="" disabled selected>اختر المادة...</option>
            ${items.map(item => `<option value="${item.id}">${item.name_ar}</option>`).join('')}
        `;
    }
    getSuppliers().then(suppliers => {
        entrySupplier.innerHTML = `
            <option value="" disabled selected>اختر المورد...</option>
            ${suppliers.map(supplier => `<option value="${supplier.id}">${supplier.name_ar} (${supplier.name_fr})</option>`).join('')}
        `;
    });

    setDate();
    
    // حساب التكلفة الإجمالية الأولية
    calculateTotal();
}

function setDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateNowInput1').value = today;
}

async function getItemsData() {
    const items = await getItems();

    return items
        .filter(item => item.expiry_track === 1 || item.expiry_track === true)
        .map(item => ({
            id: item.id,
            name_ar: item.name_ar,
            name_fr: item.name_fr
    }));
}

// جعل الدوال متاحة عالمياً للاستخدام في onclick في HTML
window.addEntryRow = addEntryRow;
window.removeEntryRow = removeEntryRow;
window.resetForm = resetForm;
window.submitEntry = submitEntry;
window.calculateTotal = calculateTotal;