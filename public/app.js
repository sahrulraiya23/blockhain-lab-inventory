let web3;
let contract;
let currentAccount;

let ADMIN_ROLE;
let ASLAB_ROLE;
let DEFAULT_ADMIN_ROLE;

async function init() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 1. Muat Alamat & ABI Kontrak dari file JSON
            const addressResponse = await fetch('./contracts/contract-address.json');
            const addressData = await addressResponse.json();
            const CONTRACT_ADDRESS = addressData.address;

            const abiResponse = await fetch('./contracts/LabInventory.json');
            const abiData = await abiResponse.json();
            const CONTRACT_ABI = abiData.abi;

            // 2. Hubungkan ke Web3 dan MetaMask
            web3 = new Web3(window.ethereum);
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            // 3. Buat instance kontrak
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            // 4. Hitung hash peran menggunakan web3
            ADMIN_ROLE = web3.utils.keccak256("ADMIN_ROLE");
            ASLAB_ROLE = web3.utils.keccak256("ASLAB_ROLE");
            DEFAULT_ADMIN_ROLE = await contract.methods.DEFAULT_ADMIN_ROLE().call(); // Ambil dari kontrak

            // 5. Tangani perubahan akun
            const accounts = await web3.eth.getAccounts();
            await handleAccountsChanged(accounts);

            window.ethereum.on('accountsChanged', handleAccountsChanged);

        } catch (error) {
            console.error("Initialization error:", error);
            alert('Gagal menginisialisasi aplikasi. Pastikan Anda sudah men-deploy kontrak dan server berjalan.');
        }
    } else {
        alert('MetaMask tidak terdeteksi. Silakan install MetaMask.');
    }
}

async function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        currentAccount = null;
    } else {
        currentAccount = accounts[0];
    }
    updateWalletUI();
    await updateAdminTabVisibility();

    // Muat ulang data untuk tab yang sedang aktif
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
        const activeTabName = activeTab.id;
        if (activeTabName === 'inventory') loadInventory();
        if (activeTabName === 'borrow') loadMyBorrows();
        if (activeTabName === 'history') loadHistory();
        if (activeTabName === 'admin') loadOwnerInfo();
        // HAPUS BARIS INI: if (activeTabName === 'profile') loadProfileInfo();
    }
}


function showTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if (tabName === 'inventory') loadInventory();
    if (tabName === 'borrow') loadMyBorrows();
    if (tabName === 'history') loadHistory();
    if (tabName === 'admin') loadOwnerInfo();
}
function updateWalletUI() {
    const connectButton = document.getElementById('connect-wallet');
    const accountAddress = document.getElementById('account-address');
    
    if (currentAccount) {
        connectButton.textContent = 'Connected';
        connectButton.disabled = true;
        accountAddress.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
    } else {
        connectButton.textContent = 'Connect MetaMask';
        connectButton.disabled = false;
        accountAddress.textContent = '';
    }
}

async function updateAdminTabVisibility() {
    const adminTabButton = document.getElementById('admin-tab-button');
    const addAslabSection = document.getElementById('add-aslab-form').closest('.admin-section'); // Ambil elemen section 'Tambah Aslab Baru'
    const addItemSection = document.getElementById('add-item-form').closest('.admin-section'); // Ambil elemen section 'Tambah Item Baru'

    if (!currentAccount || !contract) {
        adminTabButton.style.display = 'none';
        if (addAslabSection) addAslabSection.style.display = 'none';
        if (addItemSection) addItemSection.style.display = 'none';
        return;
    }

    try {
        const isAslab = await contract.methods.hasRole(ASLAB_ROLE, currentAccount).call();
        const isAdmin = await contract.methods.hasRole(ADMIN_ROLE, currentAccount).call(); // ADMIN_ROLE yang Anda definisikan adalah keccak256("ADMIN_ROLE")
        const isDefaultAdmin = await contract.methods.hasRole(DEFAULT_ADMIN_ROLE, currentAccount).call(); // DEFAULT_ADMIN_ROLE dari kontrak

        if (isAslab || isDefaultAdmin) { // Tampilkan tab Admin jika Aslab atau Default Admin
            adminTabButton.style.display = 'flex';
        } else {
            adminTabButton.style.display = 'none';
        }

        // Logika untuk menampilkan/menyembunyikan bagian "Tambah Aslab Baru"
        if (addAslabSection) {
            if (isDefaultAdmin) { // Hanya Default Admin yang bisa melihat form Add Aslab
                addAslabSection.style.display = 'block';
            } else {
                addAslabSection.style.display = 'none';
            }
        }

        // Logika untuk menampilkan/menyembunyikan bagian "Tambah Item Baru"
        // Aslab dan Default Admin harus bisa melihat form Add Item
        if (addItemSection) {
            if (isAslab || isDefaultAdmin) {
                addItemSection.style.display = 'block';
            } else {
                addItemSection.style.display = 'none';
            }
        }


    } catch (error) {
        console.error("Error checking role:", error);
        adminTabButton.style.display = 'none';
        if (addAslabSection) addAslabSection.style.display = 'none';
        if (addItemSection) addItemSection.style.display = 'none';
    }
}

