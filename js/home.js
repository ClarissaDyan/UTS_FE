let currentUser = null;

// Check login status on page load
window.addEventListener('DOMContentLoaded', function() {
    loadCurrentUser();
    checkLoginStatus();
    initializeEventListeners();
});

// Load current user from sessionStorage
function loadCurrentUser() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const userName = sessionStorage.getItem('userName');
    
    if (isLoggedIn && userName) {
        currentUser = {
            name: userName
        };
    } else {
        currentUser = null;
    }
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
            userGreeting.textContent = `Halo, ${currentUser.name}!`;
        }
        
        // Update mobile menu
        updateMobileMenu(currentUser.name);
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

// Reset mobile menu content for logged out user
function resetMobileMenu() {
    const mobileAuth = document.getElementById('mobileAuth');
    mobileAuth.innerHTML = `
        <a href="loginSignUp.html" class="login-btn" style="width: 100%; text-align: center; display: block;">Masuk</a>
        <a href="loginSignUp.html#signup" class="signup-btn" style="width: 100%; text-align: center; display: block;">Daftar</a>
    `;
}

// Contact form handler
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

            if (!isValidPhone(phone)) {
                messageEl.textContent = 'Nomor handphone harus dimulai dengan 08 dan terdiri dari 10-16 digit';
                messageEl.className = 'form-message error';
                return;
            }
            
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
        currentUser = null;
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('userName');
        
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
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            document.getElementById('mobileMenu').classList.toggle('active');
        });
    }
    
    // Navigation active state
    const navLinks = document.querySelectorAll('.nav-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            closeMobileMenu();
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // Contact form handler
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
