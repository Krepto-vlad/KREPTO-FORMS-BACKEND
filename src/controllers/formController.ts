// @ts-nocheck
import { Request, Response } from "express";
import pool from "../config/db";


export const createForm = async (req: Request, res: Response) => {
  const { title, description, theme, questions } = req.body;
  const userId = Number(req.user?.id);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !description || !questions) {
    return res.status(400).json({ message: "Title, description, and questions are required." });
  }

try {
    const result = await pool.query(
      `INSERT INTO forms (title, description, theme, questions, user_id) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, theme, questions, user_id`,
      [title, description, theme, JSON.stringify(questions), userId]
    );

    res.status(201).json({ form: result.rows[0] });
  } catch (error) {
    console.error("❌ Ошибка при создании формы:", error);
    res.status(500).json({ message: "❌ Ошибка при создании формы", error });
  }
};

export const getForms = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM forms ORDER BY created_at DESC;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching forms" });
  }
};

export const getFormById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM forms WHERE id = $1;", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Form not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching form" });
  }
};
