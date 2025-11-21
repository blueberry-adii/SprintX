import type { Request, Response, NextFunction } from "express";
import admin from "../utils/firebase.js";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
