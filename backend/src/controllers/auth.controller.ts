import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { db } from "../config/db.js";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).uid;
    const { name, email } = req.body;

    const [rows] = await db.query("SELECT id FROM users WHERE uid = ?", [uid]);

    const existing = rows as any[];

    if (existing.length > 0) {
      throw new ApiError(409, "User already registered");
    }

    await db.query("INSERT INTO users (uid, name, email) VALUES (?, ?, ?)", [
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
    const uid = (req as any).uid;

    const [rows] = await db.query(
      "SELECT id, uid, name, email FROM users WHERE uid = ?",
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

export const me = asyncHandler(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const uid = (req as any).uid;

    if (!uid) {
      throw new ApiError(401, "Not authenticated");
    }

    const users = await db.query(
      "SELECT id, uid, name, email FROM users WHERE uid = ?",
      [uid]
    );
    if (!users) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, users[0], "User profile"));
  }
);

export const updateProfile = asyncHandler(
  async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const uid = (req as any).uid;

    if (!uid) {
      throw new ApiError(401, "Not authenticated");
    }

    const { name, goals, examDates, profilePicture } = req.body;

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (goals !== undefined) updates.goals = goals;
    if (examDates !== undefined) updates.examDates = examDates;
    if (profilePicture !== undefined)
      updates.profilePicture = profilePicture;

    const keys = Object.keys(updates); // ["name", "age", "city"]
    const values = Object.values(updates); // ["Adi", 18, "Bengaluru"]

    if (keys.length === 0) {
      throw new ApiError(400, "No fields to update");
    }

    const setClause = keys.map(key => `${key} = ?`).join(", ");
    const sql = `UPDATE users SET ${setClause} WHERE uid = ?`;

    const updated = await db.query(sql, [...values, uid]);

    if (!updated) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, updated, "Profile updated"));
  }
);
