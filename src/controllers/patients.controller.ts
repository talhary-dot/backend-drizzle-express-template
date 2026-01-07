import { db } from "#libs/db/index.ts";
import { patients } from "#src/models/index.ts";
import { type Request, type Response } from "express";
export const createPatient = async (req: Request, res: Response) => {
    try {
        const [patient] = await db.insert(patients).values({}).returning();
        res.status(201).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create patient" });
    }
};