function showTab(event, tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.currentTarget.classList.add('active');
    
    if (tabName === 'inventory') loadInventory();
    if (tabName === 'borrow') loadMyBorrows();
    if (tabName === 'history') loadHistory();
    if (tabName === 'admin') loadOwnerInfo();
    if (tabName === 'profile') loadProfileInfo(); 
}

async function addItem() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const description = document.getElementById('item-description').value;
    const quantity = document.getElementById('item-quantity').value;

    try {
        await contract.methods.addItem(name, category, description, quantity).send({ from: currentAccount });
        alert('Item berhasil ditambahkan!');
        document.getElementById('add-item-form').reset();
        loadInventory();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Gagal menambahkan item. Pastikan Anda adalah admin atau aslab.');
    }
}

async function addAslab() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const aslabAddress = document.getElementById('aslab-address').value;

    if (!web3.utils.isAddress(aslabAddress)) {
        return alert('Alamat wallet tidak valid.');
    }

    try {
        await contract.methods.addAslab(aslabAddress).send({ from: currentAccount });
        alert(`Aslab dengan alamat ${aslabAddress} berhasil ditambahkan!`);
        document.getElementById('add-aslab-form').reset();
    } catch (error) {
        console.error('Error adding aslab:', error);
        alert('Gagal menambahkan aslab. Pastikan Anda adalah owner.');
    }
}

async function loadProfileInfo() {
    const connectedWalletSpan = document.getElementById('profile-connected-wallet');
    const savedWalletSpan = document.getElementById('profile-saved-wallet');
    const walletInput = document.getElementById('wallet-address-input');

    if (currentAccount) {
        connectedWalletSpan.textContent = currentAccount;
        connectedWalletSpan.classList.remove('loading');
    } else {
        connectedWalletSpan.textContent = 'Belum terhubung';
        connectedWalletSpan.classList.add('loading');
    }

    const savedWallet = localStorage.getItem('savedWallet');
    if (savedWallet) {
        savedWalletSpan.textContent = savedWallet;
        savedWalletSpan.classList.remove('loading');
        walletInput.value = savedWallet;
    } else {
        savedWalletSpan.textContent = 'Belum ada alamat tersimpan';
        savedWalletSpan.classList.add('loading');
    }
}

