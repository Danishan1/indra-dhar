import { Router } from "express";
import {
  verifyWebhook,
  receiveLeadWebhook,
} from "../controllers/facebook.controller.js";

const router = Router();

/**
 * @swagger
 * /facebook/webhook:
 *   get:
 *     summary: Verify Facebook webhook
 *     tags: [Integrations]
 *     responses:
 *       200:
 *         description: Verified
 */
router.get("/webhook", verifyWebhook);

/**
 * @swagger
 * /facebook/webhook:
 *   post:
 *     summary: Receive Facebook lead webhook
 *     tags: [Integrations]
 *     responses:
 *       200:
 *         description: Lead received
 */
router.post("/webhook", receiveLeadWebhook);

export default router;
