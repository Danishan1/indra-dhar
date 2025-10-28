// routes/costItem.routes.js
import express from "express";
import { CostItemController as CTC } from "../controllers/costItem.controller.js";
import {
  createItemValidator as CIV,
  updateItemValidator as UIV,
} from "../validators/costItem.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CIV, validateRequest, CTC.create);
router.get("/", CTC.getAll);
router.get("/:id", CTC.getOne);
router.put("/:id", UIV, validateRequest, CTC.update);
router.delete("/:id", CTC.remove);

export const costItemRoutes = router;
