# Task: Implementasi Fitur Registrasi User

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur registrasi user baru menggunakan framework Elysia JS. Kamu akan membuat tabel database untuk menyimpan data pengguna, membuat alur logika bisnis untuk proses registrasi, dan mengekspos endpoint API.

## Spesifikasi Database

Buat tabel `users` dengan struktur sebagai berikut:
- `id`: integer, auto increment (Primary Key)
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (Harus disimpan dalam bentuk hash menggunakan `bcrypt`)
- `created_at`: timestamp, default current_timestamp

## Spesifikasi API

Buat API endpoint untuk registrasi user baru.

- **Endpoint**: `POST /api/users`
- **Request Body** (JSON):
  ```json
  {
      "name" : "Eko",
      "email" : "eko@localhost",
      "password" : "rahasia"
  }
  ```
- **Response Body (Success)**:
  ```json
  {
      "data" : "OK"
  }
  ```
- **Response Body (Error - Jika email sudah terdaftar)**:
  ```json
  {
      "error" : "Email sudah terdaftar"
  }
  ```

## Struktur Folder dan File

Kode harus ditempatkan di dalam direktori `src` dengan struktur berikut:
- **`src/routes/`**: Tempat menyimpan file routing Elysia JS. Gunakan format penamaan file: `[nama]-route.ts` (contoh: `users-route.ts`).
- **`src/services/`**: Tempat menyimpan logika bisnis aplikasi. Gunakan format penamaan file: `[nama]-service.ts` (contoh: `users-service.ts`).

## Tahapan Implementasi

Untuk mengimplementasikan fitur ini, ikuti langkah-langkah berikut secara berurutan:

1. **Persiapan Database & Migrasi**
   - Buat file migrasi database atau tulis script SQL untuk membuat tabel `users` sesuai spesifikasi di atas.
   - Pastikan kolom `email` memiliki constraint `UNIQUE`.
   - Jalankan migrasi agar tabel `users` terbuat di database.

2. **Pembuatan Service (Logika Bisnis)**
   - Buat file baru: `src/services/users-service.ts`.
   - Buat fungsi/method (misalnya: `registerUser`) di dalam service tersebut yang menerima parameter data pengguna.
   - **Logika di dalam `registerUser`**:
     1. **Pengecekan Email**: Lakukan query ke database untuk mengecek apakah `email` yang dikirim dari request body sudah terdaftar.
     2. **Validasi Error**: Jika email sudah ada di database, lemparkan error (throw error) atau kembalikan response gagal.
     3. **Hashing Password**: Jika email belum terdaftar, hash `password` yang dikirim menggunakan library `bcrypt`.
     4. **Simpan ke Database**: Lakukan query `INSERT` ke tabel `users` dengan menyimpan `name`, `email`, dan `password` (yang sudah di-hash).
     5. Kembalikan indikator sukses jika proses simpan berhasil.

3. **Pembuatan Route (API Endpoint)**
   - Buat file baru: `src/routes/users-route.ts`.
   - Buat instance Elysia atau gunakan plugin untuk mendefinisikan route `POST /api/users`.
   - Hubungkan route ini dengan fungsi `registerUser` dari `users-service.ts`.
   - Tangani request dan response:
     - Ambil data (body) dari request.
     - Panggil service dengan data tersebut.
     - Jika service mengembalikan hasil sukses, kirimkan HTTP status `200` dengan body `{"data": "OK"}`.
     - Jika service mengembalikan error (email sudah terdaftar), tangkap (catch) error tersebut dan kirimkan HTTP status `400` (Bad Request) dengan body `{"error": "Email sudah terdaftar"}`.

4. **Registrasi Route ke Aplikasi Utama**
   - Buka file utama aplikasi Elysia kamu (biasanya `src/index.ts`).
   - Import route dari `users-route.ts`.
   - Daftarkan (`use`) route tersebut ke instance utama Elysia JS agar endpoint `POST /api/users` bisa diakses.

5. **Pengujian (Testing)**
   - Jalankan server aplikasi.
   - Gunakan tools seperti Postman, Insomnia, atau cURL untuk mengirim request `POST` ke `http://localhost:[PORT]/api/users`.
   - **Test skenario sukses**: Kirim data user baru dan pastikan response-nya adalah `{"data": "OK"}` dan periksa database untuk memastikan data masuk dengan password yang sudah ter-hash.
   - **Test skenario error**: Kirim lagi request dengan email yang sama persis dan pastikan response-nya adalah `{"error": "Email sudah terdaftar"}`.
