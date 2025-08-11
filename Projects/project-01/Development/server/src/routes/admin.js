import { Router } from "express";
import {
  createPhase,
  updatePhase,
  deletePhase,
  createUser,
  updateUser,
  deleteUser,
  createFormTemplate,
  listUsers,
  getPhasesByTenant,
  getUserByEmail,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { validate } from "../middleware/validate.js";

import {
  createPhaseSchema,
  updatePhaseSchema,
  createUserSchema,
  updateUserSchema,
  createFormTemplateSchema,
} from "../validations/admin.validation.js";

const router = Router();

// All admin routes require auth + ADMIN role
router.use(authMiddleware);
router.use(permit("admin"));

// ---- Phase management ----
router.post("/phases", validate(createPhaseSchema), createPhase);
router.get("/phases", getPhasesByTenant);
router.get("/phases/:phaseId", getPhasesByTenant);
router.put("/phases/:id", validate(updatePhaseSchema), updatePhase);
router.delete("/phases/:id", deletePhase);

// ---- User management ----
router.post("/users", validate(createUserSchema), createUser);
router.get("/users", listUsers);
router.get("/users/:email", getUserByEmail);
router.put("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:email", deleteUser);

// ---- Form management ----
router.post("/forms", validate(createFormTemplateSchema), createFormTemplate);

export const adminRoutes = router;
