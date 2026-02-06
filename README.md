# 🏪 Sistem Laporan Shift 3 Alfamart

Aplikasi web untuk mengelola laporan shift 3 (malam) di toko Alfamart. Sistem ini memudahkan karyawan shift 3 untuk mencatat dan melaporkan data penjualan harian, transaksi, dan dokumentasi display toko.

![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)
![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-9553E9?style=flat&logo=inertia&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

---

## 📋 Daftar Isi

- [Tentang Project](#-tentang-project)
- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#-tech-stack)
- [Persyaratan Sistem](#-persyaratan-sistem)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Database](#-database)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Tentang Project

Sistem Laporan Shift 3 Alfamart adalah aplikasi web modern yang dirancang khusus untuk membantu karyawan shift malam (shift 3) dalam mengelola dan melaporkan data operasional toko. Aplikasi ini menggantikan sistem manual dengan solusi digital yang lebih efisien dan akurat.

### Latar Belakang

Sebelumnya, karyawan shift 3 harus mencatat laporan secara manual di buku atau spreadsheet, yang memakan waktu dan rentan terhadap kesalahan. Sistem ini hadir untuk:

- ✅ Mempercepat proses pelaporan
- ✅ Mengurangi kesalahan input data
- ✅ Menyediakan visualisasi data yang mudah dipahami
- ✅ Memudahkan akses dan pencarian laporan historis
- ✅ Mendokumentasikan display toko secara digital

### Target Pengguna

- **Karyawan Shift 3**: Input dan kelola laporan harian
- **Store Manager**: Monitor performa toko
- **Area Manager**: Analisis performa multi-toko
- **Admin**: Kelola user dan sistem

---

## ✨ Fitur Utama

### 1. � Autentikasi NIK-Based

- Login menggunakan NIK (8 digit)
- Auto-fill nama karyawan saat input NIK
- Password format: `KODE_TOKO#3_DIGIT_TERAKHIR_NIK`
- Remember me functionality
- Rate limiting untuk keamanan
- Two-factor authentication (2FA)

**Contoh Login:**
```
NIK: 14085061
Nama: SUNARDI (auto-fill)
Password: TB56#061
```

### 2. � Dashboard Interaktif

Dashboard dengan visualisasi data real-time:

- **Statistics Cards**: Total penjualan, transaksi, APC, laporan
- **Quick Actions Menu**: 4 tombol aksi cepat (Buat Laporan, Lihat Laporan, Statistik, Pengaturan)
- **Sales Trend Chart**: Grafik penjualan 7 hari terakhir
- **Recent Reports**: 5 laporan terbaru dengan detail
- **Responsive Design**: Optimal di mobile dan desktop

### 3. 📝 Manajemen Laporan Shift

#### Create (Buat Laporan)
- Form dinamis dengan 28-31 baris detail (sesuai jumlah hari dalam bulan)
- Input data harian: SPD, STD, APC, Pulsa
- Auto-calculate APC dari SPD/STD
- Validasi input real-time
- Save draft functionality

#### Read (Lihat Laporan)
- List semua laporan dengan pagination
- Filter by bulan/tahun
- Search functionality
- Sort by date/store
- Detail view dengan summary

#### Update (Edit Laporan)
- Edit data existing
- Update detail harian
- Recalculate totals
- Audit trail

#### Delete (Hapus Laporan)
- Soft delete dengan confirmation
- Authorization check
- Cascade delete details

### 4. 📤 Export & Print

- **PDF Export**: Template Alfamart-branded
- **Excel Export**: Format terstruktur dengan styling
- **Print**: Print-friendly layout
- **Auto-filename**: `Laporan_TB56_February_2026.pdf`

### 5. 📸 Grid Foto Display

Dokumentasi display toko dalam grid layout:

- **Multiple Layouts**: 2x2, 2x3, 3x3
- **Upload Foto**: Single atau bulk upload
- **Auto-Compress**: Optimasi ukuran gambar
- **Mobile Capture**: Langsung dari kamera
- **Display View**: Tampilan grid rapi untuk presentasi
- **Print-Ready**: Landscape orientation

### 6. 👤 User Management

- **Profile Management**: Edit nama, email, foto
- **Change Password**: Dengan validasi keamanan
- **Two-Factor Auth**: Google Authenticator
- **Appearance Settings**: Light/Dark mode
- **Session Management**: Multi-device support

### 7. 🔒 Authorization & Security

- **Store-Based Access**: User hanya akses data toko sendiri
- **Role-Based**: Admin, Manager, Staff
- **CSRF Protection**: Token validation
- **Rate Limiting**: Prevent brute force
- **SQL Injection Prevention**: Prepared statements
- **XSS Protection**: Input sanitization

---

## 🛠️ Tech Stack

### Backend

- **Framework**: Laravel 11.x
- **Language**: PHP 8.2+
- **Database**: SQLite (development), MySQL/PostgreSQL (production)
- **Authentication**: Laravel Fortify
- **API**: RESTful API with Inertia.js

### Frontend

- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **UI Library**: shadcn/ui
- **Styling**: Tailwind CSS 3.x
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **State Management**: Inertia.js

### Development Tools

- **Build Tool**: Vite
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **Version Control**: Git
- **Testing**: Pest (PHP), Vitest (JS)

### Additional Libraries

- **PDF Generation**: barryvdh/laravel-dompdf
- **Excel Export**: maatwebsite/excel
- **Image Processing**: Intervention Image
- **Date Handling**: Carbon

---

## 💻 Persyaratan Sistem

### Minimum Requirements

- **PHP**: 8.2 or higher
- **Composer**: 2.x
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Database**: SQLite 3.x / MySQL 8.x / PostgreSQL 14.x
- **Web Server**: Apache / Nginx
- **Memory**: 512MB RAM
- **Storage**: 1GB free space

### Recommended

- **PHP**: 8.3
- **Memory**: 2GB RAM
- **Storage**: 5GB free space
- **SSL Certificate**: For production

---

## � Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Intra-Sepriansa/laporan24jam.git
cd laporan24jam
```

### 2. Install Dependencies

#### Backend (PHP)
```bash
composer install
```

#### Frontend (JavaScript)
```bash
npm install
```

### 3. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed
```

### 5. Storage Link

```bash
# Create symbolic link for storage
php artisan storage:link
```

### 6. Build Assets

```bash
# Development
npm run dev

# Production
npm run build
```

### 7. Start Development Server

```bash
# Laravel server
php artisan serve

# Access application
# http://localhost:8000
```

---

## ⚙️ Konfigurasi

### Environment Variables

Edit file `.env`:

```env
# Application
APP_NAME="Sistem Laporan Shift 3"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Or for MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laporan24jam
# DB_USERNAME=root
# DB_PASSWORD=

# Mail (optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null

# Cache & Session
CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### Alfamart Branding Colors

Aplikasi menggunakan warna resmi Alfamart:

```css
/* resources/css/app.css */
:root {
  --primary: 0 82% 47%;        /* Red #E31E24 */
  --secondary: 210 100% 40%;   /* Blue #0066CC */
  --accent: 42 100% 56%;       /* Yellow #FFB81C */
}
```

---

## 🗄️ Database

### Schema Overview

```
stores (Toko)
  ├── employees (Karyawan)
  │     └── users (Login)
  └── shift_reports (Laporan Shift)
        └── shift_report_details (Detail Harian)
        
grid_settings (Pengaturan Grid)
  └── grid_photos (Foto Display)
```

### Tables

#### 1. stores
```sql
- id (PK)
- code (unique, e.g., TB56)
- name (e.g., RAYA CANGKUDU CISOKA)
- address
- area (e.g., BALARAJA)
- created_at, updated_at
```

#### 2. employees
```sql
- id (PK)
- store_id (FK → stores)
- nik (unique, 8 digits)
- name
- position
- created_at, updated_at
```

#### 3. users
```sql
- id (PK)
- employee_id (FK → employees)
- name
- email (unique)
- password
- two_factor_secret
- two_factor_recovery_codes
- remember_token
- created_at, updated_at
```

#### 4. shift_reports
```sql
- id (PK)
- store_id (FK → stores)
- user_id (FK → users)
- report_date
- shift (1, 2, or 3)
- month_year (e.g., FEBRUARY 2026)
- created_at, updated_at
```

#### 5. shift_report_details
```sql
- id (PK)
- shift_report_id (FK → shift_reports)
- day_number (1-31)
- transaction_date
- spd (Sales Per Day)
- std (Struk Transaksi per Day)
- apc (Average Per Customer)
- pulsa
- notes
- created_at, updated_at
```

#### 6. grid_photos
```sql
- id (PK)
- store_id (FK → stores)
- user_id (FK → users)
- title
- code
- span (1 or 2)
- position (1-12)
- image_path
- created_at, updated_at
```

#### 7. grid_settings
```sql
- id (PK)
- store_id (FK → stores, unique)
- layout (2x2, 2x3, 3x3)
- created_at, updated_at
```

### Seeded Data

Aplikasi sudah include sample data:

- **17 Toko** di area BALARAJA
- **12 Karyawan** di toko TB56
- **12 User Accounts** dengan password auto-generated

### Sample Credentials

```
NIK: 14085061 | Password: TB56#061 | Nama: SUNARDI
NIK: 17110563 | Password: TB56#563 | Nama: AAN
NIK: 19085703 | Password: TB56#703 | Nama: TAQWA
```

---

## 📖 Penggunaan

### Login

1. Buka aplikasi di browser
2. Masukkan NIK (8 digit)
3. Nama akan auto-fill
4. Masukkan password (format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK)
5. Klik "Masuk"

### Membuat Laporan Shift

1. Dari dashboard, klik **"Buat Laporan Baru"**
2. Pilih bulan dan tahun
3. Pilih shift (1, 2, atau 3)
4. Isi data harian:
   - **SPD**: Sales Per Day (total penjualan)
   - **STD**: Struk Transaksi per Day (jumlah struk)
   - **APC**: Auto-calculated (SPD/STD)
   - **Pulsa**: Penjualan pulsa
5. Klik **"Simpan Laporan"**

### Melihat Laporan

1. Klik menu **"Laporan Shift"**
2. Gunakan filter untuk mencari laporan
3. Klik laporan untuk melihat detail
4. Export ke PDF/Excel jika diperlukan

### Upload Grid Foto

1. Klik menu **"Grid Foto"**
2. Pilih layout (2x2, 2x3, atau 3x3)
3. Upload foto ke slot yang diinginkan
4. Isi judul dan kode
5. Klik **"Simpan"**
6. Klik **"Lihat Grid"** untuk melihat hasil

### Export Laporan

#### PDF
```
Detail Laporan → Tombol "PDF" → Download
```

#### Excel
```
Detail Laporan → Tombol "Excel" → Download
```

#### Print
```
Detail Laporan → Tombol "Print" → Print Dialog
```

---

## 📁 Struktur Project

```
laporan24jam/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── NikLoginController.php
│   │   │   ├── Settings/
│   │   │   │   ├── PasswordController.php
│   │   │   │   ├── ProfileController.php
│   │   │   │   └── TwoFactorAuthenticationController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ShiftReportController.php
│   │   │   ├── ExportController.php
│   │   │   └── GridPhotoController.php
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   │   ├── Store.php
│   │   ├── Employee.php
│   │   ├── User.php
│   │   ├── ShiftReport.php
│   │   ├── ShiftReportDetail.php
│   │   ├── GridPhoto.php
│   │   └── GridSetting.php
│   ├── Exports/
│   │   └── ShiftReportExport.php
│   └── Providers/
│
├── database/
│   ├── migrations/
│   │   ├── 2026_02_03_000001_create_stores_table.php
│   │   ├── 2026_02_03_000002_create_employees_table.php
│   │   ├── 2026_02_03_000003_add_employee_id_to_users_table.php
│   │   ├── 2026_02_03_000004_create_shift_reports_table.php
│   │   ├── 2026_02_03_000005_create_shift_report_details_table.php
│   │   ├── 2026_02_03_000006_create_grid_photos_table.php
│   │   └── 2026_02_03_000007_create_grid_settings_table.php
│   ├── seeders/
│   │   ├── StoreSeeder.php
│   │   ├── EmployeeSeeder.php
│   │   └── UserSeeder.php
│   └── database.sqlite
│
├── resources/
│   ├── js/
│   │   ├── actions/          # Type-safe route helpers
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/          # shadcn/ui components
│   │   │   ├── app-shell.tsx
│   │   │   ├── app-sidebar.tsx
│   │   │   └── ...
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Layout components
│   │   ├── pages/           # Page components
│   │   │   ├── auth/
│   │   │   │   ├── login.tsx
│   │   │   │   └── nik-login.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── index.tsx
│   │   │   ├── reports/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── create.tsx
│   │   │   │   ├── edit.tsx
│   │   │   │   └── show.tsx
│   │   │   ├── grid/
│   │   │   │   ├── index.tsx
│   │   │   │   └── display.tsx
│   │   │   └── settings/
│   │   ├── routes/          # Route definitions
│   │   ├── types/           # TypeScript types
│   │   ├── lib/             # Utility functions
│   │   └── app.tsx
│   ├── css/
│   │   └── app.css
│   └── views/
│       ├── app.blade.php
│       └── reports/
│           └── pdf.blade.php
│
├── routes/
│   ├── web.php
│   └── api.php
│
├── public/
│   ├── build/               # Compiled assets
│   └── storage/             # Symlink to storage
│
├── storage/
│   ├── app/
│   │   └── public/
│   │       └── grid-photos/ # Uploaded photos
│   └── logs/
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── .env.example
├── composer.json
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

```
POST   /nik-login              # NIK-based login
POST   /logout                 # Logout
POST   /forgot-password        # Request password reset
POST   /reset-password         # Reset password
```

### Dashboard

```
GET    /dashboard              # Dashboard data
```

### Shift Reports

```
GET    /reports                # List all reports
GET    /reports/create         # Show create form
POST   /reports                # Store new report
GET    /reports/{id}           # Show report detail
GET    /reports/{id}/edit      # Show edit form
PUT    /reports/{id}           # Update report
DELETE /reports/{id}           # Delete report
```

### Export

```
GET    /reports/{id}/export/pdf    # Export to PDF
GET    /reports/{id}/export/excel  # Export to Excel
```

### Grid Photos

```
GET    /grid                   # Manage grid photos
GET    /grid/display           # View grid display
POST   /grid                   # Upload photo
POST   /grid/batch             # Batch upload/update
PUT    /grid/{id}              # Update photo
DELETE /grid/{id}              # Delete photo
```

### Settings

```
GET    /settings/profile       # Profile page
PUT    /settings/profile       # Update profile
PUT    /settings/password      # Change password
POST   /settings/two-factor    # Enable 2FA
DELETE /settings/two-factor    # Disable 2FA
```

### API Helper (Employee by NIK)

```
POST   /api/employee/by-nik    # Get employee by NIK
```

---

## 🧪 Testing

### Run Tests

```bash
# PHP tests (Pest)
php artisan test

# JavaScript tests (Vitest)
npm run test

# With coverage
php artisan test --coverage
npm run test:coverage
```

### Test Structure

```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── AuthenticationTest.php
│   │   ├── PasswordResetTest.php
│   │   └── TwoFactorChallengeTest.php
│   ├── DashboardTest.php
│   └── Settings/
│       ├── ProfileUpdateTest.php
│       └── PasswordUpdateTest.php
└── Unit/
    └── ExampleTest.php
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Generate new `APP_KEY`
- [ ] Configure production database
- [ ] Set up proper file permissions
- [ ] Configure web server (Apache/Nginx)
- [ ] Set up SSL certificate
- [ ] Configure cron jobs
- [ ] Set up backup system
- [ ] Configure monitoring

### Build for Production

```bash
# Install dependencies
composer install --optimize-autoloader --no-dev
npm ci

# Build assets
npm run build

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations
php artisan migrate --force

# Link storage
php artisan storage:link
```

### Web Server Configuration

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/laporan24jam/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

#### Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/laporan24jam/public

    <Directory /path/to/laporan24jam/public>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

### Cron Jobs

```bash
# Add to crontab
* * * * * cd /path/to/laporan24jam && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "No such table" Error

```bash
# Solution: Run migrations
php artisan migrate:fresh --seed
```

#### 2. Storage Permission Error

```bash
# Solution: Fix permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

#### 3. Assets Not Loading

```bash
# Solution: Rebuild assets
npm run build
php artisan config:clear
```

#### 4. 500 Internal Server Error

```bash
# Check logs
tail -f storage/logs/laravel.log

# Clear all caches
php artisan optimize:clear
```

#### 5. Grid Photos Not Displaying

```bash
# Solution: Create storage link
php artisan storage:link

# Check permissions
chmod -R 775 storage/app/public
```

### Debug Mode

Enable debug mode in `.env`:

```env
APP_DEBUG=true
```

View detailed error messages in browser.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow PSR-12 for PHP code
- Use ESLint and Prettier for JavaScript/TypeScript
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: Intra Sepriansa
- **Organization**: Alfamart
- **Contact**: [GitHub](https://github.com/Intra-Sepriansa)

---

## 🙏 Acknowledgments

- Laravel Framework
- React & TypeScript
- Inertia.js
- shadcn/ui
- Tailwind CSS
- Lucide Icons
- Recharts
- All open-source contributors

---

## 📞 Support

Jika ada pertanyaan atau masalah:

1. Check [Troubleshooting](#-troubleshooting) section
2. Search existing [Issues](https://github.com/Intra-Sepriansa/laporan24jam/issues)
3. Create a new issue if needed

---

## 🗺️ Roadmap

### Version 2.0 (Planned)

- [ ] Multi-store management
- [ ] Real-time notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Automated email reports
- [ ] API for external integrations
- [ ] Multi-language support
- [ ] Dark mode improvements

---

## 📊 Project Status

- ✅ **Version**: 1.0.0
- ✅ **Status**: Production Ready
- ✅ **Last Updated**: February 2026
- ✅ **Maintenance**: Active

---

<div align="center">

**Made with ❤️ for Alfamart**

[⬆ Back to Top](#-sistem-laporan-shift-3-alfamart)

</div>


---

## 🔌 API Documentation

Sistem ini menyediakan RESTful API untuk integrasi dengan aplikasi eksternal atau mobile app.

### Base URL
```
Development: http://localhost:8000/api
Production: https://api.alfamart.com/api
```

### Authentication
API menggunakan **Laravel Sanctum** untuk autentikasi. Setelah login, gunakan token pada header:
```
Authorization: Bearer {your-token-here}
```

### Available Endpoints

#### Authentication
- `POST /api/auth/login` - Login dengan NIK dan password
- `POST /api/auth/logout` - Logout dan hapus token
- `GET /api/employee/by-nik` - Get employee data by NIK
- `GET /api/auth/user` - Get authenticated user

#### Dashboard
- `GET /api/dashboard/statistics` - Get dashboard statistics
- `GET /api/dashboard/sales-trend` - Get sales trend (7 days)
- `GET /api/dashboard/recent-reports` - Get recent reports (5 latest)

#### Reports
- `GET /api/reports` - Get all reports (with pagination)
- `GET /api/reports/{id}` - Get report by ID
- `POST /api/reports` - Create new report
- `PUT /api/reports/{id}` - Update report
- `DELETE /api/reports/{id}` - Delete report

### Documentation Files
- **Full API Documentation**: `API_DOCUMENTATION.md`
- **Postman Collection**: `Alfamart_API.postman_collection.json`

### Quick Test with cURL
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nik": "14085061", "password": "TB56#061"}'

# Get Dashboard Statistics (replace YOUR_TOKEN)
curl -X GET http://localhost:8000/api/dashboard/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Import to Postman
1. Open Postman
2. Click "Import"
3. Select `Alfamart_API.postman_collection.json`
4. Set environment variable `base_url` to `http://localhost:8000/api`
5. Run "Login" request to get token
6. Token will be automatically saved for other requests

---
