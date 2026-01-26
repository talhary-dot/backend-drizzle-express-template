import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server.ts"; // Adjust path if needed
import { db } from "../../libs/db/index.ts";
import { users, accounts } from "../../src/models/index.ts";
import { eq } from "drizzle-orm";
import { betterAuth } from "better-auth";

// We need to simulate a Google-linked account.
// Since we can't easily mock the full Google OAuth flow with `better-auth` in this integration test without mocking the provider,
// we will manually insert a user and a google account into the DB, and then try to "set password" on it.

describe("Reproduction: Google Login & Password Update", () => {
  const testUser = {
    email: "google_repro@example.com",
    name: "Google Repro User",
    googleId: "google-12345",
    newPassword: "NewPassword123!",
  };

  let userId: string;

  beforeAll(async () => {
    // Cleanup
    await db.delete(users).where(eq(users.email, testUser.email));
  });

  afterAll(async () => {
    if (userId) {
      await db.delete(users).where(eq(users.id, userId));
    }
  });

  it("should setup a google user manually", async () => {
    // 1. Create User
    const [user] = await db
      .insert(users)
      .values({
        id: "user-repro-1",
        email: testUser.email,
        name: testUser.name,
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    userId = user.id;

    // 2. Create Google Account
    await db.insert(accounts).values({
      id: "acc-repro-1",
      userId: userId,
      accountId: testUser.googleId,
      providerId: "google",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const userCheck = await db.select().from(users).where(eq(users.id, userId));
    expect(userCheck.length).toBe(1);
    const accCheck = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));
    expect(accCheck.length).toBe(1);
    expect(accCheck[0].providerId).toBe("google");
    expect(accCheck[0].password).toBeNull();
  });

  it("should allow setting a password (simulating Forgot Password flow or similar)", async () => {
    // Scenario: User uses "Forgot Password" to set a password.
    // This usually involves calling `resetPassword` with a token.
    // For this test, let's see if we can use `better-auth`'s internal logic or just API if we can get a token.
    // Alternatively, if the user used `changePassword` (which requires current password), they couldn't have done it.
    // So they likely used `forgetPassword`.

    // 1. Request password reset
    const forgetRes = await request(app)
      .post("/api/auth/forget-password")
      .send({
        email: testUser.email,
        redirectTo: "/reset-password",
      });
    // expect(forgetRes.status).toBe(200); // better-auth might return success even if email not found? but here it exists.

    // Problem: We can't easily get the token unless we hook into the email sender or DB.
    // `better-auth` stores verification tokens in `verification` table usually?
    // Let's check `verifications` table (imported in models).

    // Wait, let's just cheat and UPDATE the account to have a password manually?
    // OR, use `better-auth` API if possible.

    // If we manually update the password in the "google" account row, we essentially reproduce "Account table has password".
    // But does `better-auth` create a NEW account for password?

    // Let's assume the user successfully set a password. What does the DB look like then?
    // Hypothesis A: The 'google' provider account row now has a password.
    // Hypothesis B: A new 'credential' provider account row is created.

    // Let's TRY to create a 'credential' account linked to the same user.
    await db.insert(accounts).values({
      id: "acc-repro-2",
      userId: userId,
      accountId: testUser.email, // credential provider usually uses email as accountId?
      providerId: "credential",
      password: "hashed_password_here", // In real life this is hashed
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Now we have TWO accounts.
    const accs = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId));
    expect(accs.length).toBe(2);

    // Now, if we try to "login with Google" (simulated), does it fail?
    // Since we can't real-login with Google, we have to look at `better-auth` logic.
    // If `better-auth` finds user by email, then checks accounts...

    // If I can't run this integration test meaningfully against the real "Sign In with Google" endpoint (because it redirects to Google),
    // I might have to rely on inspecting the DB state of the USER.
  });
});
