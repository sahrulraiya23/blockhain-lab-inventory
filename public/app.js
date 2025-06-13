// Contract ABI dan Address (akan diisi setelah deploy)
const CONTRACT_ADDRESS = '0x230BEc35EfD3731aa058C44b37DbB0574e644d60';
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
          "internalType": "string",
          "name": "category",
          "type": "string"
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
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
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
          "name": "itemId",
          "type": "uint256"
        },
        {
          "indexed": true,
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
          "internalType": "string",
          "name": "category",
          "type": "string"
        }
      ],
      "name": "ItemUpdated",
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
              "internalType": "bool",
              "name": "isAvailable",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "currentBorrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "borrowTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
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
      "inputs": [],
      "name": "getAvailableItems",
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
              "internalType": "bool",
              "name": "isAvailable",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "currentBorrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "borrowTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
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
      "name": "getItem",
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
              "internalType": "bool",
              "name": "isAvailable",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "currentBorrower",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "borrowTimestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "location",
              "type": "string"
            }
          ],
          "internalType": "struct LabInventory.Item",
          "name": "",
          "type": "tuple"
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
              "name": "itemId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "borrower",
              "type": "address"
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
          "name": "itemId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "borrower",
          "type": "address"
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
          "internalType": "bool",
          "name": "isAvailable",
          "type": "bool"
        },
        {
          "internalType": "address",
          "name": "currentBorrower",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "borrowTimestamp",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "location",
          "type": "string"
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
      "inputs": [],
      "name": "totalItems",
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
      "name": "userBorrowedItems",
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
]// Akan diisi dengan ABI dari artifacts

let web3;
let contract;
let currentAccount;

// Initialize Web3 dan Contract
async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        
        // Check if already connected
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            currentAccount = accounts[0];
            updateWalletUI();
            loadInventory();
        }
    } else {
        alert('MetaMask tidak terdeteksi. Silakan install MetaMask terlebih dahulu.');
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        currentAccount = accounts[0];
        updateWalletUI();
        loadInventory();
    } catch (error) {
        console.error('Error connecting wallet:', error);
        alert('Gagal menghubungkan wallet');
    }
}

// Update Wallet UI
function updateWalletUI() {
    const connectButton = document.getElementById('connect-wallet');
    const accountAddress = document.getElementById('account-address');
    
    if (currentAccount) {
        connectButton.textContent = 'Connected';
        connectButton.disabled = true;
        accountAddress.textContent = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
    }
}

// Load Inventory
async function loadInventory() {
    try {
        const items = await contract.methods.getAllItems().call();
        displayItems(items);
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
}

// Display Items
function displayItems(items) {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div class="loading">Tidak ada item dalam inventaris</div>';
        return;
    }
    
    items.forEach(item => {
        const itemCard = createItemCard(item);
        container.appendChild(itemCard);
    });
}

// Create Item Card
function createItemCard(item) {
    const card = document.createElement('div');
    card.className = `item-card ${!item.isAvailable ? 'unavailable' : ''}`;
    
    card.innerHTML = `
        <div class="item-header">
            <div>
                <h3>${item.name}</h3>
                <p><strong>Kategori:</strong> ${item.category}</p>
                <p><strong>Lokasi:</strong> ${item.location}</p>
                <p><strong>Deskripsi:</strong> ${item.description}</p>
            </div>
            <div class="item-status ${item.isAvailable ? 'status-available' : 'status-borrowed'}">
                ${item.isAvailable ? '✅ Tersedia' : '❌ Dipinjam'}
            </div>
        </div>
        ${!item.isAvailable ? `<p><small>Dipinjam oleh: ${item.currentBorrower}</small></p>` : ''}
        <div class="item-actions">
            ${item.isAvailable ? 
                `<button class="btn btn-primary" onclick="openBorrowModal(${item.id})">Pinjam</button>` :
                (item.currentBorrower.toLowerCase() === currentAccount.toLowerCase() ?
                    `<button class="btn btn-danger" onclick="returnItem(${item.id})">Kembalikan</button>` :
                    ''
                )
            }
        </div>
    `;
    
    return card;
}

// Open Borrow Modal
function openBorrowModal(itemId) {
    document.getElementById('borrow-item-id').value = itemId;
    document.getElementById('borrow-modal').style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('borrow-modal').style.display = 'none';
}

// Borrow Item
async function borrowItem() {
    const itemId = document.getElementById('borrow-item-id').value;
    const borrowerName = document.getElementById('borrower-name').value;
    const purpose = document.getElementById('borrow-purpose').value;
    
    try {
        await contract.methods.borrowItem(itemId, borrowerName, purpose)
            .send({ from: currentAccount });
        
        alert('Item berhasil dipinjam!');
        closeModal();
        loadInventory();
        document.getElementById('borrow-form').reset();
    } catch (error) {
        console.error('Error borrowing item:', error);
        alert('Gagal meminjam item');
    }
}

// Return Item
async function returnItem(itemId) {
    try {
        await contract.methods.returnItem(itemId)
            .send({ from: currentAccount });
        
        alert('Item berhasil dikembalikan!');
        loadInventory();
    } catch (error) {
        console.error('Error returning item:', error);
        alert('Gagal mengembalikan item');
    }
}

