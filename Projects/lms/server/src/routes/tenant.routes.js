import { Router } from "express";
import { TenantController } from "../controllers/tenant.controller.js";

const router = Router();

/**
 * @openapi
 * /tenants:
 *   post:
 *     tags: [Tenant]
 *     summary: Create tenant
 */
router.post("/", TenantController.create);

/**
 * @openapi
 * /tenants:
 *   get:
 *     tags: [Tenant]
 *     summary: List tenants
 */
router.get("/", TenantController.list);

/**
 * @openapi
 * /tenants/{id}:
 *   get:
 *     tags: [Tenant]
 *     summary: Get tenant by id
 */
router.get("/:id", TenantController.getById);

/**
 * @openapi
 * /tenants/{id}:
 *   patch:
 *     tags: [Tenant]
 *     summary: Update tenant
 */
router.patch("/:id", TenantController.update);

/**
 * @openapi
 * /tenants/{id}:
 *   delete:
 *     tags: [Tenant]
 *     summary: Suspend or delete tenant
 */
router.delete("/:id", TenantController.remove);

export default router;
