import mongoose from "mongoose";
import { BulkItem } from "../models/BulkItem.js";
import { Phase } from "../models/Phase.js";
import { Tenant } from "../models/Tenant.js";

const timeRangeToDate = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case "10 Year":
      return new Date(now.setFullYear(now.getFullYear() - 10));
    case "5 Year":
      return new Date(now.setFullYear(now.getFullYear() - 5));
    case "2 Year":
      return new Date(now.setFullYear(now.getFullYear() - 2));
    case "1 Year":
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case "6 Months":
      return new Date(now.setMonth(now.getMonth() - 6));
    case "3 Months":
      return new Date(now.setMonth(now.getMonth() - 3));
    case "1 Months":
      return new Date(now.setMonth(now.getMonth() - 1));
    case "1 Week":
      return new Date(now.setDate(now.getDate() - 7));
    default:
      return null; // no filter
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { tenantId, _id: userId, name, role, email } = req.user;
    const { timeRange } = req.params;

    // Fetch tenant name
    const tenant = await Tenant.findById(tenantId).lean();

    // Get all phases for this tenant
    const phases = await Phase.find({ tenantId }).lean();

    // Prepare date filter
    const startDate = timeRangeToDate(timeRange);
    const matchStage = {
      tenantId: new mongoose.Types.ObjectId(tenantId),
    };
    if (startDate) {
      matchStage.createdAt = { $gte: startDate };
    }

    // Aggregate BulkItem data by phase
    const bulkItems = await BulkItem.aggregate([
      {
        $match: matchStage,
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
          totalPending: { $sum: { $size: "$pendingItemIds" } },
          totalCompleted: { $sum: { $size: "$completedItemIds" } },
          totalOrders: { $sum: 1 },
          pendingOrders: {
            $sum: { $cond: [{ $gt: [{ $size: "$pendingItemIds" }, 0] }, 1, 0] },
          },
          completedOrders: {
            $sum: {
              $cond: [{ $eq: [{ $size: "$pendingItemIds" }, 0] }, 1, 0],
            },
          },
        },
      },
    ]);

    // Map bulk item data to phase data
    const bulkItemMap = {};
    bulkItems.forEach((item) => {
      bulkItemMap[item._id?.toString()] = item;
    });

    // Prepare phase summary data
    const phaseSummary = phases
      .filter((p) => p.name !== "Po")
      .map((phase, idx) => {
        const bulkData = bulkItemMap[phase._id.toString()] || {};

        return {
          phaseNumber: idx + 1,
          phaseId: phase._id.toString(),
          phaseName: phase.name,
          items: {
            total:
              (bulkData.totalPending || 0) + (bulkData.totalCompleted || 0),
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
