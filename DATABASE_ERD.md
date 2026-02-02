# Entity Relationship Diagram (ERD)

## Database Schema - Sistem Laporan Shift 3

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE STRUCTURE                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      STORES          │
├──────────────────────┤
│ PK  id               │
│     code (UNIQUE)    │◄────────┐
│     name             │         │
│     area             │         │
│     is_active        │         │
│     timestamps       │         │
└──────────────────────┘         │
         │                       │
         │ 1                     │
         │                       │
         │ N                     │
         ▼                       │
┌──────────────────────┐         │
│     EMPLOYEES        │         │
├──────────────────────┤         │
│ PK  id               │         │
│     nik (UNIQUE)     │         │
│     name             │         │
│ FK  store_id         │─────────┘
│     position         │
│     is_active        │
│     timestamps       │
└──────────────────────┘
         │
         │ 1
         │
         │ 1
         ▼
┌──────────────────────┐
│       USERS          │
├──────────────────────┤
│ PK  id               │◄────────┐
│ FK  employee_id      │─────────┤─────┐
│     nik (UNIQUE)     │         │     │
│     name             │         │     │
│     email (UNIQUE)   │         │     │
│     password         │         │     │
│     2FA fields       │         │     │
│     timestamps       │         │     │
└──────────────────────┘         │     │
                                 │     │
                                 │     │
                                 │     │ 1
┌──────────────────────┐         │     │
│   SHIFT_REPORTS      │         │     │
├──────────────────────┤         │     │
│ PK  id               │         │     │
│ FK  store_id         │─────────┘     │
│ FK  user_id          │───────────────┘
│     report_date      │
│     shift            │
│     month_year       │
│     timestamps       │
└──────────────────────┘
         │
         │ 1
         │
         │ N
         ▼
┌──────────────────────┐
│ SHIFT_REPORT_DETAILS │
├──────────────────────┤
│ PK  id               │
│ FK  shift_report_id  │
│     day_number       │
│     transaction_date │
│     spd (DECIMAL)    │
│     std (INT)        │
│     apc (DECIMAL)    │
│     pulsa (DECIMAL)  │
│     notes            │
│     timestamps       │
└──────────────────────┘
```

---

## Relasi Antar Tabel

### 1. STORES → EMPLOYEES (One to Many)
- Satu toko memiliki banyak karyawan
- Satu karyawan bekerja di satu toko

### 2. EMPLOYEES → USERS (One to One)
- Satu karyawan memiliki satu akun user
- Satu user terhubung ke satu karyawan

### 3. STORES → SHIFT_REPORTS (One to Many)
- Satu toko memiliki banyak laporan shift
- Satu laporan shift untuk satu toko

### 4. USERS → SHIFT_REPORTS (One to Many)
- Satu user dapat membuat banyak laporan
- Satu laporan dibuat oleh satu user

### 5. SHIFT_REPORTS → SHIFT_REPORT_DETAILS (One to Many)
- Satu laporan shift memiliki banyak detail harian
- Satu detail harian milik satu laporan shift

---

## Data Flow

```
┌─────────────┐
│   LOGIN     │
│  (NIK)      │
└──────┬──────┘
       │
       ▼
┌─────────────┐      ┌──────────────┐
│  EMPLOYEES  │─────►│    USERS     │
│  (Get Name) │      │  (Validate)  │
└─────────────┘      └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │   DASHBOARD  │
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │CREATE REPORT │
                     └──────┬───────┘
                            │
       ┌────────────────────┴────────────────────┐
       │                                         │
       ▼                                         ▼
┌──────────────┐                        ┌────────────────┐
│SHIFT_REPORTS │                        │     STORES     │
│  (Header)    │                        │  (Toko Info)   │
└──────┬───────┘                        └────────────────┘
       │
       ▼
