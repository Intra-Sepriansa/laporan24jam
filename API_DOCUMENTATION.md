# 📚 API Documentation - Alfamart Shift 3 Report System

## 🔗 Base URL
```
Development: http://localhost:8000/api
Production: https://api.alfamart.com/api
```

## 🔐 Authentication

API menggunakan **Laravel Sanctum** untuk autentikasi. Setelah login, gunakan token yang diberikan pada header request:

```
Authorization: Bearer {your-token-here}
```

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Dashboard](#dashboard)
3. [Reports](#reports)

---

## 🔑 Authentication

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Description:** Login dengan NIK dan password untuk mendapatkan API token

**Request Body:**
```json
{
  "nik": "14085061",
  "password": "TB56#061",
  "remember": false
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "1|abc123def456...",
    "user": {
      "id": 1,
      "nik": "14085061",
      "name": "SUNARDI",
      "email": "sunardi@store.com",
      "employee": {
        "id": 1,
        "nik": "14085061",
        "name": "SUNARDI",
        "store": {
          "id": 1,
          "code": "TB56",
          "name": "RAYA CANGKUDU CISOKA"
        }
      }
    }
  }
}
```

**Response Error (422):**
```json
{
  "success": false,
  "message": "NIK atau password salah"
}
```

---

### 2. Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Logout dan hapus token autentikasi

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout berhasil"
}
```

---

### 3. Get Employee by NIK
**Endpoint:** `GET /api/employee/by-nik`

**Description:** Mendapatkan data karyawan berdasarkan NIK (untuk auto-fill form login)

**Query Parameters:**
- `nik` (required): NIK karyawan (8 digit)

**Example:**
```
GET /api/employee/by-nik?nik=14085061
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "nik": "14085061",
    "name": "SUNARDI",
    "store_code": "TB56",
    "store_name": "RAYA CANGKUDU CISOKA"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Karyawan tidak ditemukan"
}
```

---

### 4. Get Authenticated User
**Endpoint:** `GET /api/auth/user`

**Description:** Mendapatkan data user yang sedang login

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nik": "14085061",
    "name": "SUNARDI",
    "email": "sunardi@store.com"
  }
}
```

---

## 📊 Dashboard

### 1. Get Dashboard Statistics
**Endpoint:** `GET /api/dashboard/statistics`

**Description:** Mendapatkan statistik dashboard untuk bulan ini

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "total_reports_this_month": 5,
    "total_sales_this_month": 185000000,
    "total_transactions_this_month": 3500,
    "average_apc_this_month": 52857,
    "current_month": "FEBRUARY 2026"
  }
}
```

---

### 2. Get Sales Trend
**Endpoint:** `GET /api/dashboard/sales-trend`

**Description:** Mendapatkan tren penjualan 7 hari terakhir

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "date": "01 Feb",
      "spd": 6360500,
      "std": 107,
      "apc": 59443
    },
    {
      "date": "02 Feb",
      "spd": 2328400,
      "std": 67,
      "apc": 34752
    }
  ]
}
```

---

### 3. Get Recent Reports
**Endpoint:** `GET /api/dashboard/recent-reports`

**Description:** Mendapatkan 5 laporan terbaru

**Headers:**
```
Authorization: Bearer {token}
```

**Response Success (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "month_year": "FEBRUARY 2026",
      "shift": 3,
      "report_date": "2026-02-06",
      "created_by": "SUNARDI",
      "total_days": 28,
      "total_spd": 185000000,
      "total_std": 3500,
      "created_at": "06 Feb 2026"
    }
  ]
}
```

---

## 📝 Reports

### 1. Get All Reports
**Endpoint:** `GET /api/reports`

**Description:** Mendapatkan daftar semua laporan shift dengan pagination

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `per_page` (optional): Items per page (default: 10)
- `search` (optional): Search by month_year

**Example:**
```
GET /api/reports?page=1&per_page=10&search=FEBRUARY
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "month_year": "FEBRUARY 2026",
        "shift": 3,
        "report_date": "2026-02-06",
        "store_code": "TB56",
        "store_name": "RAYA CANGKUDU CISOKA",
        "total_spd": 185000000,
        "total_std": 3500
      }
    ],
    "per_page": 10,
    "total": 50
  }
}
```

---

### 2. Get Report by ID
**Endpoint:** `GET /api/reports/{id}`

**Description:** Mendapatkan detail laporan shift berdasarkan ID

**Headers:**
```
Authorization: Bearer {token}
```

**Example:**
```
GET /api/reports/1
```

**Response Success (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "month_year": "FEBRUARY 2026",
    "shift": 3,
    "report_date": "2026-02-06",
    "store_code": "TB56",
    "store_name": "RAYA CANGKUDU CISOKA",
    "created_by": "SUNARDI",
    "details": [
      {
        "day_number": 1,
        "transaction_date": "2026-02-01",
        "spd": 6360500,
        "std": 107,
        "apc": 59443,
        "pulsa": 0
      },
      {
        "day_number": 2,
        "transaction_date": "2026-02-02",
        "spd": 2328400,
        "std": 67,
        "apc": 34752,
        "pulsa": 23500
      }
    ],
    "totals": {
      "spd": 185000000,
      "std": 3500,
      "pulsa": 5000000,
      "average_apc": 52857
    }
  }
}
```

**Response Error (404):**
```json
{
  "message": "No query results for model [App\\Models\\ShiftReport] 1"
}
```

---

### 3. Create New Report
**Endpoint:** `POST /api/reports`

