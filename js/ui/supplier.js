import { getSupplierAPI, createSupplierAPI, editSupplierAPI } from "./../api/supplierAPI.js";

// متغيرات عامة
let currentSupplierId = null;
let suppliersData = [];
// الحصول على العناصر
function getSupplierElements() {
    return {
        // الأزرار والمودالات
        addSupplierBtn: document.getElementById('addSupplierBtn'),
        supplierModal: document.getElementById('supplier-modal'),
        deleteModal: document.getElementById('delete-confirm-modal'),
        
        // عناصر النموذج
        supplierForm: document.getElementById('supplier-form'),
        supplierId: document.getElementById('supplier-id'),
        supplierCode: document.getElementById('supplier-code'),
        supplierNameAr: document.getElementById('supplier-name_ar'),
        supplierNameFr: document.getElementById('supplier-name_fr'),
        supplierPhone: document.getElementById('supplier-phone'),

        supplierAddress: document.getElementById('supplier-address'),
        modalTitle: document.getElementById('supplier-modal-title'),
        saveBtn: document.getElementById('save-supplier-btn'),
        
        // عناصر الجدول والإشعارات
        tableBody: document.getElementById('suppliers-table-body'),
        notification: document.getElementById('supplier-notification'),
        notificationText: document.getElementById('supplier-notification-text'),
        deleteMessage: document.getElementById('delete-confirm-message')
    };
}

// تهيئة قسم الموردين
export async function suppliersInit() {
    const { addSupplierBtn, supplierForm } = getSupplierElements();
    
    // إضافة مستمعات الأحداث
    if (addSupplierBtn) {
        addSupplierBtn.addEventListener('click', () => openSupplierModal('add'));
    }
    
    if (supplierForm) {
        supplierForm.addEventListener('submit', handleSupplierSubmit);
    }
    
    // عرض الموردين في الجدول
    renderSuppliersTable();
}

