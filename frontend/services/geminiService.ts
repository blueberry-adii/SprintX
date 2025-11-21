import { GoogleGenAI, Type } from "@google/genai";
import { Task, RoutineLog, UserProfile, AIAnalysisResult } from "../types";
import axios, { AxiosResponse } from "axios";

const MODEL_NAME = "gemini-2.5-flash";
let token = "temp";

export const analyzeProductivity = async (
  tasks: Task[],
  logs: RoutineLog[],
  profile: UserProfile
): Promise<AIAnalysisResult> => {
  try {
    const response = await axios.post<{ data: AIAnalysisResult }>(
      "http://localhost:5000/api/v1/insights/generate",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data.data as AIAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    // Fallback mock data to prevent app crash if API fails
    return {
      insights: [
        "Ensure your API Key is valid to get real insights.",
        "Focus on high priority tasks first.",
      ],
      suggestedSchedule: [
        { time: "09:00", activity: "Check configurations", note: "System" },
      ],
      productivityScore: 50,
    };
  }
};

export const getQuickAdvice = async (
  query: string,
  context: string
): Promise<string> => {
  try {
    const response = await axios.post<{ data: string }>(
      "http://localhost:5000/api/v1/insights/chat",
      { query, context },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.data || "I couldn't generate advice at this moment.";
  } catch (e) {
    return "Service unavailable. Please check your connection or API key.";
  }
};

//
