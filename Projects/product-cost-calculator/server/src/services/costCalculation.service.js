import { ApiError } from "../utils/ApiError.js";
import { BASE_PATH } from "../utils/basePath.js";

import { BomItemRepository } from "../repositories/bomItem.repository.js";
import { LaborRepository } from "../repositories/labor.repository.js";
import { OverheadRepository } from "../repositories/overhead.repository.js";

export const CostCalculationService = {
  async calculate(payload) {
    const resources = payload.data || [];
    const meta = payload.meta || {};

    if (!Array.isArray(resources) || !resources.length) {
      throw new ApiError(400, "No resources provided");
    }

    /* ----------------------------------------------------
       1. EXTRACT RESOURCES FROM PAYLOAD
    ---------------------------------------------------- */
    const bomIds = new Set();
    const laborItems = [];
    const overheadItems = [];

    for (const r of resources) {
      if (!r.resource_type || !r.data?.resource_id) {
        throw new ApiError(400, "Invalid resource payload");
      }

      if (r.resource_type === BASE_PATH.bom) {
        bomIds.add(r.data.resource_id);
      }

      if (r.resource_type === BASE_PATH.labors) {
        laborItems.push(r.data);
      }

      if (r.resource_type === BASE_PATH.overheads) {
        overheadItems.push(r.data);
      }
    }

    if (!bomIds.size) {
      throw new ApiError(400, "At least one BOM is required");
    }

    /* ----------------------------------------------------
       2. RAW MATERIAL COST (FROM BOM)
    ---------------------------------------------------- */
    let materialBaseTotal = 0;
    let materialGST_ITC = 0;
    let materialGST_NonITC = 0;

    for (const bomId of bomIds) {
      const bomItems = await BomItemRepository.findByBomId(bomId);

      if (!bomItems.length) {
        throw new ApiError(404, `No BOM items found for BOM ID ${bomId}`);
      }

      for (const item of bomItems) {
        const qty = parseFloat(item.quantity || 0);
        const unitPrice = parseFloat(item.material_unit_price || 0);
        const gstRate = parseFloat(item.material_gst || 0);
        const isITC = Boolean(item.material_is_gst_itc);

        const baseCost = qty * unitPrice;
        materialBaseTotal += baseCost;

        const gstAmount = baseCost * (gstRate / 100);

        if (isITC) {
          materialGST_ITC += gstAmount; // recoverable
        } else {
          materialGST_NonITC += gstAmount; // added to cost
        }
      }
    }

    const rawMaterialTotal = materialBaseTotal + materialGST_NonITC;

    /* ----------------------------------------------------
       3. LABOR COST
    ---------------------------------------------------- */
    let laborTotal = 0;

    for (const l of laborItems) {
      const labor = await LaborRepository.findById(l.resource_id);
      if (!labor) throw new ApiError(404, "Labor not found");

      const hours = parseFloat(l.hours || 0);
      const overtime = parseFloat(l.overtime_hours || 0);

      // All thee types of labor are considered in the calculation
      laborTotal +=
        hours * parseFloat(labor.rate_per_hour) +
        overtime * parseFloat(labor.overtime_rate);
    }

    /* ----------------------------------------------------
       4. DIRECT COST
    ---------------------------------------------------- */
    const directCost = rawMaterialTotal + laborTotal;

    /* ----------------------------------------------------
       5. OVERHEAD COST
    ---------------------------------------------------- */
    let overheadTotal = 0;

    for (const o of overheadItems) {
      const oh = await OverheadRepository.findById(o.resource_id);
      if (!oh) throw new ApiError(404, "Overhead not found");

      let overheadAmount = 0;

      if (oh.type === "fixed") {
        overheadAmount = parseFloat(o.applied_value ?? oh.value);
      }

      if (oh.type === "percentage") {
        const rate = parseFloat(o.percentage_value ?? oh.value);
        overheadAmount = directCost * (rate / 100);
      }

      overheadTotal += overheadAmount;
    }

    /* ----------------------------------------------------
       6. COST BEFORE PROFIT
    ---------------------------------------------------- */
    const costBeforeProfit = directCost + overheadTotal;

    /* ----------------------------------------------------
       7. PROFIT
    ---------------------------------------------------- */
    const profitValue = parseFloat(meta.profit_value || 0);
    const profitType = meta.profit_type || "Percentage";

    let profit = 0;

    if (profitType === "Percentage") {
      profit = costBeforeProfit * (profitValue / 100);
    } else {
      profit = profitValue;
    }

    const taxableValue = costBeforeProfit + profit;

    /* ----------------------------------------------------
       8. OUTPUT GST (FINAL PRODUCT)
    ---------------------------------------------------- */
    const outputGstRate = parseFloat(meta.project_gst || 0);
    const outputGST = taxableValue * (outputGstRate / 100);

    const finalCost = taxableValue + outputGST;

    /* ----------------------------------------------------
       9. RESPONSE
    ---------------------------------------------------- */
    return {
      materialBaseTotal: `₹${materialBaseTotal.toFixed(2)}`,
      materialGstItc: `₹${materialGST_ITC.toFixed(2)}`,
      materialGstNonItc: `₹${materialGST_NonITC.toFixed(2)}`,
      rawMaterialTotal: `₹${rawMaterialTotal.toFixed(2)}`,

      laborTotal: `₹${laborTotal.toFixed(2)}`,
      overheadTotal: `₹${overheadTotal.toFixed(2)}`,

      directCost: `₹${directCost.toFixed(2)}`,
      costBeforeProfit: `₹${costBeforeProfit.toFixed(2)}`,

      profit: `₹${profit.toFixed(2)}`,
      taxableValue: `₹${taxableValue.toFixed(2)}`,

      outputGst: `₹${outputGST.toFixed(2)}`,
      finalCost: `₹${finalCost.toFixed(2)}`,
    };
  },
};

