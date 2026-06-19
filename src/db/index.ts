import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connectionPool = mysql.createPool({
  uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/belajar_vibe",
});

export const db = drizzle(connectionPool, { schema, mode: "default" });
