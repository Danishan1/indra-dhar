import express from "express";
import { UnitController as UC } from "../controllers/unit.controller.js";
import {
  createUnitValidator as CUV,
  bulkCreateUnitValidator as BCUV,
  updateUnitValidator as UUV,
} from "../validators/unit.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CUV, validateRequest, UC.create);
router.post("/bulk", BCUV, validateRequest, UC.bulkCreate);
router.get("/", UC.getAll);
router.get("/:id", UC.getOne);
router.put("/:id", UUV, validateRequest, UC.update);
router.delete("/:id", UC.remove);

export const unitRoutes = router;
