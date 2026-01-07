import { Router } from "express";
import { createPatient } from "#src/controllers/patients.controller.ts";

const router = Router();

router.post("/", createPatient);

export default router;
