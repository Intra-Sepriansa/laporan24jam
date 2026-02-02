# Database Schema - Sistem Laporan Shift 3

## Struktur Database

Database ini dirancang untuk mengelola laporan shift 3 dengan fitur-fitur berikut:

### 1. **Tabel `stores`** - Data Toko
Menyimpan informasi toko-toko yang ada.

**Kolom:**
- `id`: Primary key
- `code`: Kode toko (TB62, T156, dll) - UNIQUE
- `name`: Nama toko
- `area`: Area/wilayah toko
- `is_active`: Status aktif toko

**Contoh Data:**
```
TB62 - TAMAN KIRANA 2 (F)
TB56 - RY CANGKUDU CISOKA
T156 - TAMAN KIRANA
```

---

### 2. **Tabel `employees`** - Data Karyawan
Menyimpan informasi karyawan yang bekerja di toko.

**Kolom:**
- `id`: Primary key
- `nik`: NIK karyawan (8 digit) - UNIQUE
- `name`: Nama karyawan
- `store_id`: Foreign key ke tabel stores
- `position`: Jabatan
- `is_active`: Status aktif karyawan

**Contoh Data:**
```
NIK: 14085061 - SUNARDI (Toko TB62)
NIK: 17110563 - AAN (Toko T156)
NIK: 19085703 - TAQWA (Toko TA21)
```

---

### 3. **Tabel `users`** - Data Login
Menyimpan data user untuk login ke sistem.

**Kolom:**
- `id`: Primary key
- `employee_id`: Foreign key ke tabel employees
- `nik`: NIK karyawan (copy dari employees)
- `name`: Nama user
- `email`: Email user
- `password`: Password (hashed)

**Format Password:**
```
KODE_TOKO#3_DIGIT_TERAKHIR_NIK

Contoh:
- NIK: 14085061 di Toko TB62 → Password: TB62#061
- NIK: 17110563 di Toko T156 → Password: T156#563
- NIK: 19085703 di Toko TA21 → Password: TA21#703
```

**Cara Login:**
1. Input NIK (contoh: 14085061)
2. Sistem otomatis mengisi nama (SUNARDI)
3. Input password dengan format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK

---

### 4. **Tabel `shift_reports`** - Header Laporan Shift
Menyimpan informasi header laporan shift bulanan.

**Kolom:**
- `id`: Primary key
- `store_id`: Foreign key ke tabel stores
- `user_id`: Foreign key ke tabel users (pembuat laporan)
- `report_date`: Tanggal laporan dibuat
- `shift`: Nomor shift (1, 2, atau 3)
- `month_year`: Bulan dan tahun laporan (contoh: "FEBRUARY 2026")

**Contoh:**
```
Laporan Shift 3 - Toko TB56 - FEBRUARY 2026
```

---

### 5. **Tabel `shift_report_details`** - Detail Laporan Harian
Menyimpan detail transaksi per hari dalam laporan shift.

**Kolom:**
- `id`: Primary key
- `shift_report_id`: Foreign key ke tabel shift_reports
- `day_number`: Nomor hari dalam bulan (1-31)
- `transaction_date`: Tanggal transaksi
- `spd`: Sales Per Day (total penjualan harian)
- `std`: Struk Transaksi per Day (jumlah struk)
- `apc`: Average Per Customer (SPD/STD)
- `pulsa`: Penjualan pulsa
- `notes`: Catatan tambahan

**Contoh Data:**
```
No | Tanggal | SPD       | STD | APC    | PULSA
1  | 1 Feb   | 6.360.500 | 107 | 59.443 | 0
2  | 2 Feb   | 2.328.400 | 67  | 34.752 | 23.500
```

---

## Relasi Antar Tabel

```
stores (1) -----> (N) employees
employees (1) --> (1) users
stores (1) -----> (N) shift_reports
users (1) ------> (N) shift_reports
shift_reports (1) -> (N) shift_report_details
```

---

## Cara Menjalankan Migration

1. **Jalankan migration:**
```bash
php artisan migrate
```

