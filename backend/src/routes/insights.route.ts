import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  getInsights,
  generateInsights,
  getQuickAdvice,
} from "../controllers/insights.controller.js";

const insightsRouter = Router();

insightsRouter.get("/", verifyToken, getInsights);
insightsRouter.post("/generate", verifyToken, generateInsights);
insightsRouter.post("/chat", verifyToken, getQuickAdvice);

export default insightsRouter;