function openBorrowModal(itemId, maxAvailable) {
    if (!currentAccount) {
        alert("Silakan hubungkan wallet Anda terlebih dahulu.");
        return;
    }
    document.getElementById('borrow-item-id').value = itemId;
    document.getElementById('borrower-name').value = currentAccount;
    const borrowQuantityInput = document.getElementById('borrow-quantity');
    borrowQuantityInput.value = 1; // Default 1
    borrowQuantityInput.max = maxAvailable; // Atur maksimum sesuai ketersediaan
    document.getElementById('borrow-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('borrow-modal').style.display = 'none';
    document.getElementById('borrow-form').reset(); // Reset form saat modal ditutup
}

async function borrowItem() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const itemId = document.getElementById('borrow-item-id').value;
    const purpose = document.getElementById('borrow-purpose').value;
    const quantityToBorrow = parseInt(document.getElementById('borrow-quantity').value);

    if (isNaN(quantityToBorrow) || quantityToBorrow <= 0) {
        return alert('Jumlah yang dipinjam harus angka positif.');
    }

    try {
        await contract.methods.borrowItem(itemId, currentAccount, purpose, quantityToBorrow).send({ from: currentAccount });
        alert(`${quantityToBorrow} item berhasil dipinjam!`);
        closeModal();
        loadInventory();
        loadMyBorrows();
    } catch (error) {
        console.error('Error borrowing item:', error);
        alert('Gagal meminjam item: ' + (error.message || error.data?.message || 'Terjadi kesalahan.'));
    }
}

// DIUBAH: Fungsi returnItem untuk mengirimkan jumlah yang dikembalikan (1)
async function returnItem(itemId) {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    // Kuantitas yang akan dikembalikan, sesuai dengan tombol "Kembalikan 1"
    const quantityToReturn = 1; 

    if (!confirm(`Anda yakin ingin mengembalikan ${quantityToReturn} unit item ini?`)) {
        return; // Batalkan jika user tidak yakin
    }

    try {
        // Mengirim _quantityToReturn (1) sebagai parameter kedua
        await contract.methods.returnItem(itemId, quantityToReturn).send({ from: currentAccount }); //
        alert(`${quantityToReturn} item berhasil dikembalikan!`);
        loadInventory();
        loadMyBorrows();
    } catch (error) {
        console.error('Error returning item:', error);
        alert('Gagal mengembalikan item: ' + (error.message || error.data?.message || 'Terjadi kesalahan.'));
    }
}

async function loadInventory() {
    if (!contract) return;
    const container = document.getElementById('items-container');
    container.innerHTML = '<div class="loading">Loading inventory...</div>';
    try {
        const items = await contract.methods.getAllItems().call();
        await displayItems(items);
    } catch (error) {
        console.error('Error loading inventory:', error);
        container.innerHTML = '<div class="empty-state">Gagal memuat inventaris.</div>';
    }
}

async function displayItems(items) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div class="empty-state">Tidak ada item dalam inventaris</div>';
        return;
    }
    
    for (const item of items) {
        const userBorrowed = currentAccount ? await contract.methods.userBorrowedCount(currentAccount, item.id).call() : 0;
        const userBorrowedCount = Number(userBorrowed);

        const itemCard = createItemCard(item, userBorrowedCount);
        container.appendChild(itemCard);
    }
}

function createItemCard(item, userBorrowedCount) {
    const card = document.createElement('div');
    const availableQuantity = Number(item.availableQuantity);
    const totalQuantity = Number(item.totalQuantity);
    const itemId = Number(item.id);

    card.className = `item-card ${availableQuantity === 0 ? 'unavailable' : ''}`;
    
    card.innerHTML = `
        <div class="item-header">
            <h3>${item.name}</h3>
            <div class="item-quantity ${availableQuantity > 0 ? 'quantity-available' : 'quantity-none'}">
                Tersedia: ${availableQuantity} / ${totalQuantity}
            </div>
        </div>
        <p><strong>Kategori:</strong> ${item.category}</p>
        <p><strong>Deskripsi:</strong> ${item.description}</p>
        <div class="item-actions">
            <button class="btn btn-primary" onclick="openBorrowModal(${itemId}, ${availableQuantity})" ${availableQuantity === 0 ? 'disabled' : ''}>Pinjam</button>
            <button class="btn btn-danger" onclick="returnItem(${itemId})" ${userBorrowedCount === 0 ? 'disabled' : ''}>Kembalikan</button>
        </div>
    `;
    return card;
}