// Add Item (Admin)
async function addItem() {
    const name = document.getElementById('item-name').value;
    const category = document.getElementById('item-category').value;
    const description = document.getElementById('item-description').value;
    const location = document.getElementById('item-location').value;
    
    try {
        await contract.methods.addItem(name, category, description, location)
            .send({ from: currentAccount });
        
        alert('Item berhasil ditambahkan!');
        document.getElementById('add-item-form').reset();
        loadInventory();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Gagal menambahkan item. Pastikan Anda adalah admin.');
    }
}

// Tab Navigation
function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
    
    // Load specific data for each tab
    if (tabName === 'borrow') {
        loadMyBorrows();
    } else if (tabName === 'history') {
        loadHistory();
    }
}

// Load My Borrows
async function loadMyBorrows() {
    if (!currentAccount) return;
    
    try {
        const borrowedItemIds = await contract.methods.getUserBorrowedItems(currentAccount).call();
        const container = document.getElementById('my-borrows-container');
        container.innerHTML = '';
        
        if (borrowedItemIds.length === 0) {
            container.innerHTML = '<div class="loading">Anda tidak memiliki item yang dipinjam</div>';
            return;
        }
        
        for (const itemId of borrowedItemIds) {
            const item = await contract.methods.getItem(itemId).call();
            const itemCard = createItemCard(item);
            container.appendChild(itemCard);
        }
    } catch (error) {
        console.error('Error loading my borrows:', error);
    }
}

// Load History
async function loadHistory() {
    try {
        const items = await contract.methods.getAllItems().call();
        const container = document.getElementById('history-container');
        container.innerHTML = '';
        
        let hasHistory = false;
        
        for (const item of items) {
            const history = await contract.methods.getItemBorrowHistory(item.id).call();
            
            if (history.length > 0) {
                hasHistory = true;
                const historyCard = document.createElement('div');
                historyCard.className = 'item-card';
                
                let historyHTML = `
                    <h3>${item.name}</h3>
                    <div class="history-list">
                `;
                
                history.forEach(record => {
                    const borrowDate = new Date(record.borrowTime * 1000).toLocaleString();
                    const returnDate = record.isReturned ? 
                        new Date(record.returnTime * 1000).toLocaleString() : 
                        'Belum dikembalikan';
                    
                    historyHTML += `
                        <div class="history-item">
                            <p><strong>Peminjam:</strong> ${record.borrowerName}</p>
                            <p><strong>Tujuan:</strong> ${record.purpose}</p>
                            <p><strong>Tanggal Pinjam:</strong> ${borrowDate}</p>
                            <p><strong>Tanggal Kembali:</strong> ${returnDate}</p>
                            <p><strong>Status:</strong> ${record.isReturned ? '✅ Dikembalikan' : '⏳ Dipinjam'}</p>
                            <hr>
                        </div>
                    `;
                });
                
                historyHTML += '</div>';
                historyCard.innerHTML = historyHTML;
                container.appendChild(historyCard);
            }
        }
        
        if (!hasHistory) {
            container.innerHTML = '<div class="loading">Belum ada history peminjaman</div>';
        }
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Search and Filter Functions
function setupFilters() {
    const searchInput = document.getElementById('search-items');
    const categoryFilter = document.getElementById('filter-category');
    const availableOnlyCheckbox = document.getElementById('show-available-only');
    
    searchInput.addEventListener('input', filterItems);
    categoryFilter.addEventListener('change', filterItems);
    availableOnlyCheckbox.addEventListener('change', filterItems);
}

async function filterItems() {
    const searchTerm = document.getElementById('search-items').value.toLowerCase();
    const selectedCategory = document.getElementById('filter-category').value;
    const availableOnly = document.getElementById('show-available-only').checked;
    
    try {
        const allItems = await contract.methods.getAllItems().call();
        
        const filteredItems = allItems.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                                item.description.toLowerCase().includes(searchTerm);
            const matchesCategory = !selectedCategory || item.category === selectedCategory;
            const matchesAvailable = !availableOnly || item.isAvailable;
            
            return matchesSearch && matchesCategory && matchesAvailable;
        });
        
        displayItems(filteredItems);
    } catch (error) {
        console.error('Error filtering items:', error);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    initWeb3();
    setupFilters();
    
    // Connect wallet button
    document.getElementById('connect-wallet').addEventListener('click', connectWallet);
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Borrow form submit
    document.getElementById('borrow-form').addEventListener('submit', function(e) {
        e.preventDefault();
        borrowItem();
    });
    
    // Add item form submit
    document.getElementById('add-item-form').addEventListener('submit', function(e) {
        e.preventDefault();
        addItem();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('borrow-modal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Handle account changes in MetaMask
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            currentAccount = accounts[0];
            updateWalletUI();
            if (currentAccount) {
                loadInventory();
            }
        });
    }
});

// Utility Functions
function formatAddress(address) {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
}

function formatDate(timestamp) {
    return new Date(timestamp * 1000).toLocaleString('id-ID');
}