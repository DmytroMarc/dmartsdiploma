import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updateProfile, updateEmail, updatePassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); 

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const notify = (msg) => {
    if (typeof window.showToast === 'function') window.showToast(msg);
    else alert(msg);
};

window.addToCartGlobal = function(name, price, id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = { id: id + '_Стандартний', name: name, price: parseInt(price), color: 'Стандартний', colorHex: '#3b3554', quantity: 1 };
    const existing = cart.findIndex(i => i.id === item.id);
    if (existing > -1) cart[existing].quantity += 1;
    else cart.push(item);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage')); 
    notify('🛒 Товар додано в кошик!');
};

window.toggleWishlist = async function(id, name, price) {
    const user = auth.currentUser;
    if (!user) { 
        notify("Увійдіть в акаунт, щоб зберігати моделі!"); 
        return; 
    }
    try {
        notify("Зберігаємо...");
        await setDoc(doc(db, "users", user.uid), {
            wishlist: arrayUnion({ id: id, name: name, price: parseInt(price) })
        }, { merge: true });
        notify("❤️ Додано в обране!");
    } catch(e) { 
        console.error(e);
        notify("Помилка збереження."); 
    }
};

function translateAuthError(error) {
    switch (error.code) {
        case 'auth/email-already-in-use': return 'Цей E-mail вже зареєстровано.';
        case 'auth/invalid-email': return 'Невірний формат E-mail.';
        case 'auth/weak-password': return 'Пароль занадто слабкий (мінімум 6 символів).';
        case 'auth/wrong-password': 
        case 'auth/user-not-found':
        case 'auth/invalid-credential': return 'Невірний E-mail або пароль.';
        case 'auth/requires-recent-login': return 'Для безпеки: вийдіть і зайдіть в акаунт знову, щоб змінити це.';
        case 'auth/popup-closed-by-user': return 'Ви закрили вікно авторизації.';
        default: return 'Помилка: ' + error.message;
    }
}

// 1. РЕЄСТРАЦІЯ
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            notify("Створення акаунту...");
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCred.user, { displayName: name });
            
            await setDoc(doc(db, "users", userCred.user.uid), {
                fullName: name, email: email, avatar: ""
            });
            
            localStorage.setItem('isAuth', 'true');
            notify("Реєстрація успішна!");
            setTimeout(() => window.location.href = "profile.html", 1500);
        } catch (error) { notify(translateAuthError(error)); }
    });
}

// 2. ВХІД
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            notify("Вхід...");
            await signInWithEmailAndPassword(auth, document.getElementById('log-email').value, document.getElementById('log-password').value);
            localStorage.setItem('isAuth', 'true');
            window.location.href = "profile.html";
        } catch (error) { notify(translateAuthError(error)); }
    });
}

const forgotPassLink = document.getElementById('forgot-password-link');
if (forgotPassLink) {
    forgotPassLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('log-email').value;
        if (!emailInput) { notify("Введіть E-mail у поле вище, щоб скинути пароль."); return; }
        try {
            await sendPasswordResetEmail(auth, emailInput);
            notify("Лист для відновлення пароля відправлено!");
        } catch (error) { notify(translateAuthError(error)); }
    });
}

// 3. SOCIAL LOGIN 
const socialBtns = document.querySelectorAll('.btn-social');
if(socialBtns.length > 0) {
    socialBtns[0].addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            notify("Відкриваємо Google...");
            const result = await signInWithPopup(auth, googleProvider);
            await setDoc(doc(db, "users", result.user.uid), {
                fullName: result.user.displayName || "Користувач",
                email: result.user.email || "",
                avatar: result.user.photoURL || ""
            }, { merge: true });

            localStorage.setItem('isAuth', 'true');
            window.location.href = "profile.html";
        } catch(err) { notify(translateAuthError(err)); }
    });

    if(socialBtns[1]) {
        socialBtns[1].addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                notify("Відкриваємо GitHub...");
                const result = await signInWithPopup(auth, githubProvider);
                await setDoc(doc(db, "users", result.user.uid), {
                    fullName: result.user.displayName || result._tokenResponse?.screenName || "Користувач GitHub",
                    email: result.user.email || "",
                    avatar: result.user.photoURL || ""
                }, { merge: true });

                localStorage.setItem('isAuth', 'true');
                window.location.href = "profile.html";
            } catch(err) { notify(translateAuthError(err)); }
        });
    }
}

