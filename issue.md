# Task: Penambahan Fitur Dokumentasi API (Swagger UI)

## Deskripsi
Tugas ini bertujuan untuk menambahkan antarmuka dokumentasi Swagger UI ke dalam aplikasi. Dengan adanya dokumentasi Swagger, pengguna (seperti tim *frontend* atau pihak *mobile*) dapat dengan mudah menjelajahi spesifikasi API, melihat format data payload yang dibutuhkan, dan menguji langsung endpoint API melalui browser.

Proyek ini dibangun menggunakan **ElysiaJS**. Oleh karena itu, kita akan memanfaatkan *plugin* resmi bawaan Elysia untuk Swagger.

## Target Implementator
Tugas ini dirancang untuk diselesaikan oleh *junior programmer* atau *AI model*. Silakan baca tahapan detail berikut secara berurutan dan terapkan satu per satu.

## Tahapan Implementasi Detail

### Langkah 1: Instalasi Dependency Plugin
Kita membutuhkan _package_ resmi dari ekosistem Elysia untuk meng-generate halaman Swagger.
- Buka terminal/konsol Anda di direktori proyek (`belajar-vibe-coding`).
- Jalankan perintah instalasi berikut:
  ```bash
  bun add @elysiajs/swagger
  ```

### Langkah 2: Registrasi Plugin di Entry Point (`src/index.ts`)
Plugin yang baru diinstal harus disisipkan ke *instance* utama aplikasi.
1. Buka file `src/index.ts`.
2. Tambahkan baris impor berikut di bagian atas file:
   ```typescript
   import { swagger } from '@elysiajs/swagger';
   ```
3. Sisipkan pemanggilan `.use(swagger(...))` pada saat inisiasi `app`, **sebelum** registrasi *routes* lainnya (misalnya sebelum `.use(usersRoute)`). Anda juga dapat menambahkan deskripsi singkat API seperti ini:
   ```typescript
   const app = new Elysia()
     .use(swagger({
       documentation: {
         info: {
           title: 'Dokumentasi API Belajar Vibe Coding',
           version: '1.0.0',
           description: 'API untuk manajemen autentikasi pengguna'
         }
       }
     }))
     .use(usersRoute)
     // ... rute lainnya
   ```

### Langkah 3: Penambahan Skema Validasi di Routes (`src/routes/users-route.ts`)
Agar Swagger UI mengetahui data apa yang harus dikirim (*Request Body / Headers*) dan apa yang dikembalikan (*Response*), Anda harus mendeklarasikan **skema validasi** menggunakan fitur TypeBox yang terintegrasi (yaitu `t` dari `elysia`).
1. Buka file `src/routes/users-route.ts`.
2. Update impor Elysia menjadi: `import { Elysia, t } from "elysia";`
3. Tambahkan konfigurasi skema sebagai **argumen ketiga** pada masing-masing rute.
   - **Contoh untuk Endpoint Register (`POST /api/users`)**:
     ```typescript
     .post("/api/users", async ({ body, set }: any) => {
         // ... kode yang sudah ada ...
     }, {
         body: t.Object({
             name: t.String(),
             email: t.String({ format: 'email' }),
             password: t.String()
         }),
         detail: {
             summary: "Registrasi Pengguna Baru",
             tags: ["Auth"]
         }
     })
     ```
4. Lakukan modifikasi serupa untuk 3 _endpoint_ lainnya:
   - **Login (`POST /api/users/login`)**: Definisikan `body` berupa objek berisi `email` dan `password`.
   - **Get Current User (`GET /api/users/current`)**: Definisikan validasi `headers` untuk menangkap tipe string properti `authorization`.
   - **Logout User (`DELETE /api/users/logout`)**: Sama seperti endpoint di atas, butuh deskripsi parameter `headers.authorization`.

*(Catatan: Jangan mengubah isi logika kode yang ada di dalam `{ body, set } => { ... }`, Anda murni hanya menambahkan skema konfigurasi pada parameter setelahnya).*

### Langkah 4: Verifikasi & Testing
1. Jalankan server aplikasi dengan perintah:
   ```bash
   bun run dev
   ```
2. Buka browser dan arahkan ke alamat URL berikut: `http://localhost:3000/swagger`.
3. Pastikan antarmuka grafis Swagger UI berhasil dimuat dan seluruh ke-4 rute (Register, Login, Current, Logout) muncul dengan tag `Auth`.
4. Jalankan perintah `bun test` untuk memastikan perubahan konfigurasi rute yang Anda lakukan tidak merusak pengujian (*unit tests*) yang sudah ada.
