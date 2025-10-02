// js/home.js

// === IMPORT getCurrentUser DAN clearCurrentUser DARI localStorageManager ===
import { getCurrentUser, clearCurrentUser } from './localStorageManager.js';
// === AKHIR IMPOR ===

// let currentUser = null; // HAPUS INI, kita akan mengambil dari localStorage

// Check login status on page load
window.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    checkLoginStatus();
    initializeEventListeners();
});

// Load current user from localStorageManager
function loadCurrentUser() {
    // === GUNAKAN getCurrentUser DARI localStorageManager ===
    currentUser = getCurrentUser(); 
    // === AKHIR PERUBAHAN ===

    // HAPUS BARIS INI KARENA TIDAK DIGUNAKAN LAGI:
    // const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    // const userName = sessionStorage.getItem('userName');
    
    // if (isLoggedIn && userName) {
    //     currentUser = {
    //         name: userName
    //     };
    // } else {
    //     currentUser = null;
    // }
}

// Check and update login status
function checkLoginStatus() {
    updateAuthUI();
}

// Update Authentication UI based on login status
function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');
    
    console.log('updateAuthUI called - currentUser:', currentUser); // Debug
    
    if (currentUser) {
        // User is logged in
        console.log('User logged in, showing user menu'); // Debug
        if (authButtons) {
            authButtons.classList.add('hidden');
        }
        if (userMenu) {
            userMenu.classList.remove('hidden');
        }
        if (userGreeting) {
            // === PASTIKAN MENGAMBIL fullname DARI OBJECT USER ===
            userGreeting.textContent = `Halo, ${currentUser.fullname}!`;
            // === AKHIR PERUBAHAN ===
        }
        
        // Update mobile menu
        // === PASTIKAN MENGAMBIL fullname DARI OBJECT USER ===
        updateMobileMenu(currentUser.fullname);
        // === AKHIR PERUBAHAN ===
    } else {
        // User is not logged in
        console.log('User not logged in, showing auth buttons'); // Debug
        if (authButtons) {
            authButtons.classList.remove('hidden');
        }
        if (userMenu) {
            userMenu.classList.add('hidden');
        }
        
        // Reset mobile menu
        resetMobileMenu();
    }
}

// Update mobile menu content for logged in user
function updateMobileMenu(userName) {
    const mobileAuth = document.getElementById('mobileAuth');
    if (mobileAuth) { // Tambahkan pengecekan null untuk mobileAuth
        mobileAuth.innerHTML = `
            <div style="text-align: center; color: white; font-weight: 600; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 12px; margin-bottom: 10px;">
                Halo, ${userName}!
            </div>
            <button class="payment-history" onclick="handlePaymentHistory()" style="width: 100%;">Riwayat Pembayaran</button>
            <button class="profile-btn" onclick="handleProfile()" style="width: 100%; justify-content: center;">
                <i class="fas fa-user"></i> <span style="margin-left: 8px;">Profil</span>
            </button>
            <button class="logout-btn" onclick="handleLogout()" style="width: 100%;">Keluar</button>
        `;
    }
}

// Reset mobile menu content for logged out user
function resetMobileMenu() {
    const mobileAuth = document.getElementById('mobileAuth');
    if (mobileAuth) { // Tambahkan pengecekan null untuk mobileAuth
        mobileAuth.innerHTML = `
            <a href="loginSignUp.html" class="login-btn" style="width: 100%; text-align: center; display: block;">Masuk</a>
            <a href="loginSignUp.html#signup" class="signup-btn" style="width: 100%; text-align: center; display: block;">Daftar</a>
        `;
    }
}

// Contact form handler (gunakan versi Anda)
// Pastikan isValidPhone diimpor jika tidak ada di home.js
// Untuk saat ini, kita akan asumsikan isValidPhone ada atau diimpor
// Jika isValidPhone hanya ada di loginSignUp.js dan tidak diimpor ke home.js,
// maka Anda perlu mengimpornya juga di home.js:
// import { isValidPhone } from './loginSignUp.js';
// Atau membuat versi sendiri di home.js jika itu yang dimaksud tim Anda.
// Saya akan mempertahankan yang ada, dengan catatan bahwa `isValidPhone` perlu didefinisikan atau diimpor.
function handleContactForm() {
    const contactForm = document.getElementById('contact');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');
            
            // Get form values
            const inputs = this.querySelectorAll('input, textarea');
            const name = inputs[0].value.trim();
            const phone = inputs[1].value.trim();
            const subject = inputs[2].value.trim();
            const message = inputs[3].value.trim();
            
            // Create or get message element
            let messageEl = document.getElementById('contactFormMessage');
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.id = 'contactFormMessage';
                messageEl.className = 'form-message';
                this.appendChild(messageEl);
            }
            
            // Validation
            if (!name || !phone || !subject || !message) {
                messageEl.textContent = 'Harap isi semua field';
                messageEl.className = 'form-message error';
                return;
            }

            // --- Jika isValidPhone tidak diimpor atau didefinisikan di home.js, ini akan error ---
            // Solusi: impor isValidPhone dari loginSignUp.js (jika ingin berbagi fungsi)
            // ATAU definisikan isValidPhone di home.js
            // Saya akan anggap Anda akan mengimpornya atau sudah ada definisinya di home.js
            if (typeof isValidPhone !== 'function' || !isValidPhone(phone)) {
                 messageEl.textContent = 'Nomor handphone harus dimulai dengan 08 dan terdiri dari 10-16 digit';
                 messageEl.className = 'form-message error';
                 return;
            }
            // --- Akhir catatan isValidPhone ---
            
            // Success
            messageEl.textContent = 'Pesan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.';
            messageEl.className = 'form-message success';
            contactForm.reset();

        });
    }
}


// Logout function
function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        // Clear user data
        // === GUNAKAN clearCurrentUser DARI localStorageManager ===
        clearCurrentUser(); // Hapus current user dari localStorage
        currentUser = null; // Set variabel lokal juga ke null
        // HAPUS BARIS INI:
        // sessionStorage.removeItem('isLoggedIn');
        // sessionStorage.removeItem('userName');
        // === AKHIR PERUBAHAN ===
        
        // Update UI
        updateAuthUI();
        closeMobileMenu();
        
        alert('Anda telah berhasil keluar.');
        
        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Close mobile menu
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
}

// Initialize all event listeners
function initializeEventListeners() {
    // ... (event listeners lainnya tetap sama) ...
    
    // Contact form handler (yang ini sudah ada di home.js, pastikan tidak ada duplikasi)
    // Jika Anda punya form dengan ID 'contactForm' di home.html,
    // maka event listener ini akan mengambil alih fungsi handleContactForm di atas.
    // Jika keduanya ingin dipakai, pastikan ID form berbeda atau gabungkan logikanya.
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.');
            this.reset();
        });
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// === CATATAN: Jika isValidPhone diperlukan di home.js dan hanya ada di loginSignUp.js, Anda perlu mengimpornya:
// import { isValidPhone } from './loginSignUp.js';
// Atau salin fungsi isValidPhone ke home.js jika itu lebih sesuai dengan arsitektur Anda.
// Jika tidak, handleContactForm akan error.
// Untuk saat ini, saya akan tambahkan definisinya di sini untuk memastikan kode berfungsi.
// Anda bisa memutuskan untuk mengimpor atau memindahkannya nanti.
function isValidPhone(phone) {
    return /^08\d{8,14}$/.test(phone);
}
// === AKHIR CATATAN ===