async function loadMyBorrows() {
    if (!currentAccount || !contract) return;
    const container = document.getElementById('my-borrows-container');
    container.innerHTML = '<div class="loading">Loading...</div>';
    try {
        const result = await contract.methods.getUserBorrowedItems(currentAccount).call();
        const borrowedItems = result[0];
        const borrowedCounts = result[1];

        if (borrowedItems.length === 0) {
            container.innerHTML = '<div class="empty-state">Anda tidak memiliki item yang dipinjam</div>';
            return;
        }
        
        container.innerHTML = ''; // Clear loading
        borrowedItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <p><strong>Kategori:</strong> ${item.category}</p>
                <p><strong>Jumlah Dipinjam:</strong> ${Number(borrowedCounts[index])}</p>
                <div class="item-actions">
                    <button class="btn btn-danger" onclick="returnItem(${item.id})">Kembalikan 1</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading my borrows:', error);
        container.innerHTML = '<div class="empty-state">Gagal memuat data peminjaman.</div>';
    }
}
// public/app.js

// ... (kode yang sudah ada sebelumnya) ...

async function loadHistory() {
    if (!contract) return;
    const container = document.getElementById('history-container');
    container.innerHTML = '<div class="loading">Loading history...</div>'; // Tampilkan loading state
    try {
        const items = await contract.methods.getAllItems().call();
        let hasHistory = false;
        let allHistoryHtml = '';

        for (const item of items) {
            const itemHistory = await contract.methods.getItemBorrowHistory(item.id).call();
            
            if (itemHistory.length > 0) {
                hasHistory = true;
                let itemHistoryGrouped = {};

                // Mengelompokkan riwayat berdasarkan sesi peminjaman (borrower + purpose + borrowTime)
                itemHistory.forEach(record => {
                    // Gunakan recordId yang unik untuk setiap entri history sebagai bagian dari kunci grup
                    // Ini memastikan bahwa setiap transaksi borrow/return tercatat secara individual
                    const sessionKey = `${record.borrower}-${record.purpose}-${record.borrowTime}`;

                    if (!itemHistoryGrouped[sessionKey]) {
                        itemHistoryGrouped[sessionKey] = {
                            item: item, // Simpan detail item
                            borrower: record.borrower,
                            borrowerName: record.borrowerName, // Pastikan ini tersedia atau gunakan formatAddress
                            purpose: record.purpose,
                            borrowTime: Number(record.borrowTime),
                            initialQuantity: 0, // Akan diisi dari record peminjaman pertama di sesi ini
                            returnedQuantity: 0,
                            records: [] // Untuk menyimpan semua event terkait sesi ini (pinjam & kembali)
                        };
                    }

                    // Tambahkan record ke sesi yang sesuai
                    itemHistoryGrouped[sessionKey].records.push(record);

                    // Update initialQuantity jika ini adalah record peminjaman
                    if (!record.isReturned) {
                         itemHistoryGrouped[sessionKey].initialQuantity += Number(record.quantity);
                    } else {
                        // Jika ini adalah event pengembalian, tambahkan ke total returnedQuantity untuk sesi ini
                        itemHistoryGrouped[sessionKey].returnedQuantity += Number(record.returnedQuantity);
                    }
                });

                // Urutkan berdasarkan waktu peminjaman terbaru dulu
                const sortedSessions = Object.values(itemHistoryGrouped).sort((a, b) => b.borrowTime - a.borrowTime);

                let itemHtmlForHistory = `<h3>Riwayat untuk: ${item.name}</h3>`;
                
                sortedSessions.forEach(session => {
                    const remainingBorrowed = session.initialQuantity - session.returnedQuantity;
                    const isFullyReturned = remainingBorrowed === 0;

                    itemHtmlForHistory += `
                        <div class="history-record-group ${isFullyReturned ? 'fully-returned' : 'still-borrowed'}">
                            <p><strong>Peminjam:</strong> ${session.borrowerName} (${formatAddress(session.borrower)})</p>
                            <p><strong>Tujuan:</strong> ${session.purpose}</p>
                            <p><strong>Jumlah Dipinjam Awal:</strong> ${session.initialQuantity}</p>
                            <p><strong>Waktu Pinjam:</strong> ${formatDate(session.borrowTime)}</p>
                            <p><strong>Status:</strong> 
                                ${isFullyReturned ? `✅ Dikembalikan Penuh` : `⏳ Masih Dipinjam (${remainingBorrowed} tersisa)`}
                            </p>
                            ${isFullyReturned && session.records.some(r => r.isReturned && Number(r.returnTime) > 0) ? 
                                `<p><strong>Waktu Pengembalian Terakhir:</strong> ${formatDate(Math.max(...session.records.filter(r => r.isReturned).map(r => Number(r.returnTime))))}</p>` : ''
                            }
                            <div class="sub-history">
                                <h4>Detail Transaksi:</h4>
                                ${session.records.sort((a, b) => Number(a.borrowTime) - Number(b.borrowTime)).map(subRecord => `
                                    <p class="sub-history-item">
                                        ${Number(subRecord.returnedQuantity) > 0 ? 
                                            `&bull; Dikembalikan: ${Number(subRecord.returnedQuantity)} unit pada ${formatDate(subRecord.returnTime)}` :
                                            `&bull; Dipinjam: ${Number(subRecord.quantity)} unit pada ${formatDate(subRecord.borrowTime)}`
                                        }
                                    </p>
                                `).join('')}
                            </div>
                        </div>
                    `;
                });
                allHistoryHtml += `<div class="history-card">${itemHtmlForHistory}</div>`;
            }
        }
        
        if (!hasHistory) {
            container.innerHTML = '<div class="empty-state">Belum ada histori peminjaman</div>';
        } else {
            container.innerHTML = allHistoryHtml;
        }
    } catch (error) {
        console.error('Error loading history:', error);
        container.innerHTML = '<div class="empty-state">Gagal memuat histori.</div>';
    }
}

