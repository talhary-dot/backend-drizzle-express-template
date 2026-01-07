import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { procedureNotes } from "./procedure_notes";
import { dotPhrases } from "./dot_phrases";

export const procedureNoteDotPhrases = pgTable("procedure_note_dot_phrases", {
    noteId: uuid("note_id").notNull().references(() => procedureNotes.id),
    dotPhraseId: uuid("dot_phrase_id").notNull().references(() => dotPhrases.id),
}, (t) => ({
    pk: primaryKey({ columns: [t.noteId, t.dotPhraseId] }),
}));
