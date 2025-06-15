// Contract ABI dan Address (akan diisi setelah deploy)
const CONTRACT_ADDRESS = '0xaa1970D6AE41ffE73a4707c751089618987dda1f';
const CONTRACT_ABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quantity",
          "type": "uint256"
        }
      ],
      "name": "ItemAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "recordId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "borrowerName",
          "type": "string"
        }
      ],
      "name": "ItemBorrowed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "recordId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        }
      ],
      "name": "ItemReturned",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_category",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_location",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_quantity",
          "type": "uint256"
        }
      ],
      "name": "addItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_borrowerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_purpose",
          "type": "string"
        }
      ],
      "name": "borrowItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "totalQuantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "availableQuantity",
              "type": "uint256"
            }
          ],
          "internalType": "struct LabInventory.Item[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "getItemBorrowHistory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "recordId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
            },
            {
              "internalType": "string",
              "name": "borrowerName",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "purpose",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "borrowTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "returnTime",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isReturned",
              "type": "bool"
            }
          ],
          "internalType": "struct LabInventory.BorrowRecord[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "getUserBorrowedItems",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "category",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "totalQuantity",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "availableQuantity",
              "type": "uint256"
            }
          ],
          "internalType": "struct LabInventory.Item[]",
          "name": "",
          "type": "tuple[]"
        },
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "itemBorrowHistory",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "recordId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "itemId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "borrowerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "purpose",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "borrowTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "returnTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isReturned",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "items",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "category",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "totalQuantity",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "availableQuantity",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextItemId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "nextRecordId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_itemId",
          "type": "uint256"
        }
      ],
      "name": "returnItem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "userBorrowedCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
  // Akan diisi dengan ABI dari artifacts
let web3;
let contract;
let currentAccount;

// Initialize Web3 dan Contract
async function init() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
            
            const accounts = await web3.eth.getAccounts();
            handleAccountsChanged(accounts);

            window.ethereum.on('accountsChanged', handleAccountsChanged);

        } catch (error) {
            console.error("User denied account access", error);
            alert('Anda harus menghubungkan MetaMask untuk menggunakan aplikasi ini.');
        }
    } else {
        alert('MetaMask tidak terdeteksi. Silakan install MetaMask.');
    }
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        currentAccount = null;
    } else {
        currentAccount = accounts[0];
    }
    updateWalletUI();
    // Muat ulang data setiap kali akun berganti
    if (document.getElementById('inventory').classList.contains('active')) loadInventory();
    if (document.getElementById('borrow').classList.contains('active')) loadMyBorrows();
    if (document.getElementById('history').classList.contains('active')) loadHistory();
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

async function loadInventory() {
    if (!contract) return;
    try {
        const items = await contract.methods.getAllItems().call();
        displayItems(items);
    } catch (error) {
        console.error('Error loading inventory:', error);
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
        const userBorrowed = currentAccount ? Number(await contract.methods.userBorrowedCount(currentAccount, item.id).call()) : 0;
        const itemCard = createItemCard(item, userBorrowed);
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
        <div>
            <h3>${item.name}</h3>
            <p><strong>Kategori:</strong> ${item.category}</p>
            <p><strong>Lokasi:</strong> ${item.location}</p>
            <p><strong>Deskripsi:</strong> ${item.description}</p>
        </div>
        <div>
            <div class="item-quantity ${availableQuantity > 0 ? 'quantity-available' : 'quantity-none'}">
                Tersedia: ${availableQuantity} / ${totalQuantity}
            </div>
            <div class="item-actions">
                <button class="btn btn-primary" onclick="openBorrowModal(${itemId})" ${availableQuantity === 0 ? 'disabled' : ''}>Pinjam</button>
                <button class="btn btn-danger" onclick="returnItem(${itemId})" ${userBorrowedCount === 0 ? 'disabled' : ''}>Kembalikan</button>
            </div>
        </div>
    `;
    
    return card;
}

async function addItem() {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const description = document.getElementById('item-description').value;
    const location = document.getElementById('item-location').value;
    const quantity = document.getElementById('item-quantity').value;

    try {
        await contract.methods.addItem(name, category, description, location, quantity)
            .send({ from: currentAccount });
        
        alert('Item berhasil ditambahkan!');
        document.getElementById('add-item-form').reset();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Gagal menambahkan item. Pastikan Anda adalah admin.');
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
    const borrowerName = document.getElementById('borrower-name').value;
    const purpose = document.getElementById('borrow-purpose').value;
    
    try {
        await contract.methods.borrowItem(itemId, borrowerName, purpose)
            .send({ from: currentAccount });
        
        alert('Item berhasil dipinjam!');
        closeModal();
        loadInventory();
        loadMyBorrows();
        document.getElementById('borrow-form').reset();
    } catch (error) {
        console.error('Error borrowing item:', error);
        alert('Gagal meminjam item: ' + (error.data ? error.data.message : error.message));
    }
}

async function returnItem(itemId) {
    if (!currentAccount) return alert('Silakan hubungkan wallet Anda.');

    try {
        await contract.methods.returnItem(itemId)
            .send({ from: currentAccount });
        
        alert('Item berhasil dikembalikan!');
        loadInventory();
        loadMyBorrows();
    } catch (error) {
        console.error('Error returning item:', error);
        alert('Gagal mengembalikan item: ' + (error.data ? error.data.message : error.message));
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
}

async function loadMyBorrows() {
    if (!currentAccount || !contract) return;
    
    const container = document.getElementById('my-borrows-container');
    container.innerHTML = '';
    
    try {
        const result = await contract.methods.getUserBorrowedItems(currentAccount).call();
        const borrowedItems = result[0];
        const borrowedCounts = result[1];

        if (borrowedItems.length === 0) {
            container.innerHTML = '<div class="empty-state">Anda tidak memiliki item yang dipinjam</div>';
            return;
        }
        
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
    }
}

async function loadHistory() {
    if (!contract) return;
    const container = document.getElementById('history-container');
    container.innerHTML = '';
    
    try {
        const items = await contract.methods.getAllItems().call();
        let hasHistory = false;

        for (const item of items) {
const history = await contract.methods.getItemBorrowHistory(item.id).call();
            if (history.length > 0) {
                hasHistory = true;
                const historyCard = document.createElement('div');
                historyCard.className = 'history-card';
                
                let historyHTML = `<h3>${item.name}</h3>`;
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
                historyCard.innerHTML = historyHTML;
                container.appendChild(historyCard);
            }
        }
        
        if (!hasHistory) {
            container.innerHTML = '<div class="empty-state">Belum ada histori peminjaman</div>';
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}
async function loadOwnerInfo() {
    try {
        const ownerAddress = await contract.methods.owner().call();
        const ownerSpan = document.getElementById('contract-owner-address');
        if (ownerSpan) {
            ownerSpan.textContent = ownerAddress;
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

// Utility Functions
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

     initWeb3();
    setupFilters();
    loadOwnerInfo();
});