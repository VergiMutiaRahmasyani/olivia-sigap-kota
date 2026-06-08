# SIGAP KOTA — Frontend

Platform Pemetaan Infrastruktur Berbasis Crowdsourcing untuk Mendukung SDG 11 di Kota Surabaya.

> Dibangun dengan React + Vite + Tailwind CSS v4. Berkomunikasi dengan backend Laravel melalui REST API.

---

## Daftar Isi

- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Project](#menjalankan-project)
- [Struktur Folder](#struktur-folder)
- [Halaman & Role](#halaman--role)
- [Environment Variables](#environment-variables)
- [Koneksi ke Backend](#koneksi-ke-backend)
- [Catatan Pengembangan](#catatan-pengembangan)

---

## Prasyarat

Pastikan sudah terinstall di komputer:

- [Node.js](https://nodejs.org/) versi **18 ke atas**
- npm versi **9 ke atas**
- Backend Laravel sudah berjalan (lihat repo backend)

---

## Instalasi

```bash
# 1. Clone repository
git clone https://github.com/username/sigap-kota.git
cd sigap-kota/frontend

# 2. Install dependencies
npm install

# 3. Salin file environment
cp .env.example .env

# 4. Isi nilai di .env sesuai environment lokal (lihat bagian Environment Variables)
```

---

## Menjalankan Project

```bash
# Mode development
npm run dev

# Build untuk production
npm run build

# Preview hasil build
npm run preview
```

Aplikasi berjalan di `http://localhost:5173`

---

## Struktur Folder

```
src/
├── assets/                  # Gambar, ikon, file statis
│   ├── cardmap.jpg
│   ├── jakarta.jpg
│   └── logo.png
│
├── components/
│   ├── admin/
│   │   └── AdminLayout.jsx  # Layout sidebar untuk semua halaman admin
│   └── common/
│       ├── EmergencyButton.jsx  # Tombol darurat float (landing page)
│       ├── Footer.jsx
│       ├── Logo.jsx             # Komponen logo SVG SIGAP KOTA
│       └── Navbar.jsx
│
├── context/
│   └── AuthContext.jsx      # Global state autentikasi (user, token, login, logout)
│
├── hooks/
│   └── useApi.js            # Custom hook untuk request ke API Laravel
│
├── pages/
│   ├── admin/
│   │   ├── DetailLaporan.jsx    # Detail laporan untuk admin
│   │   ├── KelolaInstansi.jsx   # Manajemen instansi pemerintah
│   │   ├── KelolaLaporan.jsx    # Daftar & manajemen laporan masuk
│   │   ├── PetaLaporan.jsx      # Peta Urgensi AI (Leaflet + zona warna)
│   │   └── TambahInstansi.jsx   # Form tambah instansi baru
│   └── user/
│       ├── BuatLaporan.jsx      # Form multi-step buat laporan (4 langkah)
│       ├── DetailLaporan.jsx    # Detail laporan publik + diskusi komunitas
│       ├── EditProfile.jsx      # Edit profil warga
│       ├── LandingPage.jsx      # Halaman utama + tombol darurat
│       ├── Login.jsx            # Login warga
│       ├── PetaLaporan.jsx      # Peta laporan publik (read-only)
│       ├── Profile.jsx          # Profil warga + gamifikasi + lencana
│       ├── Register.jsx         # Registrasi warga baru
│       └── TentangKami.jsx      # Halaman about + tim pengembang
│
├── routes/
│   └── Guards.jsx           # Route guard: UserRoute, AdminRoute, GuestRoute, AdminGuestRoute
│
├── services/
│   └── api.js               # Konfigurasi Axios + semua fungsi pemanggilan API
│
├── App.jsx                  # Routing utama aplikasi (React Router v6)
├── main.jsx                 # Entry point React
└── index.css                # Global styles + Tailwind CSS v4 directives
```

---

## Halaman & Role

### Role Warga (User)

| Path | Halaman | Akses |
|---|---|---|
| `/` | Landing Page | Publik |
| `/peta-laporan` | Peta Laporan | Publik |
| `/laporan/:id` | Detail Laporan | Publik |
| `/tentang-kami` | Tentang Kami | Publik |
| `/masuk` | Login | Guest only |
| `/daftar` | Register | Guest only |
| `/buat-laporan` | Buat Laporan | Login wajib |
| `/profil` | Profil | Login wajib |
| `/profil/edit` | Edit Profil | Login wajib |

### Role Admin

| Path | Halaman | Akses |
|---|---|---|
| `/admin/masuk` | Login Admin | Guest admin only |
| `/admin/peta` | Peta Urgensi AI | Admin only |
| `/admin/laporan` | Kelola Laporan | Admin only |
| `/admin/laporan/:id` | Detail Laporan | Admin only |
| `/admin/instansi` | Kelola Instansi | Admin only |
| `/admin/instansi/tambah` | Tambah Instansi | Admin only |
| `/admin/warga` | Data Warga | Admin only |
| `/admin/pengaturan` | Pengaturan | Admin only |

---

## Environment Variables

Salin `.env.example` menjadi `.env` lalu isi nilainya:

```bash
# URL API Laravel — tanpa trailing slash
VITE_API_URL=http://localhost:8000/api

# Nama aplikasi
VITE_APP_NAME=SIGAP KOTA

# Environment
VITE_APP_ENV=development

# Google Maps / Leaflet (opsional, saat ini pakai OpenStreetMap gratis)
VITE_MAPS_API_KEY=

# Timeout request dalam milidetik
VITE_API_TIMEOUT=10000
```

> **Penting:** Jangan pernah commit file `.env` ke Git. File ini sudah ada di `.gitignore`.

---

## Koneksi ke Backend

Semua request ke Laravel dikelola melalui `src/services/api.js` menggunakan **Axios**.

Autentikasi menggunakan **Laravel Sanctum** dengan API Token — token disimpan di `localStorage` dan dikirim otomatis di setiap request sebagai `Authorization: Bearer {token}`.

Contoh penggunaan di komponen:

```jsx
import { useApi } from '../hooks/useApi'

const { data, loading, error } = useApi('/laporan')
```

Atau langsung dari `api.js`:

```jsx
import { getLaporan, createLaporan } from '../services/api'

// Ambil daftar laporan
const laporan = await getLaporan({ wilayah: 'surabaya' })

// Kirim laporan baru
await createLaporan(formData)
```

---

## Catatan Pengembangan

### Peta (Leaflet)
Peta menggunakan **react-leaflet + OpenStreetMap** — tidak memerlukan API key. Saat ini peta dibatasi di wilayah Surabaya dengan koordinat:
- Center: `-7.2575, 112.7521`
- Batas wilayah: Southwest `-7.4, 112.55` — Northeast `-7.1, 112.95`

Data marker dan zona urgensi akan diambil dari endpoint Laravel setelah integrasi backend selesai.

### Tailwind CSS v4
Project ini menggunakan **Tailwind CSS v4**. Beberapa class berbeda dari v3:

| v3 (lama) | v4 (baru) |
|---|---|
| `flex-shrink-0` | `shrink-0` |
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `flex-grow` | `grow` |

### Struktur Role & Guard
Route guard ada di `src/routes/Guards.jsx`:
- `GuestRoute` — hanya bisa diakses kalau **belum login** (warga)
- `UserRoute` — hanya bisa diakses kalau **sudah login** sebagai warga
- `AdminRoute` — hanya bisa diakses kalau **sudah login** sebagai admin
- `AdminGuestRoute` — halaman login admin, redirect kalau sudah login

---

## Tim Pengembang

| Nama | Role |
|---|---|
| Vergi Mutia R | UI Design & Front-End Developer |
| Tsalits Habibil M | Back-End Developer & AI Engineer |
| Alya Faadilah P | Project Management |

**Dosen Pembimbing:** Dimas Novian Aditya Syahputra, S.Tr.T., M.Tr.T.
**Institusi:** Universitas Negeri Surabaya

---

*© 2026 SIGAP KOTA. Menuju Kota Berkelanjutan (SDG 11).*