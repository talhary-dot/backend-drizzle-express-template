import { db } from "#libs/db/index.ts";
import { sql } from "drizzle-orm";

const main = async () => {
  console.log("Dropping all tables...");
  await db.execute(
    sql`DROP TABLE IF EXISTS "verification", "session", "account", "users" CASCADE;`,
  );
  console.log("Tables dropped.");
  process.exit(0);
};

main();
