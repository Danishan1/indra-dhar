import { Router } from "express";
import { AuditController } from "../controllers/audit.controller.js";

const router = Router();

/**
 * Get audit logs
 */
router.get("/", AuditController.list);

/**
 * Get audit logs by entity
 */
router.get("/entity/:type/:id", AuditController.getByEntity);

/**
 * Get user audit trail
 */
router.get("/user/:userId", AuditController.getByUser);

export default router;
