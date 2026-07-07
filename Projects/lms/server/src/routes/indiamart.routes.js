import { Router } from "express";
import { receiveIndiaMartLead } from "../controllers/indiamart.controller.js";

const router = Router();

/**
 * @swagger
 * /indiamart/webhook:
 *   post:
 *     summary: Receive IndiaMART lead webhook
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
router.post("/webhook", receiveIndiaMartLead);

export default router;
