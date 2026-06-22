# 📱 Capacitor Template with CI4 API Integration

Template siap pakai untuk aplikasi mobile berbasis Capacitor + CodeIgniter 4 API. Dilengkapi dengan struktur kode modular (API, UI, Main terpisah) dan semua fitur dasar aplikasi berita (list, headline, kategori, search, detail) serta keamanan API Key yang rapi.

---

## 🚀 Fitur

- Capacitor 6 + Android Platform
- CI4 REST API Integration (Banten88 endpoint sebagai contoh)
- Struktur Modular - Pemisahan API, UI, dan Main logic
- All News - Tampilkan semua berita
- Headline - Berita utama
- Pilihan - Berita pilihan editor
- Populer - Berita paling banyak dibaca
- Category - Filter berita berdasarkan kategori
- Search - Pencarian berita
- Detail - Halaman detail berita
- Pagination - Navigasi halaman
- Security - API Key terpisah di api.js (tidak ke-upload)
- Ready to clone - Tinggal ganti config, langsung jalan

---

## 📂 Struktur Folder

template-capacitor/
├── www/
│   ├── index.html          ← Halaman utama
│   ├── style.css           ← Semua styling aplikasi
│   ├── main.js             ← Logika utama aplikasi
│   ├── api.js              ← ❌ GAK ke-upload (isi API Key asli)
│   ├── api-sample.js       ← ✅ Contoh konfigurasi (copy ke api.js)
│   ├── ui.js               ← Fungsi-fungsi UI (render, event)
│   ├── favicon.png         ← Icon aplikasi
│   ├── logo-light.png      ← Logo versi terang
│   └── logo-dark.png       ← Logo versi gelap
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
cp www/api-sample.js www/api.js
Edit www/api.js dengan API Key kamu:
nano www/api.js

Isi www/api.js:
const APP_CONFIG = {
    baseUrl: 'https://domain-api-anda.com/api',
    apiKey: 'GANTI_DENGAN_API_KEY_ANDA',
    defaultLimit: 5
};

3. Setup Capacitor
npm install
npx cap add android
npx cap sync
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

- www/api.js berisi API Key asli TIDAK DI-UPLOAD ke GitHub (terproteksi .gitignore)
- www/api-sample.js adalah contoh tanpa API Key asli (boleh di-upload)
- Pastikan kamu tidak pernah commit api.js ke repository public

---

## 📱 Contoh API yang Didukung

Template ini dirancang untuk API dengan struktur seperti Banten88:

Endpoint: /post/all | Method: GET | Parameter: page, limit
Endpoint: /post/headline | Method: GET | Parameter: page, limit
Endpoint: /post/pilihan | Method: GET | Parameter: page, limit
Endpoint: /post/populer | Method: GET | Parameter: page, limit
Endpoint: /post/search | Method: GET | Parameter: q, page, limit
Endpoint: /post/category/[slug] | Method: GET | Parameter: page, limit
Endpoint: /post/read/[slug] | Method: GET | Parameter: -
Endpoint: /api/menu | Method: GET | Parameter: page, limit
Endpoint: /api/menu/[header or footer or lainnya]  | Method: GET | Parameter: page, limit
Endpoint: /api/pages/[slug] | Method: GET | Parameter: page, limit
Endpoint: /api/foto/ | Method: GET | Parameter: page, limit
Endpoint: /api/foto/[slug] | Method: GET | Parameter: page, limit
Endpoint: /api/video/ | Method: GET | Parameter: page, limit
Endpoint: /api/foto/[slug] | Method: GET | Parameter: page, limit

---

## 🔄 Update Template

Kalo ada perubahan di template, pull di project yang sudah ada:
cd nama-project-baru
git pull origin main
Hati-hati dengan konflik, backup dulu api.js

---

## 📝 Customization

Ganti Tema/Warna: Edit www/style.css
Tambahkan Kategori Baru: Di www/index.html, tambahkan button di #navTabs
Ubah Logo: Ganti file logo-light.png dan logo-dark.png di folder www/

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