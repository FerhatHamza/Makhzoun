document.addEventListener('DOMContentLoaded', () => {
    console.log("System Initialized");
    
    // تفعيل الصفحة الافتراضية
    router('dashboard');
    
    // تهيئة الرسوم البيانية
    initDashboardCharts();
});

function router(pageId) {
    // 1. إخفاء جميع الأقسام
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    
    // 2. إظهار القسم المطلوب
    const target = document.getElementById(pageId);
    if(target) target.classList.remove('hidden');
    
    // 3. تحديث القائمة الجانبية
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
    // منطق بسيط لتحديد الزر النشط (يمكن تحسينه بربط IDs بالأزرار)
    
    // 4. تغيير عنوان الصفحة
    const titles = {
        'dashboard': 'لوحة القيادة والإحصائيات',
        'items': 'تسيير المواد والمخزون',
        'operations': 'حركات الدخول والخروج',
        'reports': 'طباعة الوثائق الرسمية'
    };
    document.getElementById('page-title').innerText = titles[pageId] || 'النظام';
}

// دالة رسم المبيانات
function initDashboardCharts() {
    const ctxMovement = document.getElementById('movementChart').getContext('2d');
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');

    // 1. رسم بياني للحركات (Bar Chart)
    new Chart(ctxMovement, {
        type: 'bar',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [
                {
                    label: 'دخول (Entrée)',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                },
                {
                    label: 'خروج (Sortie)',
                    data: [8, 15, 6, 8, 5, 7],
                    backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', align: 'end', labels: { font: { family: 'Tajawal' } } }
            },
            scales: {
                y: { beginAtZero: true, grid: { borderDash: [2, 4] } },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. رسم بياني للتوزيع (Doughnut Chart)
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: ['تجهيزات مكتبية', 'عتاد طبي', 'مواد تنظيف', 'أجهزة إعلام آلي'],
            datasets: [{
                data: [30, 50, 20, 40],
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#10b981', // Emerald
                    '#f59e0b', // Amber
                    '#6366f1'  // Indigo
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { font: { family: 'Tajawal', size: 12 }, boxWidth: 10 } }
            }
        }
    });
}
