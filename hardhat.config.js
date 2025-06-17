require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Memuat variabel dari file .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
   
      accounts: process.env.GANACHE_PRIVATE_KEY ? [process.env.GANACHE_PRIVATE_KEY] : [],
    }
  }
};