import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addDailyLog,
  getLatestLogs,
} from "../controllers/routine.controller.js";

const routineRouter = Router();

routineRouter.post("/", verifyToken, addDailyLog);
routineRouter.get("/latest", verifyToken, getLatestLogs);

export default routineRouter;
