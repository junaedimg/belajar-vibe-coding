import { Elysia } from "elysia";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../services/users-service";

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
  .derive(({ headers }: any) => {
    const authHeader = headers["authorization"];
    const tokenUser = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
    return { tokenUser };
  })
  .get("/api/users/current", async ({ tokenUser, set }: any) => {
    try {
      if (!tokenUser) {
        throw new Error("Unauthorized");
      }
      const result = await getCurrentUser(tokenUser);
      return result;
    } catch (error: any) {
      set.status = 401;
      return {
        error: "Unauthorized",
      };
    }
  })
  .delete("/api/users/logout", async ({ tokenUser, set }: any) => {
    try {
      if (!tokenUser) {
        throw new Error("Unauthorized");
      }
      const result = await logoutUser(tokenUser);
      return result;
    } catch (error: any) {
      set.status = 401;
      return {
        error: "Unauthorized",
      };
    }
  });
