// Import fungsi dari localStorageManager (PERHATIKAN: user.js ada di folder js/, jadi path relatifnya langsung ./localStorageManager.js)
import { getCurrentUser, setCurrentUser, updateUserProfile, deleteUserAccount, clearCurrentUser } from './localStorageManager.js';

// Navigate to home page
function goToHome() {
    window.location.href = 'home.html'; 
}

// Handle account deletion
function deleteAccount() {
    const confirmation = confirm('Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.');
    
    if (confirmation) {
        const doubleConfirm = confirm('Konfirmasi sekali lagi. Hapus akun?');
        
        if (doubleConfirm) {
            const currentUser = getCurrentUser();
            if (currentUser) {
                deleteUserAccount(currentUser.id);
            }
            clearCurrentUser();
            alert('Akun berhasil dihapus!');
            window.location.href = 'home.html';
        }
    }
}

// Load user profile data
function loadUserProfile() {
    const userData = getCurrentUser();

    if (!userData) {
        alert("Belum ada user login, silakan login dulu.");
        window.location.href = "loginSignUp.html";
        return;
    }

    // Populate form fields
    document.getElementById('fullname').value = userData.fullname || "";
    document.getElementById('email').value = userData.email || "";
    document.getElementById('phone').value = userData.phone || "";
}

// Handle profile form submission
function handleProfileSubmit(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!fullname || !email || !phone) {
        alert('Semua field harus diisi!');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Format email tidak valid!');
        return;
    }

    const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
    if (!phoneRegex.test(phone)) {
        alert('Format nomor telepon tidak valid!');
        return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Tidak ada user aktif.");
        return;
    }

    // Update data
    const updatedData = {
        ...currentUser,
        fullname,
        email,
        phone
    };

    // Simpan ke localStorage
    updateUserProfile(updatedData);
    setCurrentUser(updatedData);

    console.log('Data yang disimpan:', updatedData);
    alert('Perubahan berhasil disimpan!');
}

// Handle feedback form submission
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    const feedbackText = document.getElementById('feedbackText').value.trim();
    
    if (!feedbackText) {
        alert('Silakan tulis feedback Anda terlebih dahulu.');
        return;
    }
    
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert('Anda harus login untuk mengirim feedback.');
        return;
    }
    
    // TODO: Implement feedback submission to server/storage
    console.log('Feedback dari:', currentUser.fullname);
    console.log('Feedback:', feedbackText);
    
    alert('Terima kasih atas feedback Anda!');
    document.getElementById('feedbackText').value = '';
}

// Handle textarea auto-resize
function handleTextareaResize() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load user profile data
    loadUserProfile();
    
    // Back to home button
    const btnBackHome = document.getElementById('btnBackHome');
    if (btnBackHome) {
        btnBackHome.addEventListener('click', goToHome);
    }
    
    // Profile form submission
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Delete account button
    const btnDeleteAccount = document.querySelector('.btn-secondary');
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', deleteAccount);
    }
    
    // Feedback form submission
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    
    // Feedback textarea auto-resize
    const feedbackTextarea = document.getElementById('feedbackText');
    if (feedbackTextarea) {
        feedbackTextarea.addEventListener('input', handleTextareaResize);
    }
});