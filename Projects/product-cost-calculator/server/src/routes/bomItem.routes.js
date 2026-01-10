import express from "express";
import { BomItemController as BIC } from "../controllers/bomItem.controller.js";
import { createBomItemValidator as CBIV } from "../validators/bomItem.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CBIV, validateRequest, BIC.create);
router.get("/:itemId", BIC.getOne);
router.get("/bom/:bomId", BIC.getByBom);
router.put("/:id", CBIV, validateRequest, BIC.update); // 🔥 row-level update
router.delete("/:id", BIC.remove);

export const bomItemRoutes = router;
