// @ts-nocheck
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../config/db";
import { body, validationResult } from "express-validator";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "test-secret";

router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("surname").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, surname, email, password } = req.body;

    try {
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        `INSERT INTO users (name, surname, email, password, last_login) 
         VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, surname, email;`,
        [name, surname, email, hashedPassword]
      );

      const user = result.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ user, token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to register user" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const userResult = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = userResult.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "1h",
      });

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          surname: user.surname,
          email: user.email,
        },
        token,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to login" });
    }
  }
);

export default router;
