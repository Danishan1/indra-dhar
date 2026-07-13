import { Router } from "express";
import { TeamController } from "../controllers/team.controller.js";

const router = Router();

/**
 * @openapi
 * /teams:
 *   get:
 *     tags: [Team]
 *     summary: List all teams
 */
router.get("/", TeamController.list);

/**
 * @openapi
 * /teams:
 *   post:
 *     tags: [Team]
 *     summary: Create a team
 */
router.post("/", TeamController.create);

/**
 * @openapi
 * /teams/assignable:
 *   get:
 *     tags: [Team]
 *     summary: Get Assignable teams
 */
router.get("/assignable", TeamController.getAssignableTeams);

/**
 * @openapi
 * /teams/{id}:
 *   get:
 *     tags: [Team]
 *     summary: Get team details
 */
router.get("/:id", TeamController.getById);

/**
 * @openapi
 * /teams/{id}:
 *   patch:
 *     tags: [Team]
 *     summary: Update a team
 */
router.patch("/:id", TeamController.update);

/**
 * @openapi
 * /teams/{id}:
 *   delete:
 *     tags: [Team]
 *     summary: Delete a team
 */
router.delete("/:id", TeamController.remove);

/**
 * @openapi
 * /teams/{id}/members:
 *   get:
 *     tags: [Team]
 *     summary: List team members
 */
router.get("/:id/members", TeamController.listMembers);

/**
 * @openapi
 * /teams/{id}/members:
 *   post:
 *     tags: [Team]
 *     summary: Add a member to the team
 */
router.post("/:id/members", TeamController.addMember);

/**
 * @openapi
 * /teams/{id}/members/{userId}:
 *   delete:
 *     tags: [Team]
 *     summary: Remove a member from the team
 */
router.delete("/:id/members/:userId", TeamController.removeMember);

/**
 * @openapi
 * /teams/{id}/leader:
 *   patch:
 *     tags: [Team]
 *     summary: Promote or demote a team leader
 */
router.patch("/:id/leader", TeamController.setLeader);

/**
 * @openapi
 * /teams/{id}/children:
 *   get:
 *     tags: [Team]
 *     summary: List child teams
 */
router.get("/:id/children", TeamController.listChildren);

export default router;
