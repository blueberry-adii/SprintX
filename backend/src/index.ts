import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB, initDB } from "./config/db.js";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import dashboardRouter from "./routes/dashboard.route.js";
import taskRouter from "./routes/task.route.js";
import routineRouter from "./routes/routine.route.js";
import insightsRouter from "./routes/insights.route.js";
import settingsRouter from "./routes/settings.route.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const start = async () => {
  await connectDB();
  await initDB();

  app.get("/api/v1", (req: Request, res: Response) => {
    res.status(200).send("API is running 🚀");
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/dashboard", dashboardRouter);
  app.use("/api/v1/tasks", taskRouter);
  app.use("/api/v1/routines", routineRouter);
  app.use("/api/v1/insights", insightsRouter);
  app.use("/api/v1/settings", settingsRouter);

  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
};

start();
