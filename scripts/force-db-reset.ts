import { db } from "#libs/db/index.ts";

import { sql } from "drizzle-orm";

const main = async () => {
  console.log("Terminating other connections...");
  try {
    // Attempt to terminate other connections to release locks
    await db.execute(sql`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = current_database()
      AND pid <> pg_backend_pid();
    `);
  } catch (e) {
    console.log(
      "Could not terminate connections (might verify permissions later), proceeding...",
    );
  }

  console.log("Dropping all tables...");
  await db.execute(
    sql`DROP TABLE IF EXISTS "verification", "session", "account", "users" CASCADE;`,
  );
  console.log("Tables dropped.");
  process.exit(0);
};

main();
