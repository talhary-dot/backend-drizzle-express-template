export const config = {
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
  },
  env: process.env.NODE_ENV || "development",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};

if (!config.database.url) {
  throw new Error("DATABASE_URL is missing from environment variables");
}
