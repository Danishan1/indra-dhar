import { supabase } from "../config/db.js";

const timeRangeToDate = (timeRange) => {
  if (!timeRange) return null;
  const now = new Date();
  const date = new Date(now.getTime()); // clone so we don't mutate `now`
  const t = String(timeRange).trim().toLowerCase();

  switch (t) {
    case "10 year":
    case "10 years":
      date.setFullYear(date.getFullYear() - 10);
      return date;
    case "5 year":
    case "5 years":
      date.setFullYear(date.getFullYear() - 5);
      return date;
    case "2 year":
    case "2 years":
      date.setFullYear(date.getFullYear() - 2);
      return date;
    case "1 year":
    case "1 years":
      date.setFullYear(date.getFullYear() - 1);
      return date;
    case "6 months":
    case "6 month":
      date.setMonth(date.getMonth() - 6);
      return date;
    case "3 months":
    case "3 month":
      date.setMonth(date.getMonth() - 3);
      return date;
    case "1 month":
    case "1 months":
      date.setMonth(date.getMonth() - 1);
      return date;
    case "1 week":
    case "1 weeks":
      date.setDate(date.getDate() - 7);
      return date;
    default:
      return null;
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const { userId, name, role, email } = req.user;
    const { timeRange } = req.params;

    // Get phases (skip nothing here, but you can filter if needed)
    let { data: phases, error: phaseError } = await supabase
      .from("node_phases")
      .select("*")
      .order("phase_order", { ascending: true });

    if (phaseError) throw phaseError;

    // Date filter
    const startDate = timeRangeToDate(timeRange);

    // Fetch bulk items (with optional filter)
    let query = supabase.from("node_bulk_items").select("*");
    if (startDate) {
      query = query.gte("created_at", startDate.toISOString());
    }
    const { data: bulkItems = [], error: bulkError } = await query;
    if (bulkError) throw bulkError;

    // Group bulk items by phaseId with correct numeric handling
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

      // Use Number(...) and default to 0 for safety
      const pendingCount = Number(item.pending_count) || 0;
      const completedCount = Number(item.completed_count) || 0;

      // Accumulate totals (correct increment)
      bulkItemMap[phaseId].totalPending += pendingCount;
      bulkItemMap[phaseId].totalCompleted += completedCount;
      bulkItemMap[phaseId].totalOrders += 1;

      // Increment order counters correctly (add 1 when condition meets)
      bulkItemMap[phaseId].pendingOrders += pendingCount > 0 ? 1 : 0;
      bulkItemMap[phaseId].completedOrders += pendingCount === 0 ? 1 : 0;
    }

    // Phase summary
    const phaseSummary = phases.map((phase, idx) => {
      const bulkData = bulkItemMap[phase.id] || {
        totalPending: 0,
        totalCompleted: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
      };

      return {
        phaseNumber: idx + 1,
        phaseId: phase.id,
        phaseName: phase.name,
        items: {
          total: bulkData.totalPending + bulkData.totalCompleted,
          pending: bulkData.totalPending,
          completed: bulkData.totalCompleted,
        },
        orders: {
          totalOrders: bulkData.totalOrders,
          pendingOrders: bulkData.pendingOrders,
          completedOrders: bulkData.completedOrders,
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
