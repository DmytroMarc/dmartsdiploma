import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, GithubAuthProvider, signInWithPopup, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ==========================================
// 1. АВТОРИЗАЦІЯ (Email)
// ==========================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            window.showToast("Створення акаунту...");
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            
            await updateProfile(userCred.user, { displayName: name });
            await setDoc(doc(db, "users", userCred.user.uid), { fullName: name, email: email });
            
            // ЗБЕРІГАЄМО ПАМ'ЯТЬ ДЛЯ АНТИ-ФЛІКЕРУ
            localStorage.setItem('isAuth', 'true');
            
            window.showToast("Реєстрація успішна!");
            setTimeout(() => window.location.href = "profile.html", 1500);
        } catch (error) { window.showToast("Помилка: " + error.message); }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            window.showToast("Перевірка даних...");
            await signInWithEmailAndPassword(auth, document.getElementById('log-email').value, document.getElementById('log-password').value);
            
            // ЗБЕРІГАЄМО ПАМ'ЯТЬ ДЛЯ АНТИ-ФЛІКЕРУ
            localStorage.setItem('isAuth', 'true');
            
            window.showToast("Успішний вхід!");
            setTimeout(() => window.location.href = "profile.html", 1500);
        } catch (error) { window.showToast("Невірний E-mail або пароль!"); }
    });
}

// ==========================================
// 2. GOOGLE ТА GITHUB
// ==========================================
const socialBtns = document.querySelectorAll('.btn-social');
if(socialBtns.length > 0) {
    socialBtns[0].addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await setDoc(doc(db, "users", result.user.uid), { fullName: result.user.displayName, email: result.user.email }, { merge: true });
            
            localStorage.setItem('isAuth', 'true'); // АНТИ-ФЛІКЕР
            window.location.href = "profile.html";
        } catch(e) { window.showToast("Помилка Google: " + e.message); }
    });

    if(socialBtns[1]) {
        socialBtns[1].addEventListener('click', async () => {
            try {
                const result = await signInWithPopup(auth, githubProvider);
                await setDoc(doc(db, "users", result.user.uid), { fullName: result.user.displayName || "Користувач GitHub", email: result.user.email }, { merge: true });
                
                localStorage.setItem('isAuth', 'true'); // АНТИ-ФЛІКЕР
                window.location.href = "profile.html";
            } catch(e) { window.showToast("Помилка GitHub: " + e.message); }
        });
    }
}

// ==========================================
// 3. ГЛОБАЛЬНИЙ КОНТРОЛЬ СТАНУ
// ==========================================
onAuthStateChanged(auth, async (user) => {
    const isProfilePage = window.location.pathname.includes('profile.html');
    const isCheckoutPage = window.location.pathname.includes('checkout.html');
    const isAuthPage = window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html');

    if (user) {
        // Підтверджуємо, що користувач справді тут
        localStorage.setItem('isAuth', 'true');
        document.documentElement.classList.add('is-logged-in');
        document.documentElement.classList.remove('is-logged-out');

        if (isAuthPage) window.location.href = 'profile.html';

        if (isProfilePage) {
            let finalName = user.displayName || "Користувач";
            const userEmail = user.email || "";

            try {
                const docSnap = await getDoc(doc(db, "users", user.uid));
                if (docSnap.exists() && docSnap.data().fullName) {
                    finalName = docSnap.data().fullName;
                }
            } catch (e) { console.error("Помилка БД:", e); }

            let initials = "КО";
            let nameParts = finalName.trim().split(/\s+/); 
            if (nameParts.length >= 2) {
                initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
            } else if (nameParts.length === 1 && nameParts[0].length > 1) {
                initials = nameParts[0].substring(0, 2).toUpperCase();
            }

            document.querySelectorAll('.profile-name-display').forEach(el => el.innerText = finalName);
            document.querySelectorAll('.profile-email-display').forEach(el => el.innerText = userEmail);
            document.querySelectorAll('.profile-avatar').forEach(el => el.innerText = initials);

            const fnameInput = document.getElementById('prof-fname');
            const lnameInput = document.getElementById('prof-lname');
            const emailInput = document.getElementById('prof-email');

            if(fnameInput) fnameInput.value = nameParts[0] || '';
            if(lnameInput) lnameInput.value = nameParts.slice(1).join(' ') || '';
            if(emailInput) emailInput.value = userEmail;
        }
    } else {
        // Користувач вийшов або його вибило
        localStorage.removeItem('isAuth');
        document.documentElement.classList.add('is-logged-out');
        document.documentElement.classList.remove('is-logged-in');

        if (isProfilePage || isCheckoutPage) {
            window.location.href = 'login.html';
        }
    }
});

// Кнопка Виходу
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Видаляємо пам'ять миттєво, ще до Firebase
        localStorage.removeItem('isAuth');
        document.documentElement.classList.add('is-logged-out');
        document.documentElement.classList.remove('is-logged-in');

        signOut(auth).then(() => {
            window.showToast("Вихід з системи...");
            setTimeout(() => window.location.href = "index.html", 1000);
        });
    });
}