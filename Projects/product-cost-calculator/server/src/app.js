import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
// import { costCategoryRoutes } from "./routes/costCategory.routes.js";
// import { costItemRoutes } from "./routes/costItem.routes.js";
// import { costAllocationRoutes } from "./routes/costAllocation.routes.js";
// import { vendorRoutes } from "./routes/vendor.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { laborRoutes } from "./routes/labor.routes.js";
import { rawMaterialRoutes } from "./routes/rawMaterial.routes.js";
import { utilityRoutes } from "./routes/utility.routes.js";
import { overheadRoutes } from "./routes/overhead.routes.js";
import { machineRoutes } from "./routes/machine.routes.js";
import { verifyToken } from "./middlewares/auth.middleware.js";
import { costCalculationRoutes } from "./routes/costCalculation.routes.js";
import { projectCostRoutes } from "./routes/projectCost.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000"], // allowed frontend URLs
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // if you're using cookies or session auth
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/auth", authRoutes);

app.use(verifyToken);

// app.use("/cost-categories", costCategoryRoutes);
// app.use("/cost-items", costItemRoutes);
// app.use("/cost-allocations", costAllocationRoutes);
app.use("/users", userRoutes);
// app.use("/vendors", vendorRoutes);
app.use("/raw-material", rawMaterialRoutes);
app.use("/labors", laborRoutes);
app.use("/utilities", utilityRoutes);
app.use("/overheads", overheadRoutes);
app.use("/machines", machineRoutes);
app.use("/calculate-project-cost", costCalculationRoutes);
app.use("/project-cost", projectCostRoutes);

// GLOBAL ERROR HANDLER — MUST BE LAST
app.use(errorHandler);

export default app;
