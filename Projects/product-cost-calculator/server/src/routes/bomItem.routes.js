import express from "express";
import { BomItemController as BIC } from "../controllers/bomItem.controller.js";
import {
  createBomItemValidator as CBIV,
  createBomItemBulkValidator as CBBIV,
} from "../validators/bomItem.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, CBIV, validateRequest, BIC.create);
router.get("/:itemId", BIC.getOne);
router.get("/bom/:bomId", BIC.getByBom);
router.put("/:id", OAM, CBIV, validateRequest, BIC.update); // 🔥 row-level update
router.delete("/:id", OAM, BIC.remove);
router.post("/bulk", OAM, CBBIV, validateRequest, BIC.bulkCreate);

export const bomItemRoutes = router;
