import { Elysia } from "elysia";
import { db } from "./db";
import { users } from "./db/schema";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(usersRoute)
  .get("/", () => ({
    status: "ok",
    message: "Server is running successfully!",
  }))
  .get("/users", async () => {
    try {
      const allUsers = await db.select().from(users);
      return {
        status: "success",
        data: allUsers,
      };
    } catch (error: any) {
      return {
        status: "error",
        message: "Failed to query database",
        error: error.message,
      };
    }
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
