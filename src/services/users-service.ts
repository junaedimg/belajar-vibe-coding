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

export const logoutUser = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  await db.delete(sessions).where(eq(sessions.token, token));

  return { data: "OK" };
};
