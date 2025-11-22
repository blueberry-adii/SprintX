import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const toggleDarkMode = asyncHandler(
  async (req: Request, res: Response) => {
    const uid = (req as any).user.uid;

    const [rows] = await db.query(
      "SELECT settings_dark_mode FROM users WHERE uid = ?",
      [uid]
    );

    const user = (rows as any[])[0];
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const current = user.settings_dark_mode === 1 ? 1 : 0;
    const newValue = current === 1 ? 0 : 1;

    await db.query("UPDATE users SET settings_dark_mode = ? WHERE uid = ?", [
      newValue,
      uid,
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, { dark_mode: !!newValue }, "Dark mode updated")
      );
  }
);

export const changeTheme = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  const { theme } = req.body;

  const allowed = ["Ocean", "Royal", "Sky", "Sunset"];

  if (!theme || !allowed.includes(theme)) {
    return new ApiError(
      400,
      "Invalid theme. Allowed: Ocean, Royal, Sky, Sunset"
    );
  }

  await db.query("UPDATE users SET settings_color_theme = ? WHERE uid = ?", [
    theme,
    uid,
  ]);

  return res.status(200).json(new ApiResponse(200, theme, "Theme updated"));
});
