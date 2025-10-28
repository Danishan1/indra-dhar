import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import { costCategoryRoutes } from "./routes/costCategory.routes.js";
import { costItemRoutes } from "./routes/costItem.routes.js";
import { costAllocationRoutes } from "./routes/costAllocation.routes.js";
import { userRoutes } from "./routes/user.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cost-categories", costCategoryRoutes);
app.use("/api/cost-items", costItemRoutes);
app.use("/api/cost-allocations", costAllocationRoutes);
app.use("/api/users", userRoutes);

export default app;
