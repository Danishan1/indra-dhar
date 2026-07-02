import { Router } from "express";
import { RoleController } from "../controllers/role.controller.js";

const router = Router();

/**
 * @openapi
 * /roles:
 *   get:
 *     tags: [Role]
 *     summary: Get roles for current tenant
 */
router.get("/", RoleController.list);

/**
 * @openapi
 * /roles:
 *   post:
 *     tags: [Role]
 *     summary: Create role
 */
router.post("/", RoleController.create);

/**
 * @openapi
 * /roles/{id}:
 *   get:
 *     tags: [Role]
 *     summary: Get role by id
 */
router.get("/:id", RoleController.getById);

/**
 * @openapi
 * /roles/{id}:
 *   patch:
 *     tags: [Role]
 *     summary: Update role
 */
router.patch("/:id", RoleController.update);

/**
 * @openapi
 * /roles/{id}:
 *   delete:
 *     tags: [Role]
 *     summary: Delete role
 */
router.delete("/:id", RoleController.remove);

export default router;
