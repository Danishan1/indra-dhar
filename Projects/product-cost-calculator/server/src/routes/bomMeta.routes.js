import express from "express";
import { BomMetaController as BMC } from "../controllers/bomMeta.controller.js";
import { createBomMetaValidator as CBMV } from "../validators/bomMeta.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post("/", CBMV, validateRequest, BMC.create);
router.get("/", BMC.getAll);
router.get("/:id", BMC.getOne);
router.put("/:id", CBMV, validateRequest, BMC.update);
router.delete("/:id", BMC.remove);

export const bomMetaRoutes = router;
