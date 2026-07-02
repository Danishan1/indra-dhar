import { Router } from "express";
import { RoleController } from "../controllers/role.controller.js";

const router = Router();

/**
 * Get roles of current tenant
 */
router.get("/", RoleController.list);

/**
 * Create role
 */
router.post("/", RoleController.create);

/**
 * Get role by id
 */
router.get("/:id", RoleController.getById);

/**
 * Update role
 */
router.patch("/:id", RoleController.update);

/**
 * Delete role
 */
router.delete("/:id", RoleController.remove);

export default router;
