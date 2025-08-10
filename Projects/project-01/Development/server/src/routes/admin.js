import { Router } from "express";
import {
  createPhase,
  updatePhase,
  deletePhase,
  createUser,
  updateUser,
  deleteUser,
  createFormTemplate,
  getGlobalDashboard,
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
router.use(permit("ADMIN"));

// ---- Phase management ----
router.post("/phases", validate(createPhaseSchema), createPhase);
router.put("/phases/:id", validate(updatePhaseSchema), updatePhase);
router.delete("/phases/:id", deletePhase);

// ---- User management ----
router.post("/users", validate(createUserSchema), createUser);
router.put("/users/:id", validate(updateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);

// ---- Form management ----
router.post("/forms", validate(createFormTemplateSchema), createFormTemplate);

// ---- Dashboard ----
router.get("/dashboard", getGlobalDashboard);

export const adminRoutes = router;
