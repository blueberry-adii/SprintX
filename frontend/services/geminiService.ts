import { Task, RoutineLog, UserProfile, AIAnalysisResult } from "../types";
import { api } from "./api";

export const analyzeProductivity = async (
  tasks: Task[],
  logs: RoutineLog[],
  profile: UserProfile
): Promise<AIAnalysisResult> => {
  try {
    const response = await api.post<{ data: AIAnalysisResult }>(
      "/insights/generate",
      {}
    );

    return response.data as AIAnalysisResult;
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
    const response = await api.post<{ data: string }>(
      "/insights/chat",
      { query, context }
    );
    return response.data || "I couldn't generate advice at this moment.";
  } catch (e) {
    return "Service unavailable. Please check your connection or API key.";
  }
};
