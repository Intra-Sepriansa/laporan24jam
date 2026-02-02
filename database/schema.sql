-- ============================================
-- DATABASE SCHEMA UNTUK SISTEM LAPORAN SHIFT 3
-- ============================================

-- Table: stores
-- Menyimpan data toko
CREATE TABLE stores (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL COMMENT 'Kode toko (TB62, T156, dll)',
    name VARCHAR(255) NOT NULL COMMENT 'Nama toko',
    area VARCHAR(255) NULL COMMENT 'Area/wilayah toko',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

-- Table: employees
-- Menyimpan data karyawan
CREATE TABLE employees (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(20) UNIQUE NOT NULL COMMENT 'NIK karyawan',
    name VARCHAR(255) NOT NULL COMMENT 'Nama karyawan',
    store_id BIGINT UNSIGNED NULL,
    position VARCHAR(255) NULL COMMENT 'Jabatan',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE SET NULL
);

-- Table: users
-- Menyimpan data user untuk login
-- Password format: KODE_TOKO#3_DIGIT_TERAKHIR_NIK
-- Contoh: TB62#061 untuk NIK 14085061 di toko TB62
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT UNSIGNED NULL,
    nik VARCHAR(20) UNIQUE NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    two_factor_confirmed_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Table: shift_reports
-- Menyimpan header laporan shift
CREATE TABLE shift_reports (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    store_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    report_date DATE NOT NULL COMMENT 'Tanggal laporan',
    shift INT DEFAULT 3 COMMENT 'Shift (1, 2, atau 3)',
    month_year VARCHAR(20) NOT NULL COMMENT 'Bulan dan tahun (FEBRUARY 2026)',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_store_date_shift (store_id, report_date, shift)
);

-- Table: shift_report_details
-- Menyimpan detail transaksi harian dalam laporan shift
CREATE TABLE shift_report_details (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    shift_report_id BIGINT UNSIGNED NOT NULL,
    day_number INT NOT NULL COMMENT 'Nomor hari (1-31)',
    transaction_date DATE NOT NULL COMMENT 'Tanggal transaksi',
    spd DECIMAL(15,2) DEFAULT 0 COMMENT 'SPD - Sales Per Day',
    std INT DEFAULT 0 COMMENT 'STD - Struk Transaksi per Day',
    apc DECIMAL(15,2) DEFAULT 0 COMMENT 'APC - Average Per Customer (SPD/STD)',
    pulsa DECIMAL(15,2) DEFAULT 0 COMMENT 'Penjualan Pulsa',
    notes TEXT NULL COMMENT 'Catatan tambahan',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (shift_report_id) REFERENCES shift_reports(id) ON DELETE CASCADE,
    INDEX idx_report_date (shift_report_id, transaction_date)
);

-- ============================================
-- CONTOH DATA
-- ============================================

-- Contoh data toko
INSERT INTO stores (code, name, area) VALUES
('TB56', 'RY CANGKUDU CISOKA', 'Tangerang'),
('TB62', 'TAMAN KIRANA 2 (F)', 'Tangerang');

-- Contoh data karyawan
INSERT INTO employees (nik, name, store_id, position) VALUES
('14085061', 'SUNARDI', 1, 'Staff');

-- Contoh data user (password: TB62#061)
INSERT INTO users (employee_id, nik, name, email, password) VALUES
(1, '14085061', 'SUNARDI', 'sunardi@store.com', '$2y$12$...');

-- Contoh laporan shift
INSERT INTO shift_reports (store_id, user_id, report_date, shift, month_year) VALUES
(1, 1, '2026-02-01', 3, 'FEBRUARY 2026');

-- Contoh detail laporan
INSERT INTO shift_report_details (shift_report_id, day_number, transaction_date, spd, std, apc, pulsa) VALUES
(1, 1, '2026-02-01', 6360500, 107, 59443, 0),
(1, 2, '2026-02-02', 2328400, 67, 34752, 23500);

-- ============================================
-- QUERY BERGUNA
-- ============================================

-- Melihat semua toko dengan jumlah karyawan
SELECT s.code, s.name, COUNT(e.id) as total_employees
FROM stores s
LEFT JOIN employees e ON s.id = e.store_id
GROUP BY s.id;

-- Melihat laporan shift dengan total
SELECT 
    sr.id,
    s.code as store_code,
    s.name as store_name,
    sr.month_year,
    COUNT(srd.id) as total_days,
    SUM(srd.spd) as total_spd,
    SUM(srd.std) as total_std,
    SUM(srd.pulsa) as total_pulsa
FROM shift_reports sr
JOIN stores s ON sr.store_id = s.id
LEFT JOIN shift_report_details srd ON sr.id = srd.shift_report_id
GROUP BY sr.id;

-- Melihat detail laporan per hari
SELECT 
    srd.day_number,
    srd.transaction_date,
    srd.spd,
    srd.std,
    srd.apc,
    srd.pulsa
FROM shift_report_details srd
WHERE srd.shift_report_id = 1
ORDER BY srd.day_number;
