// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    console.log("Makhzoun System Loaded");
    router('dashboard');
});

// نظام التوجيه البسيط (SPA Router)
function router(pageId) {
    // إخفاء كل الأقسام
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
    
    // إظهار القسم المطلوب
    const target = document.getElementById(pageId);
    if(target) target.classList.remove('hidden');

    // تحديث أزرار النافبار
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    // (يمكن إضافة منطق لتفعيل الزر الحالي هنا)
}

function openModal(modalId) {
    // كود لفتح النوافذ المنبثقة
    alert("هنا سيفتح نموذج الإضافة: " + modalId);
}
