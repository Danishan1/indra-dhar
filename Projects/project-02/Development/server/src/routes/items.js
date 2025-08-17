// routes/item.route.js
import express from "express";
import * as itemController from "../controllers/itemController.js";
import * as returnController from "../controllers/returnController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authMiddleware);

// --- ITEM ROUTES ---
router.get("/dashboard", getDashboardData); // Dashboard (GET)
router.post("/", itemController.createItem); // Create single item
router.get("/", itemController.listItems); // Get all items
router.get("/get-bulk-items/:phaseName", itemController.getBulkItems); // Get all items
router.get("/:id", itemController.getItem); // Get single item by ID
router.post("/move-forward", itemController.moveItem);
router.post("/:id/move-backward", itemController.requestItemReturn);
router.get("/get-phases-before/:phaseName", itemController.getPhasesBefore);

// --- RETURN ROUTES ---
router.get("/returns/pending", returnController.listPendingReturns);
router.put("/returns/:returnRequestId/approve", returnController.approveReturn);
router.put("/returns/:returnRequestId/reject", returnController.rejectReturn);

export const itemRoutes = router;
