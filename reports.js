/**
 * نظام توليد الوثائق الإدارية الجزائرية
 * يقوم هذا الملف بحقن HTML ديناميكي داخل منطقة الطباعة
 */

const INSTITUTION_HEADER = `
    <div class="official-header">
        <h3 class="text-sm">الجمهورية الجزائرية الديمقراطية الشعبية</h3>
        <h4 class="text-sm font-bold">وزارة الصحة والسكان وإصلاح المستشفيات</h4>
        <h4 class="text-lg font-bold mt-1">المؤسسة العمومية للصحة الجوارية - بريان</h4>
        <div class="flex justify-between mt-2 text-xs">
            <span>الرقم الجبائي: 000000000000</span>
            <span>المخزن العام</span>
        </div>
    </div>
`;

// قوالب الأعمدة لكل نوع وثيقة
const TABLE_COLUMNS = {
    'ENTRY': ['ر.ت', 'التعيين (Désignation)', 'الوحدة', 'الكمية', 'سعر الوحدة', 'المبلغ الإجمالي', 'ملاحظات'],
    'EXIT': ['ر.ت', 'الرمز (Code)', 'التعيين (Désignation)', 'الوحدة', 'الكمية المطلوبة', 'الكمية الممنوحة', 'ملاحظات'],
    'INVENTORY': ['ر.ت', 'الرمز', 'التعيين', 'الوحدة', 'رصيد دفتري', 'رصيد فعلي', 'الفارق', 'الحالة'],
    'STOCK_CARD': ['التاريخ', 'طبيعة العملية', 'المرجع (رقم الوصل)', 'دخول', 'خروج', 'رصيد', 'تأشيرة']
};

// البيانات التجريبية (لاحقاً تأتي من قاعدة البيانات)
const MOCK_DATA = [
    { id: 1, code: 'INFO-001', name: 'طابعة ليزر HP M404', unit: 'U', qty: 2, price: 45000 },
    { id: 2, code: 'PAP-050', name: 'ورق طباعة A4 (رام)', unit: 'Paq', qty: 50, price: 850 }
];

