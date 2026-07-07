import FacebookRoutes from "./facebook.routes.js";
import IndiamartRoutes from "./indiamart.routes.js";

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { receiveFormLead } from "../controllers/form.controller.js";

const router = Router();

router.use("/facebook", FacebookRoutes);
router.use("/indiamart", IndiamartRoutes);

/**
 * @swagger
 * /webhooks/form:
 *   post:
 *     summary: Receive custom form lead
 *     tags: [Integrations]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lead received
 */
router.post("/webhooks/form", receiveFormLead);

export default router;
