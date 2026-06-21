import { db } from "../db";
import { users, sessions } from "../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import crypto from "crypto";

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
