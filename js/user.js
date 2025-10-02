// Import fungsi dari localStorageManager
import { getCurrentUser, setCurrentUser, updateUserProfile, deleteUserAccount, clearCurrentUser } from './js/localStorageManager.js';

// Navigate to home page
function goToHome() {
    window.location.href = 'home.html'; 
}

// Load user data when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
});

// Load user profile data
function loadUserProfile() {
    // Ambil dari localStorage
    const userData = getCurrentUser();

    if (!userData) {
        alert("Belum ada user login, silakan login dulu.");
        window.location.href = "login.html";
        return;
    }

    // Populate form fields
    document.getElementById('fullname').value = userData.fullname || "";
    document.getElementById('email').value = userData.email || "";
    document.getElementById('phone').value = userData.phone || "";
}

// Handle form submission
document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

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

    // Ambil user yang sedang aktif
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
});

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
            window.location.href = 'index.html';
        }
    }
}

// Handle feedback textarea auto-resize
const feedbackTextarea = document.querySelector('.feedback-textarea');
if (feedbackTextarea) {
    feedbackTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
}
