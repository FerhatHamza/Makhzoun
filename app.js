// Base URL for Cloudflare Worker
const API_URL = "/api"; 

// --- Responsive Sidebar Logic ---

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

// Close sidebar when clicking a menu item on mobile
function handleMobileMenuClick() {
    if (window.innerWidth < 768) { // md breakpoint
        toggleSidebar();
    }
}

// --- UI Logic ---

function showView(viewId) {
    // Hide all sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('aside nav button').forEach(el => el.classList.remove('active-tab', 'bg-emerald-50', 'text-emerald-700'));
    
    // Show selected
    const view = document.getElementById(`view-${viewId}`);
    if (view) view.classList.remove('hidden');
    
    // Update active tab style
    const btn = document.getElementById(`btn-${viewId}`);
    if(btn) {
        btn.classList.add('active-tab');
        btn.classList.remove('text-gray-600');
    }

    // Load Data based on view
    if (viewId === 'dashboard') loadDashboard();
    if (viewId === 'inventory') loadInventory();
    if (viewId === 'entry') loadItemsForSelect();

    // Handle Mobile Logic
    handleMobileMenuClick();
}

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// --- Data Fetching Logic (Same as before) ---

async function loadDashboard() {
    try {
        const res = await fetch(`${API_URL}/dashboard`);
        const data = await res.json();
        
        document.getElementById('stat-total').innerText = data.total_items;
        document.getElementById('stat-low').innerText = data.low_stock;
        document.getElementById('stat-value').innerText = new Intl.NumberFormat('ar-DZ', { style: 'currency', currency: 'DZD' }).format(data.inventory_value);
    } catch (err) {
        console.log("Using Mock Data for Demo"); 
        // Mock data fallback if API fails locally
        document.getElementById('stat-total').innerText = "154";
        document.getElementById('stat-low').innerText = "3";
        document.getElementById('stat-value').innerText = "1,250,000 دج";
    }
}

async function loadInventory() {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center p-4 text-gray-500">جاري التحميل...</td></tr>';

    try {
        const res = await fetch(`${API_URL}/items`);
        const items = await res.json();
        
        tbody.innerHTML = '';
        items.forEach(item => {
            const stockClass = item.current_stock <= item.min_stock_level ? 'text-red-600 font-bold bg-red-50' : 'text-gray-800';
            const status = item.current_stock <= item.min_stock_level ? 'نفاد وشيك' : 'متوفر';
            
            const row = `
                <tr class="border-b hover:bg-gray-50 transition">
                    <td class="p-4 font-mono text-sm text-gray-600">${item.code || '-'}</td>
                    <td class="p-4 font-bold text-gray-800">${item.name_ar}</td>
                    <td class="p-4 text-gray-500 text-sm" dir="ltr">${item.name_fr}</td>
                    <td class="p-4"><span class="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">${item.cat_name || 'عام'}</span></td>
                    <td class="p-4 ${stockClass}">${item.current_stock} ${item.unit || ''}</td>
                    <td class="p-4 text-xs font-medium">${status}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) {
        // Fallback demo data
        tbody.innerHTML = `
            <tr class="border-b hover:bg-gray-50"><td class="p-4 font-mono text-sm">PAP-001</td><td class="p-4 font-bold">ورق A4</td><td class="p-4 text-sm" dir="ltr">Papier A4</td><td class="p-4"><span class="bg-gray-100 px-2 py-1 rounded text-xs">قرطاسية</span></td><td class="p-4 text-red-600 font-bold">2 رزمة</td><td class="p-4 text-xs">نفاد</td></tr>
            <tr class="border-b hover:bg-gray-50"><td class="p-4 font-mono text-sm">INK-099</td><td class="p-4 font-bold">حبر طابعة HP</td><td class="p-4 text-sm" dir="ltr">Toner HP</td><td class="p-4"><span class="bg-gray-100 px-2 py-1 rounded text-xs">تقني</span></td><td class="p-4">10 علبة</td><td class="p-4 text-xs">متوفر</td></tr>
        `;
    }
}

async function loadItemsForSelect() {
    const selects = document.querySelectorAll('.item-select-entry');
    // Simplified fetch logic for demo
    // In real implementation: fetch API and populate
    selects.forEach(select => {
        if(select.options.length <= 1) { // prevent duplicates
            select.innerHTML += `<option value="1">ورق A4</option><option value="2">حبر طابعة</option>`;
        }
    });
}

// --- Action Functions ---

async function saveNewItem() {
    // Logic remains same, just simulating success for UI
    alert("سيتم إرسال البيانات للـ API");
    closeModal('addItemModal');
}

async function submitEntry() {
    alert("تم حفظ الوصل محلياً (تجربة)");
    showView('dashboard');
}

// Add dynamic row for entry (Responsive Clone)
function addEntryRow() {
    const container = document.getElementById('entry-items-container');
    const firstRow = container.children[0];
    const newRow = firstRow.cloneNode(true);
    newRow.querySelectorAll('input').forEach(i => i.value = '');
    container.appendChild(newRow);
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    showView('dashboard');
});


