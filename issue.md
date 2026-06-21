# Task: Implementasi Fitur Login User

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur login user menggunakan framework Elysia JS. Kamu akan membuat tabel database baru untuk menyimpan sesi pengguna (session) dan mengekspos endpoint API untuk login.

## Spesifikasi Database

Buat tabel `sessions` dengan struktur sebagai berikut:
- `id`: integer, auto increment (Primary Key)
- `token`: varchar(255), not null (Berisi UUID untuk token user yang login)
- `user_id`: integer (Foreign Key yang merujuk ke tabel `users`)
- `created_at`: timestamp, default current_timestamp

## Spesifikasi API

Buat API endpoint untuk login user.

- **Endpoint**: `POST /api/users/login`
- **Request Body** (JSON):
  ```json
  {
      "email" : "eko@localhost",
      "password" : "rahasia"
  }
  ```
- **Response Body (Success)**:
  ```json
  {
      "data" : "token"
  }
  ```
- **Response Body (Error - Jika email atau password salah)**:
  ```json
  {
      "error" : "Email atau password salah"
  }
  ```

## Struktur Folder dan File

Kode harus ditempatkan di dalam direktori `src` dengan struktur berikut:
- **`src/routes/`**: ini berisi routing elysia js. Gunakan format penamaan file: `users-route.ts`.
- **`src/services/`**: ini berisi logic bisnis aplikasi. Gunakan format penamaan file: `users-service.ts`.
