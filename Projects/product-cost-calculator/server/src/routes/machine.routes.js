import express from "express";
import { MachineController as MC } from "../controllers/machine.controller.js";
import {
  createMachineValidator as CMV,
  updateMachineValidator as UMV,
} from "../validators/machine.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CMV, validateRequest, MC.create);
router.get("/", MC.getAll);
router.get("/:id", MC.getOne);
router.put("/:id", UMV, validateRequest, MC.update);
router.delete("/:id", MC.remove);

export const machineRoutes = router;
