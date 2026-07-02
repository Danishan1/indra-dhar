import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

/**
 * Login
 */
router.post("/login", AuthController.login);

/**
 * Logout
 */
router.post("/logout", AuthController.logout);

/**
 * Refresh token
 */
router.post("/refresh", AuthController.refresh);

/**
 * Forgot password
 */
router.post("/forgot-password", AuthController.forgotPassword);

/**
 * Reset password
 */
router.post("/reset-password", AuthController.resetPassword);

/**
 * Get my profile
 */
router.get("/me", AuthController.me);

export default router;