┌──────────────────┐
│SHIFT_REPORT_     │
│    DETAILS       │
│  (Daily Data)    │
└──────────────────┘
```

---

## Contoh Data Flow

### Scenario: SUNARDI membuat laporan shift 3 untuk toko TB62

1. **Login:**
   - Input NIK: `14085061`
   - Query: `SELECT * FROM employees WHERE nik = '14085061'`
   - Auto-fill: Nama = `SUNARDI`, Toko = `TB62`
   - Validate password: `TB62#061`

2. **Create Report:**
   ```sql
   INSERT INTO shift_reports 
   (store_id, user_id, report_date, shift, month_year)
   VALUES (1, 1, '2026-02-01', 3, 'FEBRUARY 2026');
   ```

3. **Add Daily Details:**
   ```sql
   INSERT INTO shift_report_details
   (shift_report_id, day_number, transaction_date, spd, std, apc, pulsa)
   VALUES 
   (1, 1, '2026-02-01', 6360500, 107, 59443, 0),
   (1, 2, '2026-02-02', 2328400, 67, 34752, 23500);
   ```

4. **View Report:**
   ```sql
   SELECT 
       sr.month_year,
       s.code,
       s.name,
       srd.day_number,
       srd.spd,
       srd.std,
       srd.apc,
       srd.pulsa
   FROM shift_reports sr
   JOIN stores s ON sr.store_id = s.id
   JOIN shift_report_details srd ON sr.id = srd.shift_report_id
   WHERE sr.id = 1
   ORDER BY srd.day_number;
   ```

---

## Indexes untuk Performance

```sql
-- Index pada stores
CREATE INDEX idx_stores_code ON stores(code);
CREATE INDEX idx_stores_active ON stores(is_active);

-- Index pada employees
CREATE INDEX idx_employees_nik ON employees(nik);
CREATE INDEX idx_employees_store ON employees(store_id);

-- Index pada users
CREATE INDEX idx_users_nik ON users(nik);
CREATE INDEX idx_users_employee ON users(employee_id);

-- Index pada shift_reports
CREATE INDEX idx_reports_store_date ON shift_reports(store_id, report_date);
CREATE INDEX idx_reports_user ON shift_reports(user_id);
CREATE INDEX idx_reports_month ON shift_reports(month_year);

-- Index pada shift_report_details
CREATE INDEX idx_details_report ON shift_report_details(shift_report_id);
CREATE INDEX idx_details_date ON shift_report_details(transaction_date);
```

---

## Constraints & Rules

### Business Rules:

1. **NIK harus unik** - Tidak boleh ada duplikasi NIK
2. **Kode toko harus unik** - Setiap toko punya kode berbeda
3. **Email harus unik** - Satu email untuk satu user
4. **Password format** - Harus mengikuti: KODE_TOKO#3_DIGIT_TERAKHIR_NIK
5. **APC calculation** - APC = SPD / STD (jika STD > 0)
6. **Soft delete** - Gunakan is_active, jangan hard delete
7. **Shift number** - Hanya 1, 2, atau 3
8. **Day number** - Hanya 1-31 sesuai bulan

### Foreign Key Constraints:

- `employees.store_id` → `stores.id` (ON DELETE SET NULL)
- `users.employee_id` → `employees.id` (ON DELETE CASCADE)
- `shift_reports.store_id` → `stores.id` (ON DELETE CASCADE)
- `shift_reports.user_id` → `users.id` (ON DELETE CASCADE)
- `shift_report_details.shift_report_id` → `shift_reports.id` (ON DELETE CASCADE)

---

## Database Size Estimation

Untuk 17 toko dengan 12 karyawan, estimasi per bulan:

- **stores**: 17 rows × ~200 bytes = ~3.4 KB
- **employees**: 12 rows × ~300 bytes = ~3.6 KB
- **users**: 12 rows × ~500 bytes = ~6 KB
- **shift_reports**: 17 reports × ~200 bytes = ~3.4 KB
- **shift_report_details**: 17 × 30 days × ~150 bytes = ~76.5 KB

**Total per bulan**: ~93 KB  
**Total per tahun**: ~1.1 MB  
**Total 5 tahun**: ~5.5 MB

Database ini sangat efisien dan tidak akan membebani server!
