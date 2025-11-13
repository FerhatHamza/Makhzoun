// Application State
const appState = {
    currentPage: 'dashboard',
    language: 'fr',
    user: null,
    articles: [],
    movements: []
};

// DOM Elements
const loginPage = document.getElementById('loginPage');
const app = document.getElementById('app');
const loginForm = document.getElementById('loginForm');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const langButtons = document.querySelectorAll('.lang-btn');
const newArticleBtn = document.getElementById('newArticleBtn');
const articleModal = document.getElementById('articleModal');
const closeModal = document.querySelector('.close');
const cancelArticle = document.getElementById('cancelArticle');
const saveArticle = document.getElementById('saveArticle');
const articleForm = document.getElementById('articleForm');
const newMovementBtn = document.getElementById('newMovementBtn');

// Login Functionality
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (replace with actual API call)
    if (username === 'admin' && password === 'admin') {
        // Hide login, show app
        loginPage.style.display = 'none';
        app.style.display = 'flex';
        
        // Set user in state
        appState.user = { 
            username: 'admin', 
            role: 'Admin',
            name: 'Admin User'
        };
        
        // Update UI with user info
        updateUserInfo();
        
        // Show dashboard
        showPage('dashboard');
        
        // Load initial data
        loadInitialData();
    } else {
        alert('Nom d\'utilisateur ou mot de passe incorrect');
    }
});

// Navigation
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        const page = this.getAttribute('data-page');
        
        // Update active menu item
        menuItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Show the selected page
        showPage(page);
    });
});

// Language Switcher
langButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        langButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        appState.language = this.textContent === 'FR' ? 'fr' : 'ar';
        updateLanguage();
    });
});

// Modal Functions
if (newArticleBtn) {
    newArticleBtn.addEventListener('click', function() {
        articleModal.style.display = 'flex';
    });
}

if (closeModal) {
    closeModal.addEventListener('click', function() {
        articleModal.style.display = 'none';
    });
}

if (cancelArticle) {
    cancelArticle.addEventListener('click', function() {
        articleModal.style.display = 'none';
        articleForm.reset();
    });
}

if (saveArticle) {
    saveArticle.addEventListener('click', function() {
        // Validate form
        if (articleForm.checkValidity()) {
            // Here you would send data to your API
            const formData = new FormData(articleForm);
            const articleData = Object.fromEntries(formData);
            
            // Simulate API call
            simulateCreateArticle(articleData);
            
            // Close modal and reset form
            articleModal.style.display = 'none';
            articleForm.reset();
            
            // Show success message
            showNotification('Article créé avec succès!', 'success');
        } else {
            articleForm.reportValidity();
        }
    });
}

if (newMovementBtn) {
    newMovementBtn.addEventListener('click', function() {
        showNotification('Fonctionnalité de création de mouvement à venir!', 'info');
    });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === articleModal) {
        articleModal.style.display = 'none';
        articleForm.reset();
    }
});

// Show Page Function
function showPage(pageName) {
    // Hide all pages
    pages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show the selected page
    const pageElement = document.getElementById(pageName + 'Page');
    if (pageElement) {
        pageElement.style.display = 'block';
        appState.currentPage = pageName;
        
        // Add fade-in animation to cards and tables
        const cards = pageElement.querySelectorAll('.card, .table-container');
        cards.forEach((card, index) => {
            card.classList.remove('fade-in');
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
        
        // Load page-specific data
        loadPageData(pageName);
    }
}

// Update User Info in UI
function updateUserInfo() {
    const avatar = document.querySelector('.avatar');
    const userName = document.querySelector('.user-profile div div:first-child');
    
    if (avatar && userName && appState.user) {
        avatar.textContent = appState.user.name.split(' ').map(n => n[0]).join('');
        userName.textContent = appState.user.name;
    }
}

// Update Language
function updateLanguage() {
    // This would update all text content based on selected language
    console.log('Language changed to:', appState.language);
    // In a real app, you would have translation files and update all text
}

// Load Initial Data
function loadInitialData() {
    // Simulate API calls to load initial data
    setTimeout(() => {
        // Simulate loading articles
        appState.articles = [
            {
                id: 1,
                code: 'ORD-001245',
                barcode: '1234567890123',
                designation_fr: 'Ordinateur Portable Dell',
                designation_ar: 'حاسوب محمول ديل',
                price: 1250.00,
                family: 'MATERIEL INFORMATIQUE',
                destination: 'Bureau 1 - Département 1',
                status: 'En usage'
            },
            // ... more articles
        ];
        
        // Simulate loading movements
        appState.movements = [
            {
                id: 1,
                date: '15/11/2023',
                article: 'ORD-001245 (Ordinateur Portable)',
                type: 'Affectation',
                from: 'Stock Central',
                to: 'Bureau 1 - Département 1',
                user: 'Ahmed B.'
            },
            // ... more movements
        ];
        
        console.log('Initial data loaded:', appState);
    }, 1000);
}

// Load Page-Specific Data
function loadPageData(pageName) {
    switch (pageName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'articles':
            loadArticlesData();
            break;
        case 'movements':
            loadMovementsData();
            break;
        // Add cases for other pages
    }
}

function loadDashboardData() {
    // Update dashboard stats
    console.log('Loading dashboard data...');
}

function loadArticlesData() {
    // Update articles table
    console.log('Loading articles data...');
}

function loadMovementsData() {
    // Update movements table
    console.log('Loading movements data...');
}

// Simulate API Calls
function simulateCreateArticle(articleData) {
    console.log('Creating article:', articleData);
    // In a real app, this would be a fetch to your Cloudflare Worker
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, id: Date.now() });
        }, 500);
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles for notification
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 16px 20px;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                z-index: 1000;
                animation: slideIn 0.3s ease;
                border-left: 4px solid var(--primary);
            }
            .notification-success { border-left-color: var(--success); }
            .notification-error { border-left-color: var(--danger); }
            .notification-warning { border-left-color: var(--warning); }
            .notification-info { border-left-color: var(--info); }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .notification-close {
                background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                color: var(--gray);
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
    
    // Close on click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    });
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('EIDlawda Inventaire System Initialized');
    
    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('inventory_user');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            loginPage.style.display = 'none';
            app.style.display = 'flex';
            appState.user = user;
            updateUserInfo();
            showPage('dashboard');
            loadInitialData();
        } catch (e) {
            localStorage.removeItem('inventory_user');
        }
    }
});

// Export functions for global access (if needed)
window.appState = appState;
window.showPage = showPage;
window.showNotification = showNotification;
