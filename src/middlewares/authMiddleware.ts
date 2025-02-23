// @ts-nocheck
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("1111111111111111", req.headers, '222222222222',req.headers["Authorization"])
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. Token is missing." });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    console.error("token", token, 'sejk', secret)
    const decoded = jwt.verify(token, secret) as { id: number; email: string };
    req.user = decoded; 

    next();
  } catch (error) {
    console.error("❌ Ошибка проверки токена:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
                        console.log("Decoded user:", req.user);
};
