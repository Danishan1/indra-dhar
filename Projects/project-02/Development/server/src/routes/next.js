import { Router } from "express";
import { newPO } from "../controllers/nextController.js";
const router = Router();

router.post("/new-po", newPO);


export const nextRoutes = router;
