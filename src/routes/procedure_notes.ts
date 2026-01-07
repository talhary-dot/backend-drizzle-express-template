import { Router } from "express";
import {
    createNote,
    getNote,
    updateNote,
    deleteNote,
    getNoteHistory
} from "#src/controllers/procedure_notes.controller";

const router = Router();

router.post("/", createNote);
router.get("/:id", getNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.get("/:id/history", getNoteHistory);

export default router;
