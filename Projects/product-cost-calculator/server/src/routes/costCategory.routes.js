// routes/costCategory.routes.js
import express from "express";
import { CostCategoryController as CCC } from "../controllers/costCategory.controller.js";
import {
  createCategoryValidator as CCV,
  updateCategoryValidator as UCV,
} from "../validators/costCategory.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CCV, validateRequest, CCC.create);
router.get("/", CCC.getAll);
router.get("/:id", CCC.getOne);
router.put("/:id", UCV, validateRequest, CCC.update);
router.delete("/:id", CCC.remove);

export const costCategoryRoutes = router;


