import mongoose from "mongoose";
import { BulkItem } from "../models/BulkItem.js";
import { Phase } from "../models/Phase.js";
import { Tenant } from "../models/Tenant.js";

export const getDashboardData = async (req, res) => {
  try {
    const { tenantId, _id: userId, name, role, email } = req.user;

    // Fetch tenant name
    const tenant = await Tenant.findById(tenantId).lean();

    // Get all phases for this tenant
    const phases = await Phase.find({ tenantId }).lean();

    // Aggregate BulkItem data by phase
    const bulkItems = await BulkItem.aggregate([
      {
        $match: {
          tenantId: new mongoose.Types.ObjectId(tenantId), // Match tenantId
        },
      },
      {
        $lookup: {
          from: "phases", // Reference to the 'Phase' collection
          localField: "phaseId",
          foreignField: "_id",
          as: "phaseDetails",
        },
      },
      {
        $unwind: {
          path: "$phaseDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$phaseId",
          totalPending: { $sum: { $size: "$pendingItemIds" } }, // Count of items in pending state
          totalCompleted: { $sum: { $size: "$completedItemIds" } }, // Count of items in completed state
          totalOrders: { $sum: 1 }, // Count of BulkItem records
          pendingOrders: {
            $sum: { $cond: [{ $gt: [{ $size: "$pendingItemIds" }, 0] }, 1, 0] }, // Count of BulkItem records with pending items
          },
          completedOrders: {
            $sum: {
              $cond: [{ $gt: [{ $size: "$completedItemIds" }, 0] }, 1, 0],
            }, // Count of BulkItem records with completed items
          },
        },
      },
    ]);

    // Map bulk item data to phase data
    const bulkItemMap = {};
    bulkItems.forEach((item) => {
      bulkItemMap[item._id.toString()] = item;
    });

    // Prepare phase summary data
    const phaseSummary = phases.map((phase, idx) => {
      const bulkData = bulkItemMap[phase._id.toString()] || {};

      return {
        phaseNumber: idx + 1,
        phaseId: phase._id.toString(),
        phaseName: phase.name,
        items: {
          total: (bulkData.totalPending || 0) + (bulkData.totalCompleted || 0),
          pending: bulkData.totalPending || 0,
          completed: bulkData.totalCompleted || 0,
        },
        orders: {
          totalOrders: bulkData.totalOrders || 0,
          pendingOrders: bulkData.pendingOrders || 0,
          completedOrders: bulkData.completedOrders || 0,
        },
      };
    });

    // Send response
    res.json({
      user: {
        name,
        role,
        email,
        tenantName: tenant?.name || "",
      },
      phases: phaseSummary,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
