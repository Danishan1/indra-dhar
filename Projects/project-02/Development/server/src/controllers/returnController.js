// // controllers/return.controller.js
// import { Item } from "../models/Item.js";
// import mongoose from "mongoose";
// import { ReturnRequest } from "../models/ReturnRequest.js";

// /**
//  * Get all pending return requests for current tenant
//  */
// export const listPendingReturns = async (req, res) => {
//   try {
//     const tenantId = req.user.tenantId;

//     const requests = await ReturnRequest.find({ tenantId, status: "PENDING" })
//       .populate("itemIds", "trackingId currentPhaseId")
//       .populate("fromPhaseId", "name")
//       .populate("toPhaseId", "name")
//       .populate("requestedBy", "name")
//       .sort({ createdAt: -1 });

//     res.json(requests);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * Approve a return request
//  */
// export const approveReturn = async (req, res) => {
//   try {
//     const tenantId = req.user.tenantId;
//     const { returnRequestId } = req.params;

//     if (!mongoose.isValidObjectId(returnRequestId)) {
//       return res.status(400).json({ error: "Invalid return request ID" });
//     }

//     const request = await ReturnRequest.findOne({
//       _id: returnRequestId,
//       tenantId,
//       status: "PENDING",
//     });

//     if (!request) {
//       return res
//         .status(404)
//         .json({ error: "Return request not found or already processed" });
//     }

//     // Update all items to the target phase
//     await Item.updateMany(
//       { _id: { $in: request.itemIds } },
//       {
//         $set: { currentPhaseId: request.toPhaseId },
//         $push: {
//           history: {
//             phaseId: request.toPhaseId,
//             userId: req.user._id,
//             action: "RETURN_ACCEPTED",
//           },
//         },
//       }
//     );

//     // Mark return request as accepted
//     request.status = "ACCEPTED";
//     request.approvedBy = req.user._id;
//     await request.save();

//     res.json({ message: "Return request approved", request });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// /**
//  * Reject a return request
//  */
// export const rejectReturn = async (req, res) => {
//   try {
//     const tenantId = req.user.tenantId;
//     const { returnRequestId } = req.params;
//     const { note } = req.body;

//     if (!mongoose.isValidObjectId(returnRequestId)) {
//       return res.status(400).json({ error: "Invalid return request ID" });
//     }

//     const request = await ReturnRequest.findOne({
//       _id: returnRequestId,
//       tenantId,
//       status: "PENDING",
//     });

//     if (!request) {
//       return res
//         .status(404)
//         .json({ error: "Return request not found or already processed" });
//     }

//     // Mark rejection in item history
//     await Item.updateMany(
//       { _id: { $in: request.itemIds } },
//       {
//         $push: {
//           history: {
//             phaseId: request.fromPhaseId,
//             userId: req.user._id,
//             action: "RETURN_REJECTED",
//             note,
//           },
//         },
//       }
//     );

//     // Mark return request as rejected
//     request.status = "REJECTED";
//     request.approvedBy = req.user._id;
//     await request.save();

//     res.json({ message: "Return request rejected", request });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
