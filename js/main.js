// === МИТТЄВИЙ АНТИ-ФЛІКЕР КНОПОК (Ховає/показує кнопки до завантаження Firebase) ===
if (localStorage.getItem('isAuth') === 'true') {
    document.documentElement.classList.add('is-logged-in');
} else {
    document.documentElement.classList.add('is-logged-out');
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Система ініціалізована. Запуск модулів.");

    initThemeToggle();
    initSmartNav();
    initPasswordToggles();
    initCartSystem();
    initCatalogFilters();
    initMobileMenu();
    
    initColorPicker();
    simulate3DLoading();
    initForms();
    renderCheckoutPage();
    initDynamicItem(); // ДОДАНО: Запуск динамічної сторінки товару
});

// =========================================
// 1. ТЕМНА ТЕМА (Dark Mode)
// =========================================
function initThemeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.title = 'Перемкнути тему';
    
    const nav = document.querySelector('header nav');
    if (nav) nav.appendChild(toggleBtn);

    // Готові SVG іконки від Google Material
    const iconSun = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>`;
    
    const iconMoon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`;

    // Встановлюємо правильну іконку при завантаженні
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        toggleBtn.innerHTML = iconSun;
    } else {
        toggleBtn.innerHTML = iconMoon;
    }

    // Логіка кліку
    toggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            toggleBtn.innerHTML = iconMoon;
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            toggleBtn.innerHTML = iconSun;
        }
    });
}

// =========================================
// 2. РОЗУМНА НАВІГАЦІЯ (Smart Nav)
// =========================================
function initSmartNav() {
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.removeAttribute('style');
        
        const linkHref = link.getAttribute('href');
        // ФІКС: Додали перевірку, щоб це не була кнопка "Увійти"
        if (linkHref === currentPath && !link.classList.contains('btn-login')) {
            link.classList.add('active-link');
        }
    });
}

// =========================================
// 3. ПОКАЗАТИ/ПРИХОВАТИ ПАРОЛЬ
// =========================================
function initPasswordToggles() {
    const passInputs = document.querySelectorAll('input[type="password"]');
    
    // Готові SVG іконки від Google Material
    const iconEyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;
    
    const iconEyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-144.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q146 0 266 81.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-224q-37 11-73 17.5T480-200q-146 0-266-81.5T40-500q21-53 58-103.5T176-701L56-822l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q26 0 51-3t49-10l-58-58q-14 5-28.5 7t-33.5 2q-75 0-127.5-52.5T280-522q0-16 2-33.5t7-28.5l-67-67Zm258 124Z"/></svg>`;

    passInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'password-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const icon = document.createElement('span');
        icon.className = 'toggle-password';
        icon.innerHTML = iconEyeOpen; // Показуємо відкрите око за замовчуванням
        wrapper.appendChild(icon);

        icon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = iconEyeClosed; // Пароль видно -> показуємо перекреслене око
            } else {
                input.type = 'password';
                icon.innerHTML = iconEyeOpen;
            }
        });
    });
}

// =========================================
// 4. СИСТЕМА КОШИКА (+/- та Local Storage)
// =========================================
function initCartSystem() {
    updateCartCounter();

    const addToCartBtn = document.querySelector('.item-details .btn-primary');
    if (addToCartBtn && window.location.pathname.includes('item.html')) {
        addToCartBtn.removeAttribute('onclick');
        
        addToCartBtn.addEventListener('click', () => {
            const activeColor = document.querySelector('.color-circle.active');
            const colorName = activeColor ? activeColor.getAttribute('title') : 'Стандартний';
            const colorHex = activeColor ? activeColor.style.backgroundColor : '#3b3554';

            // Читаємо реальні дані зі сторінки товару
            const titleEl = document.querySelector('.item-details h1');
            const priceEl = document.querySelector('.item-details .price');
            
            const rawTitle = titleEl ? titleEl.innerText : 'Товар';
            const rawPrice = priceEl ? parseInt(priceEl.innerText.replace(/\D/g, '')) : 0;

            const item = {
                id: 'item_' + rawTitle + '_' + colorName, // Унікальний ID за ім'ям і кольором
                name: rawTitle,
                price: rawPrice,
                color: colorName,
                colorHex: colorHex,
                quantity: 1 
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Шукаємо, чи є в кошику такий товар
            const existingItemIndex = cart.findIndex(i => i.id === item.id);
            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push(item);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            window.showToast('Товар успішно додано в кошик!');
        });
    }

    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
    }
}

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        if (link.innerHTML.includes('Кошик')) {
            link.innerHTML = `🛒 Кошик (${totalItems})`;
        }
    });
}

