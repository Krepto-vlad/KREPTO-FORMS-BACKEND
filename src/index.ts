// @ts-nocheck
// // import { Pool } from "pg";
// // import express from "express";
// // import dotenv from "dotenv";

// // dotenv.config();
// // const app = express();
// // const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // app.get("/test-db", async (req, res) => {
// //   try {
// //     const result = await pool.query("SELECT NOW()");
// //     res.json({ time: result.rows[0] });
// //   } catch (error) {
// //     res.status(500).json({ error: "Ошибка подключения к БД" });
// //   }
// // });

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));

// import express from "express";
// import { Client } from "pg";

// // Создаем клиент для подключения к базе данных
// const app = express();
// const port = process.env.PORT || 5000;

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
// });

// client.connect();

// // Эндпоинт для теста подключения к БД


// // Запуск сервера
// app.listen(port, () => {
//   console.log(`Сервер работает на порту ${port}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import formRoutes from "./routes/formRoutes"; 
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
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ Таблица users и forms проверена/создана!");
  } catch (err) {
    console.error("❌ Ошибка при создании таблицы:", err);
  }
};


pool.connect()
  .then(async () => {
    console.log("✅ Подключено к PostgreSQL");
    await createTables(); // Создать таблицу, если её нет
  })
  .catch((err) => console.error("❌ Ошибка БД:", err));


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return res.status(200).json({
      message: "✅ Подключение к базе успешно!",
      serverTime: result.rows[0].now
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "❌ Ошибка подключения к базе данных", 
      error 
    });
  }
});

app.post("/templates", async (req, res) => {
  const { title, description, theme, questions } = req.body;

  if (!title || !description || !questions) {
    return res.status(400).json({ message: "Title, description, and questions are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO forms (title, description, theme, questions) 
       VALUES ($1, $2, $3, $4) RETURNING id, title, description, theme, questions`,
      [title, description, theme, JSON.stringify(questions)]
    );

    res.status(201).json({ form: result.rows[0] });
  } catch (error) {
    console.error("❌ Ошибка при создании формы:", error);
    res.status(500).json({ message: "❌ Ошибка при создании формы", error });
  }
});