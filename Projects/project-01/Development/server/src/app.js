import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { join } from "path";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import { authRoutes } from "./routes/auth.js";
import { adminRoutes } from "./routes/admin.js";
import { itemRoutes } from "./routes/items.js";
import { fileRoutes } from "./routes/files.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

connectDB();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));

// public var for serving uploaded files but access routed through files router
app.use(
  "/public/uploads",
  express.static(join(process.cwd(), process.env.UPLOAD_DIR || "uploads"))
);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/files", fileRoutes);

// health
app.get("/health", (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

export { app };
