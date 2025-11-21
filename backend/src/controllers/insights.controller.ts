import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getInsights = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).uid;

  const [rows] = await db.query(
    "SELECT recommendations FROM users WHERE uid = ?",
    [uid]
  );

  const user = (rows as any[])[0];
  const recs = JSON.parse(user?.recommendations || "[]");

  return res.status(200).json(new ApiResponse(200, recs, "Insights fetched"));
});

export const generateInsights = asyncHandler(
  async (req: Request, res: Response) => {
    const uid = (req as any).uid;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt =
      "Generate one short, actionable productivity recommendation for a college student in one sentence only.";

    const response = await model.generateContent(prompt);
    const aiText = response.response.text().trim();

    const [rows] = await db.query(
      "SELECT recommendations FROM users WHERE uid = ?",
      [uid]
    );

    const user = (rows as any[])[0];
    let recs: string[] = [];

    if (user?.recommendations) {
      recs = JSON.parse(user.recommendations);
    }

    if (recs.length >= 10) {
      recs.shift();
    }
    recs.push(aiText);

    await db.query("UPDATE users SET recommendations = ? WHERE uid = ?", [
      JSON.stringify(recs),
      uid,
    ]);

    return res.json(
      new ApiResponse(
        200,
        { recommendation: aiText, insights: recs },
        "New insight generated"
      )
    );
  }
);
