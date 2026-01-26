import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../../libs/db/index.ts";
import { users, sessions, accounts, verifications } from "../models/index.ts";
import { config } from "./env.ts";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"], // or true for all
    },
  },
  baseURL: process.env.BETTER_AUTH_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    // github: {
    //     clientId: process.env.GITHUB_CLIENT_ID!,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
  trustedOrigins: [
    config.frontendUrl,
    "http://localhost:5173",
    "http://localhost:5173/",
  ],
});
