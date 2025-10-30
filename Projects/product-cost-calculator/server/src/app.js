import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
// import { costCategoryRoutes } from "./routes/costCategory.routes.js";
// import { costItemRoutes } from "./routes/costItem.routes.js";
// import { costAllocationRoutes } from "./routes/costAllocation.routes.js";
import { userRoutes } from "./routes/user.routes.js";
import { laborRoutes } from "./routes/labor.routes.js";
import { rawMaterialRoutes } from "./routes/rawMaterial.routes.js";
import { vendorRoutes } from "./routes/vendor.routes.js";

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

// Routes
app.use("/auth", authRoutes);
// app.use("/cost-categories", costCategoryRoutes);
// app.use("/cost-items", costItemRoutes);
// app.use("/cost-allocations", costAllocationRoutes);
app.use("/users", userRoutes);
app.use("/vendors", vendorRoutes);
app.use("/raw-material", rawMaterialRoutes);
app.use("/labors", laborRoutes);

export default app;
