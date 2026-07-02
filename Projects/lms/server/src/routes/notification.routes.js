import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";

const router = Router();

/**
 * Get user notifications
 */
router.get("/", NotificationController.list);

/**
 * Mark as read
 */
router.patch("/:id/read", NotificationController.markAsRead);

/**
 * Archive notification
 */
router.patch("/:id/archive", NotificationController.archive);

/**
 * Create notification (system/admin only)
 */
router.post("/", NotificationController.create);

/**
 * Bulk mark as read
 */
router.post("/mark-read", NotificationController.bulkMarkRead);

export default router;
