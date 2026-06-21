import { Elysia } from "elysia";
import { registerUser, loginUser } from "../services/users-service";

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
  });
