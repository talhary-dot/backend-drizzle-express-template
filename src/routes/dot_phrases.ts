import { Router } from "express";
import {
    getDotPhrases,
    createDotPhrase,
    updateDotPhrase,
    deleteDotPhrase
} from "../controllers/dot_phrases.controller";

const router = Router();

router.get("/", getDotPhrases);
router.post("/", createDotPhrase);
router.put("/:id", updateDotPhrase);
router.delete("/:id", deleteDotPhrase);

export default router;
