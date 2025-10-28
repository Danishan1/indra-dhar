import express from "express";
import { UserController as UC } from "../controllers/user.controller.js";
import {
  createUserValidator as CUV,
  updateUserValidator as UUV,
  updatePasswordValidator as UPV,
} from "../validators/user.validator.js";
import { validateRequest } from "../middlewares/validateRequest.js";
// import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

// Register (public or first admin)
router.post("/register", CUV, validateRequest, UC.create);

// Admin/Manager CRUD
// router.use(authenticate);

router.post("/", CUV, validateRequest, UC.create);
router.get("/", UC.getAll);
router.get("/:id", UC.getOne);
router.put("/:id", UUV, validateRequest, UC.update);
router.put("/:id/password", UPV, validateRequest, UC.updatePassword);
router.delete("/:id", UC.remove);

export const userRoutes = router;
