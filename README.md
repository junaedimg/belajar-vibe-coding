# Belajar Vibe Coding

Aplikasi ini adalah proyek pembelajaran (vibe coding) yang berupa RESTful API untuk manajemen pengguna, termasuk registrasi, otentikasi (login), dan manajemen sesi. Proyek ini dibangun di atas _runtime_ Bun dengan framework ElysiaJS dan menggunakan MySQL/MariaDB sebagai database utama melalui Drizzle ORM.

## 🚀 Technology Stack & Library
- **Runtime:** [Bun](https://bun.sh/)
- **Framework Web:** [ElysiaJS](https://elysiajs.com/)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit
- **Database:** MySQL / MariaDB (menggunakan library `mysql2`)
- **Security/Hashing:** `bcrypt` (untuk hashing password)
- **Testing:** `bun test` bawaan dari Bun

## 📂 Arsitektur & Struktur Folder
Proyek ini mengadopsi pola MVC / Service Layer yang dipisahkan menjadi `routes`, `services`, dan konfigurasi `db`.

```text
belajar-vibe-coding/
├── src/
│   ├── db/
│   │   ├── index.ts        # Setup pool koneksi database dan instance Drizzle
│   │   └── schema.ts       # Definisi skema tabel (drizzle-orm/mysql-core)
│   ├── routes/
│   │   └── users-route.ts  # Definisi endpoint (routing) terkait user menggunakan Elysia
│   ├── services/
│   │   └── users-service.ts# Logika bisnis inti (registrasi, validasi login, get user)
│   └── index.ts            # Entry point utama untuk menjalankan server aplikasi
├── tests/
│   └── users.test.ts       # Kumpulan unit test komprehensif untuk seluruh API
├── createDb.mjs            # Script utilitas inisialisasi database awal
├── drizzle.config.ts       # Konfigurasi migrasi Drizzle Kit
├── .env                    # Variabel konfigurasi environment
└── package.json            # Daftar dependencies dan scripts
```

**Konvensi Penamaan File & Arsitektur:**
- **Routes Layer (`*-route.ts`)**: Bertugas menangani validasi input HTTP, ekstrak request (body/headers), memanggil fungsi di service layer, dan memformat _response status code_.
- **Service Layer (`*-service.ts`)**: Berisi seluruh manipulasi logika bisnis murni, _query_ ke database via Drizzle, dan _password hashing_. Tidak terikat secara spesifik pada request HTTP.

## 🗄 Schema Database
Aplikasi ini memiliki 2 buah tabel yang saling berelasi:

**1. Tabel `users`**
- `id` (INT, Primary Key, Auto Increment)
- `name` (VARCHAR 255, Not Null)
- `email` (VARCHAR 255, Not Null, Unique)
- `password` (VARCHAR 255, Not Null) - _hanya menyimpan nilai hashed_
- `createdAt` (TIMESTAMP, Default Now)

**2. Tabel `sessions`**
- `id` (INT, Primary Key, Auto Increment)
- `token` (VARCHAR 255, Not Null) - _UUID acak_
- `userId` (INT, Foreign Key yang merujuk ke `users.id`)
- `createdAt` (TIMESTAMP, Default Now)

## 📡 API yang Tersedia

### 1. Register User
Mendaftarkan pengguna baru ke sistem.
- **Endpoint:** `POST /api/users`
- **Body JSON:** `{ "name": "...", "email": "...", "password": "..." }`
- **Response (Sukses):** `{ "data": "OK" }`

### 2. Login User
Melakukan proses otentikasi berdasarkan kecocokan kredensial. Jika sukses akan membuat session baru.
- **Endpoint:** `POST /api/users/login`
- **Body JSON:** `{ "email": "...", "password": "..." }`
- **Response (Sukses):** `{ "data": "<token-uuid-session>" }`

### 3. Get Current User
Mendapatkan informasi detail tentang pengguna yang sedang masuk ke sistem saat ini.
- **Endpoint:** `GET /api/users/current`
- **Headers:** `Authorization: Bearer <token-uuid-session>`
- **Response (Sukses):** 
  ```json
  { 
    "data": { 
      "id": 1, 
      "name": "...", 
      "email": "...", 
      "createdAt": "..." 
    } 
  }
  ```

*(Catatan: Endpoint **Logout User** telah direncanakan di rancangan fitur berikutnya).*

## 🛠 Cara Setup Project

1. **Clone repository ini**
2. **Install semua dependencies**
   ```bash
   bun install
   ```
3. **Konfigurasi Variabel Lingkungan (.env)**
   Buat atau modifikasi file `.env` di *root* proyek. Pastikan `DATABASE_URL` mengarah ke kredensial MySQL lokal Anda:
   ```env
   DATABASE_URL="mysql://root:<password>@localhost:3306/belajar_vibe_coding"
   ```
4. **Buat Database Awal**
   Jalankan script helper untuk mengeksekusi sintaks `CREATE DATABASE`:
   ```bash
   node createDb.mjs
   ```
5. **Migrasi Skema (Push Schema)**
   Setelah database terbentuk, sinkronisasikan skema TypeScript Anda ke tabel MySQL dengan perintah bawaan Drizzle:
   ```bash
   bun run db:push
   ```

## ▶️ Cara Menjalankan Aplikasi
Gunakan script npm `dev` yang sudah disiapkan untuk menjalankan Elysia dalam mode _watch_ (restart otomatis):
```bash
bun run dev
```
Server akan menginformasikan _console log_ bahwa ia aktif dan mendengarkan request pada port `3000` (atau port dinamis yang ter-bind).

## 🧪 Cara Menjalankan Test (Unit Testing)
Sistem memiliki test komprehensif di folder `tests/` yang menyentuh seluruh endpoint beserta *edge cases* (skenario sukses maupun gagal). Untuk menjalankan pengujian, cukup eksekusi _test runner_ bawaan Bun:
```bash
bun test
```
> **⚠️ PENTING:** Rangkaian tes dikonfigurasi untuk **menghapus semua baris data (`delete`)** dari tabel `sessions` dan `users` secara otomatis setiap kali satu unit *test case* berjalan. Hal ini sengaja dibuat demi *Isolation Test*. Berhati-hatilah saat menjalankannya di environment yang memiliki data penting!
