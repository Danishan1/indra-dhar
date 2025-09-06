// routes/item.route.js
import express from "express";
import * as itemController from "../controllers/itemController.js";
import * as returnController from "../controllers/returnController.js";
import { authMiddleware } from "../middleware/auth.js";
import { getDashboardData } from "../controllers/dashboardController.js";
import { uploadFile } from "../middleware/uploadFile.js";

const router = express.Router();

router.use(authMiddleware);

// --- ITEM ROUTES ---
router.get("/dashboard/:timeRange", getDashboardData); // Dashboard (GET)
router.post("/", uploadFile.array("images", 5), itemController.createItem); // Create single item
router.post("/bulk-create", itemController.bulkCreateItems); // Create single item
router.get("/", itemController.listItems); // Get all items
router.get("/get-bulk-items/:phaseName", itemController.getBulkItems); // Get all items
router.get("/:bulkId", itemController.getItem); // Get single item by ID
router.post(
  "/move-forward",
  uploadFile.array("images"),
  itemController.moveItem
);
router.post(
  "/move-backward",
  uploadFile.array("images"),
  itemController.moveItemBackward
);
router.get(
  "/get-phases-before/:phaseName/:bulkId",
  itemController.getPhasesBefore
);
router.post("/acceptedby", itemController.acceptedBy);

// // --- RETURN ROUTES ---
// router.get("/returns/pending", returnController.listPendingReturns);
// router.put("/returns/:returnRequestId/approve", returnController.approveReturn);
// router.put("/returns/:returnRequestId/reject", returnController.rejectReturn);

export const itemRoutes = router;
