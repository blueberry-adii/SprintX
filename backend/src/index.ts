import express from "express";
import { connectDB, initDB } from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";

import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

  app.use(errorMiddleware);

  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
}

start();