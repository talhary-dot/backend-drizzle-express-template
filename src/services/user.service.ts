import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../../libs/db/index.ts";
import { users, type NewUser } from "../models/user.ts";
import { accounts } from "../models/auth.ts";

export const userService = {
  getAll: async () => {
    return await db.select().from(users);
  },

  getById: async (id: string) => {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] || null;
  },

  create: async (data: NewUser) => {
    const userData = { ...data, id: data.id || randomUUID() };
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  },

  update: async (id: string, data: Partial<NewUser>) => {
    const result = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0] || null;
  },

  delete: async (id: string) => {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0] || null;
  },

  getAuthMethods: async (userId: string) => {
    const userAccounts = await db
      .select({
        providerId: accounts.providerId,
        createdAt: accounts.createdAt,
      })
      .from(accounts)
      .where(eq(accounts.userId, userId));
    return userAccounts;
  },
};
