//МИТТЄВИЙ АНТИ-ФЛІКЕР КНОПОК 
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
    initDynamicItem(); 
});

window.addEventListener('storage', (e) => {
    if (e.key === 'cart') {
        updateCartCounter();
        if (window.location.pathname.includes('cart')) {
            renderCartPage();
        }
        if (window.location.pathname.includes('checkout')) {
            renderCheckoutPage();
        }
    }
});

// 1. ТЕМНА ТЕМА (Dark Mode)

function initThemeToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle';
    toggleBtn.title = 'Перемкнути тему';
    
    const nav = document.querySelector('header nav');
    if (nav) nav.appendChild(toggleBtn);

    const iconSun = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"/></svg>`;
    const iconMoon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`;

    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        toggleBtn.innerHTML = iconSun;
    } else {
        toggleBtn.innerHTML = iconMoon;
    }

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

// 2. РОЗУМНА НАВІГАЦІЯ (Smart Nav)

function initSmartNav() {
    let currentPath = window.location.pathname.toLowerCase();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        link.removeAttribute('style');
        const linkHref = link.getAttribute('href');
        
        const baseHref = linkHref.replace('.html', '');
        if ((currentPath.includes(linkHref) || currentPath.includes(baseHref)) && !link.classList.contains('btn-login') && baseHref !== '') {
            link.classList.add('active-link');
        }
    });
}

// 3. ПОКАЗАТИ/ПРИХОВАТИ ПАРОЛЬ

function initPasswordToggles() {
    const passInputs = document.querySelectorAll('input[type="password"]');
    const iconEyeOpen = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>`;
    const iconEyeClosed = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-144.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q146 0 266 81.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-224q-37 11-73 17.5T480-200q-146 0-266-81.5T40-500q21-53 58-103.5T176-701L56-822l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 144.5 160.5T480-280q26 0 51-3t49-10l-58-58q-14 5-28.5 7t-33.5 2q-75 0-127.5-52.5T280-522q0-16 2-33.5t7-28.5l-67-67Zm258 124Z"/></svg>`;

    passInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'password-wrapper';
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);

        const icon = document.createElement('span');
        icon.className = 'toggle-password';
        icon.innerHTML = iconEyeOpen; 
        wrapper.appendChild(icon);

        icon.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = iconEyeClosed; 
            } else {
                input.type = 'password';
                icon.innerHTML = iconEyeOpen;
            }
        });
    });
}

// 4. СИСТЕМА КОШИКА (+/- та Local Storage)

