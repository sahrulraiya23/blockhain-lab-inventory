const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("Deploying LabInventory contract...");
  const [admin] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${admin.address}`);

  const labInventory = await hre.ethers.deployContract("LabInventory");
  await labInventory.waitForDeployment();

  console.log(
    `✅ LabInventory deployed to: ${labInventory.target}`
  );

  // Menyimpan alamat kontrak dan ABI untuk digunakan oleh frontend
  saveFrontendFiles(labInventory);

  console.log("\nAdding sample items with quantity...");
  const itemsToAdd = [
    { name: "Arduino Uno R3", category: "Microcontroller", desc: "Arduino Uno dengan ATmega328P", loc: "Rak A1", qty: 10 },
    { name: "Raspberry Pi 4", category: "Single Board Computer", desc: "Raspberry Pi 4 Model B 4GB RAM", loc: "Rak A2", qty: 5 },
    { name: "Breadboard 830 Point", category: "Prototyping", desc: "Breadboard untuk prototyping elektronik", loc: "Rak B1", qty: 20 },
    { name: "Kabel Jumper Male-to-Male", category: "Prototyping", desc: "Set kabel jumper 40 pcs", loc: "Laci C3", qty: 50 }
  ];

  for (const item of itemsToAdd) {
    console.log(`  - Adding '${item.name}' (Qty: ${item.qty})...`);
    const tx = await labInventory.connect(admin).addItem(
      item.name,
      item.category,
      item.desc,
      item.loc,
      item.qty
    );
    await tx.wait();
    console.log("    ... done.");
  }
  console.log("\n✅ Sample items added successfully!");

  console.log("\nSetting up roles...");
  // PENTING: Ganti dengan alamat-alamat akun ASLAB yang valid dari Ganache Anda
  const aslabAddresses = [
    "0xcd6064C9B9d91d2F608e69ef23c40C6353975acC", 
    "0xC951418a55D3ea223e3929A70a3Bad95221B7F3a"  
  ];

  for (const aslabAddress of aslabAddresses) {
    if (hre.ethers.isAddress(aslabAddress)) {
        console.log(`  - Granting ASLAB_ROLE to ${aslabAddress}...`);
        const tx = await labInventory.connect(admin).addAslab(aslabAddress);
        await tx.wait();
        console.log("    ... done.");
    } else {
        console.warn(`  - Skipping invalid address: ${aslabAddress}. Please replace it with a valid address.`);
    }
  }
  console.log("\n✅ Roles configured successfully!");
}

// Fungsi untuk menyimpan alamat dan ABI
function saveFrontendFiles(contract) {
  const contractsDir = path.join(__dirname, '..', 'public', 'contracts');

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  // Simpan alamat kontrak
  fs.writeFileSync(
    path.join(contractsDir, 'contract-address.json'),
    JSON.stringify({ address: contract.target }, undefined, 2)
  );

  // Simpan ABI kontrak
  const LabInventoryArtifact = hre.artifacts.readArtifactSync("LabInventory");
  fs.writeFileSync(
    path.join(contractsDir, 'LabInventory.json'),
    JSON.stringify(LabInventoryArtifact, null, 2)
  );

  console.log("\n✅ Contract address and ABI saved to /public/contracts");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});