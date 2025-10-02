import { getCurrentUser } from './localStorageManager.js';

(function() {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert('Anda harus login terlebih dahulu untuk mengakses halaman ini.');
        
        window.location.href = 'loginSignUp.html';
    }
})();