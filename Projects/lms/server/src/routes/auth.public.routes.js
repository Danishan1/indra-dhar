import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 */
router.post("/login", AuthController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh access token
 */
router.get("/refresh", AuthController.refresh);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send password reset link
 */
router.post("/forgot-password", AuthController.forgotPassword);

export default router;
