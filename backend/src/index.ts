import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import type { Request, Response, NextFunction } from "express";

import { errorMiddleware } from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("API is running 🚀");
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