function initCartSystem() {
    updateCartCounter();

    const addToCartBtn = document.querySelector('.item-details .btn-primary');
    
    if (addToCartBtn && window.location.pathname.includes('item')) {

        addToCartBtn.replaceWith(addToCartBtn.cloneNode(true));
        const newAddToCartBtn = document.querySelector('.item-details .btn-primary');
        
        newAddToCartBtn.addEventListener('click', () => {
            const activeColor = document.querySelector('.color-circle.active');
            const colorName = activeColor ? activeColor.getAttribute('title') : 'Стандартний';
            const colorHex = activeColor ? activeColor.style.backgroundColor : '#3b3554';

            const titleEl = document.querySelector('.item-details h1');
            const priceEl = document.querySelector('.item-details .price');
            
            const rawTitle = titleEl ? titleEl.innerText : 'Товар';
            const rawPrice = priceEl ? parseInt(priceEl.innerText.replace(/\D/g, ''), 10) : 0;

            const item = {
                id: 'item_' + rawTitle.replace(/\s+/g, '_') + '_' + colorName.replace(/\s+/g, '_'),
                name: rawTitle,
                price: rawPrice,
                color: colorName,
                colorHex: colorHex,
                quantity: 1 
            };

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
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

    if (window.location.pathname.includes('cart')) {
        renderCartPage();
    }
}

function updateCartCounter() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
    
    const navLinks = document.querySelectorAll('header nav a');
    navLinks.forEach(link => {
        if (link.innerHTML.includes('Кошик')) {

            link.innerHTML = totalItems > 0 ? `🛒 Кошик (${totalItems})` : `🛒 Кошик`;
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
        let qty = parseInt(item.quantity) || 1;
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
    if (!cart[index]) return;
    
    let currentQty = parseInt(cart[index].quantity) || 1;
    currentQty += delta;

    if (currentQty <= 0) {
        cart.splice(index, 1);
        window.showToast('Товар видалено з кошика');
    } else {
        cart[index].quantity = currentQty;
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

// 5. ФІЛЬТРИ В КАТАЛОЗІ (Живий пошук)

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

// 6. ІНШІ СТАРІ ФУНКЦІЇ ТА TOASTS

function initForms() {
    const forms = []; 
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                let msg = 'Замовлення оформлено! Дякуємо.';
                localStorage.removeItem('cart'); 
                window.showToast(msg);
                setTimeout(() => window.location.href = 'index.html', 1500);
            });
        }
    });
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

window.showToast = function(message) { 
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    if (container.children.length >= 3) {
        container.firstChild.classList.remove('show');
        setTimeout(() => {
            if(container.firstChild) container.firstChild.remove();
        }, 400);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    
    void toast.offsetWidth;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

window.openFullscreen = function() {
    const container = document.getElementById('model-container');
    if (!container) return;

    if (!document.fullscreenElement) {
        // Розгортаємо
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) { 
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) { 
            container.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
};

window.switchTab = function(event, tabName) {
    if (event) event.preventDefault();
    
    const blocks = {
        'settings': document.getElementById('profileSettings'),
        'security': document.getElementById('profileSecurity'),
        'orders': document.getElementById('profileOrders'),
        'wishlist': document.getElementById('profileWishlist')
    };
    
    Object.values(blocks).forEach(block => {
        if (block) block.style.display = 'none';
    });
    
    const links = document.querySelectorAll('.profile-nav a:not(.danger)');
    links.forEach(link => link.classList.remove('active'));


    if (blocks[tabName]) {
        blocks[tabName].style.display = 'block';
        if (event && event.currentTarget) {
            event.currentTarget.classList.add('active');
        }
    }
}


// 7. МОБІЛЬНЕ БУРГЕР-МЕНЮ

function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');

    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('open');
            if (nav.classList.contains('open')) {
                mobileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
            } else {
                mobileBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32" fill="currentColor"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>`;
            }
        });
    }
}


// 8. ДИНАМІЧНИЙ CHECKOUT (Оформлення)

function renderCheckoutPage() {
    const checkoutSidebar = document.querySelector('.checkout-sidebar');
    // Фікс Firebase URL: замість 'checkout.html' просто 'checkout'
    if (!checkoutSidebar || !window.location.pathname.includes('checkout')) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;
    
    let orderHtml = `<h2 style="color: var(--primary-color); margin-bottom: 20px;">Ваше замовлення</h2>`;
    
    if (cart.length === 0) {
        checkoutSidebar.innerHTML = orderHtml + `<p style="color: var(--text-muted);">Ваш кошик порожній.</p>`;
        return;
    }

    cart.forEach(item => {
        let qty = parseInt(item.quantity) || 1;
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

// 9. ДИНАМІЧНА СТОРІНКА ТОВАРУ (Міні-база з брендами)

function initDynamicItem() {
    if (!window.location.pathname.includes('item')) return;

    const productsDB = {
       'soft-loft-set': {
            name: 'Софт-Лофт Комплект',
            price: 20000,
            brand: 'IKEA x Wayfair',
            modelPath: 'models/sofa_set_01.glb',
            description: 'Ексклюзивний набір меблів у стилі лофт: великий кутовий диван, крісло та дизайнерський столик. Ідеальне рішення для просторої вітальні.'
        },
        'bed_next': {
            name: 'Ліжко "Некст"',
            price: 10000,
            brand: 'JYSK',
            modelPath: 'models/bed.glb',
            description: 'Сучасне та мінімалістичне ліжко, яке ідеально впишеться у будь-який інтер\'єр. Високоякісна тканина та ергономічна спинка гарантують максимальний комфорт після важкого дня.'
        },
        'bed_mc': {
            name: 'Ліжко "Майнкрафт"',
            price: 6000,
            brand: 'Muji',
            modelPath: 'models/bed_minecraft.glb',
            description: 'Легендарне квадратне ліжко прямісінько з кубічного світу! Забезпечує 100% захист від фантомів, якщо поспати на ньому вночі. Ідеальний вибір для справжніх геймерів (але трохи жорсткуватий).'
        },
        'chair_lounge': {
            name: 'Крісло "Релакс"',
            price: 5000,
            brand: 'BoConcept',
            modelPath: 'models/lounge_chair.glb',
            description: 'Неймовірно м\'яке лаунж-крісло для вашої зони відпочинку. Плавні лінії, глибока посадка та приємна на дотик текстура роблять його ідеальним місцем для читання книг чи ранкової кави.'
        },
        'chair_gaming': {
            name: 'Крісло "Кібер"',
            price: 5500,
            brand: 'Herman Miller',
            modelPath: 'models/gaming_chair.glb',
            description: 'Професійне геймерське крісло з підтримкою попереку та шиї. Регульована спинка дозволить вам проводити за комп\'ютером години без найменшої втоми.'
        },
        'table_folding': {
            name: 'Стіл "Орігамі"',
            price: 5400,
            brand: 'West Elm',
            modelPath: 'models/folding_table.glb',
            description: 'Практичний розкладний стіл у сучасному стилі. Компактний у складеному вигляді, він легко перетворюється на повноцінне робоче або обіднє місце, заощаджуючи простір у кімнаті.'
        },
        'table_billiard': {
            name: 'Більярд "Профі"',
            price: 20000,
            brand: 'Ashley Furniture',
            modelPath: 'models/billiard-table.glb',
            description: 'Елітний більярдний стіл класичного дизайну. Сукно преміум-якості та масивні ніжки створять атмосферу справжнього джентльменського клубу у вашому домі.'
        },
        'tron_yanukovich': {
            name: 'Трон Януковича 👑',
            price: 12000000,
            brand: 'Astanavites',
            modelPath: 'models/golden_toilet.glb',
            description: 'Легендарний золотий унітаз із Межигір\'я. Символ абсолютного несмаку, неземної розкоші та епохи "Астанавітєсь!". Має вбудовану систему автоматичного підрахунку золотих батонів, підігрів чистим популізмом та захист від правосуддя. УВАГА: Ростовська прописка та страуси в комплект не входять!'
        }
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id && productsDB[id]) {
        const product = productsDB[id];
        
        document.querySelector('.item-details h1').innerText = product.name;
        document.querySelector('.item-details .price').innerText = product.price.toLocaleString() + ' ₴';
        document.querySelector('.item-details p').innerText = product.description; 
        
        const brandElement = document.querySelector('.item-details .product-brand');
        if (brandElement) {
            brandElement.innerText = `Бренд: ${product.brand}`;
        }

        document.querySelector('.breadcrumbs').innerHTML = `<a href="/">Головна</a> / <a href="/catalog">Каталог</a> / ${product.name}`;

        const imagePlaceholder = document.querySelector('.product-image-placeholder') || document.querySelector('.viewer-wrapper');
        
        if (imagePlaceholder && product.modelPath) {
            imagePlaceholder.style.position = 'relative';
            imagePlaceholder.id = 'model-container'; 
            
            imagePlaceholder.style.border = '2px solid var(--border-color)';
            imagePlaceholder.style.borderRadius = '12px';
            imagePlaceholder.style.overflow = 'hidden';
            imagePlaceholder.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            
            imagePlaceholder.innerHTML = `
                <style>
                    #model-container .model-hints { 
                        display: none !important; 
                    }
                    #model-container:fullscreen .model-hints { 
                        display: block !important; 
                    }
                    #model-container:-webkit-full-screen .model-hints { 
                        display: block !important; 
                    }
                </style>

                <model-viewer 
                    id="fullscreen-viewer"
                    src="${product.modelPath}" 
                    alt="${product.name}" 
                    auto-rotate 
                    camera-controls 
                    bounds="tight"
                    max-camera-orbit="auto auto 300%"
                    camera-orbit="0deg 75deg 140%" 
                    shadow-intensity="1.2" 
                    exposure="1"
                    style="width: 100%; height: 100%; min-height: 600px; background-color: transparent; outline: none; border: none;">
                </model-viewer>
                
                <div class="model-hints" style="pointer-events: none;">
                    <div><span>🖱️</span> Ліва кнопка: Обертати</div>
                    <div><span>🖱️</span> Права кнопка: Панорамувати (Рухати)</div>
                    <div><span>⚙️</span> Коліщатко: Наближати</div>
                </div>

                <div style="position: absolute; bottom: 20px; right: 20px; z-index: 10;">
                    <button onclick="openFullscreen()" style="padding: 10px 15px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-family: inherit; backdrop-filter: blur(5px);">
                        ⛶ На весь екран
                    </button>
                </div>
            `;
        }
    }
}