// عرض الموردين في الجدول
async function renderSuppliersTable() {
    const { tableBody } = getSupplierElements();
    if (!tableBody) return;
    
    // فرز الموردين حسب ID
    const getSuppliers = await getSupplierAPI();
    suppliersData = getSuppliers.sort((a, b) => a.id - b.id);
    // code, name_ar, name_fr, phone, address
    tableBody.innerHTML = suppliersData.map(supplier => `
        <tr class="hover:bg-gray-50" data-id="${supplier.id}">
            <td class="p-4 text-gray-800 font-medium">${supplier.code}</td>
            <td class="p-4 text-gray-800">${supplier.name_ar}</td>
            <td class="p-4 text-gray-800">${supplier.name_fr}</td>
            <td class="p-4 text-gray-800">${supplier.phone || '-'}</td>
            <td class="p-4 text-gray-800">${supplier.address || '-'}</td>
            <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="editSupplier(${supplier.id})" class="text-blue-600 hover:text-blue-800 p-1 transition duration-200" title="تعديل">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </button>
                    <button onclick="showDeleteModal(${supplier.id})" class="text-red-600 hover:text-red-800 p-1 transition duration-200" title="حذف">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>

                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// فتح مودال الإضافة/التعديل
function openSupplierModal(mode, supplier) {
    const elements = getSupplierElements();
    
    if (mode === 'add') {
        // وضع الإضافة
        elements.modalTitle.textContent = 'إضافة مورد جديد';
        elements.saveBtn.textContent = 'إضافة';
        
        // مسح الحقول
        elements.supplierId.value = '';
        elements.supplierNameAr.value = '';
        elements.supplierNameFr.value = '';
        elements.supplierPhone.value = '';
        elements.supplierAddress.value = '';
        
        currentSupplierId = null;
    } else if (mode === 'edit' && supplier) {
        // وضع التعديل
        elements.modalTitle.textContent = 'تعديل مورد';
        elements.saveBtn.textContent = 'حفظ التغييرات';
        
        // البحث عن المورد
        if (supplier) {
            currentSupplierId = supplier.id;
            elements.supplierId.value = supplier.id;
            elements.supplierCode.value = supplier.code;
            elements.supplierNameAr.value = supplier.name_ar;
            elements.supplierNameFr.value = supplier.name_fr;
            elements.supplierPhone.value = supplier.phone || '';
            elements.supplierAddress.value = supplier.address || '';
        }
    }
    
    // عرض المودال
    elements.supplierModal.classList.remove('hidden');
    elements.supplierModal.classList.add('flex');
    
    // التركيز على أول حقل
    setTimeout(() => {
        elements.supplierNameAr.focus();
    }, 100);
}

// إغلاق مودال المورد
function closeSupplierModal() {
    const { supplierModal } = getSupplierElements();
    supplierModal.classList.add('hidden');
    supplierModal.classList.remove('flex');
}

// معالجة تقديم النموذج
function handleSupplierSubmit(e) {
    console.log("Submitting supplier form...");
    e.preventDefault();
    
    const elements = getSupplierElements();
    const nameAr = elements.supplierNameAr.value.trim();
    const nameFr = elements.supplierNameFr.value.trim();
    
    // التحقق من الاسم
    if (!nameAr) {
        showSupplierNotification('الرجاء إدخال اسم المورد بالعربي', 'error');
        elements.supplierNameAr.focus();
        return;
    }
    
    // إعداد بيانات المورد
    const supplierData = {
        code: elements.supplierCode.value.trim(),
        name_ar: nameAr,
        name_fr: nameFr,
        phone: elements.supplierPhone.value.trim(),
        address: elements.supplierAddress.value.trim(),
    };
    
    if (currentSupplierId) {
        // تحديث مورد موجود
        updateSupplier(currentSupplierId, supplierData);
    } else {
        // إضافة مورد جديد
        addSupplier(supplierData);
    }
    
    // إغلاق المودال
    closeSupplierModal();
}

// إضافة مورد جديد
async function addSupplier(data) {
   
    console.log("Adding new supplier:", data);
    const supp = await createSupplierAPI(data.code, data.name_ar, data.name_fr, data.phone, data.address);
    renderSuppliersTable();
    showSupplierNotification('تم إضافة المورد بنجاح');
}

// تحديث مورد موجود
async function updateSupplier(id, data) {
    console.log("Updating supplier ID:", id, "with data:", data);
    const supp = await editSupplierAPI(id, data.code, data.name_ar, data.name_fr, data.phone, data.address);
    renderSuppliersTable();
    showSupplierNotification('تم تحديث بيانات المورد بنجاح');
    
}

// فتح مودال حذف المورد
function showDeleteModal(id) {
    const elements = getSupplierElements();
    const supplier = suppliersData.find(s => s.id === id);
    
    if (supplier) {
        currentSupplierId = id;
        elements.deleteMessage.textContent = `هل أنت متأكد من رغبتك في حذف المورد "${supplier.name}"؟`;
        elements.deleteModal.classList.remove('hidden');
        elements.deleteModal.classList.add('flex');
    }
}

// إغلاق مودال الحذف
function closeDeleteModal() {
    const { deleteModal } = getSupplierElements();
    deleteModal.classList.add('hidden');
    deleteModal.classList.remove('flex');
    currentSupplierId = null;
}

// تأكيد حذف المورد
function confirmDelete() {
    if (!currentSupplierId) return;
    
    const index = suppliersData.findIndex(s => s.id === currentSupplierId);
    
    if (index !== -1) {
        const supplierName = suppliersData[index].name;
        suppliersData.splice(index, 1);
        
        renderSuppliersTable();
        showSupplierNotification(`تم حذف المورد "${supplierName}" بنجاح`);
        closeDeleteModal();
    }
}

// دالة تعديل المورد (للأزرار في الجدول)
function editSupplier(supplierId) {
    const supplier = suppliersData.find(s => s.id === supplierId);
    console.log("Editing supplier:", supplier);
    
    openSupplierModal('edit', supplier);
}

// دالة حذف المورد (للأزرار في الجدول)
function deleteSupplier(id) {
    currentSupplierId = id;
    showDeleteModal(id);
}

// عرض إشعار 
function showSupplierNotification(message, type = 'success') {
    const { notification, notificationText } = getSupplierElements();
    
    if (!notification || !notificationText) return;
    
    // تعيين النص
    notificationText.textContent = message;
    
    // تغيير اللون حسب نوع الإشعار
    if (type === 'error') {
        notification.className = 'hidden p-4 rounded-lg bg-red-100 border border-red-300 text-red-800';
        notification.querySelector('i').className = 'fas fa-exclamation-circle text-red-600 ml-2';
    } else {
        notification.className = 'hidden p-4 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800';
        notification.querySelector('i').className = 'fas fa-check-circle text-emerald-600 ml-2';
    }
    
    // عرض الإشعار
    notification.classList.remove('hidden');
    
    // إخفاء تلقائي بعد 5 ثوان
    setTimeout(() => {
        hideSupplierNotification();
    }, 5000);
}

// إخفاء الإشعار
function hideSupplierNotification() {
    const { notification } = getSupplierElements();
    if (notification) {
        notification.classList.add('hidden');
    }
}

// جعل الدوال متاحة عالمياً للاستخدام في onClick في HTML
window.editSupplier = editSupplier;
window.deleteSupplier = deleteSupplier;
window.closeSupplierModal = closeSupplierModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.hideSupplierNotification = hideSupplierNotification;