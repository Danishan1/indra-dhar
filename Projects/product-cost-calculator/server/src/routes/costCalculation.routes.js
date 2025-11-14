import express from "express";
import { CostCalculationController as CCC } from "../controllers/costCalculation.controller.js";
import { calculateCostValidator as CCV } from "../validators/costCalculation.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CCV, validateRequest, CCC.calculate);

export const costCalculationRoutes = router;
