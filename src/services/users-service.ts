import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

/**
 * Mendaftarkan pengguna baru ke dalam database.
 * Melakukan pengecekan duplikasi email, melakukan hashing pada password,
 * dan menyimpan data pengguna ke tabel users.
 * 
 * @param payload - Objek yang berisi name, email, dan password.
 * @returns Objek response dengan data "OK" jika sukses.
 */
export const registerUser = async (payload: any) => {
  const { name, email, password } = payload;

  // Pengecekan Email
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length > 0) {
    throw new Error("Email sudah terdaftar");
  }

  // Hashing Password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan ke Database
  await db.insert(users).values({
    name,
    email,
    password: hashedPassword,
  });

  return { data: "OK" };
};

/**
 * Melakukan proses otentikasi pengguna berdasarkan email dan password.
 * Memvalidasi kredensial, melakukan pengecekan hash password, dan jika valid,
 * akan membuat UUID token baru lalu menyimpannya ke tabel sessions.
 * 
 * @param payload - Objek yang berisi email dan password.
 * @returns Objek response berisi token sesi.
 */
export const loginUser = async (payload: any) => {
  const { email, password } = payload;

  // Cari User
  const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (existingUser.length === 0) {
    throw new Error("Email atau password salah");
  }

  const user = existingUser[0];

  // Validasi Password
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Email atau password salah");
  }

  // Generate Token
  const token = crypto.randomUUID();

  // Simpan Session ke Database
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return { data: token };
};

/**
 * Mengambil detail informasi pengguna yang sedang masuk (login) saat ini.
 * Memvalidasi token dengan tabel sessions, dan mengambil data profil
 * pengguna terkait dari tabel users tanpa menyertakan password.
 * 
 * @param token - Token sesi (Bearer) yang dikirimkan via Authorization header.
 * @returns Objek response berisi data id, name, email, dan createdAt pengguna.
 */
export const getCurrentUser = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const existingSession = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);

  if (existingSession.length === 0) {
    throw new Error("Unauthorized");
  }

  const session = existingSession[0];

  const existingUser = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, session.userId as number)).limit(1);

  if (existingUser.length === 0) {
    throw new Error("Unauthorized");
  }

  return { data: existingUser[0] };
};

/**
 * Mengakhiri sesi pengguna (logout) dengan cara menghapus data token
 * dari tabel sessions, sehingga token tersebut menjadi hangus dan tidak 
 * bisa lagi digunakan untuk mengakses layanan.
 * 
 * @param token - Token sesi yang akan dihapus.
 * @returns Objek response dengan data "OK" jika sukses.
 */
export const logoutUser = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));

  return { data: "OK" };
};
