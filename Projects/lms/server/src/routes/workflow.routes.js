import { Router } from "express";
import { WorkflowController } from "../controllers/workflow.controller.js";

const router = Router();

/**
 * @openapi
 * /workflows:
 *   post:
 *     tags: [Workflow]
 *     summary: Create workflow rule
 */
router.post("/", WorkflowController.createRule);

/**
 * @openapi
 * /workflows:
 *   get:
 *     tags: [Workflow]
 *     summary: List workflow rules
 */
router.get("/", WorkflowController.listRules);

/**
 * @openapi
 * /workflows/{id}:
 *   get:
 *     tags: [Workflow]
 *     summary: Get workflow rule by id
 */
router.get("/:id", WorkflowController.getRule);

/**
 * @openapi
 * /workflows/{id}:
 *   patch:
 *     tags: [Workflow]
 *     summary: Update workflow rule
 */
router.patch("/:id", WorkflowController.updateRule);

/**
 * @openapi
 * /workflows/{id}:
 *   delete:
 *     tags: [Workflow]
 *     summary: Delete workflow rule
 */
router.delete("/:id", WorkflowController.deleteRule);

/**
 * @openapi
 * /workflows/{id}/conditions:
 *   post:
 *     tags: [Workflow]
 *     summary: Add condition to workflow rule
 */
router.post("/:id/conditions", WorkflowController.addCondition);

/**
 * @openapi
 * /workflows/{id}/actions:
 *   post:
 *     tags: [Workflow]
 *     summary: Add action to workflow rule
 */
router.post("/:id/actions", WorkflowController.addAction);

/**
 * @openapi
 * /workflows/{id}/execute:
 *   post:
 *     tags: [Workflow]
 *     summary: Manually execute workflow rule
 */
router.post("/:id/execute", WorkflowController.executeRule);

/**
 * @openapi
 * /workflows/executions:
 *   get:
 *     tags: [Workflow]
 *     summary: Get workflow execution logs
 */
router.get("/executions", WorkflowController.executions);

export default router;
