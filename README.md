# 📝 Windows 98 Notepad (React Web Edition)

> Aplikasi web Notepad klasik bertema **Windows 98** yang dibangun dengan **React**, **Vite**, **Tailwind CSS**, dan **Web Audio API**. Menghadirkan kembali kenangan nostalgia sistem operasi era 90-an dengan fitur penyuntingan teks modern.

---

## ✨ Fitur-Fitur Utama

### 1. 📁 Dukungan Multi-Tab (Multi-Document Interface)
* Buka dan sunting banyak dokumen sekaligus dalam satu jendela.
* Membuat tab baru dengan klik tombol `+` atau `Ctrl+N`.
* Menutup dokumen aktif dengan tombol `✕` per tab.

### 2. 📊 Ekspor Multi-Format Lengkap
* **File Teks Polos (`.TXT`)**: Format dokumen standar.
* **Tabel Spreadsheet (`.CSV`)**: Mengubah teks berformat menjadi data tabel Excel/Spreadsheet. Mendukung pilihan pemisah kolom (delimiter):
  * Koma ( `,` ) - Standar Internasional
  * Titik Koma ( `;` ) - Standar Indonesia / Excel
  * Tab ( `\t` ) - TSV Format
  * Pipe ( `|` ) - Formatting Data
* **Data Terstruktur (`.JSON`)**: Ekspor data lengkap beserta statistik jumlah kata, baris, karakter, dan stempel waktu.
* **Dokumen Markdown (`.MD`)**: Format siap baca untuk repositori atau catatan proyek.
* **Halaman Web Mandiri (`.HTML`)**: Mengunduh dokumen HTML yang sudah dilengkapi gaya visual khas Windows 98.

### 3. 🔍 Fitur Cari & Ganti (Find & Replace)
* Dialog pencarian retro persis ala Windows 98.
* Fitur *Find Next*, *Replace*, dan *Replace All*.
* Opsi pencocokan huruf besar/kecil (*Match Case*).

### 4. 🎨 Pilihan Tema Desktop & Pengaturan Font
* **Empat Tema Ikonik**:
  1. **Classic Windows 98 Teal** (`#008080`)
  2. **Windows 95 Solid Blue** (`#000080`)
  3. **Matrix Cyber Green** (`#0d1b1e`)
  4. **Retro Dark Mode** (`#1e1e2e`)
* **Pengatur Font Custom**:
  * Pilihan Font: *Courier Prime*, *VT323*, *Space Mono*, *Fira Code*, *Tahoma*, *Monospace*.
  * Pilihan Ukuran Font (11px s/d 20px).
  * Gaya Font (Regular, Bold, Italic, Bold Italic).

### 5. 🔊 Efek Suara Retro (Web Audio Synthesizer)
* Efek suara klik tombol, klakson kesalahan (*error*), dan *chime arpeggio* awal tanpa memerlukan berkas audio eksternal (menggunakan *Web Audio API* sintetis).
* Tombol sakelar pengaktif/penonaktif suara di *System Tray* taskbar.

### 6. 📥 Drag & Drop & Penyimpanan Otomatis
* Cukup tarik (*drag & drop*) berkas `.txt`, `.csv`, `.json`, `.md` dari komputer ke aplikasi untuk langsung membukanya.
* Fitur *Auto-Save* otomatis ke `localStorage` browser.

---

## ⌨️ Tombol Pintas (Keyboard Shortcuts)

| Shortcut | Fungsi |
| :--- | :--- |
| **`Ctrl + N`** | Membuat dokumen tab baru |
| **`Ctrl + O`** | Membuka berkas dari media penyimpanan lokal |
| **`Ctrl + S`** | Menyimpan dokumen (Auto-Save ke Browser) |
| **`Ctrl + F`** | Membuka dialog Cari & Ganti (*Find & Replace*) |
| **`F5`** | Menyisipkan Tanggal & Waktu saat ini |
| **`F12`** | Membuka dialog Simpan Sebagai / Ekspor |
| **`Ctrl + P`** | Mencetak dokumen (*Print*) |
| **`F1`** | Membuka menu Bantuan & Panduan |

---

## 🚀 Teknologi yang Digunakan

* **Framework Front-End**: [React](https://react.dev/)
* **Build Tool**: [Vite](https://vitejs.dev/)
* **Penggayaan (Styling)**: [Tailwind CSS v4](https://tailwindcss.com/) & Custom Windows 98 CSS Rules
* **Icon Set**: [Lucide React](https://lucide.dev/)
* **Sintesis Audio**: Web Audio API (Native Browser)

---

## 📦 Cara Memulai (Local Setup)

### Prasyarat
* [Node.js](https://nodejs.org/) (Versi 18 atau lebih baru)
* `npm` atau `yarn` / `pnpm`

### Langkah-Langkah Instalasi

1. **Clone atau Masuk ke Direktori Proyek**:
   ```bash
   cd win98-notepad
   ```

2. **Instal Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembang (Dev Server)**:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses di browser pada alamat `http://localhost:5173/`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

5. **Pratinjau Hasil Build**:
   ```bash
   npm run preview
   ```

---

## 📁 Struktur Direktori Proyek

```text
win98-notepad/
├── index.html            # Template HTML utama dengan font retro Google Fonts
├── package.json          # Konfigurasi dependensi dan skrip proyek
├── vite.config.js        # Konfigurasi Vite & Plugin TailwindCSS
└── src/
    ├── App.jsx           # Komponen utama Notepad Windows 98
    ├── index.css         # Styling CSS sistem 3D Windows 98 & Tailwind
    └── main.jsx          # Entry point aplikasi React
```

---

## 📜 Lisensi & Kredit

Dibuat dengan ❤️ untuk merayakan desain klasik antarmuka pengguna era **Windows 98**. Bebas dikembangkan dan dimodifikasi untuk keperluan pembelajaran atau proyek personal.