2. **Jalankan seeder untuk data awal:**
```bash
php artisan db:seed
```

Atau jalankan seeder spesifik:
```bash
php artisan db:seed --class=StoreSeeder
php artisan db:seed --class=EmployeeSeeder
php artisan db:seed --class=UserSeeder
```

3. **Reset database dan seed ulang:**
```bash
php artisan migrate:fresh --seed
```

---

## Data Login yang Tersedia

Setelah menjalankan seeder, berikut adalah data login yang bisa digunakan:

| NIK      | Nama    | Toko | Password   |
|----------|---------|------|------------|
| 14085061 | SUNARDI | TB62 | TB62#061   |
| 17110563 | AAN     | T156 | T156#563   |
| 19085703 | TAQWA   | TA21 | TA21#703   |
| 19050173 | RIKA    | TB35 | TB35#173   |
| 22103779 | DEKON   | TB50 | TB50#779   |
| 23067788 | ISNAN   | TE13 | TE13#788   |
| 23082187 | NAUFAL  | TE47 | TE47#187   |
| 22051086 | INTRA   | TF81 | TF81#086   |
| 26015149 | AMAR    | TE22 | TE22#149   |
| 23052003 | ROS     | TB08 | TB08#003   |
| 25062196 | AULIA   | TG41 | TG41#196   |
| 23072045 | ULPAH   | TD10 | TD10#045   |

---

## Fitur Database

### 1. **Auto-fill Nama saat Login**
Ketika user memasukkan NIK, sistem akan otomatis mengisi nama dari database.

### 2. **Password Terstruktur**
Format password yang konsisten memudahkan manajemen dan reset password.

### 3. **Relasi Data yang Kuat**
Semua data terhubung dengan foreign key untuk menjaga integritas data.

### 4. **Perhitungan Otomatis APC**
APC (Average Per Customer) dapat dihitung otomatis dari SPD/STD.

### 5. **Tracking Lengkap**
Setiap laporan mencatat siapa yang membuat dan kapan dibuat.

---

## Query Berguna

### Melihat semua toko dengan karyawan:
```sql
SELECT s.code, s.name, e.nik, e.name as employee_name
FROM stores s
LEFT JOIN employees e ON s.id = e.store_id
ORDER BY s.code;
```

### Melihat total laporan per toko:
```sql
SELECT 
    s.code,
    s.name,
    COUNT(sr.id) as total_reports,
    SUM(srd.spd) as total_sales
FROM stores s
LEFT JOIN shift_reports sr ON s.id = sr.store_id
LEFT JOIN shift_report_details srd ON sr.id = srd.shift_report_id
GROUP BY s.id;
```

### Melihat detail laporan bulan tertentu:
```sql
SELECT 
    srd.day_number,
    DATE_FORMAT(srd.transaction_date, '%d %M %Y') as tanggal,
    FORMAT(srd.spd, 0) as spd,
    srd.std,
    FORMAT(srd.apc, 0) as apc,
    FORMAT(srd.pulsa, 0) as pulsa
FROM shift_report_details srd
JOIN shift_reports sr ON srd.shift_report_id = sr.id
WHERE sr.month_year = 'FEBRUARY 2026'
ORDER BY srd.day_number;
```

---

## Catatan Penting

1. **NIK harus unik** - Setiap karyawan memiliki NIK yang berbeda
2. **Kode toko harus unik** - Tidak boleh ada duplikasi kode toko
3. **Password format** - Selalu ikuti format KODE_TOKO#3_DIGIT_TERAKHIR_NIK
4. **APC calculation** - APC = SPD / STD (jika STD > 0)
5. **Soft delete** - Gunakan `is_active` untuk menonaktifkan data tanpa menghapus

---

## Next Steps

Setelah database siap, langkah selanjutnya:
1. ✅ Database schema dan migration
2. ⏳ Membuat UI untuk login dengan NIK
3. ⏳ Membuat form input laporan shift
4. ⏳ Membuat tampilan laporan
5. ⏳ Export laporan ke PDF/Excel
