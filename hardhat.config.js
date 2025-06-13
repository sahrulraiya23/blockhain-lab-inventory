require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // Masukkan private key dari Ganache
        "0xbdf132d717c8f9ad8aef05bcc53e34d6a6c049e889e484b6f4145533b21e17c2"
      ]
    }
  }
};