# 📱 Capacitor Template with CI4 API Integration

Template siap pakai untuk aplikasi mobile berbasis Capacitor + CodeIgniter 4 API. Dilengkapi dengan semua fitur dasar aplikasi berita (list, headline, kategori, search, detail) dan struktur keamanan yang rapi.

---

## 🚀 Fitur

- Capacitor 6 + Android Platform
- CI4 REST API Integration (Banten88 endpoint sebagai contoh)
- All News - Tampilkan semua berita
- Headline - Berita utama
- Pilihan - Berita pilihan editor
- Populer - Berita paling banyak dibaca
- Category - Filter berita berdasarkan kategori
- Search - Pencarian berita
- Detail - Halaman detail berita
- Pagination - Navigasi halaman
- Security - API Key terpisah di config.js (tidak ke-upload)
- Ready to clone - Tinggal ganti config, langsung jalan

---

## 📂 Struktur Folder

template-capacitor/
├── www/
│   ├── index.html          ← Aplikasi utama
│   ├── config-sample.js    ← Contoh konfigurasi (copy ke config.js)
│   └── config.js           ← ❌ GAK ke-upload (isi API Key asli)
├── capacitor.config.json   ← Konfigurasi Capacitor (appId, appName)
├── package.json            ← Dependencies
├── package-lock.json
├── .gitignore              ← Proteksi file sensitif
└── README.md              ← Ini

---

## 🔧 Cara Pakai

1. Clone Repository

git clone https://github.com/yedincoder/template-capacitor.git nama-project-baru
cd nama-project-baru

2. Setup Konfigurasi

Copy contoh konfigurasi:
cp www/config-sample.js www/config.js

Edit www/config.js dengan API Key kamu:
nano www/config.js

Isi www/config.js:
const APP_CONFIG = {
    baseUrl: 'https://domain-api-anda.com/api',
    apiKey: 'GANTI_DENGAN_API_KEY_ANDA',
    defaultLimit: 5
};

3. Setup Capacitor

Install dependencies:
npm install

Tambah platform Android:
npx cap add android

Sync project:
npx cap sync

Buka di Android Studio:
npx cap open android

4. Update Identitas Aplikasi

Edit capacitor.config.json:
{
  "appId": "com.namaproject.app",
  "appName": "Nama Aplikasi",
  "webDir": "www",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}

5. Jalankan di Android Studio

Pilih device (HP fisik atau emulator)
Klik tombol Run

---

## 🛡️ Keamanan

- www/config.js berisi API Key asli TIDAK DI-UPLOAD ke GitHub (terproteksi .gitignore)
- www/config-sample.js adalah contoh tanpa API Key asli (boleh di-upload)
- Pastikan kamu tidak pernah commit config.js ke repository public

---

## 📱 Contoh API yang Didukung

Template ini dirancang untuk API dengan struktur seperti Banten88:

Endpoint: /post/all
Method: GET
Parameter: page, limit

Endpoint: /post/headline
Method: GET
Parameter: page, limit

Endpoint: /post/pilihan
Method: GET
Parameter: page, limit

Endpoint: /post/populer
Method: GET
Parameter: page, limit

Endpoint: /post/search
Method: GET
Parameter: q, page, limit

Endpoint: /post/category/[slug]
Method: GET
Parameter: page, limit

Endpoint: /post/read/[slug]
Method: GET
Parameter: -

---

## 🔄 Update Template

Kalo ada perubahan di template, pull di project yang sudah ada:

cd nama-project-baru
git pull origin main

Hati-hati dengan konflik, backup dulu config.js

---

## 📝 Customization

Ganti Tema/Warna:
Edit www/index.html bagian style

.app-header {
    background: #1a237e; /* Ganti warna biru */
}

Tambahkan Kategori Baru:
Di www/index.html, tambahkan button di #navTabs:

<button data-type="category" data-slug="teknologi">💻 Teknologi</button>

---

## 📄 Lisensi

MIT

---

## 🙏 Kredit

- Capacitor (https://capacitorjs.com/)
- CodeIgniter 4 (https://codeigniter.com/)
- Banten88 API (https://banten88.com/) (contoh integrasi)

---

## 👨‍💻 Author

Yedi Coder
GitHub: https://github.com/yedincoder

---

Happy Coding! 🚀📱