import type { NextFunction, Request, Response } from "express";
import { db } from "../config/db.js";
import { GoogleGenerativeAI, SchemaType as Type } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import type { AIInsight } from "../types/user.js";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    throw new ApiError(500, "API Key missing");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getInsights = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).uid;

    const [rows] = await db.query(
      "SELECT recommendations FROM users WHERE uid = ?",
      [uid]
    );

    const user = (rows as any[])[0];
    const recs = JSON.parse(user?.recommendations || "[]");

    return res.status(200).json(new ApiResponse(200, recs, "Insights fetched"));
  }
);

export const generateInsights = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).uid;

    const model = getAIClient().getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            suggestedSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  note: { type: Type.STRING },
                },
              },
            },
            productivityScore: { type: Type.NUMBER },
          },
        },
      },
    });

    const [rows] = await db.query(
      "SELECT full_name, academic_goals, upcoming_exams, recommendations FROM users WHERE uid = ?",
      [uid]
    );
    const user = (rows as any[])[0];
    const profile = JSON.parse(user || "[]");

    const [rows2] = await db.query(
      "SELECT title, deadline, duration_mins, priority, category, status FROM tasks WHERE uid = ?",
      [uid]
    );
    const tasks = JSON.parse((rows2 as any[])[0] || []);

    const [rows3] = await db.query(
      "SELECT log_date, felt_today, study_hours, screen_hours, exercise_mins, wake_up_time, sleep_time, wellbeing_score FROM daily_routine WHERE uid = ?",
      [uid]
    );
    const logs = JSON.parse((rows3 as any[])[0] || []);

    const prompt = `
      Act as an elite Student Productivity Coach. Analyze the following data:
      
      UserProfile: ${JSON.stringify(profile)}
      Current Tasks (Pending & Completed): ${JSON.stringify(tasks)}
      Recent Routine Logs (Last 7 days): ${JSON.stringify(logs)}

      Provide a structured analysis containing:
      1. 3-4 short, punchy insights about the student's habits (e.g., "You study best on days you exercise", "Screen time negatively impacts your sleep").
      2. A suggested simplified schedule for the *current day* based on pending tasks and typical wake/sleep times. Minimize overlap. Prioritize 'Urgent' and 'High' tasks.
      3. A productivity score (0-100) based on task completion and healthy routine habits.
    `;

    const response = await model.generateContent(prompt);
    const aiData = JSON.parse(response.response.text());

    let recs: any[] = [];

    if (user?.recommendations) {
      recs = JSON.parse(user.recommendations);
    }

    if (recs.length >= 10) {
      recs.shift();
    }
    recs.push(aiData);

    await db.query("UPDATE users SET recommendations = ? WHERE uid = ?", [
      JSON.stringify(recs),
      uid,
    ]);

    return res.json(new ApiResponse(200, aiData, "New insight generated"));
  }
);

export const getQuickAdvice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { query, context } = req.body;

    const model = getAIClient().getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const response = await model.generateContent(
      `Context: ${context}. \n\nUser Question: ${query}\n\nAnswer concisely in 2 sentences.`
    );

    const text = response.response.text();

    return res
      .status(200)
      .json(new ApiResponse(200, text, "Response generated"));
  }
);
