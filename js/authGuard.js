// Mengimpor fungsi untuk mendapatkan data user dari localStorage
import { getCurrentUser } from './localStorageManager.js';

// Fungsi ini akan langsung berjalan saat script dimuat
(function() {
    const currentUser = getCurrentUser();

    // Periksa apakah tidak ada pengguna yang login
    if (!currentUser) {
        // Jika tidak ada, tampilkan pesan peringatan
        alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
        
        // Alihkan pengguna ke halaman login
        window.location.href = 'loginSignUp.html';
    }
})();