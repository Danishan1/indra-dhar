import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";

const router = Router();

/**
 * @openapi
 * /audits:
 *   get:
 *     tags: [Audit]
 *     summary: Get audit logs
 */
router.get("/", AuditController.list);

/**
 * @openapi
 * /audits/entity/{type}/{id}:
 *   get:
 *     tags: [Audit]
 *     summary: Get audit logs by entity
 */
router.get("/entity/:type/:id", AuditController.getByEntity);

/**
 * @openapi
 * /audits/user/{userId}:
 *   get:
 *     tags: [Audit]
 *     summary: Get user audit trail
 */
router.get("/user/:userId", AuditController.getByUser);

export default router;