// import { ApiError } from "../utils/ApiError.js";
// import { CostCalculationRepository as Repo } from "../repositories/costCalculation.repository.js";
// import { BASE_PATH } from "../utils/basePath.js";

// export const CostCalculationService = {
//   async calculate(payload) {
//     const resources = payload.data || [];
//     const meta = payload.meta || {};

//     console.log("DDDD ", resources, meta);

//     if (!Array.isArray(resources) || resources.length === 0) {
//       throw new ApiError(400, "No resources provided for calculation");
//     }

//     let rawMaterialTotal = 0;
//     let laborTotal = 0;
//     let machineTotal = 0;
//     let utilityTotal = 0;
//     let overheadTotal = 0;

//     // PROCESS EACH RESOURCE
//     for (const item of resources) {
//       const type = item.resource_type;
//       const data = item.data;

//       if (!type || !data?.resource_id) {
//         throw new ApiError(400, "Invalid resource payload");
//       }

//       // RAW MATERIAL --------------------------------
//       if (type === BASE_PATH.rawMaterial) {
//         const rm = await Repo.findRawMaterialById(data.resource_id);
//         if (!rm) throw new ApiError(404, "Raw material not found");

//         const qty = parseFloat(data.quantity || 0);
//         const wastage = parseFloat(data.wastage_percent || 0);
//         const scrap = parseFloat(data.scrap_value || 0);

//         const unitPrice = parseFloat(rm.unit_price || 0);
//         const gstRate = parseFloat(rm.gst || 0);

//         // Quantity including wastage
//         const effectiveQty = qty + qty * (wastage / 100);

//         // Taxable value (before GST)
//         const taxableCost = effectiveQty * unitPrice - scrap;

//         // GST amount
//         const gstAmount = taxableCost * (gstRate / 100);

//         // Total cost including GST
//         const totalCost = taxableCost + gstAmount;

//         rawMaterialTotal += totalCost;
//       }

//       // LABORS --------------------------------------
//       else if (type === BASE_PATH.labors) {
//         const lb = await Repo.findLaborById(data.resource_id);
//         if (!lb) throw new ApiError(404, "Labor not found");

//         const hours = parseFloat(data.hours || 0); // these are effort based on labor Type
//         const overtime = parseFloat(data.overtime_hours || 0); // these are overtime based on labor type

//         const laborType = lb.labor_type; // 'Per Hour', 'Per Process', 'Salary'

//         // rate_per_hour is a generic gate based on the labourType
//         const cost =
//           hours * parseFloat(lb.rate_per_hour) +
//           overtime * parseFloat(lb.overtime_rate);

//         laborTotal += cost;
//       } else if (type === BASE_PATH.overheads) {
//         const oh = await Repo.findOverheadById(data.resource_id);
//         if (!oh) throw new ApiError(404, "Overhead not found");

//         // const totalMonths = normalizeDurationToMonths(duration, durationUnit);

//         let overheadAmount = 0;

//         // FIXED
//         if (oh.type === "fixed") {
//           overheadAmount = parseFloat(data.applied_value ?? oh.value);
//         }

//         // PERCENTAGE
//         if (oh.type === "percentage") {
//           const percentageRate = parseFloat(data.percentage_value ?? oh.value);
//           const percentageBase = parseFloat(data.applied_value);

//           overheadAmount = percentageBase * (percentageRate / 100);
//         }

//         let multiplier = 1;

//         overheadTotal += overheadAmount * multiplier;
//       }
//     }

//     const totalBeforeProfit =
//       rawMaterialTotal +
//       laborTotal +
//       machineTotal +
//       utilityTotal +
//       overheadTotal;

//     const projectGstRate = parseFloat(meta.project_gst || 0);

//     // Project-level GST amount
//     const projectGstAmount = totalBeforeProfit * (projectGstRate / 100);

//     // Base amount on which profit is calculated
//     const profitBaseAmount = totalBeforeProfit + projectGstAmount;

//     // PROFIT ---------------------------------------------
//     const profitValue = parseFloat(meta.profit_value || 0);
//     const profitType = meta.profit_type || "Percentage";

//     let profit = 0;

//     if (profitType === "Percentage") {
//       profit = profitBaseAmount * (profitValue / 100);
//     } else if (profitType === "Fixed") {
//       profit = profitValue;
//     }

//     const finalCost = totalBeforeProfit + projectGstAmount + profit;

//     return {
//       rawMaterialTotal: `₹${rawMaterialTotal.toFixed(2)}`,
//       laborTotal: `₹${laborTotal.toFixed(2)}`,
//       machineTotal: `₹${machineTotal.toFixed(2)}`,
//       utilityTotal: `₹${utilityTotal.toFixed(2)}`,
//       overheadTotal: `₹${overheadTotal.toFixed(2)}`,
//       totalBeforeProfit: `₹${profitBaseAmount.toFixed(2)}`,
//       projectGST: `₹${projectGstAmount.toFixed(2)}`,
//       profit: `₹${profit.toFixed(2)}`,
//       finalCost: `₹${finalCost.toFixed(2)}`,
//     };
//   },
// };
