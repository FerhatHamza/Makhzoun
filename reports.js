// أضف هذا الكود في بداية reports.js أو عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    const listContainer = document.getElementById('reports-list');
    if(!listContainer) return;

    const reportCategories = [
        { 
            title: "الدخول (Entrée)", 
            color: "text-green-600",
            bg: "bg-green-50",
            items: [
                { id: 'BON_COMMANDE', label: 'طلب اقتناء (Bon de Commande)' },
                { id: 'BON_RECEPTION', label: 'وصل استلام (Bon de Réception)' }
            ]
        },
        { 
            title: "الخروج (Sortie)", 
            color: "text-red-600",
            bg: "bg-red-50",
            items: [
                { id: 'BON_SORTIE', label: 'وصل خروج (Bon de Sortie)' },
                { id: 'DECHARGE', label: 'وصل تسليم (Décharge)' }
            ]
        },
        { 
            title: "الجرد (Inventaire)", 
            color: "text-amber-600",
            bg: "bg-amber-50",
            items: [
                { id: 'FICHE_STOCK', label: 'بطاقة المخزون (Fiche de Stock)' },
                { id: 'PV_REFORME', label: 'محضر إتلاف (PV de Réforme)' }
            ]
        }
    ];

    let html = '';
    reportCategories.forEach(cat => {
        html += `
            <div class="mb-4">
                <h4 class="font-bold text-xs uppercase tracking-wider mb-2 ${cat.color} px-2">${cat.title}</h4>
                <div class="space-y-1">
        `;
        cat.items.forEach(item => {
            html += `
                <button onclick="generateReportView('${item.id}')" class="w-full text-right px-3 py-2 rounded-lg text-sm hover:${cat.bg} hover:text-slate-900 text-slate-600 transition flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50"></span>
                    ${item.label}
                </button>
            `;
        });
        html += `</div></div>`;
    });

    listContainer.innerHTML = html;
});
