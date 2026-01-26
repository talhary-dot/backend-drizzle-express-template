import { eq, count } from "drizzle-orm";
import { db } from "../../libs/db/index.ts";
import { users } from "../models/user.ts"; // Assuming users model is exported from here
// import { accounts } from "../models/auth.ts";

export const adminService = {
  getUsers: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // Simple pagination
    const data = await db.select().from(users).limit(limit).offset(offset);

    // Get total count
    const [totalResult] = await db.select({ count: count() }).from(users);
    const total = totalResult.count;

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  updateUserRole: async (userId: string, role: string) => {
    const [updatedUser] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser;
  },

  getStats: async () => {
    const [totalUsers] = await db.select({ count: count() }).from(users);
    // Add more stats here (e.g. users joined today)
    return {
      totalUsers: totalUsers.count,
    };
  },
};
