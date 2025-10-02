import { getCurrentUser, clearCurrentUser } from './localStorageManager.js';
window.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    checkLoginStatus();
    initializeEventListeners();
});

function loadCurrentUser() {
    currentUser = getCurrentUser(); 
}

function checkLoginStatus() {
    updateAuthUI();
}

function updateAuthUI() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');
    
    console.log('updateAuthUI called - currentUser:', currentUser); 
    
    if (currentUser) {
        console.log('User logged in, showing user menu'); 
        if (authButtons) {
            authButtons.classList.add('hidden');
        }
        if (userMenu) {
            userMenu.classList.remove('hidden');
        }
        if (userGreeting) {
            userGreeting.textContent = `Halo, ${currentUser.fullname}!`;
        }
        
        updateMobileMenu(currentUser.fullname);
    } else {
        console.log('User not logged in, showing auth buttons'); 
        if (authButtons) {
            authButtons.classList.remove('hidden');
        }
        if (userMenu) {
            userMenu.classList.add('hidden');
        }        
        resetMobileMenu();
    }
}

function updateMobileMenu(userName) {
    const mobileAuth = document.getElementById('mobileAuth');
    if (mobileAuth) { 
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

function resetMobileMenu() {
    const mobileAuth = document.getElementById('mobileAuth');
    if (mobileAuth) { 
        mobileAuth.innerHTML = `
            <a href="loginSignUp.html" class="login-btn" style="width: 100%; text-align: center; display: block;">Masuk</a>
            <a href="loginSignUp.html#signup" class="signup-btn" style="width: 100%; text-align: center; display: block;">Daftar</a>
        `;
    }
}
function handleContactForm() {
    const contactForm = document.getElementById('contact');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted!');            
            const inputs = this.querySelectorAll('input, textarea');
            const name = inputs[0].value.trim();
            const phone = inputs[1].value.trim();
            const subject = inputs[2].value.trim();
            const message = inputs[3].value.trim();
            
            let messageEl = document.getElementById('contactFormMessage');
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.id = 'contactFormMessage';
                messageEl.className = 'form-message';
                this.appendChild(messageEl);
            }
            
            if (!name || !phone || !subject || !message) {
                messageEl.textContent = 'Harap isi semua field';
                messageEl.className = 'form-message error';
                return;
            }
            if (typeof isValidPhone !== 'function' || !isValidPhone(phone)) {
                 messageEl.textContent = 'Nomor handphone harus dimulai dengan 08 dan terdiri dari 10-16 digit';
                 messageEl.className = 'form-message error';
                 return;
            }
            messageEl.textContent = 'Pesan Anda berhasil dikirim. Tim kami akan segera menghubungi Anda.';
            messageEl.className = 'form-message success';
            contactForm.reset();

        });
    }
}

function handleLogout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        clearCurrentUser(); 
        currentUser = null; 
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

function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('active');
}

function initializeEventListeners() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.');
            this.reset();
        });
    }
}
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});
function isValidPhone(phone) {
    return /^08\d{8,14}$/.test(phone);
}