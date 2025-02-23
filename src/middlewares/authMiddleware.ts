// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token is missing." });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    console.log("token", token, 'sejk', secret)
    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    req.user = decoded; 

    next();
  } catch (error) {
    console.error("❌ Ошибка проверки токена:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
                        console.log("Decoded user:", req.user);
};
