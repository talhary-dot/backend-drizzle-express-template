
import { type Request, type Response } from "express";
import { db } from "#libs/db/index.ts";
import { dotPhrases } from "#src/models/index.ts";
import { eq, desc } from "drizzle-orm";

export const getDotPhrases = async (req: Request, res: Response) => {
    try {
        const phrases = await db.select().from(dotPhrases).orderBy(desc(dotPhrases.createdAt));
        res.json(phrases);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch dot phrases" });
    }
};

export const createDotPhrase = async (req: Request, res: Response) => {
    try {
        const { triggerKeyword, title, content } = req.body;
        const [phrase] = await db.insert(dotPhrases).values({
            triggerKeyword,
            title,
            content,
        }).returning();
        res.status(201).json(phrase);
    } catch (error: any) {
        console.error(error);
        if (error.code === '23505') { // Unique violation
            res.status(409).json({ error: "Trigger keyword already exists" });
        } else {
            res.status(500).json({ error: "Failed to create dot phrase" });
        }
    }
};

export const updateDotPhrase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { triggerKeyword, title, content } = req.body;
        const [updated] = await db.update(dotPhrases)
            .set({ triggerKeyword, title, content, updatedAt: new Date() })
            .where(eq(dotPhrases.id, id))
            .returning();

        if (!updated) {
            res.status(404).json({ error: "Dot phrase not found" });
            return;
        }
        res.json(updated);
    } catch (error: any) {
        console.error(error);
        if (error.code === '23505') {
            res.status(409).json({ error: "Trigger keyword already exists" });
        } else {
            res.status(500).json({ error: "Failed to update dot phrase" });
        }
    }
};

export const deleteDotPhrase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [deleted] = await db.delete(dotPhrases)
            .where(eq(dotPhrases.id, id))
            .returning();

        if (!deleted) {
            res.status(404).json({ error: "Dot phrase not found" });
            return;
        }
        res.json({ message: "Dot phrase deleted successfully" });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete dot phrase" });
    }
};
