import express from "express";
import { register, login, checkJwt } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/check-jwt", checkJwt);

export default router;
