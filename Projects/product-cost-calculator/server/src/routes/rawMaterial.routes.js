import express from "express";
import { RawMaterialController as RMC } from "../controllers/rawMaterial.controller.js";
import {
  createMaterialValidator as CMV,
  updateMaterialValidator as UMV,
  createMaterialBulkValidator as CMBV,
} from "../validators/rawMaterial.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, CMV, validateRequest, RMC.create);
router.get("/", RMC.getAll);
router.get("/:id", RMC.getOne);
router.put("/:id", OAM, UMV, validateRequest, RMC.update);
router.delete("/:id", OAM, RMC.remove);
router.post("/bulk", OAM, CMBV, validateRequest, RMC.bulkCreate);

export const rawMaterialRoutes = router;
