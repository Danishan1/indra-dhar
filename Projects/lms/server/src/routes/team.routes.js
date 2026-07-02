import { Router } from "express";
import { TeamController } from "../controllers/team.controller.js";

const router = Router();

/**
 * @openapi
 * /teams:
 *   get:
 *     tags: [Team]
 *     summary: List teams
 */
router.get("/", TeamController.list);

/**
 * @openapi
 * /teams:
 *   post:
 *     tags: [Team]
 *     summary: Create team
 */
router.post("/", TeamController.create);

/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     tags: [Team]
 *     summary: Get team by id
 */
router.get("/:id", TeamController.getById);

/**
 * @openapi
 * /teams/{id}:
 *   patch:
 *     tags: [Team]
 *     summary: Update team
 */
router.patch("/:id", TeamController.update);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     tags: [Team]
 *     summary: Delete team
 */
router.delete("/:id", TeamController.remove);

/**
 * @openapi
 * /teams/{id}/members:
 *   get:
 *     tags: [Team]
 *     summary: Get team members
 */
router.get("/:id/members", TeamController.getMembers);

/**
 * @openapi
 * /teams/{id}/assign-manager:
 *   post:
 *     tags: [Team]
 *     summary: Assign team manager
 */
router.post("/:id/assign-manager", TeamController.assignManager);

export default router;
