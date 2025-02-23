import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("1111111111111111", req.headers)
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.error('222222222222', token)
  if (!token) {
    return res.status(401).json({ message: "Access denied. Token is missing." });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    console.error("token", token, 'sejk', secret)
    const decoded = jwt.verify(token, secret);
    console.error('33333333333', decoded)
    req.user = decoded; 

    next();
  } catch (error) {
    console.error("❌ Ошибка проверки токена:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
                        console.log("Decoded user:", req.user);
};
