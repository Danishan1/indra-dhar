import mongoose from "mongoose";
import { Phase } from "../models/Phase.js";
import { Item } from "../models/Item.js";
import { Tenant } from "../models/Tenant.js";
import { User } from "../models/User.js";

export const getDashboardData = async (req, res) => {
  try {
    const { tenantId, _id: userId, name, role, email } = req.user;

    console.log("Fetching dashboard data for user:", req.user);

    // Fetch tenant name
    const tenant = await Tenant.findById(tenantId).lean();

    // Get all phases for this tenant
    const phases = await Phase.find({ tenantId }).lean();

    // Aggregate items by phase
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

    // Map items to phase ID
    const phaseItemMap = {};
    itemsByPhase.forEach((p) => {
      phaseItemMap[p._id?.toString()] = p.items;
    });

    // Prepare dashboard phase data
    const phaseSummary = phases.map((phase, idx) => {
      const phaseItems = phaseItemMap[phase._id.toString()] || [];

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
        phaseNumber: idx + 1,
        phaseId: phase._id,
        phaseName: phase.name,
        items: Object.values(summary),
      };
    });

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
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
