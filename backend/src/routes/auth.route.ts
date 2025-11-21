import { Router } from "express";
import { login, register, me, updateProfile } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();


authRouter.post("/register", verifyToken, register);
authRouter.post("/login", verifyToken, login);
authRouter.get("/me", verifyToken, me);
authRouter.put("/profile", verifyToken, updateProfile);

export default authRouter;
