const hre = require("hardhat");

async function main() {
  console.log("Deploying LabInventory contract...");

  const labInventory = await hre.ethers.deployContract("LabInventory");
  await labInventory.waitForDeployment();

  console.log(
    `✅ LabInventory deployed to: ${labInventory.target}`
  );

  console.log("\nAdding sample items with quantity...");

  // Tambahkan item dengan jumlah (quantity)
  const itemsToAdd = [
    { name: "Arduino Uno R3", category: "Microcontroller", desc: "Arduino Uno dengan ATmega328P", loc: "Rak A1", qty: 10 },
    { name: "Raspberry Pi 4", category: "Single Board Computer", desc: "Raspberry Pi 4 Model B 4GB RAM", loc: "Rak A2", qty: 5 },
    { name: "Breadboard 830 Point", category: "Prototyping", desc: "Breadboard untuk prototyping elektronik", loc: "Rak B1", qty: 20 },
    { name: "Kabel Jumper Male-to-Male", category: "Prototyping", desc: "Set kabel jumper 40 pcs", loc: "Laci C3", qty: 50 }
  ];

  for (const item of itemsToAdd) {
    console.log(`  - Adding '${item.name}' (Qty: ${item.qty})...`);
    const tx = await labInventory.addItem(
      item.name,
      item.category,
      item.desc,
      item.loc,
      item.qty
    );
    await tx.wait(); // Tunggu transaksi selesai
    console.log("    ... done.");
  }

  console.log("\n✅ Sample items added successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});