import express from "express";
import { LaborController as LC } from "../controllers/labor.controller.js";
import {
  createLaborValidator as CLV,
  updateLaborValidator as ULV,
  createLaborBulkValidator as CLBV,
} from "../validators/labor.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CLV, validateRequest, LC.create);
router.get("/", LC.getAll);
router.get("/:id", LC.getOne);
router.put("/:id", ULV, validateRequest, LC.update);
router.delete("/:id", LC.remove);
router.post("/bulk", CLBV, validateRequest, LC.bulkCreate);
export const laborRoutes = router;