**Description:** Membuat laporan shift baru

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "month_year": "FEBRUARY 2026",
  "shift": 3,
  "report_date": "2026-02-06",
  "details": [
    {
      "day_number": 1,
      "transaction_date": "2026-02-01",
      "spd": 6360500,
      "std": 107,
      "pulsa": 0,
      "notes": ""
    },
    {
      "day_number": 2,
      "transaction_date": "2026-02-02",
      "spd": 2328400,
      "std": 67,
      "pulsa": 23500,
      "notes": "Promo hari ini"
    }
  ]
}
```

**Response Success (201):**
```json
{
  "success": true,
  "message": "Laporan berhasil dibuat",
  "data": {
    "id": 1
  }
}
```

**Response Error (422):**
```json
{
  "message": "The month year field is required.",
  "errors": {
    "month_year": [
      "The month year field is required."
    ]
  }
}
```

---

### 4. Update Report
**Endpoint:** `PUT /api/reports/{id}`

**Description:** Update laporan shift yang sudah ada

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "month_year": "FEBRUARY 2026",
  "shift": 3,
  "report_date": "2026-02-06",
  "details": [
    {
      "day_number": 1,
      "transaction_date": "2026-02-01",
      "spd": 6360500,
      "std": 107,
      "pulsa": 0,
      "notes": ""
    }
  ]
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Laporan berhasil diupdate"
}
```

---

### 5. Delete Report
**Endpoint:** `DELETE /api/reports/{id}`

**Description:** Hapus laporan shift

**Headers:**
```
Authorization: Bearer {token}
```

**Example:**
```
DELETE /api/reports/1
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Laporan berhasil dihapus"
}
```

**Response Error (404):**
```json
{
  "message": "No query results for model [App\\Models\\ShiftReport] 1"
}
```

---

## 📌 Data Models

### User
```json
{
  "id": 1,
  "nik": "14085061",
  "name": "SUNARDI",
  "email": "sunardi@store.com",
  "employee_id": 1,
  "created_at": "2026-02-06T00:00:00.000000Z",
  "updated_at": "2026-02-06T00:00:00.000000Z"
}
```

### Employee
```json
{
  "id": 1,
  "store_id": 1,
  "nik": "14085061",
  "name": "SUNARDI",
  "created_at": "2026-02-06T00:00:00.000000Z",
  "updated_at": "2026-02-06T00:00:00.000000Z"
}
```

### Store
```json
{
  "id": 1,
  "code": "TB56",
  "name": "RAYA CANGKUDU CISOKA",
  "address": "BALARAJA",
  "created_at": "2026-02-06T00:00:00.000000Z",
  "updated_at": "2026-02-06T00:00:00.000000Z"
}
```

### Shift Report
```json
{
  "id": 1,
  "store_id": 1,
  "user_id": 1,
  "month_year": "FEBRUARY 2026",
  "shift": 3,
  "report_date": "2026-02-06",
  "total_spd": 185000000,
  "total_std": 3500,
  "total_pulsa": 5000000,
  "average_apc": 52857,
  "created_at": "2026-02-06T00:00:00.000000Z",
  "updated_at": "2026-02-06T00:00:00.000000Z"
}
```

### Shift Report Detail
```json
{
  "id": 1,
  "shift_report_id": 1,
  "day_number": 1,
  "transaction_date": "2026-02-01",
  "spd": 6360500,
  "std": 107,
  "apc": 59443,
  "pulsa": 0,
  "notes": null,
  "created_at": "2026-02-06T00:00:00.000000Z",
  "updated_at": "2026-02-06T00:00:00.000000Z"
}
```

---

## 🔒 Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\ShiftReport] 1"
}
```

### 422 Validation Error
```json
{
  "message": "The month year field is required. (and 2 more errors)",
  "errors": {
    "month_year": [
      "The month year field is required."
    ],
    "shift": [
      "The shift field is required."
    ],
    "report_date": [
      "The report date field is required."
    ]
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Gagal membuat laporan: Database connection error"
}
```

---

## 🧪 Testing dengan Postman

### 1. Import Collection
Buat Postman Collection dengan base URL: `http://localhost:8000/api`

### 2. Setup Environment Variables
```
base_url: http://localhost:8000/api
token: (akan di-set setelah login)
```

### 3. Test Flow
1. **Login** → Simpan token dari response
2. **Get Dashboard Statistics** → Gunakan token
3. **Create Report** → Gunakan token
4. **Get All Reports** → Gunakan token
5. **Get Report by ID** → Gunakan token
6. **Update Report** → Gunakan token
7. **Delete Report** → Gunakan token
8. **Logout** → Gunakan token

---

## 📝 Notes

1. **Token Expiration:** Token tidak expire secara otomatis. Gunakan logout untuk menghapus token.
2. **Rate Limiting:** API memiliki rate limiting 60 requests per minute per user.
3. **Pagination:** Default pagination adalah 10 items per page, maksimal 100.
4. **Date Format:** Semua tanggal menggunakan format `YYYY-MM-DD`.
5. **Currency:** Semua nilai mata uang dalam Rupiah (IDR).
6. **Authorization:** User hanya bisa mengakses data dari toko mereka sendiri.

---

## 🚀 Quick Start Example (cURL)

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "14085061",
    "password": "TB56#061"
  }'
```

### Get Dashboard Statistics
```bash
curl -X GET http://localhost:8000/api/dashboard/statistics \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Report
```bash
curl -X POST http://localhost:8000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "month_year": "FEBRUARY 2026",
    "shift": 3,
    "report_date": "2026-02-06",
    "details": [
      {
        "day_number": 1,
        "transaction_date": "2026-02-01",
        "spd": 6360500,
        "std": 107,
        "pulsa": 0
      }
    ]
  }'
```

---

## 📞 Support

Untuk pertanyaan atau masalah terkait API, hubungi:
- Email: support@alfamart.com
- Documentation: http://localhost:8000/api/documentation

---

**Last Updated:** February 6, 2026  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready
