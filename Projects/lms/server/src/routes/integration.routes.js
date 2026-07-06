import { Router } from "express";
import { IntegrationController } from "../controllers/integration.controller.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Integrations
 *   description: Integration management APIs (Facebook, IndiaMART, LMS, etc.)
 */

/**
 * @swagger
 * /integrations:
 *   post:
 *     summary: Create integration
 *     tags: [Integrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created
 */
router.post("/", IntegrationController.create);

/**
 * @swagger
 * /integrations:
 *   get:
 *     summary: List integrations
 *     tags: [Integrations]
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", IntegrationController.list);

/**
 * @swagger
 * /integrations/{id}:
 *   get:
 *     summary: Get integration by id
 *     tags: [Integrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/:id", IntegrationController.getById);

/**
 * @swagger
 * /integrations/{id}:
 *   patch:
 *     summary: Update integration
 *     tags: [Integrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch("/:id", IntegrationController.update);

/**
 * @swagger
 * /integrations/{id}:
 *   delete:
 *     summary: Delete integration
 *     tags: [Integrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 */
router.delete("/:id", IntegrationController.remove);

export default router;
