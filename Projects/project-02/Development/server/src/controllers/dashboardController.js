import { supabase } from "../config/db.js";

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
      return null;
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { userId, name, role, email } = req.user;
    const { timeRange } = req.params;

    // Get phases for this tenant (skip "Po")
    let { data: phases, error: phaseError } = await supabase
      .from("node_phases")
      .select("*")
      .order("order", { ascending: true });

    if (phaseError) throw phaseError;

    // Date filter
    const startDate = timeRangeToDate(timeRange);

    // Fetch bulk items (with optional filter)
    let query = supabase.from("node_bulk_items").select("*");
    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }
    const { data: bulkItems, error: bulkError } = await query;
    if (bulkError) throw bulkError;

    // Group bulk items by phaseId
    const bulkItemMap = {};
    for (const item of bulkItems) {
      const phaseId = item.phase_id;
      if (!bulkItemMap[phaseId]) {
        bulkItemMap[phaseId] = {
          totalPending: 0,
          totalCompleted: 0,
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
        };
      }

      const pendingCount = parseInt(item.pending_count) || 0;
      const completedCount = parseInt(item.completed_count) || 0;

      bulkItemMap[phaseId].totalPending += pendingCount;
      bulkItemMap[phaseId].totalCompleted += completedCount;
      bulkItemMap[phaseId].totalOrders += 1;
      bulkItemMap[phaseId].pendingOrders += pendingCount > 0 ? 1 : 0;
      bulkItemMap[phaseId].completedOrders += pendingCount === 0 ? 1 : 0;
    }

    // Phase summary
    const phaseSummary = phases.map((phase, idx) => {
      const bulkData = bulkItemMap[phase.id] || {};
      return {
        phaseNumber: idx + 1,
        phaseId: phase.id,
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

    // Response
    res.json({
      user: {
        userId,
        name,
        role,
        email,
        tenantName: "Company Name", // TODO
      },
      phases: phaseSummary,
    });
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
