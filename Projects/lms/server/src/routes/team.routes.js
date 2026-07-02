import { Router } from "express";
import { TeamController } from "../controllers/team.controller.js";

const router = Router();

router.get("/", TeamController.list);

router.post("/", TeamController.create);

router.get("/:id", TeamController.getById);

router.patch("/:id", TeamController.update);

router.delete("/:id", TeamController.remove);

/**
 * Get team members
 */
router.get("/:id/members", TeamController.getMembers);

/**
 * Assign manager
 */
router.post("/:id/assign-manager", TeamController.assignManager);

export default router;
