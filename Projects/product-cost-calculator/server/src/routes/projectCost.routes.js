import express from "express";
import { ProjectCostController as PCC } from "../controllers/projectCost.controller.js";
import { createProjectCostValidator as CPCV } from "../validators/projectCost.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CPCV, validateRequest, PCC.create);
router.get("/", PCC.getAll);
router.get("/:id", PCC.getOne);
router.delete("/:id", PCC.remove);

export const projectCostRoutes = router;
