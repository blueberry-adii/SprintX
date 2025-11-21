import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../config/db.js";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).user.uid;
    const { name, email } = req.body;

    const [rows] = await db.query("SELECT id FROM users WHERE uid = ?", [uid]);

    const existing = rows as any[];

    if (existing.length > 0) {
      throw new ApiError(409, "User already registered");
    }

    // Note: Schema needs 'email' column added. For now, mapping 'name' to 'full_name'.
    await db.query("INSERT INTO users (uid, full_name, email) VALUES (?, ?, ?)", [
      uid,
      name,
      email,
    ]);

    return res
      .status(201)
      .json(new ApiResponse(201, uid, "User registered successfully in MySQL"));
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).user.uid;

    const [rows] = await db.query(
      "SELECT id, uid, full_name, email FROM users WHERE uid = ?",
      [uid]
    );

    const users = rows as any[];

    if (users.length === 0) {
      throw new ApiError(
        404,
        "User not found in MySQL. Please complete registration."
      );
    }

    const user = users[0];

    return res
      .status(200)
      .json(new ApiResponse<any>(200, user, "Login successful"));
  }
);

export const me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const uid = (req as any).user.uid;

  const [rows] = await db.query(
    "SELECT id, uid, full_name, pfp_url, academic_goals, upcoming_exams, recommendations, settings_dark_mode, settings_color_theme, created_at, updated_at FROM users WHERE uid = ?",
    [uid]
  );

  const users = rows as any[];

  if (users.length === 0) {
    throw new ApiError(404, "User not found in database");
  }

  const user = users[0];

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile fetched successfully"));
});

export const updateProfile = asyncHandler(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const uid = (req as any).user.uid;
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return new ApiError(400, "No fields to update");
    }

    const keys = Object.keys(updates);
    const values = keys.map((key) => {
      const value = updates[key];

      if (Array.isArray(value) || typeof value === "object") {
        return JSON.stringify(value);
      }

      return value;
    });

    const setClause = keys.map((key) => `${key} = ?`).join(", ");

    const sql = `UPDATE users SET ${setClause} WHERE uid = ?`;

    await db.query(sql, [...values, uid]);

    return res.status(200).json(new ApiResponse(200, [], "Profile updated successfully"));
  }
);
