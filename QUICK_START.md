# 🚀 QUICK START - Sistem Laporan Shift 3

## ✅ Yang Sudah Selesai

### 1. Database Structure
- ✅ 5 tabel utama sudah dibuat
- ✅ Relasi antar tabel sudah terkonfigurasi
- ✅ Migration files sudah siap
- ✅ Seeder dengan data awal sudah berjalan

### 2. Models
- ✅ Store Model (Toko)
- ✅ Employee Model (Karyawan)
- ✅ User Model (Login)
- ✅ ShiftReport Model (Header Laporan)
- ✅ ShiftReportDetail Model (Detail Harian)

### 3. Data Awal
- ✅ 17 toko sudah ter-input
- ✅ 12 karyawan sudah ter-input
- ✅ 12 user dengan password otomatis sudah dibuat

---

## 📊 Struktur Database

```
stores (Toko)
  ├── employees (Karyawan)
  │     └── users (Login)
  └── shift_reports (Laporan Shift)
        └── shift_report_details (Detail Harian)
```

---

## 🔐 Format Login

**Username:** NIK (8 digit)  
**Password:** KODE_TOKO#3_DIGIT_TERAKHIR_NIK

**Contoh:**
- NIK: `14085061`
- Nama: `SUNARDI` (auto-fill)
- Toko: `TB62`
- Password: `TB62#061`

---

## 📝 Format Laporan Shift 3

```
KODE : TB56
TOKO : RAYA CANGKUDU CISOKA
BULAN : FEBRUARY 2026

No | Tanggal | SPD       | STD | APC    | PULSA
1  | 1       | 6.360.500 | 107 | 59.443 | 0
2  | 2       | 2.328.400 | 67  | 34.752 | 23.500
```

**Keterangan:**
- **SPD** = Sales Per Day (Total penjualan harian)
- **STD** = Struk Transaksi per Day (Jumlah struk)
- **APC** = Average Per Customer (SPD/STD)
- **PULSA** = Penjualan pulsa

---

## 🛠️ Command yang Tersedia

### Jalankan Migration
```bash
php artisan migrate
```

### Jalankan Seeder
```bash
php artisan db:seed
```

### Reset Database & Seed Ulang
```bash
php artisan migrate:fresh --seed
```

### Cek Data di Database
```bash
php artisan tinker
```

Kemudian:
```php
// Lihat semua toko
App\Models\Store::all();

// Lihat semua karyawan dengan toko
App\Models\Employee::with('store')->get();

// Lihat semua user dengan password
App\Models\User::with('employee.store')->get()->each(function($u) {
    echo "NIK: {$u->nik} | Nama: {$u->name} | Password: " . 
         $u->employee->generatePassword() . "\n";
});
```

---

## 📁 File-File Penting

### Migration Files
- `database/migrations/2026_02_03_000001_create_stores_table.php`
- `database/migrations/2026_02_03_000002_create_employees_table.php`
- `database/migrations/2026_02_03_000003_add_employee_id_to_users_table.php`
- `database/migrations/2026_02_03_000004_create_shift_reports_table.php`
- `database/migrations/2026_02_03_000005_create_shift_report_details_table.php`

### Seeder Files
- `database/seeders/StoreSeeder.php` - Data 17 toko
- `database/seeders/EmployeeSeeder.php` - Data 12 karyawan
- `database/seeders/UserSeeder.php` - Data 12 user dengan password

### Model Files
- `app/Models/Store.php`
- `app/Models/Employee.php`
- `app/Models/User.php`
- `app/Models/ShiftReport.php`
- `app/Models/ShiftReportDetail.php`

### Dokumentasi
- `README_DATABASE.md` - Dokumentasi lengkap database
- `CREDENTIALS.md` - Daftar login semua user
- `DATABASE_ERD.md` - Diagram ERD dan relasi
- `database/schema.sql` - Raw SQL schema
- `QUICK_START.md` - File ini

---

## 🎯 Next Steps (Yang Perlu Dibuat)

### Phase 1: Authentication
- [ ] Halaman login dengan input NIK
- [ ] Auto-fill nama saat NIK diinput
- [ ] Validasi password
- [ ] Session management

### Phase 2: Dashboard
- [ ] Dashboard utama setelah login
- [ ] Tampilkan info user dan toko
- [ ] Menu navigasi

### Phase 3: Form Laporan
- [ ] Form create laporan shift baru
- [ ] Input header (bulan, tahun, shift)
- [ ] Form input detail harian (SPD, STD, APC, PULSA)
- [ ] Auto-calculate APC dari SPD/STD
- [ ] Validasi input

### Phase 4: View Laporan
- [ ] List semua laporan
- [ ] Filter by bulan/tahun
- [ ] Detail laporan per bulan
- [ ] Summary total

### Phase 5: Export & Print
- [ ] Export ke PDF
- [ ] Export ke Excel
- [ ] Print laporan
- [ ] Format sesuai template

### Phase 6: Additional Features
- [ ] Edit laporan
- [ ] Delete laporan
- [ ] User management
- [ ] Change password
- [ ] Audit log

---

## 💡 Tips Development

### 1. Testing Login
```php
// Di tinker
$user = App\Models\User::where('nik', '14085061')->first();
$password = $user->employee->generatePassword();
echo "Password: {$password}";
```

### 2. Create Sample Report
```php
$report = App\Models\ShiftReport::create([
    'store_id' => 1,
    'user_id' => 1,
    'report_date' => now(),
    'shift' => 3,
    'month_year' => 'FEBRUARY 2026'
]);

$report->details()->create([
    'day_number' => 1,
    'transaction_date' => '2026-02-01',
    'spd' => 6360500,
    'std' => 107,
    'apc' => 59443,
    'pulsa' => 0
]);
```

### 3. Query Laporan
```php
$report = App\Models\ShiftReport::with(['store', 'user', 'details'])
    ->where('month_year', 'FEBRUARY 2026')
    ->first();

echo "Toko: {$report->store->name}\n";
echo "Total SPD: {$report->total_spd}\n";
echo "Total STD: {$report->total_std}\n";
```

---

## 📞 Support

Jika ada pertanyaan atau masalah:
1. Cek dokumentasi di `README_DATABASE.md`
2. Lihat credentials di `CREDENTIALS.md`
3. Review ERD di `DATABASE_ERD.md`

---

## ⚠️ Catatan Penting

1. **Database sudah siap digunakan** ✅
2. **Semua data sudah ter-seed** ✅
3. **Password format sudah otomatis** ✅
4. **Fokus selanjutnya: UI/UX** 🎨
5. **Jangan lupa backup database** 💾

---

**Status:** Database 100% Complete! 🎉  
**Next:** Mulai develop UI untuk login dan form laporan
