import FacebookRoutes from "./facebook.routes.js";
import IndiamartRoutes from "./indiamart.routes.js";

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { receiveFormLead } from "../controllers/form.controller.js";

const router = Router();

router.use("/facebook", FacebookRoutes);
router.use("/indiamart", IndiamartRoutes);

router.post("/webhooks/form", receiveFormLead);

export default router;
