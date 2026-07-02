import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

/**
 * List users in tenant
 */
router.get("/", UserController.list);

/**
 * Create user (admin only)
 */
router.post("/", UserController.create);

/**
 * Get user profile
 */
router.get("/:id", UserController.getById);

/**
 * Update user
 */
router.patch("/:id", UserController.update);

/**
 * Activate / deactivate user
 */
router.patch("/:id/status", UserController.toggleStatus);

/**
 * Assign role
 */
router.patch("/:id/role", UserController.assignRole);

/**
 * Assign team
 */
router.patch("/:id/team", UserController.assignTeam);

export default router;
