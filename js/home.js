// js/home.js
import { getCurrentUser, clearCurrentUser, initializeData } from './localStorageManager.js';

document.addEventListener('DOMContentLoaded', function() {
    // Pastikan data diinisialisasi (misal jika home.html diakses langsung pertama kali)
    initializeData();

    const user = getCurrentUser(); // Ambil data user dari localStorage

    const welcomeMessage = document.getElementById('welcomeMessage');
    const mainNavbar = document.getElementById('mainNavbar');

    if (welcomeMessage) { // Pastikan elemen ada sebelum diakses
        if (user) {
            // User is logged in
            welcomeMessage.textContent = `Halo, ${user.fullname}!`;
            if (mainNavbar) buildLoggedInNavbar(mainNavbar, user.fullname);
        } else {
            // User is not logged in
            welcomeMessage.textContent = `Selamat datang di Online Learning Platform!`;
            if (mainNavbar) buildLoggedOutNavbar(mainNavbar);
            // Redirect to login page if trying to access protected content
            // window.location.href = 'loginSignUp.html'; // uncomment if home.html should only be accessible when logged in
        }
    }
});

function buildLoggedInNavbar(navbarElement, username) {
    navbarElement.innerHTML = `
        <a href="home.html" class="active">Halaman Utama</a>
        <a href="courses.html">Kursus</a>
        <a href="learning-history.html">Riwayat Pembelajaran</a>
        <a href="contact.html">Hubungi Kami</a>
        <div class="user-menu" id="userMenu">
            <button class="user-btn">
                <i class="fas fa-user-circle"></i>
                <span>${username}</span>
                <i class="fas fa-chevron-down"></i>
            </button>
            <div class="dropdown-content">
                <a href="user-profile.html">Profil Saya</a>
                <a href="#" id="logoutButton">Logout</a>
            </div>
        </div>
    `;

    // Add event listener for user menu dropdown
    const userMenu = document.getElementById('userMenu');
    if (userMenu) { // Check if element exists
        userMenu.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }


    // Add event listener for logout button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) { // Check if element exists
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}

function buildLoggedOutNavbar(navbarElement) {
    navbarElement.innerHTML = `
        <a href="home.html" class="active">Halaman Utama</a>
        <a href="courses.html">Kursus</a>
        <a href="contact.html">Hubungi Kami</a>
        <a href="loginSignUp.html?auth=login" class="auth-btn">Login</a>
        <a href="loginSignUp.html?auth=signup" class="auth-btn">Sign Up</a>
    `;
}

function handleLogout() {
    clearCurrentUser(); // Hapus user dari localStorage
    alert('Anda telah logout.'); // Masih menggunakan alert untuk logout, bisa diganti dengan pesan di UI
    window.location.href = 'home.html'; // Redirect ke home page (akan menampilkan navbar logged out)
}

// Global function to redirect to home.html (for other pages if needed)
export function goToHome() {
    window.location.href = 'home.html';
}