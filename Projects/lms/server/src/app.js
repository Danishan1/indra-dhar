import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes/index.js";
import publicAuthRoutes from "./routes/auth.public.routes.js";
import publicRoutes from "./routes/public.routes.js";

// import { verifyToken } from "./middlewares/auth.middleware.js";
import path from "path";
import { errorHandler } from "./middlewares/error.middleware.js";
import { notFound } from "./middlewares/notFound.middleware.js";
import { loggerMiddleware } from "./middlewares/logger.middleware.js";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { tenantMiddleware } from "./middlewares/tenant.middleware.js";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.js";

const __dirname = path.resolve();

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://trtcvpc8-3000.inc1.devtunnels.ms",
      "https://7qx1z0nk-3000.inc1.devtunnels.ms",
    ], // allowed frontend URLs
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // if you're using cookies or session auth
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(loggerMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", publicAuthRoutes);
app.use("/", publicRoutes);

// protected routes
app.use(authMiddleware);
app.use(tenantMiddleware);

// Routes
app.use("/", routes);

// 404
app.use(notFound);

// GLOBAL ERROR HANDLER — MUST BE LAST
app.use(errorHandler);

export default app;
