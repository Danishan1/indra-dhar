import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller.js";

const router = Router();

/**
 * @openapi
 * /activities:
 *   get:
 *     tags: [Activity]
 *     summary: Get all activities
 */
router.get("/", ActivityController.list);

/**
 * @openapi
 * /activities/lead/{leadId}:
 *   get:
 *     tags: [Activity]
 *     summary: Get lead timeline
 */
router.get("/lead/:leadId", ActivityController.getByLead);

/**
 * @openapi
 * /activities/entity/{type}/{id}:
 *   get:
 *     tags: [Activity]
 *     summary: Get entity timeline
 */
router.get("/entity/:type/:id", ActivityController.getByEntity);

/**
 * @openapi
 * /activities:
 *   post:
 *     tags: [Activity]
 *     summary: Create activity
 */
router.post("/", ActivityController.create);

export default router;
