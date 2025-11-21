import { GoogleGenAI, Type } from "@google/genai";
import { Task, RoutineLog, UserProfile, AIAnalysisResult } from "../types";

// Using gemini-2.5-flash for fast response times suitable for UI interactions
const MODEL_NAME = 'gemini-2.5-flash';

const getAIClient = () => {
  // Fix: Use process.env.API_KEY exclusively
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key is missing in environment variables");
    throw new Error("API Key missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeProductivity = async (
  tasks: Task[],
  logs: RoutineLog[],
  profile: UserProfile
): Promise<AIAnalysisResult> => {
  try {
    const ai = getAIClient();
    
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

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedSchedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  note: { type: Type.STRING }
                }
              }
            },
            productivityScore: { type: Type.NUMBER }
          }
        }
      }
    });

    let cleanText = response.text || "{}";
    cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanText);
    return result as AIAnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    // Fallback mock data to prevent app crash if API fails
    return {
      insights: ["Ensure your API Key is valid to get real insights.", "Focus on high priority tasks first."],
      suggestedSchedule: [{ time: "09:00", activity: "Check configurations", note: "System" }],
      productivityScore: 50
    };
  }
};

export const getQuickAdvice = async (query: string, context: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Context: ${context}. \n\nUser Question: ${query}\n\nAnswer concisely in 2 sentences.`
    });
    return response.text || "I couldn't generate advice at this moment.";
  } catch (e) {
    return "Service unavailable. Please check your connection or API key.";
  }
};

export const getDailyScoreAnalysis = async (
  date: string,
  stats: { studyHours: number; mood: number; completed: number; total: number; score: number }
): Promise<{ analysis: string; tip: string }> => {
  try {
    const ai = getAIClient();
    const prompt = `
      Analyze the daily productivity score of ${stats.score}/100 for ${date}.
      Metrics:
      - Study Hours: ${stats.studyHours}
      - Mood Rating: ${stats.mood}/10
      - Tasks Completed: ${stats.completed}/${stats.total}

      Output Requirements:
      1. analysis: A 2-sentence psychological analysis of why the score is high/low based on the correlation between mood, study time, and task completion. Be specific.
      2. tip: A single, short, high-impact actionable tip for the next day to improve or maintain momentum.
      
      Tone: Professional, insightful, and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            tip: { type: Type.STRING }
          }
        }
      }
    });

    let cleanText = response.text || "";
    cleanText = cleanText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(cleanText || '{"analysis": "No analysis available.", "tip": "Keep going!"}');
  } catch (error) {
    console.error(error);
    return { analysis: "Unable to analyze right now.", tip: "Try again later." };
  }
};