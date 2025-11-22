# Routine Flow & Wellbeing Calculation

## Overview
The Routine system tracks daily habits (sleep, study, exercise, mood) to calculate a **Wellbeing Score**. This score helps users visualize the impact of their habits on their overall productivity.

## Data Model
**Table**: `daily_routine`
- `uid`: User ID (Foreign Key)
- `log_date`: Date of the log (YYYY-MM-DD)
- `felt_today`: Mood string ('Terrible', 'Bad', 'Okay', 'Good', 'Great')
- `study_hours`: Number of hours studied.
- `screen_hours`: Number of hours spent on screens (non-productive).
- `exercise_mins`: Minutes of exercise.
- `wake_up_time`: Time string (HH:MM).
- `sleep_time`: Time string (HH:MM).
- `wellbeing_score`: Calculated integer (0-10).

## User Flow

1.  **Logging**:
    - User accesses the **Routine Logger** component.
    - Inputs data for the current day (or past dates).
    - Submits the form.

2.  **Processing (`backend/src/controllers/routine.controller.ts`)**:
    - The backend receives the payload.
    - **Mood Quantification**:
        - Terrible: 1
        - Bad: 3
        - Okay: 5
        - Good: 7
        - Great: 10
    - **Sleep Calculation**: Calculates duration between `sleep_time` and `wake_up_time`.

3.  **Wellbeing Score Formula**:
    The score is a weighted sum of various factors, capped at 10.
    ```javascript
    Score = (Mood * 0.5) 
          + (StudyHours * 0.5) 
          + (ExerciseMins / 30) 
          + (SleepHours * 0.4) 
          - (ScreenHours * 0.2)
    ```
    *Note: Screen time negatively impacts the score.*

4.  **Storage**:
    - Uses `INSERT ... ON DUPLICATE KEY UPDATE` to ensure only one log entry exists per user per day.
    - If a user edits their log for the same day, the existing entry is updated.

5.  **Visualization**:
    - The **Dashboard** and **AI Planner** fetch the latest 10 logs (`getLatestLogs`).
    - Data is used to generate graphs and provide context for AI analysis.
