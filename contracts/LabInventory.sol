// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LabInventory is AccessControl, ReentrancyGuard {
    // Struktur untuk merepresentasikan item di inventaris
    struct Item {
        uint256 id;
        string name;
        string category;
        string description;
        uint256 totalQuantity; // Total stok keseluruhan item
        uint256 availableQuantity; // Stok item yang tersedia untuk dipinjam
    }

    // Struktur untuk merepresentasikan catatan peminjaman
    struct BorrowRecord {
        uint256 recordId;
        uint256 itemId;
        address borrower;
        string borrowerName;
        string purpose;
        uint256 quantity; // Jumlah item yang dipinjam dalam catatan ini
        uint256 returnedQuantity; // Jumlah item yang sudah dikembalikan dari catatan ini
        uint256 borrowTime;
        uint256 returnTime; // Waktu saat semua item dalam catatan ini dikembalikan, atau waktu pengembalian terakhir
        bool isReturned; // True jika semua item dalam catatan ini sudah dikembalikan
    }

    // Mendefinisikan peran menggunakan hash keccak256
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ASLAB_ROLE = keccak256("ASLAB_ROLE");

    // Penghitung manual untuk ID item dan ID catatan peminjaman
    uint256 public nextItemId;
    uint256 public nextRecordId;

    // Mapping untuk menyimpan data item berdasarkan ID
    mapping(uint256 => Item) public items;
    // Mapping untuk menyimpan riwayat peminjaman setiap item
    mapping(uint256 => BorrowRecord[]) public itemBorrowHistory;
    // Mapping untuk melacak total jumlah item yang sedang dipinjam oleh seorang pengguna
    // userAddress => itemId => totalBorrowedQuantityByThisUserForThisItem
    mapping(address => mapping(uint256 => uint256)) public userBorrowedCount;

    // Events untuk memberi tahu tentang perubahan status item
    event ItemAdded(uint256 indexed itemId, string name, uint256 quantity);
    event ItemBorrowed(
        uint256 indexed recordId,
        uint256 indexed itemId,
        address borrower,
        string borrowerName,
        uint256 quantity // Jumlah item yang dipinjam
    );
    event ItemReturned(
        uint256 indexed recordId,
        uint256 indexed itemId,
        address borrower,
        uint256 quantityReturned, // Jumlah item yang dikembalikan dalam transaksi ini
        uint256 remainingBorrowedByThisUser // Jumlah total yang masih dipinjam oleh pengguna ini untuk item ini
    );

    // Constructor: dijalankan saat kontrak pertama kali di-deploy
    constructor() {
        // Memberikan peran ADMIN_ROLE dan DEFAULT_ADMIN_ROLE kepada deployer kontrak
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        // Menetapkan ADMIN_ROLE sebagai admin untuk peran ASLAB_ROLE
        _setRoleAdmin(ASLAB_ROLE, ADMIN_ROLE);

        // Menginisialisasi penghitung ID
        nextItemId = 1;
        nextRecordId = 1;
    }

    /**
     * @notice Menambahkan peran ASLAB_ROLE kepada alamat tertentu.
     * @dev Hanya dapat dipanggil oleh akun dengan ADMIN_ROLE.
     * @param _aslabAddress Alamat akun yang akan diberi peran Aslab.
     */
    function addAslab(address _aslabAddress) public onlyRole(ADMIN_ROLE) {
        grantRole(ASLAB_ROLE, _aslabAddress);
    }

    /**
     * @notice Menghapus peran ASLAB_ROLE dari alamat tertentu.
     * @dev Hanya dapat dipanggil oleh akun dengan ADMIN_ROLE.
     * @param _aslabAddress Alamat akun yang akan dihapus perannya.
     */
    function removeAslab(address _aslabAddress) public onlyRole(ADMIN_ROLE) {
        revokeRole(ASLAB_ROLE, _aslabAddress);
    }

    /**
     * @notice Menambahkan item baru ke inventaris.
     * @dev Hanya dapat dipanggil oleh akun dengan ADMIN_ROLE atau ASLAB_ROLE.
     * @param _name Nama item.
     * @param _category Kategori item.
     * @param _description Deskripsi item.
     * @param _quantity Jumlah awal item yang tersedia.
     */
    function addItem(
        string memory _name,
        string memory _category,
        string memory _description,
        uint256 _quantity
    ) public {
        require(
            hasRole(ADMIN_ROLE, msg.sender) || hasRole(ASLAB_ROLE, msg.sender),
            "Caller is not an admin or aslab"
        );
        require(_quantity > 0, "Quantity must be greater than 0");

        items[nextItemId] = Item(
            nextItemId,
            _name,
            _category,
            _description,
            _quantity, // totalQuantity diset ke _quantity awal
            _quantity // availableQuantity juga diset ke _quantity awal
        );
        emit ItemAdded(nextItemId, _name, _quantity);
        nextItemId++;
    }

    /**
     * @notice Meminjam item dari inventaris.
     * @dev Mengurangi 'availableQuantity' dan menambahkan catatan peminjaman.
     * @param _itemId ID dari item yang akan dipinjam.
     * @param _borrowerName Nama peminjam.
     * @param _purpose Tujuan peminjaman.
     * @param _quantityToBorrow Jumlah item yang akan dipinjam.
     */
    function borrowItem(
        uint256 _itemId,
        string memory _borrowerName,
        string memory _purpose,
        uint256 _quantityToBorrow
    ) public nonReentrant {
        // Memastikan item ada dan ID valid
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        Item storage item = items[_itemId];
        require(item.id != 0, "Item does not exist (invalid ID)");

        // Memastikan jumlah yang dipinjam lebih dari 0
        require(
            _quantityToBorrow > 0,
            "Quantity to borrow must be greater than 0"
        );
        // Memastikan stok tersedia mencukupi
        require(
            item.availableQuantity >= _quantityToBorrow,
            "Item not available in this quantity"
        );

        // Mengurangi stok yang tersedia
        item.availableQuantity -= _quantityToBorrow;
        // Menambah jumlah total yang dipinjam oleh pengguna ini untuk item ini
        userBorrowedCount[msg.sender][_itemId] += _quantityToBorrow;

        // Menambahkan catatan peminjaman baru
        itemBorrowHistory[_itemId].push(
            BorrowRecord({
                recordId: nextRecordId,
                itemId: _itemId,
                borrower: msg.sender,
                borrowerName: _borrowerName,
                purpose: _purpose,
                quantity: _quantityToBorrow,
                returnedQuantity: 0, // Awalnya, 0 item telah dikembalikan dari catatan ini
                borrowTime: block.timestamp,
                returnTime: 0,
                isReturned: false
            })
        );

        // Memicu event ItemBorrowed
        emit ItemBorrowed(
            nextRecordId,
            _itemId,
            msg.sender,
            _borrowerName,
            _quantityToBorrow
        );
        nextRecordId++;
    }

    /**
     * @notice Mengembalikan item ke inventaris.
     * @dev Mengembalikan 'availableQuantity' dan memperbarui catatan peminjaman.
     * @param _itemId ID dari item yang akan dikembalikan.
     * @param _quantityToReturn Jumlah item yang akan dikembalikan.
     */
    function returnItem(
        uint256 _itemId,
        uint256 _quantityToReturn
    ) public nonReentrant {
        // Memastikan item ada dan ID valid
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        Item storage item = items[_itemId];
        require(item.id != 0, "Item does not exist (invalid ID)");

        // Memastikan jumlah yang dikembalikan lebih dari 0
        require(
            _quantityToReturn > 0,
            "Quantity to return must be greater than 0"
        );
        // Memastikan pengguna tidak mengembalikan lebih dari yang dipinjam
        require(
            userBorrowedCount[msg.sender][_itemId] >= _quantityToReturn,
            "You are trying to return more than you borrowed, or have not borrowed this item"
        );

        // Menambah stok yang tersedia di inventaris
        item.availableQuantity += _quantityToReturn;
        // Mengurangi jumlah total yang dipinjam oleh pengguna ini untuk item ini
        userBorrowedCount[msg.sender][_itemId] -= _quantityToReturn;

        // Logic untuk memperbarui catatan peminjaman spesifik
        uint256 remainingToReturn = _quantityToReturn;
        // Iterasi dari catatan terbaru ke yang terlama
        for (
            uint i = itemBorrowHistory[_itemId].length;
            i > 0 && remainingToReturn > 0;
            i--
        ) {
            BorrowRecord storage record = itemBorrowHistory[_itemId][i - 1];
            // Hanya perbarui catatan milik pemanggil dan yang belum sepenuhnya dikembalikan
            if (
                record.borrower == msg.sender &&
                record.returnedQuantity < record.quantity
            ) {
                // Hitung berapa banyak yang bisa dikembalikan dalam catatan ini
                uint256 canReturnInThisRecord = record.quantity -
                    record.returnedQuantity;
                // Ambil nilai minimum antara sisa yang perlu dikembalikan dan yang bisa dikembalikan di catatan ini
                uint256 actualReturnForThisRecord = (remainingToReturn <
                    canReturnInThisRecord)
                    ? remainingToReturn
                    : canReturnInThisRecord;

                // Perbarui jumlah yang telah dikembalikan dalam catatan ini
                record.returnedQuantity += actualReturnForThisRecord;
                // Kurangi sisa yang perlu dikembalikan
                remainingToReturn -= actualReturnForThisRecord;

                // Jika semua item dalam catatan ini sudah dikembalikan
                if (record.returnedQuantity == record.quantity) {
                    record.isReturned = true;
                    record.returnTime = block.timestamp; // Catat waktu pengembalian penuh
                }
                // Emit event ItemReturned untuk setiap operasi pengembalian yang berhasil dikaitkan dengan record
                emit ItemReturned(
                    record.recordId,
                    _itemId,
                    msg.sender,
                    actualReturnForThisRecord,
                    userBorrowedCount[msg.sender][_itemId] // Sisa yang dipinjam oleh pengguna
                );
            }
        }
    }

    // --- View Functions ---

    /**
     * @notice Mendapatkan semua item yang ada di inventaris.
     * @dev Mengembalikan array dari semua objek Item.
     * @return allItems Array memory dari semua Item.
     */
    function getAllItems() public view returns (Item[] memory) {
        uint256 itemCount = 0;
        for (uint256 i = 1; i < nextItemId; i++) {
            if (items[i].id != 0) {
                // Pastikan item dengan ID ini benar-benar ada
                itemCount++;
            }
        }

        Item[] memory allItems = new Item[](itemCount);
        uint256 index = 0;
        for (uint256 i = 1; i < nextItemId; i++) {
            if (items[i].id != 0) {
                allItems[index] = items[i];
                index++;
            }
        }
        return allItems;
    }

    /**
     * @notice Mendapatkan daftar item yang sedang dipinjam oleh pengguna tertentu.
     * @param _user Alamat pengguna.
     * @return borrowed Array memory dari Item yang dipinjam.
     * @return borrowedCounts Array memory dari jumlah masing-masing item yang dipinjam.
     */
    function getUserBorrowedItems(
        address _user
    ) public view returns (Item[] memory, uint256[] memory) {
        uint256 count = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (userBorrowedCount[_user][i] > 0) {
                count++;
            }
        }

        Item[] memory borrowed = new Item[](count);
        uint256[] memory borrowedCounts = new uint256[](count);
        uint256 index = 0;
        for (uint i = 1; i < nextItemId; i++) {
            if (userBorrowedCount[_user][i] > 0) {
                borrowed[index] = items[i];
                borrowedCounts[index] = userBorrowedCount[_user][i];
                index++;
            }
        }
        return (borrowed, borrowedCounts);
    }

    /**
     * @notice Mendapatkan riwayat peminjaman untuk item tertentu.
     * @param _itemId ID dari item.
     * @return BorrowRecord[] memory Array dari catatan peminjaman.
     */
    function getItemBorrowHistory(
        uint256 _itemId
    ) public view returns (BorrowRecord[] memory) {
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        return itemBorrowHistory[_itemId];
    }

    /**
     * @notice Memeriksa apakah akun memiliki peran tertentu.
     * @dev Fungsi wrapper untuk hasRole dari AccessControl.sol.
     * @param role Peran yang akan diperiksa (e.g., ADMIN_ROLE, ASLAB_ROLE).
     * @param account Alamat akun yang akan diperiksa.
     * @return bool True jika akun memiliki peran tersebut, false jika tidak.
     */
    function hasRole(
        bytes32 role,
        address account
    ) public view override returns (bool) {
        return super.hasRole(role, account);
    }
}
