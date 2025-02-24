// @ts-nocheck
import express from "express";
import { createForm, getForms, getFormById, updateForm } from "../controllers/formController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/", authenticateToken, createForm);
router.get("/", getForms);
router.get("/:id", getFormById);
router.put("/:id", authenticateToken, updateForm);

export default router;
