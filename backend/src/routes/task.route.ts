import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getTasks,
  createTask,
  editTask,
  completeTask,
  uncompleteTask,
  deleteTask
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.get("/", verifyToken, getTasks);
taskRouter.post("/", verifyToken, createTask);
taskRouter.put("/:id", verifyToken, editTask);
taskRouter.patch("/:id/complete", verifyToken, completeTask);
taskRouter.patch("/:id/uncomplete", verifyToken, uncompleteTask);
taskRouter.delete("/:id", verifyToken, deleteTask);

export default taskRouter;
