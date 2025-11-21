import type { Request, Response } from "express";
import { db } from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getTasks = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;

  const [rows] = await db.query(
    "SELECT * FROM tasks WHERE uid = ? ORDER BY deadline ASC",
    [uid]
  );

  return res.json({
    msg: "Tasks fetched successfully",
    tasks: rows,
  });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  const { title, deadline, duration_mins, priority, category } = req.body;

  const [result]: any = await db.query(
    `INSERT INTO tasks 
       (uid, title, deadline, duration_mins, priority, category)
       VALUES (?, ?, ?, ?, ?, ?)`,
    [uid, title, deadline, duration_mins || 0, priority, category]
  );

  const newTask = {
    id: result.insertId,
    uid,
    title,
    deadline,
    duration_mins: duration_mins || 0,
    priority,
    category,
    status: 'Pending',
    created_at: new Date(),
    updated_at: new Date()
  };

  return res
    .status(201)
    .json(new ApiResponse(201, newTask, "Task created successfully"));
});

export const editTask = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  const taskId = req.params.id;
  const updates = req.body;

  if (!updates || Object.keys(updates).length === 0) {
    return new ApiError(400, "No fields to update");
  }

  console.log('Updating task:', taskId, 'with updates:', updates);

  const keys = Object.keys(updates);
  const values = Object.values(updates);

  const setClause = keys.map((key) => `${key} = ?`).join(", ");

  const [result]: any = await db.query(`UPDATE tasks SET ${setClause} WHERE id = ? AND uid = ?`, [
    ...values,
    taskId,
    uid,
  ]);

  console.log('Update result:', result);

  const [rows]: any = await db.query("SELECT * FROM tasks WHERE id = ? AND uid = ?", [taskId, uid]);

  return res.status(200).json(new ApiResponse(200, rows[0], "Task updated successfully"));
});

export const completeTask = asyncHandler(
  async (req: Request, res: Response) => {
    const uid = (req as any).user.uid;
    const taskId = req.params.id;

    await db.query(
      "UPDATE tasks SET status = 'Completed' WHERE id = ? AND uid = ?",
      [taskId, uid]
    );

    const [rows]: any = await db.query("SELECT * FROM tasks WHERE id = ? AND uid = ?", [taskId, uid]);

    return res.status(200).json(new ApiResponse(200, rows[0], "Task marked as completed"));
  }
);

export const uncompleteTask = asyncHandler(
  async (req: Request, res: Response) => {
    const uid = (req as any).user.uid;
    const taskId = req.params.id;

    await db.query(
      "UPDATE tasks SET status = 'Pending' WHERE id = ? AND uid = ?",
      [taskId, uid]
    );

    const [rows]: any = await db.query("SELECT * FROM tasks WHERE id = ? AND uid = ?", [taskId, uid]);

    return res.status(200).json(new ApiResponse(200, rows[0], "Task marked as pending"));
  }
);

export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const uid = (req as any).user.uid;
  const taskId = req.params.id;

  await db.query("DELETE FROM tasks WHERE id = ? AND uid = ?", [taskId, uid]);

  return res.status(200).json(new ApiResponse(200, [], "Task deleted successfully"));
});
