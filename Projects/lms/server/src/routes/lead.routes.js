import { Router } from "express";
import { LeadController } from "../controllers/lead.controller.js";
import { upload } from "../utils/upload.js";

const router = Router();

/**
 * Create lead
 */
router.post("/", LeadController.create);

/**
 * List leads (filters, pagination)
 */
router.get("/", LeadController.list);

/**
 * Get lead by id
 */
router.get("/:id", LeadController.getById);

/**
 * Update lead
 */
router.patch("/:id", LeadController.update);

/**
 * Delete lead (soft delete recommended)
 */
router.delete("/:id", LeadController.remove);

/**
 * Assign lead to user
 */
router.post("/:id/assign", LeadController.assign);

/**
 * Change stage (pipeline movement)
 */
router.post("/:id/stage", LeadController.changeStage);

/**
 * Mark lead status (Won / Lost / Invalid)
 */
router.post("/:id/status", LeadController.updateStatus);

/**
 * Add note
 */
router.post("/:id/notes", LeadController.addNote);

/**
 * Upload attachment
 */
router.post(
  "/:id/attachments",
  upload.single("file"),
  LeadController.uploadAttachment,
);

/**
 * Get timeline (activities + history)
 */
router.get("/:id/timeline", LeadController.timeline);

/**
 * Duplicate check
 */
router.get("/:id/duplicates", LeadController.checkDuplicates);

export default router;
