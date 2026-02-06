import express from "express";
import { IndirectExpenseController as OC } from "../controllers/indirectExpence.controller.js";
import {
  createIndirectExpValidator as COV,
  updateIndirectExpValidator as UOV,
  createIndirectExpBulkValidator as COBV,
} from "../validators/indirectExpense.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, COV, validateRequest, OC.create);
router.get("/", OC.getAll);
router.get("/:id", OC.getOne);
router.put("/:id", OAM, UOV, validateRequest, OC.update);
router.delete("/:id", OAM, OC.remove);
router.post("/bulk", OAM, COBV, validateRequest, OC.bulkCreate);

export const indirectExpenseRoutes = router;
