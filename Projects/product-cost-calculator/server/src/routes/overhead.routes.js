import express from "express";
import { OverheadController as OC } from "../controllers/overhead.controller.js";
import {
  createOverheadValidator as COV,
  updateOverheadValidator as UOV,
  createOverheadBulkValidator as COBV,
} from "../validators/overhead.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, COV, validateRequest, OC.create);
router.get("/", OC.getAll);
router.get("/:id", OC.getOne);
router.put("/:id", OAM, UOV, validateRequest, OC.update);
router.delete("/:id", OAM, OC.remove);
router.post("/bulk", OAM, COBV, validateRequest, OC.bulkCreate);

export const overheadRoutes = router;
