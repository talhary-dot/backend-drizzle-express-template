import { db } from "../../libs/db/index.ts";
import { users, accounts, sessions } from "../models/index.ts";
import { eq } from "drizzle-orm";

/**
 * Auth Service
 *
 * Provides reusable authentication and account management functions
 * used by both controllers and tests to ensure consistency.
 */

/**
 * Creates a user with Google OAuth account
 * @param email - User email
 * @param name - User name
 * @param googleId - Google account ID
 * @returns Created user
 */
export async function createGoogleUser(
  email: string,
  name: string,
  googleId: string,
) {
  const userId = `user-google-${Date.now()}`;

  const [user] = await db
    .insert(users)
    .values({
      id: userId,
      email,
      name,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  // Create Google account link
  await db.insert(accounts).values({
    id: `acc-google-${Date.now()}`,
    userId: user.id,
    accountId: googleId,
    providerId: "google",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return user;
}

/**
 * Links a credential (email/password) account to an existing user
 * @param userId - User ID to link account to
 * @param email - User email
 * @param hashedPassword - Hashed password (optional)
 * @returns Created account
 */
export async function linkCredentialAccount(
  userId: string,
  email: string,
  hashedPassword?: string,
) {
  const [account] = await db
    .insert(accounts)
    .values({
      id: `acc-credential-${Date.now()}`,
      userId,
      accountId: email,
      providerId: "credential",
      password: hashedPassword || "hashed_password_placeholder",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return account;
}

/**
 * Links a Google account to an existing user
 * @param userId - User ID to link account to
 * @param googleId - Google account ID
 * @returns Created account
 */
export async function linkGoogleAccount(userId: string, googleId: string) {
  const [account] = await db
    .insert(accounts)
    .values({
      id: `acc-google-linked-${Date.now()}`,
      userId,
      accountId: googleId,
      providerId: "google",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return account;
}

/**
 * Gets all accounts for a user
 * @param userId - User ID
 * @returns Array of accounts
 */
export async function getUserAccounts(userId: string) {
  return await db.select().from(accounts).where(eq(accounts.userId, userId));
}

/**
 * Checks if a user has a specific provider linked
 * @param userId - User ID
 * @param providerId - Provider ID (e.g., "google", "credential")
 * @returns True if provider is linked
 */
export async function hasProvider(userId: string, providerId: string) {
  const userAccounts = await getUserAccounts(userId);
  return userAccounts.some((acc) => acc.providerId === providerId);
}

/**
 * Gets user authentication methods
 * @param userId - User ID
 * @returns Object with authentication method flags
 */
export async function getUserAuthMethods(userId: string) {
  const userAccounts = await getUserAccounts(userId);

  return {
    hasPassword: userAccounts.some((acc) => acc.providerId === "credential"),
    hasGoogle: userAccounts.some((acc) => acc.providerId === "google"),
    hasGithub: userAccounts.some((acc) => acc.providerId === "github"),
    providers: userAccounts.map((acc) => acc.providerId),
  };
}

/**
 * Cleanup helper for tests - deletes user and all related data
 * @param userId - User ID to delete
 */
export async function deleteUserAndRelatedData(userId: string) {
  // Delete in correct order due to foreign key constraints
  await db.delete(sessions).where(eq(sessions.userId, userId));
  await db.delete(accounts).where(eq(accounts.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
}

/**
 * Cleanup helper for tests - deletes user by email and all related data
 * @param email - User email to delete
 */
export async function deleteUserByEmailAndRelatedData(email: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    await deleteUserAndRelatedData(existingUser[0].id);
  }
}
