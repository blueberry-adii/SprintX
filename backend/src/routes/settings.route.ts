import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  toggleDarkMode,
  changeTheme,
} from "../controllers/settings.controller.js";

const settingsRouter = Router();

settingsRouter.patch("/dark-mode", verifyToken, toggleDarkMode);
settingsRouter.patch("/theme", verifyToken, changeTheme);

export default settingsRouter;
