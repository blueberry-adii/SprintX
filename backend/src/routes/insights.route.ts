import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getInsights,
  generateInsights,
} from "../controllers/insights.controller.js";

const insightsRouter = Router();

insightsRouter.get("/", verifyToken, getInsights);
insightsRouter.post("/generate", verifyToken, generateInsights);

export default insightsRouter;
