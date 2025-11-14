import { ApiError } from "../utils/ApiError.js";
import { CostCalculationRepository as Repo } from "../repositories/costCalculation.repository.js";
import { BASE_PATH } from "../utils/basePath.js";

export const CostCalculationService = {
  async calculate(payload) {
    const resources = payload.data || [];
    const globalData = payload.global_data || {};

    if (!Array.isArray(resources) || resources.length === 0) {
      throw new ApiError(400, "No resources provided for calculation");
    }

    let rawMaterialTotal = 0;
    let laborTotal = 0;
    let machineTotal = 0;
    let utilityTotal = 0;
    let overheadTotal = 0;

    // PROCESS EACH RESOURCE
    for (const item of resources) {
      const type = item.resource_type;
      const data = item.data;

      if (!type || !data?.resource_id) {
        throw new ApiError(400, "Invalid resource payload");
      }

      // RAW MATERIAL --------------------------------
      if (type === BASE_PATH.rawMaterial) {
        const rm = await Repo.findRawMaterialById(data.resource_id);
        if (!rm) throw new ApiError(404, "Raw material not found");

        const qty = parseFloat(data.quantity || 0);
        const wastage = parseFloat(data.wastage_percent || 0);
        const scrap = parseFloat(data.scrap_value || 0);

        const effectiveQty = qty + qty * (wastage / 100);
        const cost = effectiveQty * parseFloat(rm.unit_price) - scrap;

        rawMaterialTotal += cost;
      }

      // LABORS --------------------------------------
      else if (type === BASE_PATH.labors) {
        const lb = await Repo.findLaborById(data.resource_id);
        if (!lb) throw new ApiError(404, "Labor not found");

        const hours = parseFloat(data.hours || 0);
        const overtime = parseFloat(data.overtime_hours || 0);

        const cost =
          hours * parseFloat(lb.rate_per_hour) +
          overtime * parseFloat(lb.overtime_rate);

        laborTotal += cost;
      }

      // MACHINES ------------------------------------
      else if (type === BASE_PATH.machines) {
        const mc = await Repo.findMachineById(data.resource_id);
        if (!mc) throw new ApiError(404, "Machine not found");

        const hours = parseFloat(data.hours || 0);

        const cost =
          hours * parseFloat(mc.cost_per_hour) +
          parseFloat(mc.maintenance_cost) / 12; // Monthly maintenance apportioned

        machineTotal += cost;
      }

      // UTILITIES -----------------------------------
      else if (type === BASE_PATH.utilities) {
        const ut = await Repo.findUtilityById(data.resource_id);
        if (!ut) throw new ApiError(404, "Utility not found");

        const units = parseFloat(data.units_consumed || 0);
        const cost = units * parseFloat(ut.cost_per_unit);

        utilityTotal += cost;
      }

      // OVERHEADS -----------------------------------
      else if (type === BASE_PATH.overheads) {
        const oh = await Repo.findOverheadById(data.resource_id);
        if (!oh) throw new ApiError(404, "Overhead not found");

        // FIXED
        if (oh.type === "fixed") {
          overheadTotal += parseFloat(data.applied_value || oh.value);
        }

        // PERCENTAGE
        if (oh.type === "percentage") {
          const base = parseFloat(data.applied_value || oh.value);

          const p = parseFloat(data.percentage_value || oh.value);

          overheadTotal += base * (p / 100);
        }

        if (oh.frequency === "monthly") {
          const duration = parseInt(globalData.duration_in_months || 1);
          overheadTotal *= duration; // Monthly Recurrence
        } else {
          overheadTotal *= duration / 12; // Yearly Recurrence
        }
      }
    }

    const totalBeforeProfit =
      rawMaterialTotal +
      laborTotal +
      machineTotal +
      utilityTotal +
      overheadTotal;

    // PROFIT ---------------------------------------------
    const profitValue = parseFloat(globalData.profit_value || 0);
    const profitType = globalData.profit_type || "percentage";

    let profit = 0;

    if (profitType === "percentage") {
      profit = totalBeforeProfit * (profitValue / 100);
    } else if (profitType === "fixed") {
      profit = profitValue;
    }

    const finalCost = totalBeforeProfit + profit;

    return {
      rawMaterialTotal: `₹${rawMaterialTotal.toFixed(2)}`,
      laborTotal: `₹${laborTotal.toFixed(2)}`,
      machineTotal: `₹${machineTotal.toFixed(2)}`,
      utilityTotal: `₹${utilityTotal.toFixed(2)}`,
      overheadTotal: `₹${overheadTotal.toFixed(2)}`,
      totalBeforeProfit: `₹${totalBeforeProfit.toFixed(2)}`,
      profit: `₹${profit.toFixed(2)}`,
      finalCost: `₹${finalCost.toFixed(2)}`,
    };
  },
};
