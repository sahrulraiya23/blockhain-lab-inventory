const hre = require("hardhat");

async function main() {
  // =================================================================
  // 1. DEPLOY KONTRAK (dengan sintaks baru)
  // =================================================================
  console.log("Deploying LabInventory contract...");

  const labInventory = await hre.ethers.deployContract("LabInventory");
  await labInventory.waitForDeployment(); // <-- Menggunakan .waitForDeployment()

  console.log(
    `✅ LabInventory deployed to: ${labInventory.target}` // <-- Menggunakan .target
  );


  // =================================================================
  // 2. TAMBAHKAN DATA CONTOH (dengan menunggu setiap transaksi)
  // =================================================================
  console.log("\nAdding sample items...");

  // --- Item 1 ---
  console.log("  - Adding 'Arduino Uno R3'...");
  const tx1 = await labInventory.addItem(
    "Arduino Uno R3",
    "Microcontroller",
    "Arduino Uno dengan ATmega328P",
    "Rak A1"
  );
  await tx1.wait(); // <-- Tunggu transaksi selesai
  console.log("    ... done.");

  // --- Item 2 ---
  console.log("  - Adding 'Raspberry Pi 4'...");
  const tx2 = await labInventory.addItem(
    "Raspberry Pi 4",
    "Single Board Computer",
    "Raspberry Pi 4 Model B 4GB RAM",
    "Rak A2"
  );
  await tx2.wait(); // <-- Tunggu transaksi selesai
  console.log("    ... done.");

  // --- Item 3 ---
  console.log("  - Adding 'Breadboard 830 Point'...");
  const tx3 = await labInventory.addItem(
    "Breadboard 830 Point",
    "Prototyping",
    "Breadboard untuk prototyping elektronik",
    "Rak B1"
  );
  await tx3.wait(); // <-- Tunggu transaksi selesai
  console.log("    ... done.");

  console.log("\n✅ Sample items added successfully!");
}

// Pola standar untuk menjalankan skrip dan menangani error
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});