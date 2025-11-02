import express from "express";
import { OverheadController as OC } from "../controllers/overhead.controller.js";
import {
  createOverheadValidator as COV,
  updateOverheadValidator as UOV,
} from "../validators/overhead.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", COV, validateRequest, OC.create);
router.get("/", OC.getAll);
router.get("/:id", OC.getOne);
router.put("/:id", UOV, validateRequest, OC.update);
router.delete("/:id", OC.remove);

export const overheadRoutes = router;
