import express from "express";
import { CostAllocationController as CAC } from "../controllers/costAllocation.controller.js";
import {
  createAllocationValidator as CAV,
  updateAllocationValidator as UAV,
} from "../validators/costAllocation.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CAV, validateRequest, CAC.create);
router.get("/", CAC.getAll);
router.get("/:id", CAC.getOne);
router.put("/:id", UAV, validateRequest, CAC.update);
router.delete("/:id", CAC.remove);

export const costAllocationRoutes = router;
