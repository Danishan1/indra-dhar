import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller.js";

const router = Router();

/**
 * Get all activities (global feed)
 */
router.get("/", ActivityController.list);

/**
 * Get lead-specific timeline
 */
router.get("/lead/:leadId", ActivityController.getByLead);

/**
 * Get entity timeline (lead/task/user/etc.)
 */
router.get("/entity/:type/:id", ActivityController.getByEntity);

/**
 * Create manual activity (rare, admin/system use)
 */
router.post("/", ActivityController.create);

export default router;
