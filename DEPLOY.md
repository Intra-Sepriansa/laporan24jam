# 🚀 Panduan Deploy ke Railway + Custom Domain (sepriansatech.com)

## Prasyarat
- Akun GitHub (sudah ada ✅)
- Akun Railway.app (gratis, daftar pakai GitHub)
- Domain: sepriansatech.com (di Spaceship ✅)

---

## Langkah 1: Daftar Railway

1. Buka **https://railway.app**
2. Klik **"Login"** → pilih **"Login with GitHub"**
3. Authorize Railway untuk akses GitHub Anda

---

## Langkah 2: Buat Project Baru

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub Repo"**
3. Pilih repository **`Intra-Sepriansa/laporan24jam`**
4. Pilih branch **`blackboxai/feature-6-new-menus`** (atau `main` jika sudah di-merge)
5. Railway akan otomatis mendeteksi Dockerfile dan mulai build

---

## Langkah 3: Tambah MySQL Database (Opsional tapi Direkomendasikan)

> Jika ingin tetap pakai SQLite, skip langkah ini dan lanjut ke Langkah 4.

1. Di project Railway, klik **"+ New"** → **"Database"** → **"MySQL"**
2. Railway akan otomatis membuat database dan environment variables
3. Catat variabel yang dibuat:
   - `MYSQL_URL`
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

---

## Langkah 4: Set Environment Variables

Klik service app Anda → tab **"Variables"** → tambahkan:

### Wajib:
```
APP_NAME=Laporan24JAM
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_KEY_BARU
APP_URL=https://laporan.sepriansatech.com
APP_LOCALE=id

LOG_CHANNEL=stderr

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_STORE=file
```

### Jika pakai SQLite (default):
```
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite
```

### Jika pakai MySQL (dari Langkah 3):
```
DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
```

### Generate APP_KEY:
Jalankan di terminal lokal:
```bash
php artisan key:generate --show
```
Copy hasilnya dan paste sebagai nilai `APP_KEY`.

---

## Langkah 5: Setup Custom Domain

### Di Railway:
1. Klik service app → tab **"Settings"**
2. Scroll ke **"Networking"** → **"Custom Domain"**
3. Klik **"+ Custom Domain"**
4. Masukkan: `laporan.sepriansatech.com` (subdomain) atau `sepriansatech.com` (root domain)
5. Railway akan memberikan **CNAME record** yang perlu ditambahkan

### Di Spaceship (DNS Manager):
1. Login ke **Spaceship** → buka domain **sepriansatech.com**
2. Klik **"Nameserver & DNS"**
3. Tambahkan DNS record:

#### Untuk subdomain (laporan.sepriansatech.com):
| Type  | Name     | Value                          | TTL  |
|-------|----------|--------------------------------|------|
| CNAME | laporan  | [nilai dari Railway]           | 3600 |

#### Untuk root domain (sepriansatech.com):
| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| CNAME | @    | [nilai dari Railway]           | 3600 |

> ⚠️ Beberapa DNS provider tidak support CNAME di root domain. Gunakan subdomain jika ada masalah.

4. Tunggu propagasi DNS (biasanya 5-30 menit, maksimal 48 jam)
5. Railway akan otomatis generate **SSL certificate** (HTTPS gratis!)

---

## Langkah 6: Deploy!

Setelah semua dikonfigurasi:
1. Railway akan otomatis build dan deploy dari GitHub
2. Setiap kali Anda push ke branch yang dipilih, Railway auto-deploy
3. Monitor build di tab **"Deployments"**

### Verifikasi:
```bash
# Cek apakah site sudah live
curl -I https://laporan.sepriansatech.com
```

---

## Langkah 7: Seed Database (Pertama Kali)

Setelah deploy berhasil, jalankan seeder via Railway CLI atau shell:

1. Di Railway dashboard, klik service → **"Settings"** → **"Railway Shell"**
2. Jalankan:
```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## 🔧 Troubleshooting

### Build gagal?
- Cek tab "Deployments" → klik deployment yang gagal → lihat build logs
- Pastikan semua environment variables sudah diset

### Domain tidak bisa diakses?
- Cek DNS propagation: https://dnschecker.org
- Pastikan CNAME record sudah benar
- Tunggu hingga 48 jam untuk propagasi penuh

### Error 500?
- Set `APP_DEBUG=true` sementara untuk lihat error detail
- Cek logs di Railway dashboard
- Pastikan `APP_KEY` sudah diset

### SQLite permission error?
- Pastikan volume mount sudah dikonfigurasi di Railway
- Atau switch ke MySQL (lebih reliable untuk production)

---

## 📊 Monitoring

- **Railway Dashboard**: https://railway.app/dashboard
- **Logs**: Klik service → tab "Logs"
- **Metrics**: Klik service → tab "Metrics" (CPU, Memory, Network)
- **Usage**: Klik avatar → "Usage" (monitor free credit)

---

## 💰 Biaya

Railway Free Tier:
- **$5 credit gratis per bulan**
- Cukup untuk ~500 jam runtime (app kecil-menengah)
- Jika credit habis, service akan di-pause sampai bulan berikutnya
- Upgrade ke Hobby ($5/bulan) untuk unlimited runtime

---

## 🔄 Auto-Deploy dari GitHub

Railway otomatis deploy setiap kali ada push ke branch yang terhubung:

```bash
# Push perubahan baru
git add -A
git commit -m "update: deskripsi perubahan"
git push origin blackboxai/feature-6-new-menus
```

Railway akan otomatis build & deploy dalam 2-5 menit.
