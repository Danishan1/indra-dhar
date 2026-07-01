import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import { userRoutes } from "./routes/user.routes.js";

import { verifyToken } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import path from "path";

const __dirname = path.resolve();

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://trtcvpc8-3000.inc1.devtunnels.ms",
    ], // allowed frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you're using cookies or session auth
  }),
);

app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);

app.use(verifyToken);

app.use("/users", userRoutes);

// GLOBAL ERROR HANDLER — MUST BE LAST
app.use(errorHandler);

export default app;
