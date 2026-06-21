# Task: Implementasi Unit Test API Menggunakan Bun Test

## Deskripsi
Implementasikan unit test secara menyeluruh untuk semua endpoint API yang telah tersedia saat ini. Pengujian harus menggunakan fitur bawaan `bun test` dan semua file test harus disimpan di dalam folder `tests/`.

## Persyaratan Teknis Utama
1. **Konsistensi Data:** **WAJIB** menghapus data di database pada setiap awal atau akhir skenario pengujian (misalnya menggunakan blok `beforeEach` atau `afterEach`). Hal ini penting agar satu test tidak mempengaruhi test lainnya.
2. **Framework:** Menggunakan `bun test`.
3. **Lokasi Penyimpanan:** Letakkan seluruh file test di dalam folder `tests/` (misalnya `tests/users.test.ts`).

## Skenario Pengujian yang Harus Diimplementasikan

Berikut adalah daftar API beserta skenario pengujian yang wajib di-cover:

### 1. API Register User (`POST /api/users`)
- [ ] **Skenario Sukses:** Sistem berhasil mendaftarkan pengguna baru saat diberikan data yang valid (respons mengembalikan data user yang didaftarkan tanpa menampilkan password).
- [ ] **Skenario Gagal (Email Duplikat):** Sistem menolak pendaftaran dan mengembalikan error ketika pengguna mencoba mendaftar menggunakan email yang sudah ada di database.
- [ ] **Skenario Gagal (Validasi Data):** Sistem menolak pendaftaran ketika dikirim payload yang tidak lengkap (misal: password kosong atau email format tidak valid).

### 2. API Login User (`POST /api/users/login`)
- [ ] **Skenario Sukses:** Sistem mengizinkan pengguna untuk masuk dan mengembalikan sebuah token autentikasi ketika email dan password cocok.
- [ ] **Skenario Gagal (Password Salah):** Sistem menolak akses dan mengembalikan error (401 Unauthorized) ketika password salah.
- [ ] **Skenario Gagal (Email Tidak Terdaftar):** Sistem menolak akses ketika email tidak ditemukan di database.
- [ ] **Skenario Gagal (Validasi Data):** Sistem menolak login jika tidak ada email atau password yang disertakan pada request.

### 3. API Get Current User (`GET /api/users/current`)
- [ ] **Skenario Sukses:** Sistem berhasil mengembalikan data pengguna login saat ini dengan header `Authorization: Bearer <token>` yang valid.
- [ ] **Skenario Gagal (Token Tidak Valid):** Sistem mengembalikan error 401 Unauthorized ketika dikirimkan token yang salah, sembarang, atau sudah dicabut.
- [ ] **Skenario Gagal (Header Kosong):** Sistem menolak akses jika request sama sekali tidak menyertakan header `Authorization`.

### 4. API Logout User (`DELETE /api/users/logout` - opsional jika telah di-merge)
- [ ] **Skenario Sukses:** Sistem berhasil menghapus sesi dari database saat diberikan token yang valid.
- [ ] **Skenario Gagal (Token Tidak Valid):** Sistem menolak proses logout ketika token salah atau kosong.

## Catatan untuk Implementator
Tugas Anda adalah menulis kode unit test-nya saja berdasarkan skenario di atas tanpa perlu diinstruksikan baris per baris. Tentukan sendiri cara spesifik memanggil endpoint, mereset database (menggunakan Drizzle), serta _assertion_ (`expect()`) yang paling relevan untuk mengevaluasi apakah API berjalan sesuai skenario.
