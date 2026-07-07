import { Router } from "express";
import {
  verifyWebhook,
  receiveLeadWebhook,
} from "../controllers/facebook.controller.js";

const router = Router();

router.get("/webhook", verifyWebhook);
router.post("/webhook", receiveLeadWebhook);

export default router;
