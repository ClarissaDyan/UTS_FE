// Uncomment jika menggunakan localStorage
// import { getCurrentUser, clearCurrentUser } from './localStorageManager.js';

let currentUser = null;

// Fungsi sementara jika localStorageManager belum ada
function getCurrentUser() {
    try {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}

window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing...');
    loadCurrentUser();
    checkLoginStatus();
    initializeEventListeners();
    initializeHamburgerMenu();
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

// Fungsi untuk initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    console.log('Hamburger:', hamburger);
    console.log('Mobile Menu:', mobileMenu);
    
    if (hamburger && mobileMenu) {
        console.log('Adding click listener to hamburger');
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Hamburger clicked!');
            
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            
            console.log('Hamburger active:', hamburger.classList.contains('active'));
            console.log('Menu active:', mobileMenu.classList.contains('active'));
        });
    } else {
        console.error('Hamburger or Mobile Menu not found!');
    }
    
    // Close menu saat link diklik
    const mobileNavLinks = document.querySelectorAll('.mobile-nav .nav-btn');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Close menu saat klik di luar menu
    document.addEventListener('click', function(event) {
        if (!mobileMenu || !hamburger) return;
        
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
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
    const navLinks = document.querySelectorAll('#desktopNav .nav-btn, .mobile-nav .nav-btn');
    const contactForm = document.getElementById('contactForm');
    
    const currentPath = window.location.pathname; // Mendapatkan path URL saat ini (e.g., /home.html, /produkList.html)

    navLinks.forEach(link => {
        link.classList.remove('active'); // Hapus semua 'active' terlebih dahulu
        const linkPath = link.getAttribute('href');

        // Tandai link 'Kursus' sebagai aktif jika berada di halaman produkList.html
        if (currentPath.includes('produkList.html') && linkPath.includes('produkList.html')) {
            link.classList.add('active');
        } 
        // Tandai link 'Halaman Utama' sebagai aktif jika berada di halaman home.html
        else if (currentPath.includes('home.html') && linkPath.includes('home.html')) {
            // Biarkan IntersectionObserver yang menangani ini jika di home.html,
            // tapi kita bisa set default ke 'Halaman Utama'
            if (link.getAttribute('href') === '/home.html' || link.getAttribute('href') === '#hero') {
                 link.classList.add('active');
            }
        }
    });

    // Cek apakah kita sedang berada di halaman home.html
    const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/home.html');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetUrl = this.getAttribute('href');
            
            navLinks.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            if (isHomePage && targetUrl.startsWith('#')) {
                // Jika di home.html dan link adalah anchor (#)
                e.preventDefault(); // Hentikan perilaku default

                const targetElement = document.querySelector(targetUrl);
                if (targetElement) {
                    // Lakukan smooth scroll
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            } else if (!isHomePage && targetUrl.startsWith('/home.html#')) {
                // Jika di halaman lain dan link mengarah ke bagian di home.html
                // Tidak perlu e.preventDefault(), biarkan browser mengarahkan
                // Browser akan otomatis pindah ke home.html dan scroll ke #contact
            } else if (!isHomePage && targetUrl === '/produkList.html') {
                // Jika di halaman lain dan link adalah /produkList.html
                // Biarkan perilaku default berjalan
            }
            // Untuk semua kasus lain (seperti link Halaman Utama dari page lain),
            // biarkan browser menangani navigasi secara normal.
        });
    });
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.');
            this.reset();
        });
    }

    // Logika untuk active state saat scroll (HANYA JIKA DI HOME.HTML)
    if (isHomePage) {
        const sections = document.querySelectorAll('main section[id]');
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -50% 0px', // Aktifkan saat bagian atas section melewati 80px dari atas viewport
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.getAttribute('id');
                const navLink = document.querySelector(`.nav-btn[href="#${id}"]`);

                if (navLink) {
                    if (entry.isIntersecting) {
                        // Hapus semua 'active' terlebih dahulu
                        navLinks.forEach(link => link.classList.remove('active'));
                        // Tambahkan 'active' ke link yang sesuai
                        navLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }
}

window.addEventListener('resize', function() {
    if (window.innerWidth > 850) {
        closeMobileMenu();
    }
});

function isValidPhone(phone) {
    return /^08\d{8,14}$/.test(phone);
}

// Make functions available globally for onclick handlers
window.handleLogout = handleLogout;
window.handlePaymentHistory = function() {
    window.location.href = 'riwayat.html';
};
window.handleProfile = function() {
    window.location.href = 'profile.html';
};