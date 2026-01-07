import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const dotPhrases = pgTable("dot_phrases", {
    id: uuid("id").primaryKey().defaultRandom(),
    triggerKeyword: varchar("trigger_keyword", { length: 50 }).notNull().unique(),
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
});
