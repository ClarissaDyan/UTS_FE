// js/localStorageManager.js (Pastikan ini ada dan seperti ini)

const KEY_ALL_USERS = 'allUsers';
const KEY_CURRENT_USER = 'currentUser';
const KEY_ALL_COURSES_DEFINITIONS = 'allCourseDefinitions'; // Untuk dummy data kursus

// Default dummy courses (can be expanded later)
const defaultCourses = [
    {
        id: 'html-css-basic',
        title: 'Dasar HTML & CSS',
        description: 'Membangun fondasi web pertama Anda dengan HTML struktural dan gaya CSS.',
        category: 'Web Development',
        level: 'Pemula',
        duration: '2 minggu',
        price: 150000,
        thumbnail: 'https://via.placeholder.com/200x120/8A2BE2/FFFFFF?text=HTML+CSS',
        rating: 4.5,
        students: 1200
    },
    {
        id: 'javascript-intro',
        title: 'Dasar JavaScript',
        description: 'Mempelajari dasar-dasar JavaScript untuk membuat web interaktif.',
        category: 'Web Development',
        level: 'Pemula',
        duration: '3 minggu',
        price: 200000,
        thumbnail: 'https://via.placeholder.com/200x120/8A2BE2/FFFFFF?text=JavaScript',
        rating: 4.7,
        students: 1500
    },
    {
        id: 'blender-3d-modeling',
        title: 'Blender 3D Modeling',
        description: 'Membuat objek 3D untuk game dan animasi menggunakan Blender.',
        category: 'Desain 3D',
        level: 'Menengah',
        duration: '4 minggu',
        price: 250000,
        thumbnail: 'https://via.placeholder.com/200x120/8A2BE2/FFFFFF?text=Blender+3D',
        rating: 4.6,
        students: 800
    }
];

export function initializeData() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(KEY_ALL_USERS)) {
        localStorage.setItem(KEY_ALL_USERS, JSON.stringify([]));
    }
    // Initialize default courses if they don't exist
    if (!localStorage.getItem(KEY_ALL_COURSES_DEFINITIONS)) {
        localStorage.setItem(KEY_ALL_COURSES_DEFINITIONS, JSON.stringify(defaultCourses));
    }
    // Clear current user on app start if desired, or keep it
    // clearCurrentUser();
}

export function getAllUsers() {
    const usersJson = localStorage.getItem(KEY_ALL_USERS);
    return usersJson ? JSON.parse(usersJson) : [];
}

export function addUser(user) {
    const users = getAllUsers();
    users.push(user);
    localStorage.setItem(KEY_ALL_USERS, JSON.stringify(users));
}

export function getCurrentUser() {
    const userJson = localStorage.getItem(KEY_CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
}

export function setCurrentUser(user) {
    localStorage.setItem(KEY_CURRENT_USER, JSON.stringify(user));
}

export function clearCurrentUser() {
    localStorage.removeItem(KEY_CURRENT_USER);
}

// Placeholder for other user-related functions (will be used later)
export function updateUserProfile(updatedUser) {
    let users = getAllUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem(KEY_ALL_USERS, JSON.stringify(users));
        if (getCurrentUser() && getCurrentUser().id === updatedUser.id) {
            setCurrentUser(updatedUser); // Update current user if it's the one being updated
        }
    }
}

export function deleteUserAccount(userId) {
    let users = getAllUsers();
    users = users.filter(u => u.id !== userId);
    localStorage.setItem(KEY_ALL_USERS, JSON.stringify(users));
    if (getCurrentUser() && getCurrentUser().id === userId) {
        clearCurrentUser();
    }
}

// Course-related functions (for later use, but good to have)
export function getAllCourseDefinitions() {
    const coursesJson = localStorage.getItem(KEY_ALL_COURSES_DEFINITIONS);
    return coursesJson ? JSON.parse(coursesJson) : [];
}

// User-specific course tracking (e.g., courses a user has enrolled in)
// Structure: { userId: [{ courseId, progress, status }] }
const KEY_USER_COURSES = 'userCourses';

export function getUserCourses(userId) {
    const allUserCourses = JSON.parse(localStorage.getItem(KEY_USER_COURSES) || '{}');
    return allUserCourses[userId] || [];
}

export function addUserCourse(userId, courseId, initialStatus = 'enrolled') {
    const allUserCourses = JSON.parse(localStorage.getItem(KEY_USER_COURSES) || '{}');
    if (!allUserCourses[userId]) {
        allUserCourses[userId] = [];
    }
    // Check if user already has the course
    if (!allUserCourses[userId].some(c => c.courseId === courseId)) {
        allUserCourses[userId].push({ courseId, progress: 0, status: initialStatus, enrolledAt: new Date().toISOString() });
        localStorage.setItem(KEY_USER_COURSES, JSON.stringify(allUserCourses));
    }
}

export function updateUserCourseProgress(userId, courseId, newProgress, newStatus) {
    const allUserCourses = JSON.parse(localStorage.getItem(KEY_USER_COURSES) || '{}');
    if (allUserCourses[userId]) {
        const courseIndex = allUserCourses[userId].findIndex(c => c.courseId === courseId);
        if (courseIndex !== -1) {
            allUserCourses[userId][courseIndex].progress = newProgress;
            if (newStatus) {
                allUserCourses[userId][courseIndex].status = newStatus;
            }
            localStorage.setItem(KEY_USER_COURSES, JSON.stringify(allUserCourses));
        }
    }
}

// User-specific transactions (e.g., payment history)
// Structure: { userId: [{ transactionId, courseId, amount, date }] }
const KEY_USER_TRANSACTIONS = 'userTransactions';

export function getUserTransactions(userId) {
    const allUserTransactions = JSON.parse(localStorage.getItem(KEY_USER_TRANSACTIONS) || '{}');
    return allUserTransactions[userId] || [];
}

export function addTransaction(userId, transaction) {
    const allUserTransactions = JSON.parse(localStorage.getItem(KEY_USER_TRANSACTIONS) || '{}');
    if (!allUserTransactions[userId]) {
        allUserTransactions[userId] = [];
    }
    allUserTransactions[userId].push(transaction);
    localStorage.setItem(KEY_USER_TRANSACTIONS, JSON.stringify(allUserTransactions));
}