import { Router } from "express";
import { SessionController } from "../controllers/session.controller.js";

const router = Router();

/**
 * Get active sessions
 */
router.get("/", SessionController.list);

/**
 * Revoke session
 */
router.delete("/:id", SessionController.revoke);

/**
 * Revoke all sessions
 */
router.delete("/", SessionController.revokeAll);

export default router;
