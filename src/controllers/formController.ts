import { Request, Response } from "express";
import pool from "../config/db";


export const createForm = async (req: Request, res: Response) => {
  const { title, description, fields } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!title || !fields || !userId) {
    return res.status(400).json({ message: "Title and fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO forms (title, description, fields, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [title, description, JSON.stringify(fields), userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating form" });
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
