import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { patients } from "./patients";

export const procedureNotes = pgTable("procedure_notes", {
    id: uuid("id").primaryKey().defaultRandom(),
    procedureId: uuid("procedure_id").notNull(), // External ID or future table
    patientId: uuid("patient_id").notNull().references(() => patients.id),
    providerId: uuid("provider_id").notNull(), // External ID
    content: text("content").notNull(),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at"),
});
