import { pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { procedureNotes } from "./procedure_notes";

export const noteHistory = pgTable("note_history", {
    id: uuid("id").primaryKey().defaultRandom(),
    noteId: uuid("note_id").references(() => procedureNotes.id),
    previousContent: text("previous_content").notNull(),
    changedByUserId: uuid("changed_by_user_id").notNull(),
    changedAt: timestamp("changed_at").defaultNow(),
    actionType: varchar("action_type", { length: 20 }), // 'EDIT', 'DELETE', 'RESTORE'
});
