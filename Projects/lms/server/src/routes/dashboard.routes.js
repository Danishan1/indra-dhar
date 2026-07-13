import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller.js";

const router = Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary:
 *       Get dashboard overview
 */
router.get("/", DashboardController.overview);

export default router;