function renderCartPage() {
    const cartList = document.getElementById('cart-items-list');
    const cartSummary = document.getElementById('cart-summary-box');
    if (!cartList || !cartSummary) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartList.innerHTML = '<div style="text-align: center; padding: 50px; background: var(--card-bg); border-radius: 12px;"><h3 style="color: var(--primary-color);">Ваш кошик порожній</h3><p style="margin: 15px 0;">Додайте меблі з каталогу, щоб оформити замовлення.</p><a href="catalog.html" class="btn-primary">Перейти в каталог</a></div>';
        cartSummary.style.display = 'none';
        return;
    }

    cartSummary.style.display = 'block';
    cartList.innerHTML = '';
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let qty = item.quantity || 1;
        let itemTotal = item.price * qty;
        totalPrice += itemTotal;

        cartList.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-img" style="background: ${item.colorHex}; color: white; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">3D</div>
                <div class="cart-item-info">
                    <h3>${item.name}</h3>
                    <p>Колір: ${item.color}</p>
                </div>
                
                <div class="cart-quantity">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight: bold; width: 20px; text-align: center;">${qty}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>

                <div class="cart-price">${itemTotal.toLocaleString()} ₴</div>
                <button class="cart-remove" onclick="removeFromCart(${index})" title="Видалити">×</button>
            </div>
        `;
    });

    document.getElementById('cart-total-price').innerText = `Разом: ${totalPrice.toLocaleString()} ₴`;
}

window.changeQuantity = function(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart[index].quantity) cart[index].quantity = 1;
    
    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
        window.showToast('Товар видалено з кошика');
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCounter();
};

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartPage();
    updateCartCounter();
    window.showToast('Товар видалено з кошика');
};

window.clearCart = function() {
    localStorage.removeItem('cart');
    renderCartPage();
    updateCartCounter();
    window.showToast('Кошик очищено');
};

// =========================================
// 5. ФІЛЬТРИ В КАТАЛОЗІ (Живий пошук)
// =========================================
function initCatalogFilters() {
    const catalogGrid = document.getElementById('catalog-grid');
    if (!catalogGrid) return; 

    const filterCheckboxes = document.querySelectorAll('.cat-filter');
    const products = document.querySelectorAll('.product-card');
    const noResultsMsg = document.getElementById('no-results-msg');
    const filterAll = document.querySelector('.cat-filter[value="all"]');

    filterCheckboxes.forEach(box => {
        box.addEventListener('change', (e) => {
            
            if (e.target.value === 'all' && e.target.checked) {
                filterCheckboxes.forEach(cb => { if(cb !== e.target) cb.checked = false; });
            } else if (e.target.checked && filterAll) {
                filterAll.checked = false;
            }

            const activeCategories = Array.from(filterCheckboxes)
                                          .filter(cb => cb.checked && cb.value !== 'all')
                                          .map(cb => cb.value);

            let visibleCount = 0;

            products.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (activeCategories.length === 0 || (filterAll && filterAll.checked)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    if (activeCategories.includes(cardCat)) {
                        card.style.display = 'block';
                        visibleCount++;
                    } else {
                        card.style.display = 'none';
                    }
                }
            });

            if (visibleCount === 0) {
                noResultsMsg.style.display = 'block';
            } else {
                noResultsMsg.style.display = 'none';
            }
        });
    });
}

// =========================================
// 6. ІНШІ СТАРІ ФУНКЦІЇ (Форми, Кольори, Toasts)
// =========================================
function initForms() {
    // ФІКС: Залишили тільки профіль і чекаут. Логін і реєстрацію тепер обробляє Firebase!
    const forms = ['profileForm', 'checkoutForm']; 
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let msg = 'Успішно збережено!';
                if (formId === 'checkoutForm') {
                    msg = 'Замовлення оформлено! Дякуємо.';
                    localStorage.removeItem('cart'); 
                }
                window.showToast(msg);
                if (formId !== 'profileForm') {
                    setTimeout(() => window.location.href = formId === 'checkoutForm' ? 'index.html' : 'profile.html', 1500);
                }
            });
        }
    });

    // Логіку кнопки виходу видалено звідси, оскільки вона тепер у firebase-auth.js
}

function initColorPicker() {
    const colorCircles = document.querySelectorAll('.color-circle');
    const webglContainer = document.querySelector('.viewer-wrapper');
    if (colorCircles.length === 0) return;

    colorCircles.forEach(circle => {
        circle.addEventListener('click', function() {
            colorCircles.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            const bgColor = this.style.backgroundColor;
            window.showToast(`Колір змінено на: ${this.title}`);
            if (webglContainer) webglContainer.style.boxShadow = `inset 0 0 40px ${bgColor}`;
        });
    });
}

function simulate3DLoading() {
    const loader = document.getElementById('model-loader');
    if (!loader) return;
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1500);
}

// ЗМІНЕНО: Тепер ця функція глобальна, щоб її бачив Firebase
window.showToast = function(message) { 
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

window.toggleFullScreen = function() {
    const viewer = document.querySelector('.viewer-wrapper');
    if (!document.fullscreenElement) {
        viewer.requestFullscreen().catch(err => window.showToast(`Помилка екрану: ${err.message}`));
    } else {
        document.exitFullscreen();
    }
}

window.switchTab = function(tabName) {
    const settingsBlock = document.getElementById('profileSettings');
    const ordersBlock = document.getElementById('profileOrders');
    if(settingsBlock) settingsBlock.style.display = 'none';
    if(ordersBlock) ordersBlock.style.display = 'none';
    const links = document.querySelectorAll('.profile-nav a');
    links.forEach(link => link.classList.remove('active'));

    if (tabName === 'settings') {
        if(settingsBlock) settingsBlock.style.display = 'block';
        if(links[0]) links[0].classList.add('active');
    } else if (tabName === 'orders' || tabName === 'wishlist') {
        if(ordersBlock) ordersBlock.style.display = 'block';
        if (tabName === 'orders' && links[1]) links[1].classList.add('active');
        if (tabName === 'wishlist' && links[2]) links[2].classList.add('active');
    }
}

// =========================================
// 7. МОБІЛЬНЕ БУРГЕР-МЕНЮ
// =========================================
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            // Додаємо або забираємо клас 'open'
            nav.classList.toggle('open');
            
            // Крута фішка: міняємо іконку бургера (☰) на хрестик (✕)
            if (nav.classList.contains('open')) {
                mobileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
            } else {
                mobileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>`;
            }
        });
    }
}

