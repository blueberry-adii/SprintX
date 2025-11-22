import type { Request, Response, NextFunction } from "express";
import { db } from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = (req as any).user.uid;

  const [userRows] = await db.query(
    "SELECT full_name FROM users WHERE uid = ?",
    [uid]
  );
  const user = (userRows as any[])[0];
  const firstName = user?.full_name?.split(" ")[0] || "User";

  const [taskRows] = await db.query(
    `SELECT 
         COUNT(*) AS total_tasks,
         SUM(CASE WHEN status='Completed' THEN 1 ELSE 0 END) AS completed_tasks
       FROM tasks 
       WHERE uid = ?`,
    [uid]
  );
  const taskStats = (taskRows as any[])[0];

  const [weekStudyRows] = await db.query(
    `SELECT 
         log_date,
         study_hours,
         screen_hours,
         wellbeing_score
       FROM daily_routine
       WHERE uid = ?
       ORDER BY log_date DESC
       LIMIT 7`,
    [uid]
  );
  const last7 = weekStudyRows as any[];

  const avgStudy =
    last7.length === 0
      ? 0
      : Number(
        (
          last7.reduce((sum, row) => sum + (row.study_hours || 0), 0) /
          last7.length
        ).toFixed(2)
      );

  const [prevRows] = await db.query(
    `SELECT 
         log_date,
         study_hours
       FROM daily_routine
       WHERE uid = ?
       ORDER BY log_date DESC
       LIMIT 14`,
    [uid]
  );

  const last14 = prevRows as any[];

  const last7Study = last14
    .slice(0, 7)
    .reduce((s, r) => s + (r.study_hours || 0), 0);
  const prev7Study = last14
    .slice(7, 14)
    .reduce((s, r) => s + (r.study_hours || 0), 0);

  const avgWellbeing =
    last7.length === 0
      ? 0
      : Number(
        (
          last7.reduce((sum, row) => sum + (row.wellbeing_score || 0), 0) /
          last7.length
        ).toFixed(1)
      );

  const productivityScore = Math.min(100, Math.round(avgWellbeing * 10));

  let productivityChange = 0;
  if (prev7Study === 0 && last7Study > 0) productivityChange = 100;
  else if (prev7Study === 0) productivityChange = 0;
  else
    productivityChange = Number(
      (((last7Study - prev7Study) / prev7Study) * 100).toFixed(2)
    );

  const studyTrend = [...last7].reverse().map((day) => ({
    date: day.log_date,
    study_hours: day.study_hours,
  }));

  const screenTrend = [...last7].reverse().map((day) => ({
    date: day.log_date,
    screen_hours: day.screen_hours,
  }));

  const wellbeingTrend = [...last7].reverse().map((day) => ({
    date: day.log_date,
    wellbeing_score: day.wellbeing_score,
  }));

  return res.json(
    new ApiResponse(
      200,
      {
        first_name: firstName,
        total_tasks: taskStats.total_tasks,
        completed_tasks: taskStats.completed_tasks,
        avg_study_hours: avgStudy,
        productivity_score: productivityScore,
        productivity_change: productivityChange,
        study_past_7_days: studyTrend,
        screen_past_7_days: screenTrend,
        wellbeing_past_7_days: wellbeingTrend,
      },
      "Got Dashboard Stats successfully"
    )
  );
};
