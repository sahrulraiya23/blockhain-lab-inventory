const hre = require("hardhat");

async function main() {
  console.log("Deploying LabInventory contract...");
  const [admin] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${admin.address}`);

  const labInventory = await hre.ethers.deployContract("LabInventory");
  await labInventory.waitForDeployment();

  console.log(
    `✅ LabInventory deployed to: ${labInventory.target}`
  );

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
  const aslabAddresses = [
    "0x460d133b970095dbfedb6efb94541385cc38cd47748b996ca21617a0867a7b28",
    "0x8f0f17c1774c45a8c61f219a6ba39615656598ee42ba837a95845292e29e577f",
  
  ];

  for (const aslabAddress of aslabAddresses) {
    if (hre.ethers.isAddress(aslabAddress)) { // Pengecekan sederhana
        console.log(`  - Granting ASLAB_ROLE to ${aslabAddress}...`);
        const tx = await labInventory.connect(admin).addAslab(aslabAddress);
        await tx.wait();
        console.log("    ... done.");
    } else {
        console.warn(`  - Skipping invalid address: ${aslabAddress}`);
    }
  }

  console.log("\n✅ Roles configured successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});