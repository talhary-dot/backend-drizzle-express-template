import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server.ts";
import { db } from "../../libs/db/index.ts";
import { users, accounts, sessions } from "../../src/models/index.ts";
import { eq } from "drizzle-orm";

describe("Auth & Profile Integration Tests", () => {
  const testUser = {
    email: "authtest@example.com",
    password: "Password123!",
    name: "Auth Test User",
  };

  let cookies: string[] = [];
  let userId: string;

  beforeAll(async () => {
    // Cleanup any existing test user and their sessions/accounts
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, testUser.email));
    if (existingUser.length > 0) {
      await db.delete(sessions).where(eq(sessions.userId, existingUser[0].id));
      await db.delete(accounts).where(eq(accounts.userId, existingUser[0].id));
      await db.delete(users).where(eq(users.id, existingUser[0].id));
    }
  });

  afterAll(async () => {
    if (userId) {
      await db.delete(sessions).where(eq(sessions.userId, userId));
      await db.delete(accounts).where(eq(accounts.userId, userId));
      await db.delete(users).where(eq(users.id, userId));
    } else {
      // Fallback cleanup
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, testUser.email));
      if (existingUser.length > 0) {
        await db
          .delete(sessions)
          .where(eq(sessions.userId, existingUser[0].id));
        await db
          .delete(accounts)
          .where(eq(accounts.userId, existingUser[0].id));
        await db.delete(users).where(eq(users.id, existingUser[0].id));
      }
    }
  });

  describe("Authentication Flow", () => {
    it("should sign up a new user", async () => {
      const res = await request(app).post("/api/auth/sign-up/email").send({
        email: testUser.email,
        password: testUser.password,
        name: testUser.name,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body.user.name).toBe(testUser.name);

      userId = res.body.user.id;

      // Capture cookies for session
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }
    });

    it("should sign in with the user", async () => {
      // If prompt signup logs in, cookies are already there.
      // But let's test explicit sign in.

      const res = await request(app).post("/api/auth/sign-in/email").send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email);

      // Update cookies
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }
    });
  });

  describe("Profile Management", () => {
    it("should update user profile", async () => {
      const newName = "Updated Auth User";

      // better-auth uses /api/auth/update-user endpoint
      const res = await request(app)
        .post("/api/auth/update-user")
        .set("Cookie", cookies)
        .send({
          name: newName,
        });

      expect(res.status).toBe(200);
      // better-auth update-user endpoint returns { status: true } on success
      expect(res.body.status).toBe(true);

      // Verify the update was successful by checking the database
      const user = await db.select().from(users).where(eq(users.id, userId));
      expect(user[0].name).toBe(newName);
    });

    it("should change password", async () => {
      const newPassword = "NewPassword123!";

      const res = await request(app)
        .post("/api/auth/change-password")
        .set("Cookie", cookies)
        .send({
          currentPassword: testUser.password,
          newPassword: newPassword,
        });

      expect(res.status).toBe(200);
      // better-auth returns success without a specific status field
      expect(res.body).toBeDefined();

      // Update testUser password for subsequent tests
      testUser.password = newPassword;

      // Try login with NEW password (should succeed)
      const successRes = await request(app)
        .post("/api/auth/sign-in/email")
        .send({
          email: testUser.email,
          password: newPassword,
        });
      expect(successRes.status).toBe(200);
      expect(successRes.body.user.email).toBe(testUser.email);
    });
  });
});
