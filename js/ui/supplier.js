// متغيرات عامة
let currentSupplierId = null;
let suppliersData = [
    {
        id: 1,
        name: 'مؤسسة سوناطراك',
        phone: '023-1234567',
        email: 'contact@sonatrach.dz',
        address: 'الجزائر العاصمة',
        notes: 'مورد رئيسي للمواد الطبية'
    },
    {
        id: 2,
        name: 'صيدلية مركزية',
        phone: '021-9876543',
        email: 'info@pharmacie.dz',
        address: 'وهران',
        notes: ''
    }
];

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
        supplierName: document.getElementById('supplier-name'),
        supplierPhone: document.getElementById('supplier-phone'),
        supplierEmail: document.getElementById('supplier-email'),
        supplierAddress: document.getElementById('supplier-address'),
        supplierNotes: document.getElementById('supplier-notes'),
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
export function suppliersInit() {
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
function renderSuppliersTable() {
    const { tableBody } = getSupplierElements();
    if (!tableBody) return;
    
    // فرز الموردين حسب ID
    const sortedSuppliers = [...suppliersData].sort((a, b) => a.id - b.id);
    
    tableBody.innerHTML = sortedSuppliers.map(supplier => `
        <tr class="hover:bg-gray-50" data-id="${supplier.id}">
            <td class="p-4 text-gray-800 font-medium">${supplier.id}</td>
            <td class="p-4 text-gray-800">${supplier.name}</td>
            <td class="p-4 text-gray-800">${supplier.phone || '-'}</td>
            <td class="p-4 text-gray-800">${supplier.email || '-'}</td>
            <td class="p-4 text-gray-800">${supplier.address || '-'}</td>
            <td class="p-4">
                <div class="flex items-center justify-center gap-2">
                    <button onclick="editSupplier(${supplier.id})" class="text-blue-600 hover:text-blue-800 p-1 transition duration-200" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="showDeleteModal(${supplier.id})" class="text-red-600 hover:text-red-800 p-1 transition duration-200" title="حذف">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// فتح مودال الإضافة/التعديل
function openSupplierModal(mode, supplierId = null) {
    const elements = getSupplierElements();
    
    if (mode === 'add') {
        // وضع الإضافة
        elements.modalTitle.textContent = 'إضافة مورد جديد';
        elements.saveBtn.textContent = 'إضافة';
        
        // مسح الحقول
        elements.supplierId.value = '';
        elements.supplierName.value = '';
        elements.supplierPhone.value = '';
        elements.supplierEmail.value = '';
        elements.supplierAddress.value = '';
        elements.supplierNotes.value = '';
        
        currentSupplierId = null;
    } else if (mode === 'edit' && supplierId) {
        // وضع التعديل
        elements.modalTitle.textContent = 'تعديل مورد';
        elements.saveBtn.textContent = 'حفظ التغييرات';
        
        // البحث عن المورد
        const supplier = suppliersData.find(s => s.id === supplierId);
        if (supplier) {
            currentSupplierId = supplierId;
            elements.supplierId.value = supplier.id;
            elements.supplierName.value = supplier.name;
            elements.supplierPhone.value = supplier.phone || '';
            elements.supplierEmail.value = supplier.email || '';
            elements.supplierAddress.value = supplier.address || '';
            elements.supplierNotes.value = supplier.notes || '';
        }
    }
    
    // عرض المودال
    elements.supplierModal.classList.remove('hidden');
    elements.supplierModal.classList.add('flex');
    
    // التركيز على أول حقل
    setTimeout(() => {
        elements.supplierName.focus();
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
    e.preventDefault();
    
    const elements = getSupplierElements();
    const name = elements.supplierName.value.trim();
    
    // التحقق من الاسم
    if (!name) {
        showSupplierNotification('الرجاء إدخال اسم المورد', 'error');
        elements.supplierName.focus();
        return;
    }
    
    // إعداد بيانات المورد
    const supplierData = {
        name: name,
        phone: elements.supplierPhone.value.trim(),
        email: elements.supplierEmail.value.trim(),
        address: elements.supplierAddress.value.trim(),
        notes: elements.supplierNotes.value.trim()
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
function addSupplier(data) {
    // إنشاء ID جديد
    const newId = suppliersData.length > 0 
        ? Math.max(...suppliersData.map(s => s.id)) + 1 
        : 1;
    
    const newSupplier = {
        id: newId,
        ...data
    };
    
    suppliersData.push(newSupplier);
    renderSuppliersTable();
    showSupplierNotification('تم إضافة المورد بنجاح');
}

// تحديث مورد موجود
function updateSupplier(id, data) {
    const index = suppliersData.findIndex(s => s.id === id);
    
    if (index !== -1) {
        suppliersData[index] = {
            ...suppliersData[index],
            ...data
        };
        
        renderSuppliersTable();
        showSupplierNotification('تم تحديث بيانات المورد بنجاح');
    }
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
function editSupplier(id) {
    openSupplierModal('edit', id);
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