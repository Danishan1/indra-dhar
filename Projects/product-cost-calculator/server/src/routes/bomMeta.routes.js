import express from "express";
import { BomMetaController as BMC } from "../controllers/bomMeta.controller.js";
import { createBomMetaValidator as CBMV } from "../validators/bomMeta.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { onlyAdminManager as OAM } from "../middlewares/onlyTop.middleware.js";

const router = express.Router();

router.post("/", OAM, CBMV, validateRequest, BMC.create);
router.get("/", BMC.getAll);
router.get("/:id", BMC.getOne);
router.put("/:id", OAM, CBMV, validateRequest, BMC.update);
router.delete("/:id", OAM, BMC.remove);

export const bomMetaRoutes = router;
