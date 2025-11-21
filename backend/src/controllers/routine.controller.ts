import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addDailyLog = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).uid;

  const {
    log_date,
    felt_today,
    study_hours,
    screen_hours,
    exercise_mins,
    wake_up_time,
    sleep_time,
  } = req.body;

  const moodMap: Record<string, number> = {
    Terrible: 1,
    Bad: 3,
    Okay: 5,
    Good: 7,
    Great: 10,
  };

  const moodScore = moodMap[felt_today] ?? 5;

  let sleepHours = 0;
  if (wake_up_time && sleep_time) {
    const diff =
      (new Date(`2000-01-01T${wake_up_time}`) as any) -
      (new Date(`2000-01-01T${sleep_time}`) as any);

    sleepHours = Math.abs(diff) / (1000 * 60 * 60);
  }

  const wellbeing_score = Math.min(
    10,
    Math.round(
      moodScore * 0.5 +
        (study_hours || 0) * 0.5 +
        (exercise_mins || 0) / 30 +
        sleepHours * 0.4 -
        (screen_hours || 0) * 0.2
    )
  );

  await db.query(
    `
      INSERT INTO daily_routine 
      (uid, log_date, felt_today, study_hours, screen_hours, exercise_mins, wake_up_time, sleep_time, wellbeing_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        felt_today = VALUES(felt_today),
        study_hours = VALUES(study_hours),
        screen_hours = VALUES(screen_hours),
        exercise_mins = VALUES(exercise_mins),
        wake_up_time = VALUES(wake_up_time),
        sleep_time = VALUES(sleep_time),
        wellbeing_score = VALUES(wellbeing_score)
    `,
    [
      uid,
      log_date,
      felt_today,
      study_hours,
      screen_hours,
      exercise_mins,
      wake_up_time,
      sleep_time,
      wellbeing_score,
    ]
  );

  return res
    .status(200)
    .json(new ApiResponse(200, wellbeing_score, "Daily routine saved"));
});

export const getLatestLogs = asyncHandler(
  async (req: Request, res: Response) => {
    const uid = (req as any).uid;

    const [rows] = await db.query(
      `
      SELECT * FROM daily_routine 
      WHERE uid = ?
      ORDER BY log_date DESC
      LIMIT 10
      `,
      [uid]
    );

    return res
      .status(200)
      .json(new ApiResponse(200, rows, "Latest logs fetched"));
  }
);
