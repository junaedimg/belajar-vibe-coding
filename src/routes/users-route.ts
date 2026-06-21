import { Elysia } from "elysia";
import { registerUser } from "../services/users-service";

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
  });
