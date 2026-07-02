import { Router } from "express";
import { TaskController } from "../controllers/task.controller.js";

const router = Router();

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Task]
 *     summary: Create task
 */
router.post("/", TaskController.create);

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Task]
 *     summary: List tasks
 */
router.get("/", TaskController.list);

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Task]
 *     summary: Get task by id
 */
router.get("/:id", TaskController.getById);

/**
 * @openapi
 * /tasks/{id}:
 *   patch:
 *     tags: [Task]
 *     summary: Update task
 */
router.patch("/:id", TaskController.update);

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Task]
 *     summary: Delete task
 */
router.delete("/:id", TaskController.remove);

/**
 * @openapi
 * /tasks/{id}/assign:
 *   post:
 *     tags: [Task]
 *     summary: Assign or reassign task
 */
router.post("/:id/assign", TaskController.assign);

/**
 * @openapi
 * /tasks/{id}/status:
 *   post:
 *     tags: [Task]
 *     summary: Change task status
 */
router.post("/:id/status", TaskController.changeStatus);

/**
 * @openapi
 * /tasks/{id}/outcome:
 *   post:
 *     tags: [Task]
 *     summary: Set task outcome
 */
router.post("/:id/outcome", TaskController.setOutcome);

/**
 * @openapi
 * /tasks/{id}/comments:
 *   post:
 *     tags: [Task]
 *     summary: Add comment to task
 */
router.post("/:id/comments", TaskController.addComment);

/**
 * @openapi
 * /tasks/{id}/comments:
 *   get:
 *     tags: [Task]
 *     summary: Get task comments
 */
router.get("/:id/comments", TaskController.getComments);

/**
 * @openapi
 * /tasks/{id}/history:
 *   get:
 *     tags: [Task]
 *     summary: Get task history
 */
router.get("/:id/history", TaskController.history);

export default router;
