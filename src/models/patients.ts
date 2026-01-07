import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";

export const patients = pgTable("patients", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
});
