import { Router } from "express";

import tenantRoutes from "./tenant.routes.js";
import roleRoutes from "./role.routes.js";
import teamRoutes from "./team.routes.js";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js";
import sessionRoutes from "./session.routes.js";
import activityRoutes from "./activity.routes.js";
import auditRoutes from "./audit.routes.js";
import leadRoutes from "./lead.routes.js";
import notificationRoutes from "./notification.routes.js";
import taskRoutes from "./task.routes.js";
import workflowRoutes from "./workflow.routes.js";
import integrationRoutes from "./integration.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/sessions", sessionRoutes);

router.use("/tenants", tenantRoutes);
router.use("/roles", roleRoutes);
router.use("/teams", teamRoutes);
router.use("/users", userRoutes);
router.use("/activity", activityRoutes);
router.use("/audit", auditRoutes);
router.use("/leads", leadRoutes);
router.use("/notification", notificationRoutes);
router.use("/tasks", taskRoutes);
router.use("/workflow", workflowRoutes);
router.use("/integrations", integrationRoutes);

export default router;
