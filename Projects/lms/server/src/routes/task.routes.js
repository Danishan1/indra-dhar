import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";

const router = Router();

/**
 * Create task
 */
router.post("/", TaskController.create);

/**
 * List tasks (filters: assigned_to, status, due_date)
 */
router.get("/", TaskController.list);

/**
 * Get task by id
 */
router.get("/:id", TaskController.getById);

/**
 * Update task
 */
router.patch("/:id", TaskController.update);

/**
 * Delete task
 */
router.delete("/:id", TaskController.remove);
/**
 * Assign / reassign task
 */
router.post("/:id/assign", TaskController.assign);

/**
 * Change task status
 */
router.post("/:id/status", TaskController.changeStatus);

/**
 * Set task outcome (used for CRM automation)
 */
router.post("/:id/outcome", TaskController.setOutcome);

/**
 * Add comment
 */
router.post("/:id/comments", TaskController.addComment);

/**
 * Get comments
 */
router.get("/:id/comments", TaskController.getComments);

/**
 * Get task history
 */
router.get("/:id/history", TaskController.history);

export default router;
