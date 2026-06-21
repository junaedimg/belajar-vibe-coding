# Task: Implementasi Fitur Logout User

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur logout user menggunakan framework Elysia JS. Kamu akan membuat alur logika bisnis untuk memvalidasi token otentikasi dari header request, lalu menghapus data sesi (session) yang bersangkutan dari database agar token tersebut kedaluwarsa dan tidak bisa digunakan lagi.

## Spesifikasi API

Buat API endpoint untuk proses logout user.

- **Endpoint**: `DELETE /api/users/logout`
- **Headers**: 
  - `Authorization`: `Bearer <token>` (token merujuk pada token yang tersimpan di tabel `sessions` milik user)
- **Response Body (Success)**:
  ```json
  {
      "data" : "OK"
  }
  ```
  *(Penting: Jika sukses logout, maka data session dengan token tersebut harus dihapus dari tabel `sessions`)*
- **Response Body (Error - Jika token tidak valid / tidak ada)**:
  ```json
  {
      "error" : "Unauthorized"
  }
  ```

## Struktur Folder dan File

Kode harus ditempatkan atau dimodifikasi di dalam direktori `src` dengan struktur berikut:
- **`src/routes/`**: ini berisi routing elysia js. Kamu akan memperbarui file `users-route.ts`.
- **`src/services/`**: ini berisi logic bisnis aplikasi. Kamu akan memperbarui file `users-service.ts`.

## Tahapan Implementasi

Untuk mengimplementasikan fitur ini, ikuti langkah-langkah berikut secara berurutan:

1. **Update Service (Logika Bisnis Logout User)**
   - Buka file `src/services/users-service.ts`.
   - Buat fungsi/method baru (misalnya: `logoutUser`) yang menerima parameter `token` (string).
   - **Logika di dalam `logoutUser`**:
     1. Lakukan query `SELECT` ke database untuk memastikan sesi dengan `token` tersebut benar-benar ada di tabel `sessions`.
     2. Jika sesi tidak ditemukan, lemparkan error "Unauthorized".
     3. Jika sesi ditemukan, jalankan query `DELETE` ke tabel `sessions` di mana field `token` sama dengan token yang diberikan.
     4. Kembalikan objek `{ data: "OK" }` sebagai tanda logout berhasil.

2. **Update Route (API Endpoint Logout)**
   - Buka file `src/routes/users-route.ts`.
   - Tambahkan route baru untuk HTTP `DELETE /api/users/logout` ke dalam instance Elysia.
   - Tangani request dan response:
     - Ambil nilai dari header `Authorization`.
     - Lakukan validasi. Jika header tidak ada, atau formatnya bukan "Bearer <token>", langsung kembalikan status `401 Unauthorized` dengan body `{"error": "Unauthorized"}`.
     - Ekstrak nilai token-nya (buang kata "Bearer ").
     - Panggil service `logoutUser` dengan nilai token tersebut.
     - Jika service mengembalikan status berhasil, kirim response sukses `200` dengan body `{"data": "OK"}`.
     - Jika pemanggilan service menghasilkan error (token sudah tidak valid/dihapus), tangkap error tersebut, set status ke `401`, dan kirim response `{"error": "Unauthorized"}`.

3. **Pengujian (Testing)**
   - Jalankan server lokal aplikasi (`bun run dev`).
   - Gunakan tools pengujian seperti Postman, Insomnia, atau cURL.
   - Pastikan kamu sudah melakukan login (`POST /api/users/login`) sebelumnya untuk mendapatkan token UUID yang valid.
   - **Test skenario sukses**: 
     - Lakukan request `DELETE` ke `http://localhost:[PORT]/api/users/logout` dengan menyertakan header `Authorization: Bearer <token_valid>`. 
     - Pastikan response membalas `{"data": "OK"}`.
     - Pastikan jika kamu memanggil endpoint *Get Current User* lagi dengan token yang sama, response yang didapat adalah `Unauthorized` (karena record di tabel `sessions` telah dihapus).
   - **Test skenario error**: Kirim request `DELETE` tanpa header `Authorization`, atau gunakan token yang salah/sudah dihapus. Pastikan response-nya adalah `{"error": "Unauthorized"}` dengan status HTTP 401.

Selamat bekerja!
