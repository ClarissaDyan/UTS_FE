// js/riwayat.js
import { getCurrentUser, getUserTransactions } from './localStorageManager.js';

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    const transactionListContainer = document.getElementById('transactionList');
    const noTransactionsMessage = document.getElementById('noTransactionsMessage');

    if (!currentUser) {
        alert("Anda harus login untuk melihat riwayat pembayaran.");
        window.location.href = 'loginSignUp.html'; // Arahkan ke halaman login
        return;
    }

    const userTransactions = getUserTransactions(currentUser.id);

    if (userTransactions.length === 0) {
        noTransactionsMessage.classList.remove('hidden'); // Tampilkan pesan jika tidak ada transaksi
        transactionListContainer.innerHTML = ''; // Pastikan tidak ada konten lain
    } else {
        noTransactionsMessage.classList.add('hidden'); // Sembunyikan pesan jika ada transaksi
        transactionListContainer.innerHTML = ''; // Kosongkan dulu

        // Urutkan transaksi dari yang terbaru
        userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

        userTransactions.forEach(transaction => {
            const transactionCard = document.createElement('div');
            transactionCard.classList.add('transaction-card');
            
            // Format tanggal agar lebih mudah dibaca
            const transactionDate = new Date(transaction.date).toLocaleDateString('id-ID', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            transactionCard.innerHTML = `
                <img src="${transaction.courseThumbnail || 'https://via.placeholder.com/80x50?text=Course'}" alt="${transaction.courseTitle}" class="course-thumbnail">
                <div class="transaction-details">
                    <h3>${transaction.courseTitle}</h3>
                    <p>ID Transaksi: ${transaction.transactionId.substring(0, 8)}...</p>
                    <p>Metode: ${transaction.paymentMethod}</p>
                    <p class="transaction-date">Tanggal: ${transactionDate}</p>
                </div>
                <div class="transaction-amount">
                    Rp${transaction.amount.toLocaleString('id-ID')}
                </div>
            `;
            transactionListContainer.appendChild(transactionCard);
        });
    }
});