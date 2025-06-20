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
  // DIUBAH: Item-item sampel yang relevan untuk lab rekayasa perangkat lunak dan menghapus 'loc'
const itemsToAdd = [
  { name: "Komputer PC", category: "Elektronik", desc: "Komputer untuk keperluan praktikum dan pengembangan perangkat lunak.", qty: 22 },
  { name: "Kursi Direktur", category: "Furniture", desc: "Kursi dengan sandaran tinggi dan hidrolik, digunakan oleh dosen/pengajar.", qty: 3 },
  { name: "UPS", category: "Elektronik", desc: "Uninterruptible Power Supply untuk cadangan daya komputer.", qty: 1 },
  { name: "Printer", category: "Elektronik", desc: "Printer untuk mencetak dokumen praktikum.", qty: 1 },
  { name: "Meja Komputer", category: "Furniture", desc: "Meja khusus untuk meletakkan komputer.", qty: 6 },
  { name: "Kursi Staf", category: "Furniture", desc: "Kursi standar untuk mahasiswa/staf.", qty: 30 },
  { name: "White Board", category: "Furniture", desc: "Papan tulis putih untuk presentasi atau penjelasan materi.", qty: 1 },
  { name: "AC", category: "Elektronik", desc: "Pendingin ruangan berkapasitas 1 PK.", qty: 1 },
  { name: "Projector", category: "Elektronik", desc: "Alat untuk menampilkan presentasi ke layar lebar.", qty: 1 },
  { name: "Meja X Biro", category: "Furniture", desc: "Meja kerja berukuran setengah biro.", qty: 1 },
  { name: "Acces Point", category: "Elektronik", desc: "Perangkat jaringan untuk akses internet nirkabel.", qty: 1 },
  { name: "Meja Komputer", category: "Furniture", desc: "Meja komputer dengan partisi dari masing-masing pengguna.", qty: 3 },
  { name: "TV LED", category: "Elektronik", desc: "TV layar datar untuk media tampilan materi.", qty: 24 },
  { name: "Logitech B100 Mouse Kabel", category: "Elektronik", desc: "Mouse kabel USB untuk keperluan laboratorium komputer.", qty: 20 },
  { name: "Convert Hub Adapter 6 in 1 Type C 3.1 to HDMI 4K VGA USB 3X UCH60", category: "Elektronik", desc: "Adapter multiport untuk menghubungkan berbagai perangkat ke laptop.", qty: 1 },
  { name: "Type C 3.1 to HDMI Hub Converter USB Micro SD Card 6 in 1 PX UCH160", category: "Elektronik", desc: "Converter hub untuk konektivitas tambahan perangkat elektronik.", qty: 1 },
  { name: "ILLUPRO Kabel VGA to VGA 10m Full HD", category: "Elektronik", desc: "Kabel VGA panjang untuk koneksi monitor jarak jauh.", qty: 1 },
  { name: "Illukpro Kabel 20 VGA to VGA 1.5m Full HD", category: "Elektronik", desc: "Kabel VGA pendek untuk koneksi monitor standar.", qty: 2 },
  { name: "ILLUPRO Kabel 21 VGA to VGA 3m Full HD", category: "Elektronik", desc: "Kabel VGA ukuran menengah untuk koneksi monitor.", qty: 1 },
  { name: "KINGSTON RAM SODIMM 8GB 22 DDR4 3200MHz Non-ECC KVR32252S8/8", category: "Elektronik", desc: "RAM laptop untuk meningkatkan performa perangkat komputer.", qty: 4 }
];

  for (const item of itemsToAdd) {
    console.log(`  - Adding '${item.name}' (Qty: ${item.qty})...`);
    const tx = await labInventory.connect(admin).addItem(
      item.name,
      item.category,
      item.desc,
      // DIUBAH: Menghapus 'item.loc' karena bidang lokasi sudah tidak ada di kontrak
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