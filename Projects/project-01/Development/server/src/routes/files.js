import { Router } from "express";
import { relative, join } from "path";
import { existsSync } from "fs";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { upload, processImage } from "../utils/fileStorage.js";
import { Item } from "../models/Item.js";

const router = Router();

// upload images for a given item
// route: POST /api/files/:tenantId/items/:itemId/upload
router.post(
  "/:tenantId/items/:itemId/upload",
  authMiddleware,
  permit("ADMIN", "PHASE_HEAD", "OPERATOR"),
  upload.array("images", 10),
  async (req, res, next) => {
    try {
      const { tenantId, itemId } = req.params;

      // basic checks: tenant match
      if (req.user.tenantId.toString() !== tenantId) {
        return res.status(403).json({ message: "Tenant mismatch" });
      }

      const item = await Item.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const files = req.files || [];
      for (const f of files) {
        try {
          await processImage(f.path);
        } catch (e) {
          console.warn("image process failed", e);
        }
        const rel = relative(process.cwd(), f.path);
        item.images.push(rel);
      }

      await item.save();
      res.json({ uploaded: files.length, files: item.images });
    } catch (err) {
      next(err);
    }
  }
);

// serve file but ensure tenant validity (optional)
// GET /api/files/:tenantId/items/:itemId/:filename
router.get(
  "/:tenantId/items/:itemId/:filename",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { tenantId, itemId, filename } = req.params;

      if (req.user.tenantId.toString() !== tenantId) {
        return res.status(403).json({ message: "Tenant mismatch" });
      }

      const full = join(
        process.cwd(),
        process.env.UPLOAD_DIR || "uploads",
        tenantId,
        "items",
        itemId,
        filename
      );

      if (!existsSync(full)) {
        return res.status(404).json({ message: "Not found" });
      }

      res.sendFile(full);
    } catch (err) {
      next(err);
    }
  }
);

export const fileRoutes = router;
