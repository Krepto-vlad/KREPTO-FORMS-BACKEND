// @ts-nocheck
import express from "express";
import { createForm, getForms, getFormById } from "../controllers/formController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);

export default router;