// =========================================
// 8. ДИНАМІЧНИЙ CHECKOUT (Оформлення)
// =========================================
function renderCheckoutPage() {
    const checkoutSidebar = document.querySelector('.checkout-sidebar');
    if (!checkoutSidebar || !window.location.pathname.includes('checkout.html')) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
    
    let orderHtml = `<h2 style="color: var(--primary-color); margin-bottom: 20px;">Ваше замовлення</h2>`;
    
    if (cart.length === 0) {
        checkoutSidebar.innerHTML = orderHtml + `<p style="color: var(--text-muted);">Ваш кошик порожній.</p>`;
        return;
    }

    cart.forEach(item => {
        let qty = item.quantity || 1;
        let itemTotal = item.price * qty;
        totalPrice += itemTotal;
        
        orderHtml += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); padding-bottom: 15px;">
                <div>
                    <strong style="color: var(--text-color);">${item.name}</strong> x ${qty}
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Колір: ${item.color}</p>
                </div>
                <strong style="color: var(--text-color);">${itemTotal.toLocaleString()} ₴</strong>
            </div>
        `;
    });
    
    orderHtml += `
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px; color: var(--text-muted);">
            <span>Доставка:</span>
            <span>За тарифами перевізника</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1.3rem; font-weight: bold; color: var(--accent-color); margin-bottom: 25px;">
            <span>Разом:</span>
            <span>${totalPrice.toLocaleString()} ₴</span>
        </div>
    `;
    
    checkoutSidebar.innerHTML = orderHtml;
}

// =========================================
// 9. ДИНАМІЧНА СТОРІНКА ТОВАРУ (Міні-база)
// =========================================
function initDynamicItem() {
    if (!window.location.pathname.includes('item.html')) return;

    // Наша база товарів
    const productsDB = {
        "sofa_oslo": { name: 'Диван "Осло"', price: 12500, desc: 'Сучасний мінімалістичний диван. Ідеально підходить для вітальні.' },
        "chair_loft": { name: 'Крісло "Лофт"', price: 4200, desc: 'Стильне крісло з металевим каркасом для вашого інтер\'єру.' },
        "table_scandi": { name: 'Стіл "Сканді"', price: 6800, desc: 'Дерев\'яний стіл у скандинавському стилі. Надійний та красивий.' },
        "bed_hygge": { name: 'Ліжко "Х\'юге"', price: 15000, desc: 'Комфортне двоспальне ліжко для міцного сну.' }
    };

    // Читаємо ID з URL (наприклад: item.html?id=chair_loft)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id && productsDB[id]) {
        const product = productsDB[id];
        document.querySelector('.item-details h1').innerText = product.name;
        document.querySelector('.item-details .price').innerText = product.price.toLocaleString() + ' ₴';
        document.querySelector('.item-details p').innerText = product.desc;
        document.querySelector('.breadcrumbs').innerHTML = `<a href="index.html">Головна</a> / <a href="catalog.html">Каталог</a> / ${product.name}`;
    }
}