// 4. СТАН ПРОФІЛЮ ТА РЕДАГУВАННЯ
onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname.toLowerCase();
    const isProfilePage = currentPath.includes('profile');
    const isCheckoutPage = currentPath.includes('checkout');
    const isItemPage = currentPath.includes('item');
    const isAuthPage = currentPath.includes('login') || currentPath.includes('register');

    if (user) {
        localStorage.setItem('isAuth', 'true');
        document.documentElement.classList.add('is-logged-in');
        document.documentElement.classList.remove('is-logged-out');

        if (isAuthPage) { window.location.href = 'profile.html'; return; }

        if (isCheckoutPage) {
            const checkForm = document.getElementById('checkoutForm');
            if (checkForm) {
                checkForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    
                    if (cart.length > 0) {
                        try {
                            notify("Оформлюємо замовлення...");
                            await setDoc(doc(db, "users", user.uid), {
                                orders: arrayUnion({
                                    items: cart,
                                    date: new Date().toLocaleDateString(),
                                    total: cart.reduce((s, i) => s + (i.price * i.quantity), 0)
                                })
                            }, { merge: true });

                            localStorage.removeItem('cart');
                            window.dispatchEvent(new Event('storage')); 
                            
                            notify("Замовлення успішно оформлено!");
                            setTimeout(() => window.location.href = "profile.html", 1500);
                        } catch(e) { 
                            console.error("Помилка", e); 
                            notify("Сталася помилка при оформленні.");
                        }
                    } else {
                        notify("Ваш кошик порожній!");
                    }
                };
            }
        }

        if (isItemPage) {
            const wishBtn = document.getElementById('wishlist-btn');
            if(wishBtn) {
                wishBtn.onclick = () => {
                    const title = document.querySelector('.item-details h1').innerText;
                    const price = parseInt(document.querySelector('.item-details .price').innerText.replace(/\D/g, ''));
                    const id = new URLSearchParams(window.location.search).get('id');
                    window.toggleWishlist(id, title, price);
                };
            }
        }

        if (isProfilePage) {
            let dbData = {};
            try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists()) dbData = docSnap.data();
            } catch(e) { console.warn("Не вдалося завантажити БД", e); }

            const displayName = dbData.fullName || user.displayName || user.email?.split('@')[0] || "Користувач";
            const email = user.email || "E-mail приховано";
            const photoURL = dbData.avatar || user.photoURL;

            document.querySelectorAll('.profile-name-display').forEach(el => el.innerText = displayName);
            document.querySelectorAll('.profile-email-display').forEach(el => el.innerText = email);

            let nameParts = displayName.trim().split(/\s+/); 
            if(document.getElementById('prof-fname')) document.getElementById('prof-fname').value = nameParts[0] || '';
            if(document.getElementById('prof-lname')) document.getElementById('prof-lname').value = nameParts.slice(1).join(' ') || '';
            if(document.getElementById('prof-new-email')) document.getElementById('prof-new-email').value = user.email || '';

            const avatarPreview = document.getElementById('avatarPreview');
            const avatarInitials = document.getElementById('avatarInitials');
            
            if (photoURL) {
                if (avatarPreview) avatarPreview.style.backgroundImage = `url('${photoURL}')`;
                if (avatarInitials) avatarInitials.style.display = 'none';
            } else {
                let initials = nameParts.length >= 2 ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() : displayName.substring(0, 2).toUpperCase();
                if(avatarInitials) { avatarInitials.innerText = initials; avatarInitials.style.display = 'inline'; }
                if (avatarPreview) avatarPreview.style.backgroundImage = 'none';
            }

            const wishlistContainer = document.getElementById('profileWishlist');
            if (wishlistContainer && dbData.wishlist && dbData.wishlist.length > 0) {
                let html = '<h2>Збережені 3D-моделі</h2><div class="catalog-grid" style="margin-top: 20px; display: grid; gap: 20px;">';
                dbData.wishlist.forEach(item => {
                    html += `
                    <div class="product-card" style="padding: 15px; border-radius: 10px; background: var(--card-bg);">
                        <h3 style="margin-bottom: 5px;">${item.name}</h3>
                        <div class="price" style="margin-bottom: 10px;">${item.price.toLocaleString()} ₴</div>
                        <a href="item.html?id=${item.id}" class="btn-primary" style="display:block; text-align:center; padding: 8px;">Переглянути</a>
                    </div>`;
                });
                html += '</div>';
                wishlistContainer.innerHTML = html;
            } else if (wishlistContainer) {
                wishlistContainer.innerHTML = '<h2>Збережені 3D-моделі</h2><p style="color: var(--text-muted); text-align: center; margin-top: 50px;">Ви ще не додали жодної моделі в улюблені.</p>';
            }

            const ordersContainer = document.getElementById('profileOrders');
            if (ordersContainer && dbData.orders && dbData.orders.length > 0) {
                 let html = '<h2>Історія замовлень</h2>';
                 dbData.orders.slice().reverse().forEach(order => {
                      html += `
                        <div style="background: var(--card-bg); padding:15px; border-radius:10px; margin-bottom:15px; border-left: 4px solid var(--accent-color);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
                                <strong>Дата: ${order.date}</strong>
                                <span style="color:var(--accent-color); font-weight:bold;">${order.total.toLocaleString()} ₴</span>
                            </div>
                            <div style="font-size:0.85rem; color:var(--text-muted);">
                                ${order.items.map(i => `${i.name} x${i.quantity}`).join(',<br> ')}
                            </div>
                        </div>`;
                 });
                 ordersContainer.innerHTML = html;
            } else if (ordersContainer) {
                ordersContainer.innerHTML = '<h2>Історія замовлень</h2><p style="color: var(--text-muted); text-align: center; margin-top: 50px;">У вас поки немає оформлених замовлень.</p><div style="text-align: center; margin-top: 20px;"><a href="catalog.html" class="btn-primary">Перейти до каталогу</a></div>';
            }

            const profileForm = document.getElementById('profileForm');
            if (profileForm) {
                profileForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const newFname = document.getElementById('prof-fname').value.trim();
                    const newLname = document.getElementById('prof-lname').value.trim();
                    const newFullName = `${newFname} ${newLname}`.trim();

                    try {
                        notify("Збереження...");
                        await updateProfile(user, { displayName: newFullName });
                        await setDoc(doc(db, "users", user.uid), { fullName: newFullName }, { merge: true });
                        document.querySelectorAll('.profile-name-display').forEach(el => el.innerText = newFullName);
                        notify("Дані успішно оновлено!");
                    } catch(err) { notify(translateAuthError(err)); }
                };
            }

            // === ЛОГІКА ХОВАННЯ ФОРМ ДЛЯ СОЦМЕРЕЖ ===
            const isSocial = user.providerData.some(provider => 
                provider.providerId === 'google.com' || provider.providerId === 'github.com'
            );

            const emailForm = document.getElementById('emailForm');
            const passwordForm = document.getElementById('passwordForm');
            const securityTab = document.getElementById('profileSecurity');

            if (isSocial) {
                if (emailForm) emailForm.style.display = 'none';
                if (passwordForm) passwordForm.style.display = 'none';
                
                if (securityTab && !document.getElementById('social-msg')) {
                    const msg = document.createElement('p');
                    msg.id = 'social-msg';
                    msg.style.color = 'var(--text-muted)';
                    msg.style.textAlign = 'center';
                    msg.style.marginTop = '30px';
                    msg.innerText = 'Ви авторизовані через соцмережу. Налаштування пошти та пароля керуються на стороні вашого провайдера.';
                    securityTab.appendChild(msg);
                }
            } else {
                if(emailForm) {
                    emailForm.onsubmit = async (e) => {
                        e.preventDefault();
                        const newEmail = document.getElementById('prof-new-email').value;
                        try {
                            await updateEmail(user, newEmail);
                            await setDoc(doc(db, "users", user.uid), { email: newEmail }, { merge: true });
                            document.querySelectorAll('.profile-email-display').forEach(el => el.innerText = newEmail);
                            notify("E-mail успішно змінено!");
                        } catch(err) { notify(translateAuthError(err)); }
                    };
                }

                if(passwordForm) {
                    passwordForm.onsubmit = async (e) => {
                        e.preventDefault();
                        const newPass = document.getElementById('prof-new-pass').value;
                        try {
                            await updatePassword(user, newPass);
                            notify("Пароль успішно змінено!");
                            document.getElementById('prof-new-pass').value = ''; 
                        } catch(err) { notify(translateAuthError(err)); }
                    };
                }
            }
        }
    } else {
        localStorage.removeItem('isAuth');
        document.documentElement.classList.add('is-logged-out');
        document.documentElement.classList.remove('is-logged-in');
        if (isProfilePage || isCheckoutPage) window.location.href = 'login.html';
    }
});

const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        localStorage.removeItem('isAuth');
        document.documentElement.classList.add('is-logged-out');
        document.documentElement.classList.remove('is-logged-in');
        
        try { await signOut(auth); } catch (error) { console.warn("Вихід..."); } 
        finally {
            notify("Вихід з системи...");
            setTimeout(() => window.location.href = "index.html", 500);
        }
    });
}