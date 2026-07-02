import { Router } from "express";
import { TenantController } from "../controllers/tenant.controller.js";

const router = Router();

/**
 * Create Tenant
 */
router.post("/", TenantController.create);

/**
 * Get all tenants (super admin only)
 */
router.get("/", TenantController.list);

/**
 * Get tenant by id
 */
router.get("/:id", TenantController.getById);

/**
 * Update tenant
 */
router.patch("/:id", TenantController.update);

/**
 * Soft delete / suspend tenant
 */
router.delete("/:id", TenantController.remove);

export default router;
