import express from "express";
import { UtilityController as UC } from "../controllers/utility.controller.js";
import {
  createUtilityValidator as CUV,
  updateUtilityValidator as UUV,
  createUtilityBulkValidator as CUBV,
} from "../validators/utility.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, CUV, validateRequest, UC.create);
router.get("/", UC.getAll);
router.get("/:id", UC.getOne);
router.put("/:id", OAM, UUV, validateRequest, UC.update);
router.delete("/:id", OAM, UC.remove);
router.post("/bulk", OAM, CUBV, validateRequest, UC.bulkCreate);

export const utilityRoutes = router;
