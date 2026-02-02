# 🏪 Sistem Laporan Shift 3 - ALFAMART

> **Sistem manajemen laporan shift modern untuk toko Alfamart dengan fitur lengkap dan user-friendly**

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Dokumentasi](#-dokumentasi)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🎯 Tentang Project

**Sistem Laporan Shift 3** adalah aplikasi web modern yang dirancang khusus untuk membantu karyawan Alfamart dalam mengelola dan melaporkan data penjualan harian shift 3. Sistem ini menggantikan proses manual dengan solusi digital yang efisien, akurat, dan mudah digunakan.

### Latar Belakang
Sebelumnya, laporan shift dibuat secara manual menggunakan kertas atau spreadsheet yang rentan terhadap kesalahan dan sulit untuk dianalisis. Sistem ini hadir untuk:
- ✅ Mempercepat proses pelaporan
- ✅ Mengurangi kesalahan input data
- ✅ Memudahkan analisis performa toko
- ✅ Menyediakan export otomatis ke PDF/Excel
- ✅ Memberikan visualisasi data yang jelas

### Target Pengguna
- 👥 Karyawan shift toko Alfamart
- 👨‍💼 Manager toko
- 📊 Tim analisis performa

---

## ✨ Fitur Utama

### 🔐 Authentication
- **NIK-based Login**: Login menggunakan NIK karyawan
- **Auto-fill Nama**: Nama otomatis terisi saat input NIK
- **Password Terstruktur**: Format `KODE_TOKO#3_DIGIT_TERAKHIR_NIK`
- **Remember Me**: Opsi untuk tetap login
- **Rate Limiting**: Proteksi dari brute force attack

### 📊 Dashboard
- **Statistics Cards**: Total penjualan, transaksi, APC, dan laporan
- **Sales Trend Chart**: Grafik penjualan 7 hari terakhir
- **Recent Reports**: 5 laporan terbaru
- **Quick Actions**: Tombol cepat untuk membuat laporan baru
- **Real-time Data**: Data selalu update

### 📝 Manajemen Laporan
- **Create Report**: Form dinamis untuk input data harian (28-31 hari)
- **Auto-calculate APC**: APC dihitung otomatis dari SPD/STD
- **Edit Report**: Modifikasi laporan yang sudah ada
- **View Detail**: Tampilan detail dengan summary
- **Delete Report**: Hapus laporan dengan konfirmasi
- **Filter & Search**: Cari laporan berdasarkan bulan/shift
- **Pagination**: Navigasi halaman yang smooth

### 📄 Export Features
- **Export to PDF**: Download laporan dalam format PDF profesional
- **Export to Excel**: Download dalam format Excel yang bisa diedit
- **Print Preview**: Print langsung dari browser
- **Custom Template**: Template dengan branding Alfamart
- **Auto Filename**: Nama file otomatis sesuai toko dan bulan

### 🎨 UI/UX
- **Alfamart Branding**: Warna merah, biru, dan kuning Alfamart
- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Dark Mode Ready**: Siap untuk dark mode (optional)
- **Loading States**: Feedback visual saat loading
- **Error Handling**: Pesan error yang jelas dan helpful
- **Accessibility**: Memenuhi standar WCAG 2.1

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 11.x
- **Language**: PHP 8.2+
- **Database**: MySQL 8.0 / SQLite (dev)
- **Authentication**: Laravel Fortify
- **PDF Generation**: DomPDF
- **Excel Export**: Maatwebsite Excel

### Frontend
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **UI Library**: shadcn/ui (Radix UI + Tailwind CSS)
- **Routing**: Inertia.js (SSR)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Build Tool**: Vite 5.x

### Additional Tools
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Notifications**: Sonner
- **Styling**: Tailwind CSS 3.x

---

## 📸 Screenshots

### Login Page
![Login](docs/screenshots/login.png)
*NIK-based authentication dengan auto-fill nama*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Dashboard dengan statistik dan grafik penjualan*

### Create Report
![Create Report](docs/screenshots/create-report.png)
*Form input laporan dengan dynamic daily rows*

### Report Detail
![Report Detail](docs/screenshots/report-detail.png)
*Detail laporan dengan summary dan export options*

---

## 🚀 Instalasi

### Prerequisites
- PHP 8.2 or higher
- Composer 2.x
- Node.js 18.x or higher
- MySQL 8.0 or higher

### Step 1: Clone Repository
```bash
git clone https://github.com/Intra-Sepriansa/laporan24jam.git
cd laporan24jam
```

### Step 2: Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node dependencies
npm install
```

### Step 3: Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Database Configuration
Edit `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laporan_shift
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### Step 5: Run Migrations & Seeders
```bash
# Run migrations
php artisan migrate

# Seed database with initial data
php artisan db:seed
```

### Step 6: Build Assets
```bash
# Development
npm run dev

# Production
npm run build
```

### Step 7: Start Server
```bash
# Laravel development server
php artisan serve

# Or use Laravel Herd/Valet
```

Visit: `http://localhost:8000`

---

## 📖 Penggunaan

### Login
1. Buka aplikasi di browser
2. Masukkan NIK (8 digit)
3. Nama akan otomatis terisi
4. Masukkan password dengan format: `TB56#XXX`
5. Klik "Masuk"

### Membuat Laporan Baru
1. Dari dashboard, klik "Buat Laporan Baru"
2. Pilih bulan, tahun, dan shift
3. Isi data harian (SPD, STD, Pulsa)
4. APC akan dihitung otomatis
5. Klik "Simpan Laporan"

### Melihat & Export Laporan
1. Buka menu "Laporan Shift"
2. Klik "Lihat" pada laporan yang diinginkan
3. Pilih export format:
   - **PDF**: Download sebagai PDF
   - **Excel**: Download sebagai Excel
   - **Print**: Print langsung

### Edit Laporan
1. Buka detail laporan
2. Klik tombol "Edit"
3. Ubah data yang diperlukan
4. Klik "Simpan"

---

## 📚 Dokumentasi

Dokumentasi lengkap tersedia di folder `docs/`:

- [PROJECT_PLAN.md](PROJECT_PLAN.md) - Rencana project lengkap
- [TECH_STACK_DETAILS.md](TECH_STACK_DETAILS.md) - Detail tech stack
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Roadmap implementasi
- [ALFAMART_BRANDING.md](ALFAMART_BRANDING.md) - Brand guidelines
- [DATABASE_ERD.md](DATABASE_ERD.md) - Database schema
- [API_QUERIES.md](API_QUERIES.md) - API documentation
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Panduan deployment
- [CREDENTIALS.md](CREDENTIALS.md) - Daftar login

---

## 👥 Default Users

Setelah seeding, gunakan credentials berikut untuk login:

| NIK      | Nama    | Password   |
|----------|---------|------------|
| 14085061 | SUNARDI | TB56#061   |
| 17110563 | AAN     | TB56#563   |
| 19085703 | TAQWA   | TB56#703   |
| 19050173 | RIKA    | TB56#173   |

*Lihat [CREDENTIALS.md](CREDENTIALS.md) untuk daftar lengkap*

---

## 🗂️ Struktur Project

```
laporan24jam/
├── app/
│   ├── Http/Controllers/      # Controllers
│   ├── Models/                # Eloquent Models
│   ├── Exports/               # Excel Exports
│   └── ...
├── database/
│   ├── migrations/            # Database migrations
│   └── seeders/               # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── layouts/           # Layout components
│   │   └── lib/               # Utilities
│   ├── css/                   # Styles
│   └── views/                 # Blade templates
├── routes/
│   └── web.php                # Web routes
└── public/                    # Public assets
```

---

## 🧪 Testing

```bash
# Run all tests
php artisan test

# Run specific test
php artisan test --filter=LoginTest

# With coverage
php artisan test --coverage
```

---

## 🔄 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/nama-fitur

# Commit changes
git add .
git commit -m "Add: deskripsi fitur"

# Push to remote
git push origin feature/nama-fitur

# Create Pull Request
```

### Code Style
```bash
# PHP (Laravel Pint)
./vendor/bin/pint

# JavaScript/TypeScript (ESLint)
npm run lint

# Format (Prettier)
npm run format
```

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add: Amazing Feature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 Changelog

### Version 1.0.0 (2026-02-03)
- ✅ Initial release
- ✅ NIK-based authentication
- ✅ Dashboard with statistics
- ✅ Full CRUD for shift reports
- ✅ Export to PDF & Excel
- ✅ Alfamart branding
- ✅ Responsive design

---

## 🐛 Known Issues

- None at the moment

---

## 🔮 Roadmap

### Version 1.1 (Planned)
- [ ] Advanced analytics dashboard
- [ ] Email notifications
- [ ] User management
- [ ] Role-based access control
- [ ] Activity log

### Version 2.0 (Future)
- [ ] Mobile app (PWA)
- [ ] Real-time notifications
- [ ] WhatsApp integration
- [ ] Forecasting with ML
- [ ] Multi-language support

---

## 📄 Lisensi

This project is proprietary software for Alfamart internal use.

---

## 👨‍💻 Developer

**Developed by:** Intra Sepriansa  
**For:** Alfamart TB56 - RY CANGKUDU CISOKA, BALARAJA  
**Year:** 2026

---

## 📞 Support

Untuk bantuan atau pertanyaan:
- 📧 Email: support@alfamart.com
- 📱 WhatsApp: +62 xxx xxxx xxxx
- 🌐 Website: https://alfamart.co.id

---

## 🙏 Acknowledgments

- Laravel Team untuk framework yang luar biasa
- React Team untuk library UI yang powerful
- shadcn/ui untuk komponen UI yang beautiful
- Alfamart untuk kesempatan mengembangkan sistem ini

---

<div align="center">

**Made with ❤️ for Alfamart**

*Belanja Puas, Harga Pas!*

</div>
