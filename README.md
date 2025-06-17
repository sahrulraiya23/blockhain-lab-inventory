# 🧪 Sistem Inventaris Laboratorium Berbasis Blockchain

<div align="center">

![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-blue?style=for-the-badge&logo=ethereum)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-black?style=for-the-badge&logo=solidity)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Sistem manajemen inventaris laboratorium terdesentralisasi yang aman, transparan, dan mudah digunakan.**

[Demo](#-demo) • [Instalasi](#-instalasi-dan-konfigurasi) • [Dokumentasi](#-cara-menggunakan-aplikasi) • [Kontribusi](#-kontribusi)

</div>

---

## 📋 Daftar Isi

- [✨ Tentang Proyek](#-tentang-proyek)
- [🚀 Fitur Utama](#-fitur-utama)
- [🛠️ Teknologi](#️-teknologi-yang-digunakan)
- [📋 Prasyarat](#-prasyarat)
- [🔧 Instalasi dan Konfigurasi](#-instalasi-dan-konfigurasi)
- [📱 Cara Menggunakan](#-cara-menggunakan-aplikasi)
- [🎯 Peran Pengguna](#-peran-pengguna)
- [⚡ Skrip Hardhat](#-skrip-hardhat-yang-tersedia)
- [🤝 Kontribusi](#-kontribusi)
- [📄 Lisensi](#-lisensi)

---

## ✨ Tentang Proyek

Proyek ini adalah sistem manajemen inventaris laboratorium terdesentralisasi yang dibangun di atas blockchain Ethereum. Aplikasi ini memungkinkan untuk melacak item-item di laboratorium, mengelola peminjaman, dan melihat riwayat penggunaan secara transparan dan aman.

> 🎯 **Visi**: Menciptakan sistem inventaris yang transparan, dapat diaudit, dan tidak dapat dimanipulasi untuk lingkungan laboratorium.

---

## 🚀 Fitur Utama

<table>
<tr>
<td width="50%">

### 📦 Manajemen Inventaris
- ✅ Menambah item inventaris
- 🔍 Pencarian dan filter item
- 📊 Tracking kuantitas real-time
- 📍 Pelacakan lokasi item

</td>
<td width="50%">

### 🔄 Peminjaman & Pengembalian
- 📝 Sistem booking yang mudah
- ⏰ Tracking waktu peminjaman
- 🔔 Notifikasi status item
- 📋 Catatan tujuan penggunaan

</td>
</tr>
<tr>
<td width="50%">

### 📈 Riwayat Transparan
- 🔍 Audit trail lengkap
- 📊 Dashboard analytics
- 🕐 Timestamp setiap transaksi
- 🔒 Data immutable

</td>
<td width="50%">

### 👥 Kontrol Akses Berbasis Peran
- 👑 **Admin**: Kontrol penuh sistem
- 🔬 **Asisten Lab**: Manajemen inventaris
- 👤 **Pengguna**: Peminjaman & pengembalian

</td>
</tr>
</table>

---

## 🛠️ Teknologi yang Digunakan

<div align="center">

| **Kategori** | **Teknologi** | **Versi** |
|:------------:|:-------------:|:---------:|
| 🔗 **Blockchain** | Ethereum, Solidity | 0.8.20 |
| ⚡ **Framework** | Hardhat | Latest |
| 🎨 **Frontend** | HTML5, CSS3, JavaScript | ES6+ |
| 🌐 **Web3** | Web3.js, MetaMask | Latest |
| 🖥️ **Backend** | Express.js, CORS | Latest |
| 🔧 **Development** | Ganache, Node.js | 18+ |

</div>

---

## 📋 Prasyarat

Pastikan Anda telah menginstal perangkat lunak berikut sebelum memulai:

```bash
# Cek versi Node.js (minimal v18)
node --version

# Cek versi npm
npm --version

# Cek versi Git
git --version
```

### 📥 Download Required Software

| Software | Link Download | Keterangan |
|----------|---------------|------------|
| 🟢 **Node.js & npm** | [Download](https://nodejs.org/) | Runtime JavaScript |
| 📂 **Git** | [Download](https://git-scm.com/) | Version control |
| 🔗 **Ganache** | [Download](https://trufflesuite.com/ganache/) | Local blockchain |
| 🦊 **MetaMask** | [Download](https://metamask.io/) | Browser wallet |

---

## 🔧 Instalasi dan Konfigurasi

### 1️⃣ Kloning Repositori

```bash
# Kloning repository
git clone https://github.com/sahrulraiya23/blockhain-lab-inventory.git

# Masuk ke direktori proyek
cd blockhain-lab-inventory
```

### 2️⃣ Instalasi Dependensi

```bash
# Install semua dependensi
npm install

# Atau menggunakan yarn
yarn install
```

<details>
<summary>🔍 <strong>Lihat dependensi yang diinstall</strong></summary>

- `@nomicfoundation/hardhat-toolbox`
- `hardhat`
- `express`
- `cors`
- `dotenv`
- `web3`

</details>

### 3️⃣ Konfigurasi Ganache

> 🚨 **Penting**: Pastikan Ganache berjalan sebelum melanjutkan!

1. 🚀 Buka aplikasi **Ganache**
2. ⚙️ Pastikan RPC Server: `HTTP://127.0.0.1:7545`
3. 🔑 Salin **private key** dari salah satu akun

### 4️⃣ Setup Environment Variables

```bash
# Buat file .env
touch .env
```

Tambahkan konfigurasi berikut ke file `.env`:

```env
# 🔐 Private Key dari Ganache
GANACHE_PRIVATE_KEY="your_ganache_private_key_here"

# 🌐 Network Configuration
GANACHE_URL="http://127.0.0.1:7545"
GANACHE_CHAIN_ID=1337

# 🖥️ Server Configuration
PORT=3000
```

### 5️⃣ Kompilasi Smart Contract

```bash
# Kompilasi contract
npx hardhat compile

# Output yang diharapkan:
# ✅ Compiled 1 Solidity file successfully
```

### 6️⃣ Deploy Smart Contract

```bash
# Deploy ke Ganache
npx hardhat run scripts/deploy.js --network ganache
```

**📋 Output Deploy:**
```
🚀 Deploying contracts with account: 0x...
💰 Account balance: 1000.0 ETH
📦 LabInventory deployed to: 0x...
✅ Contract deployed successfully!
```

> 💡 **Tips**: Simpan alamat contract yang muncul di terminal!

### 7️⃣ Konfigurasi Frontend

Edit file `public/app.js`:

```javascript
// 🔗 Update alamat contract
const CONTRACT_ADDRESS = 'ALAMAT_KONTRAK_ANDA_YANG_BARU';
```

### 8️⃣ Jalankan Aplikasi

```bash
# Start server
npm start

# Atau
node server.js
```

🎉 **Aplikasi berjalan di**: http://localhost:3000

### 9️⃣ Setup MetaMask

1. 🦊 Buka **MetaMask** di browser
2. ➕ Tambah network baru:

| Field | Value |
|-------|-------|
| 🏷️ **Network Name** | Ganache Local |
| 🌐 **RPC URL** | http://127.0.0.1:7545 |
| 🔗 **Chain ID** | 1337 |
| 💰 **Currency** | ETH |

3. 🔑 Import akun menggunakan private key dari Ganache

---

## 📱 Cara Menggunakan Aplikasi

### 🔌 Koneksi Wallet

1. Buka http://localhost:3000
2. Klik **"Connect MetaMask"**
3. Pilih akun dan konfirmasi koneksi

### 📦 Melihat Inventaris

- 🔍 **Pencarian**: Gunakan search bar untuk mencari item
- 🏷️ **Filter**: Filter berdasarkan kategori
- ✅ **Status**: Tampilkan hanya item yang tersedia

### 📝 Meminjam Item

```
1. 📦 Pilih item di tab "Inventory"
2. 🔘 Klik tombol "Pinjam"
3. ✍️ Isi tujuan peminjaman
4. ✅ Konfirmasi transaksi di MetaMask
```

### 🔄 Mengembalikan Item

```
1. 📋 Buka tab "Peminjaman" atau "Inventory"
2. 🔘 Klik "Kembalikan" pada item yang dipinjam
3. ✅ Konfirmasi transaksi di MetaMask
```

### 📊 Melihat Riwayat

Tab **"History"** menampilkan:
- 📅 Tanggal dan waktu transaksi
- 👤 Alamat peminjam
- 📦 Detail item
- 🎯 Tujuan penggunaan
- ✅ Status (Dipinjam/Dikembalikan)

---

## 🎯 Peran Pengguna

<div align="center">

### 👑 Admin (Owner)
- ✅ Deploy contract
- ✅ Menambah Asisten Lab
- ✅ Akses penuh ke semua fitur

### 🔬 Asisten Lab (Aslab)
- ✅ Menambah item inventaris
- ✅ Edit informasi item
- ✅ Lihat semua transaksi

### 👤 Pengguna Umum
- ✅ Lihat inventaris
- ✅ Pinjam & kembalikan item
- ✅ Lihat riwayat pribadi

</div>

---

## ⚡ Skrip Hardhat yang Tersedia

| Perintah | Fungsi | Contoh |
|----------|--------|---------|
| 🔨 **compile** | Kompilasi smart contract | `npx hardhat compile` |
| 🧪 **test** | Jalankan unit test | `npx hardhat test` |
| 🚀 **deploy** | Deploy contract | `npx hardhat run scripts/deploy.js --network ganache` |
| 🌐 **node** | Jalankan local node | `npx hardhat node` |
| 🧹 **clean** | Bersihkan cache | `npx hardhat clean` |

### 🔍 Advanced Commands

```bash
# Deploy dengan verifikasi gas
npx hardhat run scripts/deploy.js --network ganache --verbose

# Test dengan coverage
npx hardhat coverage

# Generate dokumentasi
npx hardhat docgen
```

---

## 🤝 Kontribusi

Kami sangat menghargai kontribusi dari komunitas! 

### 📝 Cara Berkontribusi

1. 🍴 Fork repositori ini
2. 🌿 Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push ke branch (`git push origin feature/AmazingFeature`)
5. 🔄 Buat Pull Request

### 🐛 Melaporkan Bug

Gunakan [GitHub Issues](https://github.com/sahrulraiya23/blockhain-lab-inventory/issues) untuk melaporkan bug dengan template:

```markdown
**🐛 Deskripsi Bug**
Penjelasan singkat tentang bug

**🔄 Cara Reproduksi**
Langkah-langkah untuk mereproduksi bug

**✅ Hasil yang Diharapkan**
Apa yang seharusnya terjadi

**📷 Screenshot**
Jika applicable, tambahkan screenshot
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah **MIT License** - lihat file [LICENSE](LICENSE) untuk detail lengkap.

---

<div align="center">

### 🌟 Jika proyek ini membantu Anda, berikan ⭐ di GitHub!

**Dibuat dengan ❤️ oleh [Sahrul Raiya](https://github.com/sahrulraiya23)**

[🔗 Repository](https://github.com/sahrulraiya23/blockhain-lab-inventory) • [📧 Email](mailto:sahrulraiya23@example.com) • [💼 LinkedIn](https://linkedin.com/in/sahrulraiya23)

</div>

---

<div align="center">
<sub>© 2024 Sistem Inventaris Lab. Semua hak dilindungi.</sub>
</div>