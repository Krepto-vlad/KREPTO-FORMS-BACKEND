// @ts-nocheck
import express from "express";
import { createForm, getForms, getFormById } from "../controllers/formController";
import { updateForm } from "../controllers/formController";
import { authenticateToken } from "../middlewares/authMiddleware";
import { getFormById } from "../controllers/formController";

const router = express.Router();

router.post("/", authenticateToken, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", authenticateToken, updateForm);

export default router;
