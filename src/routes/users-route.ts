import { Elysia } from "elysia";
import { registerUser, loginUser, getCurrentUser } from "../services/users-service";

export const usersRoute = new Elysia()
  .post("/api/users", async ({ body, set }: any) => {
    try {
      const result = await registerUser(body);
      return result;
    } catch (error: any) {
      set.status = 400;
      return {
        error: error.message || "Email sudah terdaftar",
      };
    }
  })
  .post("/api/users/login", async ({ body, set }: any) => {
    try {
      const result = await loginUser(body);
      return result;
    } catch (error: any) {
      set.status = 401;
      return {
        error: error.message || "Email atau password salah",
      };
    }
  })
  .get("/api/users/current", async ({ headers, set }: any) => {
    try {
      const authHeader = headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Unauthorized");
      }
      const token = authHeader.substring(7);
      const result = await getCurrentUser(token);
      return result;
    } catch (error: any) {
      set.status = 401;
      return {
        error: "Unauthorized",
      };
    }
  });
