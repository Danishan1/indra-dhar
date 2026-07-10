import { Router } from "express";
import { WorkflowController } from "../controllers/workflow.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Workflow
 */

/**
 * @swagger
 * /workflow:
 *   get:
 *     tags:
 *       - Workflow
 *     summary: List workflows
 */
router.get("/", WorkflowController.list);

/**
 * @swagger
 * /workflow/{key}:
 *   put:
 *     tags:
 *       - Workflow
 *     summary: Update workflow
 */
router.put("/:key", WorkflowController.update);

/**
 * @swagger
 * /workflow/executions:
 *   get:
 *     tags:
 *       - Workflow
 *     summary: List executions
 */
router.get("/executions", WorkflowController.executions);

/**
 * @swagger
 * /workflow/executions/{id}:
 *   get:
 *     tags:
 *       - Workflow
 *     summary: Get execution
 */
router.get("/executions/:id", WorkflowController.execution);

/**
 * @swagger
 * /workflow/catalog:
 *   get:
 *     tags:
 *       - Workflow
 *     summary: List workflow catalog
 */
router.get("/catalog", WorkflowController.catalog);

/**
 * @swagger
 * /workflow/{key}/install:
 *   post:
 *     tags:
 *       - Workflow
 *     summary: Install workflow
 */
router.post("/:key/install", WorkflowController.install);

/**
 * @swagger
 * /workflow/{key}:
 *   delete:
 *     tags:
 *       - Workflow
 *     summary: Remove workflow
 */
router.delete("/:key", WorkflowController.remove);

export default router;
