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
            DEFAULT_ADMIN_ROLE = await contract.methods.DEFAULT_ADMIN_ROLE().call();
            
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
    }
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
    if (!currentAccount || !contract) {
        adminTabButton.style.display = 'none';
        return;
    }

    try {
        const isAslab = await contract.methods.hasRole(ASLAB_ROLE, currentAccount).call();
        const isAdmin = await contract.methods.hasRole(ADMIN_ROLE, currentAccount).call();

        if (isAslab || isAdmin) {
            adminTabButton.style.display = 'flex';
        } else {
            adminTabButton.style.display = 'none';
        }
    } catch (error) {
        console.error("Error checking role:", error);
        adminTabButton.style.display = 'none';
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

async function addItem() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const description = document.getElementById('item-description').value;
    const location = document.getElementById('item-location').value;
    const quantity = document.getElementById('item-quantity').value;

    try {
        await contract.methods.addItem(name, category, description, location, quantity).send({ from: currentAccount });
        alert('Item berhasil ditambahkan!');
        document.getElementById('add-item-form').reset();
        loadInventory();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Gagal menambahkan item. Pastikan Anda adalah admin atau aslab.');
    }
}

function openBorrowModal(itemId) {
    if (!currentAccount) {
        alert("Silakan hubungkan wallet Anda terlebih dahulu.");
        return;
    }
    document.getElementById('borrow-item-id').value = itemId;
    document.getElementById('borrower-name').value = currentAccount; 
    document.getElementById('borrow-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('borrow-modal').style.display = 'none';
}

async function borrowItem() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const itemId = document.getElementById('borrow-item-id').value;
    const purpose = document.getElementById('borrow-purpose').value;
    
    try {
        // Nama peminjam sekarang diambil dari alamat wallet yang terhubung
        await contract.methods.borrowItem(itemId, currentAccount, purpose).send({ from: currentAccount });
        alert('Item berhasil dipinjam!');
        closeModal();
        loadInventory();
        loadMyBorrows();
        document.getElementById('borrow-form').reset();
    } catch (error) {
        console.error('Error borrowing item:', error);
        alert('Gagal meminjam item: ' + (error.message || error.data?.message));
    }
}

async function returnItem(itemId) {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    try {
        await contract.methods.returnItem(itemId).send({ from: currentAccount });
        alert('Item berhasil dikembalikan!');
        loadInventory();
        loadMyBorrows();
    } catch (error) {
        console.error('Error returning item:', error);
        alert('Gagal mengembalikan item: ' + (error.message || error.data?.message));
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
        // Cek jumlah yang dipinjam oleh user saat ini
        const userBorrowedCount = currentAccount ? await contract.methods.userBorrowedCount(currentAccount, item.id).call() : 0;
        
        const itemCard = createItemCard(item, Number(userBorrowedCount));
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
        <p><strong>Lokasi:</strong> ${item.location}</p>
        <p><strong>Deskripsi:</strong> ${item.description}</p>
        <div class="item-actions">
            <button class="btn btn-primary" onclick="openBorrowModal(${itemId})" ${availableQuantity === 0 ? 'disabled' : ''}>Pinjam</button>
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
                <p><strong>Jumlah Dipinjam:</strong> ${borrowedCounts[index]}</p>
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

async function loadHistory() {
    if (!contract) return;
    const container = document.getElementById('history-container');
    container.innerHTML = '<div class="loading">Loading history...</div>';
    try {
        const items = await contract.methods.getAllItems().call();
        let hasHistory = false;
        let allHistoryHtml = '';

        for (const item of items) {
            const history = await contract.methods.getItemBorrowHistory(item.id).call();
            if (history.length > 0) {
                hasHistory = true;
                let historyHTML = `<h3>Riwayat untuk: ${item.name}</h3>`;
                history.slice().reverse().forEach(record => {
                    historyHTML += `
                        <div class="history-item">
                            <p><strong>Peminjam:</strong> ${record.borrowerName} (${formatAddress(record.borrower)})</p>
                            <p><strong>Tujuan:</strong> ${record.purpose}</p>
                            <p><strong>Waktu Pinjam:</strong> ${formatDate(record.borrowTime)}</p>
                            <p><strong>Status:</strong> ${record.isReturned ? `✅ Dikembalikan pada ${formatDate(record.returnTime)}` : '⏳ Masih Dipinjam'}</p>
                        </div>
                    `;
                });
                allHistoryHtml += `<div class="history-card">${historyHTML}</div>`;
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
    try {
        const adminAddress = await contract.methods.getRoleMember(DEFAULT_ADMIN_ROLE, 0).call();
        const ownerSpan = document.getElementById('contract-owner-address');
        if (ownerSpan) {
            ownerSpan.textContent = adminAddress;
        }
    } catch (error) {
        console.error('Error loading owner info:', error);
        const ownerSpan = document.getElementById('contract-owner-address');
        if(ownerSpan) ownerSpan.textContent = 'Gagal memuat.';
    }
}

async function filterItems() {
    if (!contract) return;
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const selectedCategory = document.getElementById('filter-category').value;
    const availableOnly = document.getElementById('show-available-only').checked;
    
    try {
        const allItems = await contract.methods.getAllItems().call();
        const filtered = allItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            const matchesAvailable = !availableOnly || Number(item.availableQuantity) > 0;
            return matchesSearch && matchesCategory && matchesAvailable;
        });
        await displayItems(filtered);
    } catch (error) {
        console.error('Error filtering items:', error);
    }
}

function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function formatDate(timestamp) {
    if (Number(timestamp) === 0) return 'N/A';
    return new Date(Number(timestamp) * 1000).toLocaleString('id-ID');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('connect-wallet').addEventListener('click', init);
    document.querySelector('.close').addEventListener('click', closeModal);
    
    document.getElementById('borrow-form').addEventListener('submit', (e) => {
        e.preventDefault();
        borrowItem();
    });
    
    document.getElementById('add-item-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addItem();
    });
    
    document.getElementById('search-items').addEventListener('input', filterItems);
    document.getElementById('filter-category').addEventListener('change', filterItems);
    document.getElementById('show-available-only').addEventListener('change', filterItems);

    // Langsung panggil init untuk memulai koneksi saat halaman dimuat
    init(); 
});