import { Router } from "express";

import { receiveIndiaMartLead } from "../controllers/indiamart.controller.js";

const router = Router();

router.post("/webhook", receiveIndiaMartLead);

export default router;
