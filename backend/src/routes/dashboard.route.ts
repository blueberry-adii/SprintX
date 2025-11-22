import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

dashboardRouter.get("/", verifyToken, getDashboard);

export default dashboardRouter;
