// @ts-nocheck
import express from "express";
import { createForm, getForms, getFormById } from "../controllers/formController";

const router = express.Router();

router.post("/", createForm);
router.get("/", getForms);
router.get("/:id", getFormById);

export default router;
