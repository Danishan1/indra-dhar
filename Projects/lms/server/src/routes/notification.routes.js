import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller.js";

const router = Router();

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags: [Notification]
 *     summary: Get user notifications
 */
router.get("/", NotificationController.list);

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     tags: [Notification]
 *     summary: Mark notification as read
 */
router.patch("/:id/read", NotificationController.markAsRead);

/**
 * @openapi
 * /notifications/{id}/archive:
 *   patch:
 *     tags: [Notification]
 *     summary: Archive notification
 */
router.patch("/:id/archive", NotificationController.archive);

/**
 * @openapi
 * /notifications:
 *   post:
 *     tags: [Notification]
 *     summary: Create notification
 */
router.post("/", NotificationController.create);

/**
 * @openapi
 * /notifications/mark-read:
 *   post:
 *     tags: [Notification]
 *     summary: Bulk mark notifications as read
 */
router.post("/mark-read", NotificationController.bulkMarkRead);

export default router;
