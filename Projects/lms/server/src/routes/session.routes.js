import { Router } from "express";
import { SessionController } from "../controllers/session.controller.js";

const router = Router();

/**
 * @openapi
 * /sessions:
 *   get:
 *     tags: [Session]
 *     summary: Get active sessions
 */
router.get("/", SessionController.list);

/**
 * @openapi
 * /sessions/{id}:
 *   delete:
 *     tags: [Session]
 *     summary: Revoke session
 */
router.delete("/:id", SessionController.revoke);

/**
 * @openapi
 * /sessions:
 *   delete:
 *     tags: [Session]
 *     summary: Revoke all sessions
 */
router.delete("/", SessionController.revokeAll);

export default router;
