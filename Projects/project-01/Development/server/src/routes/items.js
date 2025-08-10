import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import { Item } from "../models/Item.js";
import { generateTrackingId } from "../utils/idGenerator.js";
import { Phase } from "../models/Phase.js";

const router = Router();

// create single item at Kora (start)
router.post(
  "/",
  authMiddleware,
  permit("ADMIN", "PHASE_HEAD", "OPERATOR"),
  async (req, res, next) => {
    try {
      const tenantId = req.user.tenantId;
      const { templateId, formData } = req.body;

      // set currentPhaseId = sequenceOrder==1 phase for tenant (Kora)
      const koraPhase = await Phase.findOne({ tenantId, sequenceOrder: 1 });

      const trackingId = await generateTrackingId("global", 6); // returns padded number

      const item = await Item.create({
        tenantId,
        trackingId,
        templateId,
        formData,
        currentPhaseId: koraPhase ? koraPhase._id : null,
        history: [
          {
            phaseId: koraPhase ? koraPhase._id : null,
            userId: req.user._id,
            action: "CREATE",
          },
        ],
      });

      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

// move forward
router.put(
  "/:id/move-forward",
  authMiddleware,
  permit("ADMIN", "PHASE_HEAD", "OPERATOR"),
  async (req, res, next) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: "Item not found" });

      // find next phase for this tenant by sequenceOrder > current
      const currPhase = await Phase.findById(item.currentPhaseId);

      const next = await Phase.findOne({
        tenantId: item.tenantId,
        sequenceOrder: { $gt: currPhase ? currPhase.sequenceOrder : 0 },
      }).sort({ sequenceOrder: 1 });

      if (!next) {
        item.status = "COMPLETED";
        item.history.push({
          phaseId: item.currentPhaseId,
          userId: req.user._id,
          action: "MOVE_FORWARD",
          note: "Completed",
        });
        await item.save();
        return res.json({ message: "Item completed", item });
      }

      item.currentPhaseId = next._id;
      item.history.push({
        phaseId: next._id,
        userId: req.user._id,
        action: "MOVE_FORWARD",
      });
      await item.save();

      // TODO: emit socket event via socket manager
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

export const itemRoutes = router;
