import { Router } from "express";
import { LeadController } from "../controllers/lead.controller.js";
import { upload } from "../utils/upload.js";

const router = Router();

/**
 * @openapi
 * /leads:
 *   post:
 *     tags: [Lead]
 *     summary: Create lead
 */
router.post("/", LeadController.create);

/**
 * @openapi
 * /leads:
 *   get:
 *     tags: [Lead]
 *     summary: List leads
 */
router.get("/", LeadController.list);

/**
 * @openapi
 * /leads/{id}:
 *   get:
 *     tags: [Lead]
 *     summary: Get lead by id
 */
router.get("/:id", LeadController.getById);

/**
 * @openapi
 * /leads/{id}:
 *   patch:
 *     tags: [Lead]
 *     summary: Update lead
 */
router.patch("/:id", LeadController.update);

/**
 * @openapi
 * /leads/{id}:
 *   delete:
 *     tags: [Lead]
 *     summary: Delete lead
 */
router.delete("/:id", LeadController.remove);

/**
 * @openapi
 * /leads/{id}/assign:
 *   post:
 *     tags: [Lead]
 *     summary: Assign lead to user
 */
router.post("/:id/assign", LeadController.assign);

/**
 * @openapi
 * /leads/{id}/stage:
 *   post:
 *     tags: [Lead]
 *     summary: Change lead stage
 */
router.post("/:id/stage", LeadController.changeStage);

/**
 * @openapi
 * /leads/{id}/status:
 *   post:
 *     tags: [Lead]
 *     summary: Update lead status
 */
router.post("/:id/status", LeadController.updateStatus);

/**
 * @openapi
 * /leads/{id}/notes:
 *   post:
 *     tags: [Lead]
 *     summary: Add note to lead
 */
router.post("/:id/notes", LeadController.addNote);

/**
 * @openapi
 * /leads/{id}/attachments:
 *   post:
 *     tags: [Lead]
 *     summary: Upload attachment
 */
router.post(
  "/:id/attachments",
  upload.single("file"),
  LeadController.uploadAttachment,
);

/**
 * @openapi
 * /leads/{id}/timeline:
 *   get:
 *     tags: [Lead]
 *     summary: Get lead timeline
 */
router.get("/:id/timeline", LeadController.timeline);

/**
 * @openapi
 * /leads/{id}/duplicates:
 *   get:
 *     tags: [Lead]
 *     summary: Check duplicate leads
 */
router.get("/:id/duplicates", LeadController.checkDuplicates);

export default router;
