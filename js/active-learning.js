// js/active-learning.js
import { getCurrentUser, getUserTransactions } from './localStorageManager.js';
    function getCourseDetailUrl(courseTitle) {
    const title = courseTitle.toLowerCase();
    
    if (title.includes('adobe')) {
        return 'DetailAdobe.html';
    } else if (title.includes('blender')) {
        return 'DetailBlender.html';
    } else if (title.includes('struktur')) {
        return 'DetailStruktur.html';
    } else if (title.includes('oop')) {
        return 'DetailOOP.html';
    } else if (title.includes('roblox')) {
        return 'DetailRoblox.html';
    } else {
        // Jika tidak cocok, arahkan ke daftar produk sebagai cadangan
        return 'produkList.html';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        // AuthGuard seharusnya sudah menangani ini, tapi sebagai cadangan
        window.location.href = 'loginSignUp.html';
        return;
    }

    // Ambil data transaksi pengguna
    const userTransactions = getUserTransactions(currentUser.id);

    // Dapatkan daftar kursus yang unik dari transaksi
    const myCourses = getUniqueCoursesFromTransactions(userTransactions);
    
    // Asumsikan kita punya data progres (untuk simulasi)
    // Di aplikasi nyata, ini akan disimpan di localStorage juga
    const courseProgress = getCourseProgress(currentUser.id, myCourses);

    // Tampilkan bagian "Kursus Saya"
    displayMyCourses(myCourses, courseProgress);
    
    // Tampilkan bagian "Lanjutkan Belajar"
    // Untuk simulasi, kita ambil kursus pertama dengan progres paling tinggi < 100%
    displayContinueLearning(myCourses, courseProgress);
});

function getUniqueCoursesFromTransactions(transactions) {
    const uniqueCourses = new Map();
    // Urutkan transaksi dari yang terbaru, agar data kursus yang diambil adalah yang paling update
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    transactions.forEach(trx => {
        if (!uniqueCourses.has(trx.courseTitle)) {
            uniqueCourses.set(trx.courseTitle, {
                title: trx.courseTitle,
                thumbnail: trx.courseThumbnail
                // Di aplikasi nyata, kita mungkin punya ID kursus
                // courseId: trx.courseId 
            });
        }
    });

    return Array.from(uniqueCourses.values());
}

function getCourseProgress(userId, courses) {
    // --- SIMULASI ---
    // Di aplikasi nyata, fungsi ini akan membaca progres dari localStorage.
    // Untuk sekarang, kita buat data progres palsu.
    let progressData = {};
    courses.forEach((course, index) => {
        // Buat progres acak, pastikan yang pertama tidak selesai
        progressData[course.title] = (index === 0) ? Math.floor(Math.random() * 51) + 20 : Math.floor(Math.random() * 101); // Acak 20-70 atau 0-100
    });
    return progressData;
}

function displayMyCourses(courses, progressData) {
    const gridContainer = document.getElementById('myCoursesGrid');
    const noCoursesMessage = document.getElementById('noCoursesMessage');
    gridContainer.innerHTML = '';

    if (courses.length === 0) {
        noCoursesMessage.classList.remove('hidden');
        return;
    }

    noCoursesMessage.classList.add('hidden');
    courses.forEach(course => {
        const progress = progressData[course.title] || 0;
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${course.thumbnail}" alt="${course.title}" class="thumbnail">
            <div class="info">
                <h3>${course.title}</h3>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
                <p class="progress-text">${progress}% Selesai</p>
            </div>
        `;
        gridContainer.appendChild(card);
    });
}

function displayContinueLearning(courses, progressData) {
    const container = document.getElementById('continueLearningCard');
    
    let lastAccessedCourse = null;
    let maxProgress = -1;

    courses.forEach(course => {
        const progress = progressData[course.title] || 0;
        if (progress < 100 && progress > maxProgress) {
            maxProgress = progress;
            lastAccessedCourse = course;
        }
    });
    
    if (!lastAccessedCourse && courses.length > 0) {
        lastAccessedCourse = courses[0];
        maxProgress = progressData[lastAccessedCourse.title] || 0;
    }

    if (lastAccessedCourse) {
        // Dapatkan URL dari fungsi yang kita buat tadi
        const courseUrl = getCourseDetailUrl(lastAccessedCourse.title);

        // Bungkus semua dengan tag <a> dan hapus tombol terpisah
        container.innerHTML = `
            <a href="${courseUrl}" class="course-card-large-link">
                <img src="${lastAccessedCourse.thumbnail}" alt="${lastAccessedCourse.title}" class="thumbnail">
                <div class="info">
                    <h3>${lastAccessedCourse.title}</h3>
                    <p>Lanjutkan progres belajar Anda dan selesaikan kursus untuk mendapatkan sertifikat.</p>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${maxProgress}%;"></div>
                    </div>
                    <p class="progress-text">${maxProgress}% Selesai</p>
                </div>
            </a>
        `;
    } else {
        container.innerHTML = `<p style="text-align:center; width:100%; padding: 20px;">Anda belum memulai kursus apa pun.</p>`;
    }
}