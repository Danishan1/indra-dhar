import mongoose from "mongoose";
import { Phase } from "../models/Phase.js";
import { Item } from "../models/Item.js";

/**
 * Dashboard API
 * Shows all phases with items summary
 */
export const getDashboardData = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    console.log("Fetching dashboard data for tenant:", tenantId);

    // Get all phases
    const phases = await Phase.find({ tenantId }).lean();

    // Aggregate item data per phase
    const itemsByPhase = await Item.aggregate([
      { $match: { tenantId: new mongoose.Types.ObjectId(tenantId) } },
      {
        $group: {
          _id: "$currentPhaseId",
          items: {
            $push: {
              bulkGroupId: "$bulkGroupId",
              quantity: "$quantity",
              name: "$formData.name",
              status: "$status",
              isBulkCountBased: "$isBulkCountBased",
            },
          },
        },
      },
    ]);

    // Convert aggregation into map for fast lookup
    const phaseItemMap = {};
    itemsByPhase.forEach((p) => {
      phaseItemMap[p._id?.toString()] = p.items;
    });

    // Prepare dashboard data
    const dashboardData = phases.map((phase) => {
      const phaseItems = phaseItemMap[phase._id.toString()] || [];

      // Summarize data
      const summary = phaseItems.reduce((acc, item) => {
        const key = item.bulkGroupId || item.name || "UNKNOWN";
        if (!acc[key]) {
          acc[key] = {
            bulkGroupId: item.bulkGroupId || null,
            name: item.name || null,
            status: item.status,
            quantity: 0,
          };
        }
        acc[key].quantity += item.isBulkCountBased ? item.quantity : 1;
        return acc;
      }, {});

      return {
        phaseId: phase._id,
        phaseName: phase.name,
        items: Object.values(summary),
      };
    });

    res.json(dashboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
