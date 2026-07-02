import { Router } from "express";
import { WorkflowController } from "../controllers/workflow.controller.js";

const router = Router();

/**
 * Create workflow rule
 */
router.post("/", WorkflowController.createRule);

/**
 * List rules
 */
router.get("/", WorkflowController.listRules);

/**
 * Get rule detail
 */
router.get("/:id", WorkflowController.getRule);

/**
 * Update rule
 */
router.patch("/:id", WorkflowController.updateRule);

/**
 * Delete rule
 */
router.delete("/:id", WorkflowController.deleteRule);

/**
 * Add condition
 */
router.post("/:id/conditions", WorkflowController.addCondition);

/**
 * Add action
 */
router.post("/:id/actions", WorkflowController.addAction);

/**
 * Manually trigger workflow (debug/admin)
 */
router.post("/:id/execute", WorkflowController.executeRule);

/**
 * Get execution logs
 */
router.get("/executions", WorkflowController.executions);

export default router;
