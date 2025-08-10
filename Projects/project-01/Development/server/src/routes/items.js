// routes/item.route.js
import express from "express";
import * as itemController from "../controllers/itemController.js";
import * as returnController from "../controllers/returnController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

router.use(authMiddleware);

// ---------------------
// ITEM ROUTES
// ---------------------
router.post("/", itemController.createItem); // Create single item
router.get("/", itemController.listItems); // Get all items (with filters: phase, status, trackingId, etc.)
router.get("/:id", itemController.getItem); // Get single item by ID
// router.put("/items/:id", itemController.updateItem); // Update item (e.g., formData, images)
router.post("/:id/move-forward", itemController.moveItem); // Move item forward to next phase
router.post("/:id/move-backward", itemController.requestItemReturn); // Move item backward (non-sequential return)
router.post("/dashboard", getDashboardData); // Move item backward (non-sequential return)

// ---------------------
// RETURN ROUTES
// ---------------------
// router.post("/returns/request", returnController.listPendingReturns); // Request a return (single or bulk)
router.get("/returns/pending", returnController.listPendingReturns); // Get all pending return requests
router.put("/returns/:returnRequestId/approve", returnController.approveReturn); // Approve a return request
router.put("/returns/:returnRequestId/reject", returnController.rejectReturn); // Reject a return request

export const itemRoutes = router;
