import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { permit } from "../middleware/roles.js";
import Phase from "../models/Phase.js";
import ItemFormTemplate from "../models/ItemFormTemplate.js";

const router = Router();

// create phase
router.post(
  "/phase",
  authMiddleware,
  permit("ADMIN"),
  async (req, res, next) => {
    try {
      const { name, sequenceOrder } = req.body;
      const phase = await Phase.create({
        tenantId: req.user.tenantId,
        name,
        sequenceOrder,
        users: [],
      });
      res.status(201).json(phase);
    } catch (err) {
      next(err);
    }
  }
);

// create template
router.post(
  "/form-template",
  authMiddleware,
  permit("ADMIN"),
  async (req, res, next) => {
    try {
      const { name, fields } = req.body;
      const tpl = await ItemFormTemplate.create({
        tenantId: req.user.tenantId,
        name,
        fields,
      });
      res.status(201).json(tpl);
    } catch (err) {
      next(err);
    }
  }
);

export const adminRoutes = router;
