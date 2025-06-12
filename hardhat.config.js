require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        // Masukkan private key dari Ganache
        "0xdd9ff8a4c2218755cae28d7cdf8f857e08d862a519984588fb5f9333910cb403"
      ]
    }
  }
};