async function loadOwnerInfo() {
    if (!contract) return;
    const ownerSpan = document.getElementById('contract-owner-address');
    try {
        const adminRole = await contract.methods.DEFAULT_ADMIN_ROLE().call();
        const pastEvents = await contract.getPastEvents('RoleGranted', {
            filter: { role: adminRole },
            fromBlock: 0, 
            toBlock: 'latest'
        });
        if (pastEvents && pastEvents.length > 0) {
            const ownerAddress = pastEvents[0].returnValues.account;
            ownerSpan.textContent = ownerAddress;
        } else {
            ownerSpan.textContent = 'Owner tidak ditemukan.';
        }
    } catch (error) {
        console.error('Error loading owner info:', error);
        if(ownerSpan) ownerSpan.textContent = 'Gagal memuat info owner.';
    }
}

async function filterItems() {
    if (!contract) return;
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const selectedCategory = document.getElementById('filter-category').value;
    const availableOnly = document.getElementById('show-available-only').checked;
    
    try {
        const allItems = await contract.methods.getAllItems().call(); // Memanggil semua item dari kontrak
        const filtered = allItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) || // Mencocokkan nama dengan istilah pencarian
                                item.description.toLowerCase().includes(searchTerm); // Mencocokkan deskripsi dengan istilah pencarian
            const matchesCategory = !selectedCategory || item.category === selectedCategory; // Mencocokkan kategori
            const matchesAvailable = !availableOnly || Number(item.availableQuantity) > 0; // Mencocokkan ketersediaan
            return matchesSearch && matchesCategory && matchesAvailable; // Menggabungkan semua kondisi
        });
        await displayItems(filtered); // Menampilkan item yang sudah difilter
    } catch (error) {
        console.error('Error filtering items:', error);
    }
}

function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function formatDate(timestamp) {
    if (Number(timestamp) === 0) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString('id-ID', { timeZone: 'Asia/Makassar' }); // WITA timezone
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connect-wallet').addEventListener('click', init);
    document.querySelector('#borrow-modal .close').addEventListener('click', closeModal);
        document.getElementById('borrow-form').addEventListener('submit', (e) => {
        e.preventDefault();
        borrowItem();
    });
        document.getElementById('add-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addItem();
    });
    document.getElementById('add-aslab-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addAslab();
    });
    document.getElementById('search-items').addEventListener('input', filterItems);
    document.getElementById('filter-category').addEventListener('change', filterItems);
    document.getElementById('show-available-only').addEventListener('change', filterItems);

    init(); 
});