import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();


/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout user
 */
router.post("/logout", AuthController.logout);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset password
 */
router.post("/reset-password", AuthController.resetPassword);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user profile
 */
router.get("/me", AuthController.me);

export default router;
