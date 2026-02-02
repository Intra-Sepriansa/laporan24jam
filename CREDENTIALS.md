# 🔐 CREDENTIALS LOGIN SISTEM LAPORAN SHIFT 3

## Format Login

**Username:** NIK (8 digit)  
**Password:** TB56#3_DIGIT_TERAKHIR_NIK

---

## 📋 Daftar Login Karyawan

**SEMUA KARYAWAN DI TOKO TB56 - RY CANGKUDU CISOKA (BALARAJA)**

| NIK      | Nama    | Toko | Password   |
|----------|---------|------|------------|
| 14085061 | SUNARDI | TB56 | TB56#061   |
| 17110563 | AAN     | TB56 | TB56#563   |
| 19085703 | TAQWA   | TB56 | TB56#703   |
| 19050173 | RIKA    | TB56 | TB56#173   |
| 22103779 | DEKON   | TB56 | TB56#779   |
| 23067788 | ISNAN   | TB56 | TB56#788   |
| 23082187 | NAUFAL  | TB56 | TB56#187   |
| 22051086 | INTRA   | TB56 | TB56#086   |
| 26015149 | AMAR    | TB56 | TB56#149   |
| 23052003 | ROS     | TB56 | TB56#003   |
| 25062196 | AULIA   | TB56 | TB56#196   |
| 23072045 | ULPAH   | TB56 | TB56#045   |

---

## 🏪 Daftar Semua Toko

**AREA: BALARAJA**

| Kode | Nama Toko                  | Area     |
|------|----------------------------|----------|
| TB62 | TAMAN KIRANA 2 (F)         | BALARAJA |
| T156 | TAMAN KIRANA               | BALARAJA |
| TA21 | CISOKA 2                   | BALARAJA |
| TB35 | RAYA MEGU                  | BALARAJA |
| TB50 | PASANGGRAHAN               | BALARAJA |
| TE13 | TAMAN ADIYASA 2            | BALARAJA |
| TE47 | CILELES CIKASUNGKA         | BALARAJA |
| TF81 | PESANGGRAHAN SOLEART       | BALARAJA |
| TE22 | KP JEUNJING                | BALARAJA |
| TB08 | SYECH MUBAROK 3            | BALARAJA |
| TG41 | TAMAN ADIYASA              | BALARAJA |
| TD10 | MUNJUL 2 (F)               | BALARAJA |
| TB49 | MUNJUL                     | BALARAJA |
| TH69 | RAYA SOLEART               | BALARAJA |
| TB56 | RY CANGKUDU CISOKA         | BALARAJA |
| TB96 | PINANG TIGARAKSA           | BALARAJA |
| TE52 | SODONG 3RAKSA              | BALARAJA |

---

## 📝 Contoh Penggunaan

### Login dengan NIK: 14085061 (SUNARDI)

1. **Input NIK:** `14085061`
2. **Sistem auto-fill nama:** `SUNARDI`
3. **Input Password:** `TB56#061`
4. **Login berhasil!**

### Cara Menghitung Password

Untuk NIK: **14085061** di Toko **TB56**

1. Ambil kode toko: `TB56`
2. Ambil 3 digit terakhir NIK: `061`
3. Gabungkan dengan format: `TB56#3_DIGIT`
4. Hasil: `TB56#061`

---

## 🔧 Reset Password

Jika perlu reset password, gunakan command:

```bash
php artisan tinker
```

Kemudian jalankan:

```php
$user = App\Models\User::where('nik', '14085061')->first();
$password = $user->employee->generatePassword();
$user->password = Hash::make($password);
$user->save();
echo "Password untuk {$user->name}: {$password}";
```

---

## ⚠️ Catatan Keamanan

1. **Jangan share credentials** ini ke publik
2. **Ganti password default** setelah login pertama kali
3. **Gunakan HTTPS** untuk akses sistem
4. **Logout** setelah selesai menggunakan sistem
5. **Jangan simpan password** di browser

---

## 📞 Support

Jika ada masalah login, hubungi administrator sistem.
