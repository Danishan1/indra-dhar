import express from "express";
import { RawMaterialController as RMC } from "../controllers/rawMaterial.controller.js";
import {
  createMaterialValidator as CMV,
  updateMaterialValidator as UMV,
} from "../validators/rawMaterial.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CMV, validateRequest, RMC.create);
router.get("/", RMC.getAll);
router.get("/:id", RMC.getOne);
router.put("/:id", UMV, validateRequest, RMC.update);
router.delete("/:id", RMC.remove);

export const rawMaterialRoutes = router;
