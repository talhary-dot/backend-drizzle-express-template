import { db } from "#libs/db/index.ts";
import { procedureNotes, noteHistory, procedureNoteDotPhrases, dotPhrases } from "#src/models/index.ts";
import { eq, desc, and } from "drizzle-orm";
import { type Request, type Response } from "express";
export const createNote = async (req: Request, res: Response) => {
    try {
        const { procedureId, patientId, providerId, content, dotPhraseIds } = req.body;

        // Transaction to create note and link dot phrases
        const result = await db.transaction(async (tx) => {
            const [note] = await tx.insert(procedureNotes).values({
                procedureId,
                patientId,
                providerId,
                content
            }).returning();

            if (dotPhraseIds && Array.isArray(dotPhraseIds) && dotPhraseIds.length > 0) {
                await tx.insert(procedureNoteDotPhrases).values(
                    dotPhraseIds.map((dpId: string) => ({
                        noteId: note.id,
                        dotPhraseId: dpId
                    }))
                );
            }
            return note;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Failed to create note" });
    }
};

export const getNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [note] = await db.select().from(procedureNotes).where(eq(procedureNotes.id, id));

        if (!note) {
            res.status(404).json({ error: "Note not found" });
            return;
        }
        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch note" });
    }
};

export const updateNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { content, changedByUserId } = req.body; // Expecting ID of user making change

        await db.transaction(async (tx) => {
            // Get current note for history
            const [currentNote] = await tx.select().from(procedureNotes).where(eq(procedureNotes.id, id));

            if (!currentNote) {
                throw new Error("Note not found");
            }

            // Create history record
            await tx.insert(noteHistory).values({
                noteId: id,
                previousContent: currentNote.content,
                changedByUserId: changedByUserId || currentNote.providerId, // Fallback if not provided
                actionType: 'EDIT'
            });

            // Update note
            const [updated] = await tx.update(procedureNotes)
                .set({ content, updatedAt: new Date() })
                .where(eq(procedureNotes.id, id))
                .returning();

            return updated;
        });

        const [finalNote] = await db.select().from(procedureNotes).where(eq(procedureNotes.id, id));
        res.json(finalNote);
    } catch (error: any) {
        console.error(error);
        if (error.message === "Note not found") {
            res.status(404).json({ error: "Note not found" });
        } else {
            res.status(500).json({ error: "Failed to update note" });
        }
    }
};

export const deleteNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { changedByUserId } = req.body;

        await db.transaction(async (tx) => {
            const [currentNote] = await tx.select().from(procedureNotes).where(eq(procedureNotes.id, id));
            if (!currentNote) throw new Error("Note not found");

            await tx.insert(noteHistory).values({
                noteId: id,
                previousContent: currentNote.content,
                changedByUserId: changedByUserId || currentNote.providerId,
                actionType: 'DELETE'
            });

            await tx.update(procedureNotes)
                .set({ isDeleted: true, updatedAt: new Date() })
                .where(eq(procedureNotes.id, id));
        });

        res.json({ message: "Note soft-deleted successfully" });
    } catch (error: any) {
        console.error(error);
        if (error.message === "Note not found") {
            res.status(404).json({ error: "Note not found" });
        } else {
            res.status(500).json({ error: "Failed to delete note" });
        }
    }
};

export const getNoteHistory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const history = await db.select()
            .from(noteHistory)
            .where(eq(noteHistory.noteId, id))
            .orderBy(desc(noteHistory.changedAt));
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch note history" });
    }
};
