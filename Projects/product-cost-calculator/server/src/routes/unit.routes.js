import express from "express";
import { UnitController as UC } from "../controllers/unit.controller.js";
import {
  createUnitValidator as CUV,
  bulkCreateUnitValidator as BCUV,
  updateUnitValidator as UUV,
} from "../validators/unit.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, CUV, validateRequest, UC.create);
router.get("/", UC.getAll);
router.get("/:id", UC.getOne);
router.put("/:id", OAM, UUV, validateRequest, UC.update);
router.delete("/:id", OAM, UC.remove);
router.post("/bulk", OAM, BCUV, validateRequest, UC.bulkCreate);

export const unitRoutes = router;
