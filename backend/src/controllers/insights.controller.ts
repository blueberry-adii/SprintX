import type { NextFunction, Request, Response } from "express";
import { db } from "../config/db.js";
import { GoogleGenerativeAI, SchemaType as Type } from "@google/generative-ai";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import type { AIInsight } from "../types/user.js";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    throw new ApiError(500, "API Key missing");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI;
};

export const getInsights = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).user.uid;

    const [rows] = await db.query(
      "SELECT recommendations FROM users WHERE uid = ?",
      [uid]
    );

    const user = (rows as any[])[0];
    const recs = user?.recommendations
      ? (typeof user.recommendations === 'string' ? JSON.parse(user.recommendations) : user.recommendations)
      : [];

    return res.status(200).json(new ApiResponse(200, recs, "Insights fetched"));
  }
);

export const generateInsights = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const uid = (req as any).user.uid;

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

    // Parse JSON fields safely
    const profile = user ? {
      full_name: user.full_name,
      academic_goals: typeof user.academic_goals === 'string' ? JSON.parse(user.academic_goals) : user.academic_goals,
      upcoming_exams: typeof user.upcoming_exams === 'string' ? JSON.parse(user.upcoming_exams) : user.upcoming_exams,
      recommendations: typeof user.recommendations === 'string' ? JSON.parse(user.recommendations) : user.recommendations
    } : {};

    const [taskRows] = await db.query(
      "SELECT title, deadline, duration_mins, priority, category, status FROM tasks WHERE uid = ?",
      [uid]
    );
    const tasks = taskRows as any[];

    const [logRows] = await db.query(
      "SELECT log_date, felt_today, study_hours, screen_hours, exercise_mins, wake_up_time, sleep_time, wellbeing_score FROM daily_routine WHERE uid = ?",
      [uid]
    );
    const logs = logRows as any[];

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

    // Add metadata for history
    aiData.id = Date.now().toString();
    aiData.createdAt = new Date().toISOString();

    console.log(`[GenerateInsights] UID: ${uid}`);
    console.log(`[GenerateInsights] Existing recommendations raw:`, user?.recommendations);

    let recs: any[] = [];

    if (user?.recommendations) {
      recs = typeof user.recommendations === 'string' ? JSON.parse(user.recommendations) : user.recommendations;
    }

    console.log(`[GenerateInsights] Parsed existing recs count: ${recs.length}`);

    if (recs.length >= 10) {
      recs.shift();
    }
    recs.push(aiData);

    console.log(`[GenerateInsights] New recs count to save: ${recs.length}`);

    const [updateResult] = await db.query("UPDATE users SET recommendations = ? WHERE uid = ?", [
      JSON.stringify(recs),
      uid,
    ]);

    console.log(`[GenerateInsights] Update result:`, updateResult);

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
