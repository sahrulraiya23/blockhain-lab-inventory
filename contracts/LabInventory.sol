// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LabInventory is Ownable, ReentrancyGuard {
    struct Item {
        uint256 id;
        string name;
        string category;
        string description;
        bool isAvailable;
        address currentBorrower;
        uint256 borrowTimestamp;
        string location;
    }

    struct BorrowRecord {
        uint256 itemId;
        address borrower;
        uint256 borrowTime;
        uint256 returnTime;
        bool isReturned;
        string borrowerName;
        string purpose;
    }

    mapping(uint256 => Item) public items;
    mapping(uint256 => BorrowRecord[]) public itemBorrowHistory;
    mapping(address => uint256[]) public userBorrowedItems;

    uint256 public nextItemId = 1;
    uint256 public totalItems = 0;

    event ItemAdded(uint256 indexed itemId, string name, string category);
    event ItemBorrowed(
        uint256 indexed itemId,
        address indexed borrower,
        string borrowerName
    );
    event ItemReturned(uint256 indexed itemId, address indexed borrower);
    event ItemUpdated(uint256 indexed itemId, string name, string category);

    constructor() Ownable(msg.sender) {}

    // Add new item to inventory
    function addItem(
        string memory _name,
        string memory _category,
        string memory _description,
        string memory _location
    ) public onlyOwner {
        items[nextItemId] = Item({
            id: nextItemId,
            name: _name,
            category: _category,
            description: _description,
            isAvailable: true,
            currentBorrower: address(0),
            borrowTimestamp: 0,
            location: _location
        });

        totalItems++;
        emit ItemAdded(nextItemId, _name, _category);
        nextItemId++;
    }

    // Borrow an item
    function borrowItem(
        uint256 _itemId,
        string memory _borrowerName,
        string memory _purpose
    ) public nonReentrant {
        require(_itemId < nextItemId && _itemId > 0, "Item tidak ditemukan");
        require(items[_itemId].isAvailable, "Item sedang dipinjam");

        items[_itemId].isAvailable = false;
        items[_itemId].currentBorrower = msg.sender;
        items[_itemId].borrowTimestamp = block.timestamp;

        // Add to borrow history
        itemBorrowHistory[_itemId].push(
            BorrowRecord({
                itemId: _itemId,
                borrower: msg.sender,
                borrowTime: block.timestamp,
                returnTime: 0,
                isReturned: false,
                borrowerName: _borrowerName,
                purpose: _purpose
            })
        );

        // Add to user's borrowed items
        userBorrowedItems[msg.sender].push(_itemId);

        emit ItemBorrowed(_itemId, msg.sender, _borrowerName);
    }

    // Return an item
    function returnItem(uint256 _itemId) public nonReentrant {
        require(_itemId < nextItemId && _itemId > 0, "Item tidak ditemukan");
        require(!items[_itemId].isAvailable, "Item tidak sedang dipinjam");
        require(
            items[_itemId].currentBorrower == msg.sender,
            "Anda tidak meminjam item ini"
        );

        items[_itemId].isAvailable = true;
        items[_itemId].currentBorrower = address(0);
        items[_itemId].borrowTimestamp = 0;

        // Update borrow history
        BorrowRecord[] storage history = itemBorrowHistory[_itemId];
        for (uint i = history.length; i > 0; i--) {
            if (
                !history[i - 1].isReturned &&
                history[i - 1].borrower == msg.sender
            ) {
                history[i - 1].returnTime = block.timestamp;
                history[i - 1].isReturned = true;
                break;
            }
        }

        // Remove from user's borrowed items
        uint256[] storage userItems = userBorrowedItems[msg.sender];
        for (uint i = 0; i < userItems.length; i++) {
            if (userItems[i] == _itemId) {
                userItems[i] = userItems[userItems.length - 1];
                userItems.pop();
                break;
            }
        }

        emit ItemReturned(_itemId, msg.sender);
    }

    // Get item details
    function getItem(uint256 _itemId) public view returns (Item memory) {
        require(_itemId < nextItemId && _itemId > 0, "Item tidak ditemukan");
        return items[_itemId];
    }

    // Get all items
    function getAllItems() public view returns (Item[] memory) {
        Item[] memory allItems = new Item[](totalItems);
        uint256 index = 0;

        for (uint256 i = 1; i < nextItemId; i++) {
            if (bytes(items[i].name).length > 0) {
                allItems[index] = items[i];
                index++;
            }
        }

        return allItems;
    }

    // Get available items
    function getAvailableItems() public view returns (Item[] memory) {
        uint256 availableCount = 0;

        // Count available items
        for (uint256 i = 1; i < nextItemId; i++) {
            if (bytes(items[i].name).length > 0 && items[i].isAvailable) {
                availableCount++;
            }
        }

        Item[] memory availableItems = new Item[](availableCount);
        uint256 index = 0;

        for (uint256 i = 1; i < nextItemId; i++) {
            if (bytes(items[i].name).length > 0 && items[i].isAvailable) {
                availableItems[index] = items[i];
                index++;
            }
        }

        return availableItems;
    }

    // Get user's borrowed items
    function getUserBorrowedItems(
        address _user
    ) public view returns (uint256[] memory) {
        return userBorrowedItems[_user];
    }

    // Get item borrow history
    function getItemBorrowHistory(
        uint256 _itemId
    ) public view returns (BorrowRecord[] memory) {
        require(_itemId < nextItemId && _itemId > 0, "Item tidak ditemukan");
        return itemBorrowHistory[_itemId];
    }
}
