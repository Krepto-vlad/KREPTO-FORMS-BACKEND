// @ts-nocheck

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import formRoutes from "./routes/formRoutes"; 
import { createForm } from "./controllers/formController";
import { authenticateToken } from "./middlewares/authMiddleware";
import pool from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin: [
          "https://krepto-forms-webapp.vercel.app", 
          "https://krepto-forms-webapp-nnz7tk7uy-krepto-vlads-projects.vercel.app"
        ],
        credentials: true,
      })
);
app.use(express.json());

app.use("/auth", authRoutes);

app.use("/forms", formRoutes);

const createTables = async () => {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        last_login TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        theme VARCHAR,
        questions JSONB NOT NULL,
        user_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    form_id INT NOT NULL,
    user_id INT,
    answers JSONB NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (form_id) REFERENCES forms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
  );
    `);

    console.log(" The users, responses and forms table has been checked/created!");
  } catch (err) {
    console.error(" Error creating table:", err);
  }
};


pool.connect()
  .then(async () => {
    console.log(" Connected to PostgreSQL");
    await createTables(); 
  })
  .catch((err) => console.error(" DB error:", err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/forms", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM forms;");
    res.json(result.rows);
  } catch (error) {
    console.error(" Error while retrieving forms:", error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return res.status(200).json({
      message: " Connection to the database successfully!",
      serverTime: result.rows[0].now
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Database connection error", 
      error 
    });
  }
});

app.post("/templates", authenticateToken, createForm);