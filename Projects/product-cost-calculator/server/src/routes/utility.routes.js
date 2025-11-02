import express from "express";
import { UtilityController as UC } from "../controllers/utility.controller.js";
import {
  createUtilityValidator as CUV,
  updateUtilityValidator as UUV,
} from "../validators/utility.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CUV, validateRequest, UC.create);
router.get("/", UC.getAll);
router.get("/:id", UC.getOne);
router.put("/:id", UUV, validateRequest, UC.update);
router.delete("/:id", UC.remove);

export const utilityRoutes = router;
