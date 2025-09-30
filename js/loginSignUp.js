// User storage and current user
let currentUser = null;
let users = []; // In-memory array for demo

// Validation functions
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^08\d{8,14}$/.test(phone);
}

function isValidName(name) {
    return name.length >= 3 && name.length <= 32 && !/\d/.test(name);
}

// DOM elements
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    const authType = window.opener && window.opener.getAuthType ? window.opener.getAuthType() : null;
    if (authType === 'signup') {
        showSignupForm();
    } else {
        showLoginForm();
    }
    
    setupEventListeners();
    addFloatingLabels();
});

function setupEventListeners() {
    loginTab.addEventListener('click', showLoginForm);
    signupTab.addEventListener('click', showSignupForm);
    loginForm.addEventListener('submit', handleLogin);
    signupForm.addEventListener('submit', handleSignup);
    
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            alert(`Login dengan ${platform} belum tersedia. Silakan gunakan email dan password.`);
        });
    });
}

function showLoginForm() {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    clearMessages();
}

function showSignupForm() {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    clearMessages();
}

function showForm(type) {
    if (type === 'login') {
        showLoginForm();
    } else {
        showSignupForm();
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errorEl = document.getElementById('loginError');
    
    errorEl.textContent = '';
    
    if (!email) {
        showError('loginError', 'Email harus diisi');
        return;
    }
    
    if (!password) {
        showError('loginError', 'Kata sandi harus diisi');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('loginError', 'Format email tidak valid');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;

        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('userName', user.fullname);
        
        showButtonLoading('loginForm');
        
        setTimeout(() => {
            alert(`Selamat datang, ${user.fullname}!`);
            window.location.href = 'home.html';
        }, 1000);
    } else {
        showError('loginError', 'Email atau kata sandi salah');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    const errorEl = document.getElementById('signupError');
    const successEl = document.getElementById('signupSuccess');
    
    errorEl.textContent = '';
    successEl.textContent = '';
    
    if (!email || !password || !fullname || !phone) {
        showError('signupError', 'Email, kata sandi, nama lengkap, dan nomor handphone harus diisi');
        return;
    }
    
    if (!confirmPassword) {
        showError('signupError', 'Konfirmasi kata sandi harus diisi');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('signupError', 'Format email tidak valid');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        showError('signupError', 'Email sudah terdaftar');
        return;
    }
    
    if (password.length < 8) {
        showError('signupError', 'Kata sandi minimal 8 karakter');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('signupError', 'Kata sandi dan konfirmasi kata sandi harus sesuai');
        return;
    }
    
    if (fullname.length < 3) {
        showError('signupError', 'Nama lengkap minimal 3 karakter');
        return;
    }
    
    if (fullname.length > 32) {
        showError('signupError', 'Nama lengkap maksimal 32 karakter');
        return;
    }
    
    if (/\d/.test(fullname)) {
        showError('signupError', 'Nama lengkap tidak boleh mengandung angka');
        return;
    }
    
    if (!phone.startsWith('08')) {
        showError('signupError', 'Nomor handphone harus dimulai dengan 08');
        return;
    }
    
    if (!/^\d+$/.test(phone)) {
        showError('signupError', 'Nomor handphone hanya boleh berisi angka');
        return;
    }
    
    if (phone.length < 10) {
        showError('signupError', 'Nomor handphone minimal 10 digit');
        return;
    }
    
    if (phone.length > 16) {
        showError('signupError', 'Nomor handphone maksimal 16 digit');
        return;
    }
    
    if (!agreeTerms) {
        showError('signupError', 'Anda harus menyetujui syarat dan ketentuan');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        fullname,
        email,
        phone,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    showButtonLoading('signupForm');
    
    setTimeout(() => {
        showSuccess('signupSuccess', 'Pendaftaran berhasil! Silakan login dengan akun Anda.');
        signupForm.reset();
        
        setTimeout(() => {
            showLoginForm();
        }, 2000);
    }, 1000);
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function showSuccess(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function clearMessages() {
    const messages = document.querySelectorAll('.error-message, .success-message');
    messages.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });
}

function showButtonLoading(formId) {
    const form = document.getElementById(formId);
    const button = form.querySelector('.btn-submit');
    button.classList.add('loading');
    button.disabled = true;
    
    setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
    }, 1000);
}

function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentElement.querySelector('.toggle-password i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function goToHome() {
    window.location.href = 'home.html';
}

function addFloatingLabels() {
    const inputs = document.querySelectorAll('.input-group input');
    
    inputs.forEach(input => {
        const label = input.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            const inputGroup = input.parentElement;
            inputGroup.classList.add('floating');
            input.parentElement.appendChild(label);
            
            if (!input.placeholder) {
                input.placeholder = ' ';
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            this.parentElement.classList.remove('error');
        });
    });
});

function validateField(input) {
    const inputGroup = input.parentElement;
    const value = input.value.trim();
    
    inputGroup.classList.remove('error', 'success');
    
    if (!value && input.required) {
        inputGroup.classList.add('error');
        return false;
    }
    
    if (input.type === 'email' && value && !isValidEmail(value)) {
        inputGroup.classList.add('error');
        return false;
    }
    
    if (input.id === 'phone' && value) {
        if (!value.startsWith('08')) {
            inputGroup.classList.add('error');
            return false;
        }
        if (!/^\d+$/.test(value)) {
            inputGroup.classList.add('error');
            return false;
        }
        if (value.length < 10 || value.length > 16) {
            inputGroup.classList.add('error');
            return false;
        }
    }
    
    if (input.id === 'fullname' && value) {
        if (value.length < 3 || value.length > 32) {
            inputGroup.classList.add('error');
            return false;
        }
        if (/\d/.test(value)) {
            inputGroup.classList.add('error');
            return false;
        }
    }
    
    if ((input.id === 'password' || input.id === 'loginPassword') && value && value.length < 8) {
        inputGroup.classList.add('error');
        return false;
    }
    
    if (input.id === 'confirmPassword' && value) {
        const password = document.getElementById('password').value;
        if (value !== password) {
            inputGroup.classList.add('error');
            return false;
        }
    }
    
    if (value) {
        inputGroup.classList.add('success');
    }
    
    return true;
}

const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);