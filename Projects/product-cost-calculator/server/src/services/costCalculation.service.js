import { ApiError } from "../utils/ApiError.js";
import { CostCalculationRepository as Repo } from "../repositories/costCalculation.repository.js";
import { BASE_PATH } from "../utils/basePath.js";

export const CostCalculationService = {
  async calculate(payload) {
    const resources = payload.data || [];
    const meta = payload.meta || {};

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

        const unitPrice = parseFloat(rm.unit_price || 0);
        const gstRate = parseFloat(rm.gst || 0);

        // Quantity including wastage
        const effectiveQty = qty + qty * (wastage / 100);

        // Taxable value (before GST)
        const taxableCost = effectiveQty * unitPrice - scrap;

        // GST amount
        const gstAmount = taxableCost * (gstRate / 100);

        // Total cost including GST
        const totalCost = taxableCost + gstAmount;

        rawMaterialTotal += totalCost;
      }

      // LABORS --------------------------------------
      else if (type === BASE_PATH.labors) {
        const lb = await Repo.findLaborById(data.resource_id);
        if (!lb) throw new ApiError(404, "Labor not found");

        const hours = parseFloat(data.hours || 0); // these are effort based on labor Type
        const overtime = parseFloat(data.overtime_hours || 0); // these are overtime based on labor type

        const laborType = lb.labor_type; // 'Per Hour', 'Per Process', 'Salary'

        // rate_per_hour is a generic gate based on the labourType
        const cost =
          hours * parseFloat(lb.rate_per_hour) +
          overtime * parseFloat(lb.overtime_rate);

        laborTotal += cost;
      }

      // // MACHINES ------------------------------------
      // else if (type === BASE_PATH.machines) {
      //   const mc = await Repo.findMachineById(data.resource_id);
      //   if (!mc) throw new ApiError(404, "Machine not found");

      //   const hours = parseFloat(data.hours || 0);

      //   const cost =
      //     hours * parseFloat(mc.cost_per_hour) +
      //     parseFloat(mc.maintenance_cost) / 12; // Monthly maintenance apportioned

      //   machineTotal += cost;
      // }

      // // UTILITIES -----------------------------------
      // else if (type === BASE_PATH.utilities) {
      //   const ut = await Repo.findUtilityById(data.resource_id);
      //   if (!ut) throw new ApiError(404, "Utility not found");

      //   const units = parseFloat(data.units_consumed || 0);
      //   const cost = units * parseFloat(ut.cost_per_unit);

      //   utilityTotal += cost;
      // }
      else if (type === BASE_PATH.overheads) {
        const oh = await Repo.findOverheadById(data.resource_id);
        if (!oh) throw new ApiError(404, "Overhead not found");

        // const totalMonths = normalizeDurationToMonths(duration, durationUnit);

        let overheadAmount = 0;

        // FIXED
        if (oh.type === "fixed") {
          overheadAmount = parseFloat(data.applied_value ?? oh.value);
        }

        // PERCENTAGE
        if (oh.type === "percentage") {
          const percentageRate = parseFloat(data.percentage_value ?? oh.value);
          const percentageBase = parseFloat(data.applied_value);

          overheadAmount = percentageBase * (percentageRate / 100);
        }

        let multiplier = 1;

        // switch (oh.frequency) {
        //   case "Machine Hour":
        //     multiplier = parseFloat(meta.machine_hours || 0);
        //     break;

        //   case "Labor Hour":
        //     multiplier = parseFloat(meta.labor_hours || 0);
        //     break;

        //   case "Unit Produced":
        //     multiplier = parseFloat(meta.units_produced || 1);
        //     break;

        //   case "% of Direct Cost":
        //     multiplier = parseFloat(meta.direct_cost || 0);
        //     break;
        // }

        overheadTotal += overheadAmount * multiplier;
      }
    }

    const totalBeforeProfit =
      rawMaterialTotal +
      laborTotal +
      machineTotal +
      utilityTotal +
      overheadTotal;

    const projectGstRate = parseFloat(meta.project_gst || 0);

    // Project-level GST amount
    const projectGstAmount = totalBeforeProfit * (projectGstRate / 100);

    // Base amount on which profit is calculated
    const profitBaseAmount = totalBeforeProfit + projectGstAmount;

    // PROFIT ---------------------------------------------
    const profitValue = parseFloat(meta.profit_value || 0);
    const profitType = meta.profit_type || "Percentage";

    let profit = 0;

    if (profitType === "Percentage") {
      profit = profitBaseAmount * (profitValue / 100);
    } else if (profitType === "Fixed") {
      profit = profitValue;
    }

    const finalCost = totalBeforeProfit + projectGstAmount + profit;

    return {
      rawMaterialTotal: `₹${rawMaterialTotal.toFixed(2)}`,
      laborTotal: `₹${laborTotal.toFixed(2)}`,
      machineTotal: `₹${machineTotal.toFixed(2)}`,
      utilityTotal: `₹${utilityTotal.toFixed(2)}`,
      overheadTotal: `₹${overheadTotal.toFixed(2)}`,
      totalBeforeProfit: `₹${profitBaseAmount.toFixed(2)}`,
      projectGST: `₹${projectGstAmount.toFixed(2)}`,
      profit: `₹${profit.toFixed(2)}`,
      finalCost: `₹${finalCost.toFixed(2)}`,
    };
  },
};

// function normalizeDurationToMonths(duration, unit) {
//   switch (unit) {
//     case "Years":
//       return duration * 12;
//     case "Months":
//       return duration;
//     case "Days":
//       return duration / 30;
//     case "Pieces":
//       return 1; // Pieces usually shouldn't scale time-based overheads
//     default:
//       return 1;
//   }
// }
