// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// DIUBAH: Mengganti Ownable dengan AccessControl
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

// DIUBAH: Menghapus Ownable dan menambahkan AccessControl
contract LabInventory is AccessControl, ReentrancyGuard {
    struct Item {
        uint256 id;
        string name;
        string category;
        string description;
        string location;
        uint256 totalQuantity;
        uint256 availableQuantity;
    }

    struct BorrowRecord {
        uint256 recordId;
        uint256 itemId;
        address borrower;
        string borrowerName;
        string purpose;
        uint256 borrowTime;
        uint256 returnTime;
        bool isReturned;
    }

    // DITAMBAHKAN: Mendefinisikan peran sebagai bytes32
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ASLAB_ROLE = keccak256("ASLAB_ROLE");

    uint256 public nextItemId;
    uint256 public nextRecordId;

    mapping(uint256 => Item) public items;
    mapping(uint256 => BorrowRecord[]) public itemBorrowHistory;
    mapping(address => mapping(uint256 => uint256)) public userBorrowedCount;

    event ItemAdded(uint256 indexed itemId, string name, uint256 quantity);
    event ItemBorrowed(
        uint256 indexed recordId,
        uint256 indexed itemId,
        address borrower,
        string borrowerName
    );
    event ItemReturned(
        uint256 indexed recordId,
        uint256 indexed itemId,
        address borrower
    );

    // DIUBAH: Constructor untuk setup AccessControl
    constructor() {
        // Alamat yang mendeploy kontrak ini akan mendapatkan peran super admin (DEFAULT_ADMIN_ROLE)
        // dan juga peran ADMIN_ROLE.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);

        // Menetapkan bahwa hanya ADMIN yang bisa memberikan atau mencabut peran ASLAB_ROLE.
        _setRoleAdmin(ASLAB_ROLE, ADMIN_ROLE);

        nextItemId = 1;
        nextRecordId = 1;
    }

    // DITAMBAHKAN: Fungsi untuk Admin menambah Aslab baru
    function addAslab(address _aslabAddress) public onlyRole(ADMIN_ROLE) {
        grantRole(ASLAB_ROLE, _aslabAddress);
    }

    // DITAMBAHKAN: Fungsi untuk Admin menghapus Aslab
    function removeAslab(address _aslabAddress) public onlyRole(ADMIN_ROLE) {
        revokeRole(ASLAB_ROLE, _aslabAddress);
    }

    // DIUBAH: Menghapus modifier 'onlyOwner' dan menggunakan pengecekan peran
    function addItem(
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _location,
        uint256 _quantity
    ) public {
        // Hanya alamat dengan ADMIN_ROLE atau ASLAB_ROLE yang bisa menjalankan fungsi ini
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
            _location,
            _quantity,
            _quantity
        );
        emit ItemAdded(nextItemId, _name, _quantity);
        nextItemId++;
    }

    function borrowItem(
        uint256 _itemId,
        string memory _borrowerName,
        string memory _purpose
    ) public nonReentrant {
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        Item storage item = items[_itemId];
        require(item.availableQuantity > 0, "Item not available");

        item.availableQuantity--;
        userBorrowedCount[msg.sender][_itemId]++;

        itemBorrowHistory[_itemId].push(
            BorrowRecord({
                recordId: nextRecordId,
                itemId: _itemId,
                borrower: msg.sender,
                borrowerName: _borrowerName,
                purpose: _purpose,
                borrowTime: block.timestamp,
                returnTime: 0,
                isReturned: false
            })
        );

        emit ItemBorrowed(nextRecordId, _itemId, msg.sender, _borrowerName);
        nextRecordId++;
    }

    function returnItem(uint256 _itemId) public nonReentrant {
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        require(
            userBorrowedCount[msg.sender][_itemId] > 0,
            "You have not borrowed this item"
        );

        Item storage item = items[_itemId];
        item.availableQuantity++;
        userBorrowedCount[msg.sender][_itemId]--;

        for (uint i = itemBorrowHistory[_itemId].length; i > 0; i--) {
            BorrowRecord storage record = itemBorrowHistory[_itemId][i - 1];
            if (record.borrower == msg.sender && !record.isReturned) {
                record.isReturned = true;
                record.returnTime = block.timestamp;
                emit ItemReturned(record.recordId, _itemId, msg.sender);
                break;
            }
        }
    }

    // --- View Functions ---

    function getAllItems() public view returns (Item[] memory) {
        uint256 itemCount = 0;
        for (uint256 i = 1; i < nextItemId; i++) {
            if (items[i].id != 0) {
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

    function getItemBorrowHistory(
        uint256 _itemId
    ) public view returns (BorrowRecord[] memory) {
        require(_itemId > 0 && _itemId < nextItemId, "Item does not exist");
        return itemBorrowHistory[_itemId];
    }
}
