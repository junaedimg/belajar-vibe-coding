import { describe, expect, it, beforeEach, afterAll } from "bun:test";
import { Elysia } from "elysia";
import { usersRoute } from "../src/routes/users-route";
import { db } from "../src/db";
import { users, sessions } from "../src/db/schema";

const app = new Elysia().use(usersRoute);

describe("User API Unit Tests", () => {
  beforeEach(async () => {
    // Clear sessions first because it references users
    await db.delete(sessions);
    await db.delete(users);
  });

  afterAll(async () => {
    // Final cleanup
    await db.delete(sessions);
    await db.delete(users);
  });

  describe("POST /api/users (Register)", () => {
    it("should successfully register a new user with valid data", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body).toEqual({ data: "OK" });
    });

    it("should fail to register if email is already taken", async () => {
      // Register first user
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      // Try registering with same email
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Another User",
            email: "test@example.com",
            password: "password456",
          }),
        })
      );

      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.error).toBe("Email sudah terdaftar");
    });

    it("should fail to register if required fields are missing", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            // email and password missing
          }),
        })
      );

      expect(response.status).toBe(422);
    });
  });

  describe("POST /api/users/login (Login)", () => {
    beforeEach(async () => {
      // Register a user for login tests
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
    });

    it("should successfully login with correct credentials", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toBeDefined();
      expect(typeof body.data).toBe("string"); // should return token uuid
    });

    it("should fail login with wrong password", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "wrongpassword",
          }),
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Email atau password salah");
    });

    it("should fail login with unregistered email", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "unregistered@example.com",
            password: "password123",
          }),
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Email atau password salah");
    });
  });

  describe("GET /api/users/current (Get Current User)", () => {
    let token: string;

    beforeEach(async () => {
      // Register and login to get valid token
      await app.handle(
        new Request("http://localhost/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
          }),
        })
      );

      const loginRes = await app.handle(
        new Request("http://localhost/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        })
      );
      const loginBody = await loginRes.json();
      token = loginBody.data;
    });

    it("should successfully retrieve user info with a valid token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );

      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.data).toBeDefined();
      expect(body.data.name).toBe("Test User");
      expect(body.data.email).toBe("test@example.com");
      expect(body.data.password).toBeUndefined();
    });

    it("should fail with 401 Unauthorized for an invalid token", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
          headers: {
            Authorization: `Bearer invalid-token-xyz`,
          },
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });

    it("should fail with 401 Unauthorized if Authorization header is missing", async () => {
      const response = await app.handle(
        new Request("http://localhost/api/users/current", {
          method: "GET",
        })
      );

      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.error).toBe("Unauthorized");
    });
  });
});
