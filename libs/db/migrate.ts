import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "#libs/db/index.ts";

async function main() {
  await migrate(db, { migrationsFolder: "drizzle" });
  console.log("Migrations applied");
  process.exit(0);
}

main();
