import { Router } from "express";

import tenantRoutes from "./tenant.routes.js";
import roleRoutes from "./role.routes.js";
import teamRoutes from "./team.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import sessionRoutes from "./session.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);

router.use("/tenants", tenantRoutes);
router.use("/roles", roleRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);

export default router;