function generateReportView(docType) {
    const printArea = document.getElementById('print-area');
    let htmlContent = INSTITUTION_HEADER;
    let tableHeaders = [];
    let tableRows = '';
    let docTitle = '';
    let docMeta = ''; // معلومات إضافية مثل المورد أو المصلحة
    let footerSignatures = '';

    // 1. تحديد نوع الوثيقة وإعداداتها
    switch (docType) {
        case 'BON_COMMANDE':
            docTitle = 'سند طلب (Bon de Commande)';
            docMeta = `
                <div class="flex justify-between mb-4 border p-2 text-sm">
                    <div><strong>المورد:</strong> EURL MEDICAL EQUIP</div>
                    <div><strong>التاريخ:</strong> 01/01/2026</div>
                    <div><strong>رقم:</strong> 2026/001</div>
                </div>`;
            tableHeaders = TABLE_COLUMNS.ENTRY;
            footerSignatures = getSignatures('ADMIN');
            break;

        case 'BON_RECEPTION':
            docTitle = 'وصــــل استـــــلام (Bon de Réception)';
            docMeta = `
                <div class="flex justify-between mb-4 border p-2 text-sm">
                    <div><strong>المورد:</strong> SARL BUREAU PRO</div>
                    <div><strong>رقم الفاتورة:</strong> FACT-9988</div>
                    <div><strong>تاريخ الدخول:</strong> 01/01/2026</div>
                </div>`;
            tableHeaders = TABLE_COLUMNS.ENTRY;
            footerSignatures = getSignatures('STORE_ENTRY');
            break;

        case 'BON_SORTIE':
            docTitle = 'وصــــل خــــــروج (Bon de Sortie)';
            docMeta = `
                <div class="flex justify-between mb-4 border p-2 text-sm">
                    <div><strong>المصلحة المستفيدة:</strong> مصلحة الاستعجالات</div>
                    <div><strong>طالب المواد:</strong> د. محمدي</div>
                    <div><strong>التاريخ:</strong> 02/01/2026</div>
                </div>`;
            tableHeaders = TABLE_COLUMNS.EXIT;
            footerSignatures = getSignatures('STORE_EXIT');
            break;

        case 'PV_REFORME':
            docTitle = 'محضــــر إتـــــلاف / شطب (PV de Réforme)';
            docMeta = `<div class="mb-4 text-sm">بناءً على محضر اللجنة التقنية المؤرخ في...</div>`;
            tableHeaders = TABLE_COLUMNS.INVENTORY;
            footerSignatures = getSignatures('COMMITTEE');
            break;
            
        case 'FICHE_STOCK':
            docTitle = 'بطاقــــة مخــــزون (Fiche de Stock)';
            docMeta = `
                <div class="grid grid-cols-2 gap-4 mb-4 border p-2 text-sm">
                    <div><strong>المادة:</strong> طابعة ليزر HP</div>
                    <div><strong>الكود:</strong> INFO-001</div>
                    <div><strong>الحد الأدنى:</strong> 2</div>
                    <div><strong>الموقع:</strong> الرف A-2</div>
                </div>`;
            tableHeaders = TABLE_COLUMNS.STOCK_CARD;
            // بيانات وهمية خاصة ببطاقة المخزون
            tableRows = `
                <tr><td>01/01</td><td>رصيد سابق</td><td>جرد 2025</td><td>-</td><td>-</td><td>10</td><td></td></tr>
                <tr><td>15/01</td><td>دخول</td><td>وصل 05</td><td>5</td><td>-</td><td>15</td><td></td></tr>
            `;
            footerSignatures = ''; // لا توقيع في البطاقة عادة، أو توقيع واحد
            break;

        default:
            docTitle = 'وثيقة إدارية';
    }

    // 2. بناء الجدول (إذا لم يكن مبنياً يدوياً كبطاقة المخزون)
    if (!tableRows) {
        MOCK_DATA.forEach((item, index) => {
            if (docType.includes('ENTRY') || docType.includes('COMMANDE')) {
                tableRows += `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td>${item.name}</td>
                        <td class="text-center">${item.unit}</td>
                        <td class="text-center">${item.qty}</td>
                        <td class="text-center">${item.price}</td>
                        <td class="text-center">${item.qty * item.price}</td>
                        <td></td>
                    </tr>`;
            } else {
                tableRows += `
                    <tr>
                        <td class="text-center">${index + 1}</td>
                        <td class="text-center">${item.code}</td>
                        <td>${item.name}</td>
                        <td class="text-center">${item.unit}</td>
                        <td class="text-center">${item.qty}</td>
                        <td class="text-center">${item.qty}</td>
                        <td></td>
                    </tr>`;
            }
        });
    }

    // 3. تجميع HTML النهائي
    htmlContent += `
        <h1 class="official-title">${docTitle}</h1>
        ${docMeta}
        <table class="official-table w-full text-sm">
            <thead>
                <tr>${tableHeaders.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        <div class="mt-12 w-full">
            ${footerSignatures}
        </div>
    `;

    printArea.innerHTML = htmlContent;
}

// دالة مساعدة لتوليد التوقيعات حسب السياق
function getSignatures(type) {
    const signs = {
        'ADMIN': ['المقتصد', 'المدير'],
        'STORE_ENTRY': ['أمين المخزن', 'المورد', 'المقتصد'],
        'STORE_EXIT': ['المستلم', 'أمين المخزن', 'رئيس المصلحة'],
        'COMMITTEE': ['عضو اللجنة 1', 'عضو اللجنة 2', 'عضو اللجنة 3', 'المدير']
    };
    
    const list = signs[type] || ['التوقيع'];
    return `
        <div class="flex justify-between text-center font-bold px-4">
            ${list.map(s => `<div class="mt-4"><p class="mb-16 underline">${s}</p></div>`).join('')}
        </div>
    `;
}
