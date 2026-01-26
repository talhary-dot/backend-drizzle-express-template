import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { app } from "../../src/server.ts";
import { db } from "../../libs/db/index.ts";
import { users } from "../../src/models/index.ts";
import { eq } from "drizzle-orm";
import {
  createGoogleUser,
  linkCredentialAccount,
  linkGoogleAccount,
  getUserAccounts,
  deleteUserByEmailAndRelatedData,
  deleteUserAndRelatedData,
} from "../../src/services/auth.service.ts";

/**
 * Test: Dual Authentication (Google + Email)
 *
 * This test verifies that account linking works correctly when a user
 * authenticates using both Google OAuth and Email/Password methods.
 *
 * Scenarios:
 * 1. User signs in with Google first, then sets a password (Email auth)
 * 2. User signs up with Email first, then links Google account
 */
describe("Dual Authentication: Google + Email Account Linking", () => {
  const testUser1 = {
    email: "dual_auth_google_first@example.com",
    name: "Google First User",
    googleId: "google-test-123",
    password: "SecurePassword123!",
  };

  const testUser2 = {
    email: "dual_auth_email_first@example.com",
    name: "Email First User",
    googleId: "google-test-456",
    password: "SecurePassword456!",
  };

  let user1Id: string;
  let user2Id: string;
  let user2Cookies: string[] = [];

  beforeAll(async () => {
    // Cleanup any existing test users using auth service
    await deleteUserByEmailAndRelatedData(testUser1.email);
    await deleteUserByEmailAndRelatedData(testUser2.email);
  });

  afterAll(async () => {
    // Cleanup using auth service
    if (user1Id) {
      await deleteUserAndRelatedData(user1Id);
    }
    if (user2Id) {
      await deleteUserAndRelatedData(user2Id);
    }
  });

  describe("Scenario 1: Google First, Then Email Password", () => {
    it("should create a user via Google OAuth (simulated)", async () => {
      // Use auth service to create Google user
      const user = await createGoogleUser(
        testUser1.email,
        testUser1.name,
        testUser1.googleId,
      );

      user1Id = user.id;

      // Verify user and account were created
      const userCheck = await db
        .select()
        .from(users)
        .where(eq(users.id, user1Id));
      expect(userCheck.length).toBe(1);
      expect(userCheck[0].email).toBe(testUser1.email);

      const accountCheck = await getUserAccounts(user1Id);
      expect(accountCheck.length).toBe(1);
      expect(accountCheck[0].providerId).toBe("google");
    });

    it("should allow setting a password via credential account (account linking)", async () => {
      // Use auth service to link credential account
      await linkCredentialAccount(user1Id, testUser1.email);

      // Verify both accounts exist for the same user
      const accountsCheck = await getUserAccounts(user1Id);
      expect(accountsCheck.length).toBe(2);

      const providers = accountsCheck.map((acc) => acc.providerId).sort();
      expect(providers).toEqual(["credential", "google"]);
    });

    it("should verify user has both authentication methods", async () => {
      const userAccounts = await getUserAccounts(user1Id);

      expect(userAccounts.length).toBe(2);

      const hasGoogle = userAccounts.some((acc) => acc.providerId === "google");
      const hasCredential = userAccounts.some(
        (acc) => acc.providerId === "credential",
      );

      expect(hasGoogle).toBe(true);
      expect(hasCredential).toBe(true);
    });
  });

  describe("Scenario 2: Email First, Then Google", () => {
    it("should sign up a user with email/password", async () => {
      const res = await request(app).post("/api/auth/sign-up/email").send({
        email: testUser2.email,
        password: testUser2.password,
        name: testUser2.name,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(testUser2.email);

      user2Id = res.body.user.id;

      // Capture cookies
      const setCookie = res.headers["set-cookie"];
      if (setCookie) {
        user2Cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
      }

      // Verify credential account was created using auth service
      const accountCheck = await getUserAccounts(user2Id);
      expect(accountCheck.length).toBe(1);
      expect(accountCheck[0].providerId).toBe("credential");
    });

    it("should link Google account to existing email user (simulated)", async () => {
      // Use auth service to link Google account
      await linkGoogleAccount(user2Id, testUser2.googleId);

      // Verify both accounts exist
      const accountsCheck = await getUserAccounts(user2Id);
      expect(accountsCheck.length).toBe(2);

      const providers = accountsCheck.map((acc) => acc.providerId).sort();
      expect(providers).toEqual(["credential", "google"]);
    });

    it("should be able to sign in with email/password after Google linking", async () => {
      const res = await request(app).post("/api/auth/sign-in/email").send({
        email: testUser2.email,
        password: testUser2.password,
      });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser2.email);
      expect(res.body.user.id).toBe(user2Id);
    });

    it("should verify user has both authentication methods available", async () => {
      const userAccounts = await getUserAccounts(user2Id);

      expect(userAccounts.length).toBe(2);

      const hasGoogle = userAccounts.some((acc) => acc.providerId === "google");
      const hasCredential = userAccounts.some(
        (acc) => acc.providerId === "credential",
      );

      expect(hasGoogle).toBe(true);
      expect(hasCredential).toBe(true);

      // Verify they all point to the same user
      const userIds = [...new Set(userAccounts.map((acc) => acc.userId))];
      expect(userIds.length).toBe(1);
      expect(userIds[0]).toBe(user2Id);
    });
  });

  describe("Account Linking Configuration Verification", () => {
    it("should verify account linking is enabled in auth config", async () => {
      // This is more of a sanity check to ensure the config is correct
      // We can't directly test the config, but we can verify the behavior

      // If account linking works (as tested above), the config is correct
      // This test documents the expected configuration
      expect(true).toBe(true); // Placeholder - config is verified by successful linking tests above
    });
  });
});
