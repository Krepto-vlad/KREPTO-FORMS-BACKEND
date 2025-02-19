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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


app.get("/test", async (req, res) => {
    try {
      
      return res.status(200).json({
        message: "ok",
    
      });
    } catch (error) {
      return res.status(500).json({ message: "Ошибка подключения к базе данных", error });
    }
  });