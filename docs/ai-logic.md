# AI Logic & Integration

## Overview
The application leverages Google's **Gemini 2.5 Flash** model to provide personalized productivity insights, schedule suggestions, and quick advice. The AI acts as an "Elite Student Productivity Coach," analyzing user data to optimize their daily routine.

## Architecture

### 1. AI Service (`backend/src/controllers/insights.controller.ts`)
The backend exposes endpoints that interact with the Gemini API.
- **Library**: `@google/generative-ai`
- **Model**: `gemini-2.5-flash`
- **Configuration**:
  - `responseMimeType`: `application/json` (for structured insights)
  - `responseSchema`: Enforced JSON schema for consistent parsing.

### 2. Data Context
To generate relevant insights, the AI is fed a comprehensive context window containing:
- **User Profile**: Academic goals, upcoming exams, and full name.
- **Tasks**: Current pending and completed tasks (title, deadline, priority, duration).
- **Routine Logs**: Recent daily logs (last 7 days) including mood, sleep, study hours, and screen time.

### 3. Prompt Engineering
The system uses a structured prompt to guide the AI's persona and output format.

**System Instruction:**
> "Act as an elite Student Productivity Coach. Analyze the following data..."

**Output Requirements:**
1.  **Insights**: 3-4 short, actionable observations about habits (e.g., correlation between exercise and study efficiency).
2.  **Suggested Schedule**: A simplified timeline for the *current day*, prioritizing urgent tasks and minimizing overlap.
3.  **Productivity Score**: A 0-100 metric evaluating the user's recent performance.

## Endpoints

### `POST /api/insights/generate`
- **Trigger**: User clicks "New Insight" on the Dashboard or AI Planner.
- **Process**:
    1.  Fetches User, Tasks, and Routine data from MySQL.
    2.  Constructs the prompt.
    3.  Calls Gemini API.
    4.  Parses the JSON response.
    5.  **Storage**: Appends the new insight to the `recommendations` JSON array in the `users` table (capped at 10 items history).
- **Response**: Returns the generated `AIAnalysisResult`.

### `POST /api/insights/chat`
- **Trigger**: User asks a quick question in the AI Assistant chat.
- **Process**:
    1.  Receives `query` and `context` (current page content/state).
    2.  Sends a concise prompt to Gemini.
- **Response**: Returns a short text answer (max 2 sentences).

## Frontend Integration (`frontend/services/geminiService.ts`)
- **`analyzeProductivity`**: Calls the generate endpoint. Includes error handling with fallback "mock" data to ensure UI resilience if the API fails.
- **`getQuickAdvice`**: Calls the chat endpoint for immediate assistance.
