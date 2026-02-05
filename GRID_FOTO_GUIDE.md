# 📸 GRID FOTO - PANDUAN PENGGUNAAN

## Apa itu Grid Foto?

Grid Foto adalah fitur untuk mendokumentasikan display toko dalam satu tampilan rapi yang terorganisir. Anda bisa mengatur foto-foto display toko dalam layout grid (2x2, 2x3, atau 3x3).

---

## ✅ Fitur Grid Foto

### 1. Multiple Layout Options
- **2 x 2**: 4 slot foto (2 baris x 2 kolom)
- **2 x 3**: 6 slot foto (3 baris x 2 kolom)  
- **3 x 3**: 9 slot foto (3 baris x 3 kolom)

### 2. Upload Foto
- Upload foto satu per satu per slot
- Upload banyak foto sekaligus (bulk upload)
- Auto-compress gambar untuk menghemat storage
- Support capture langsung dari kamera (mobile)

### 3. Informasi Per Foto
- **Judul**: Deskripsi foto (contoh: "Display Promo Ramadan")
- **Kode**: Kode toko (auto-fill dari profil user)
- **Posisi**: Slot 1-9 (tergantung layout)

### 4. Manajemen Foto
- Edit judul dan kode foto
- Ganti foto yang sudah ada
- Hapus foto
- Simpan per slot atau batch

---

## 🚀 Cara Menggunakan

### Langkah 1: Akses Grid Foto
1. Login ke aplikasi
2. Klik menu **"Grid Foto"** di sidebar
3. Halaman grid akan terbuka

### Langkah 2: Pilih Layout
1. Pilih layout yang diinginkan dari dropdown:
   - 2 x 2 (4 foto)
   - 2 x 3 (6 foto)
   - 3 x 3 (9 foto)
2. Klik tombol **"Simpan Layout"**

### Langkah 3: Upload Foto

#### Cara A: Upload Satu Per Satu
1. Pilih slot yang ingin diisi
2. Isi **Judul** foto (opsional)
3. Isi **Kode** toko (auto-fill)
4. Klik **"Pilih Foto"** di slot tersebut
5. Pilih foto dari galeri atau ambil foto baru
6. Klik tombol **"Simpan"** di slot tersebut

#### Cara B: Upload Banyak Sekaligus (Bulk)
1. Klik **"Pilih Banyak Foto"** di bagian atas
2. Pilih multiple foto sekaligus
3. Foto akan otomatis mengisi slot kosong
4. Edit judul/kode jika perlu
5. Klik **"Simpan"** di setiap slot yang terisi

### Langkah 4: Edit Foto
1. Klik slot foto yang ingin diedit
2. Ubah judul atau kode
3. Atau ganti foto dengan klik **"Pilih Foto"**
4. Klik **"Simpan"**

### Langkah 5: Hapus Foto
1. Klik tombol **"Hapus"** di slot foto
2. Konfirmasi penghapusan
3. Foto akan dihapus dari slot

---

## 📱 Tips Penggunaan

### Untuk Mobile
- Gunakan fitur **capture="environment"** untuk langsung ambil foto
- Foto akan otomatis di-compress untuk menghemat data
- Layout responsive, mudah digunakan di HP

### Untuk Desktop
- Upload foto dari komputer
- Drag and drop (coming soon)
- Preview lebih besar

### Best Practices
1. **Gunakan foto berkualitas baik** tapi tidak terlalu besar (max 5MB)
2. **Beri judul yang jelas** untuk setiap foto
3. **Gunakan layout yang sesuai** dengan jumlah display
4. **Update foto secara berkala** untuk dokumentasi terbaru

---

## 🎨 Contoh Penggunaan

### Scenario 1: Dokumentasi Display Promo
```
Layout: 2 x 3 (6 foto)

Slot 1: "Display Promo Ramadan" - TB56
Slot 2: "Display Minuman Dingin" - TB56
Slot 3: "Display Snack" - TB56
Slot 4: "Display Rokok" - TB56
Slot 5: "Display Pulsa" - TB56
Slot 6: "Display Kasir" - TB56
```

### Scenario 2: Dokumentasi Toko Lengkap
```
Layout: 3 x 3 (9 foto)

Slot 1: "Tampak Depan Toko" - TB56
Slot 2: "Area Kasir" - TB56
Slot 3: "Rak Kanan" - TB56
Slot 4: "Rak Kiri" - TB56
Slot 5: "Display Promo" - TB56
Slot 6: "Area Kulkas" - TB56
Slot 7: "Gudang" - TB56
Slot 8: "Toilet" - TB56
Slot 9: "Parkir" - TB56
```

---

## 🔧 Troubleshooting

### Foto tidak bisa diupload
- **Cek ukuran file**: Max 5MB per foto
- **Cek format**: Hanya support image (jpg, png, etc)
- **Cek koneksi internet**: Pastikan stabil
- **Clear cache**: Refresh halaman

### Foto tidak muncul
- **Refresh halaman**: Tekan F5 atau reload
- **Cek storage**: Pastikan folder storage/app/public ada
- **Cek symlink**: Jalankan `php artisan storage:link`

### Layout tidak tersimpan
- **Klik tombol "Simpan Layout"**: Jangan lupa klik tombol
- **Cek koneksi**: Pastikan tidak ada error network
- **Cek log**: Lihat storage/logs/laravel.log

---

## 🎯 Fitur Teknis

### Auto-Compress Image
Aplikasi otomatis compress gambar dengan algoritma:
1. Max dimension: 1280px
2. Quality: 75%
3. Format: JPEG
4. Target size: ~1.2MB

### Storage
- Foto disimpan di: `storage/app/public/grid-photos/`
- Database: `grid_photos` dan `grid_settings`
- Symlink: `public/storage` → `storage/app/public`

### Authorization
- User hanya bisa lihat/edit foto toko sendiri
- Store-based access control
- Middleware: auth, verified

---

## 📊 Database Schema

### Table: grid_photos
```sql
- id (primary key)
- store_id (foreign key → stores)
- user_id (foreign key → users)
- title (varchar, nullable)
- code (varchar, nullable)
- span (integer, default 1)
- position (integer, 1-12)
- image_path (varchar)
- created_at, updated_at
```

### Table: grid_settings
```sql
- id (primary key)
- store_id (foreign key → stores, unique)
- layout (varchar, default '2x3')
- created_at, updated_at
```

---

## 🚀 API Endpoints

### GET /grid
- Menampilkan halaman grid foto
- Return: photos[], layout

### POST /grid
- Upload foto baru
- Params: title, code, span, image

### POST /grid/batch
- Batch upload/update
- Params: layout, items[]

### PUT /grid/{id}
- Update foto existing
- Params: title, code, span, image

### DELETE /grid/{id}
- Hapus foto
- Return: success message

---

## ✅ Status

- ✅ **Routes**: Fixed dan working
- ✅ **Controller**: Fully functional
- ✅ **Models**: GridPhoto & GridSetting
- ✅ **Migrations**: Ran successfully
- ✅ **Frontend**: React component ready
- ✅ **Authorization**: Store-based access
- ✅ **Image Compression**: Auto-compress
- ✅ **Responsive**: Mobile & desktop

---

## 🎉 Grid Foto Siap Digunakan!

Fitur Grid Foto sudah lengkap dan siap digunakan untuk mendokumentasikan display toko Anda dengan rapi dan terorganisir! 📸
