import { Pool } from "pg";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ time: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Ошибка подключения к БД" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
