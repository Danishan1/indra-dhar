import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

const router = Router();

/**
 * @openapi
 * /users:
 *   get:
 *     tags: [User]
 *     summary: List users in tenant
 */
router.get("/", UserController.list);

/**
 * @openapi
 * /users:
 *   post:
 *     tags: [User]
 *     summary: Create user
 */
router.post("/", UserController.create);

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     tags: [User]
 *     summary: Get user by id
 */
router.get("/:id", UserController.getById);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     tags: [User]
 *     summary: Update user
 */
router.patch("/:id", UserController.update);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     tags: [User]
 *     summary: Activate or deactivate user
 */
router.patch("/:id/status", UserController.toggleStatus);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     tags: [User]
 *     summary: Assign role to user
 */
router.patch("/:id/role", UserController.assignRole);

/**
 * @openapi
 * /users/{id}/team:
 *   patch:
 *     tags: [User]
 *     summary: Assign user to team
 */
router.patch("/:id/team", UserController.assignTeam);

export default router;
