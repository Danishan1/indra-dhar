import { ApiError } from "../utils/ApiError.js";
import { BASE_PATH } from "../utils/basePath.js";

import { BomItemRepository } from "../repositories/bomItem.repository.js";
import { LaborRepository } from "../repositories/labor.repository.js";
import { OverheadRepository } from "../repositories/overhead.repository.js";
import { IndirectExpRepository } from "../repositories/indirectExpense.repository.js";
import { getTotalIndirectCost } from "./helper/getTotalIndirectCost.js";

const formatINR = (value) => `₹${Number(value).toFixed(2)}`;

export const CostCalculationService = {
  async calculate(payload) {
    try {
      const resources = payload.data || [];
      const meta = payload.meta || {};
      const productionQuantity = Number(meta.production_quantity || 1);

      if (productionQuantity <= 0) {
        return {
          success: false,
          message: "production_quantity must be greater than zero",
        };
      }

      if (!Array.isArray(resources) || !resources.length) {
        throw new ApiError(400, "No resources provided");
      }

      const invoiceItems = [];

      /* ----------------------------------------------------
       1. EXTRACT RESOURCES
    ---------------------------------------------------- */
      const bomIds = new Set();
      const laborItems = [];
      const overheadItems = [];
      const indirectExpenseItems = [];

      for (const r of resources) {
        if (!r.resource_type || !r.data?.resource_id) {
          throw new ApiError(400, "Invalid resource payload");
        }

        if (r.resource_type === BASE_PATH.bom) bomIds.add(r.data.resource_id);
        if (r.resource_type === BASE_PATH.labors) laborItems.push(r.data);
        if (r.resource_type === BASE_PATH.overheads) overheadItems.push(r.data);
        if (r.resource_type === BASE_PATH.indirectExpense)
          indirectExpenseItems.push(r.data);
      }

      if (!bomIds.size) {
        return {
          success: false,
          message: "At least one BOM is required",
        };
      }
      /* ----------------------------------------------------
       2. MATERIAL COST (SCALED BY PRODUCTION QUANTITY)
    ---------------------------------------------------- */
      let materialBaseTotal = 0;
      let materialGST_NonITC = 0;

      for (const bomId of bomIds) {
        const bomItems = await BomItemRepository.findByBomId(bomId);
        if (!bomItems.length)
          throw new ApiError(404, `No BOM items for BOM ${bomId}`);

        for (const item of bomItems) {
          const qty = Number(item.quantity || 0);
          const rate = Number(item.material_unit_price || 0);
          const gstRate = Number(item.material_gst || 0);
          const isITC = Boolean(item.material_is_gst_itc);

          // Scale by production quantity
          const base = qty * rate * productionQuantity;
          const gstAmount = base * (gstRate / 100);
          const total = base + (isITC ? 0 : gstAmount);

          materialBaseTotal += base;
          if (!isITC) materialGST_NonITC += gstAmount;

          invoiceItems.push({
            category: "Material",
            description: item.material_name,
            quantity_per_unit: qty,
            quantity_total: qty * productionQuantity,
            rate: formatINR(rate),
            amount: formatINR(base),
            gst_rate: `${gstRate}%`,
            gst_amount: formatINR(isITC ? 0 : gstAmount),
            // total: formatINR(total),
            gst_type: isITC ? "ITC" : "Non-ITC",
          });
        }
      }

      /* ----------------------------------------------------
       3. LABOR COST (SCALED)
    ---------------------------------------------------- */
      let laborTotal = 0;

      for (const l of laborItems) {
        const labor = await LaborRepository.findById(l.resource_id);
        if (!labor) {
          return {
            success: false,
            message: "Labor not found",
          };
        }

        const hours = Number(l.hours || 0);
        const overtime = Number(l.overtime_hours || 0);

        if (hours > 0) {
          const cost = hours * Number(labor.rate_per_hour) * productionQuantity;
          laborTotal += cost;

          invoiceItems.push({
            category: "Labor",
            description: `${labor.name} (Regular)`,
            quantity_per_unit: hours,
            quantity_total: hours * productionQuantity,
            rate: formatINR(labor.rate_per_hour),
            amount: formatINR(cost),
            // total: formatINR(cost),
          });
        }

        if (overtime > 0) {
          const cost =
            overtime * Number(labor.overtime_rate) * productionQuantity;
          laborTotal += cost;

          invoiceItems.push({
            category: "Labor",
            description: `${labor.name} (Overtime)`,
            quantity_per_unit: overtime,
            quantity_total: overtime * productionQuantity,
            rate: formatINR(labor.overtime_rate),
            amount: formatINR(cost),
            // total: formatINR(cost),
          });
        }
      }

      /* ----------------------------------------------------
       4. DIRECT COST
    ---------------------------------------------------- */
      const rawMaterialTotal = materialBaseTotal + materialGST_NonITC;
      const directCost = rawMaterialTotal + laborTotal;

      /* ----------------------------------------------------
       5. OVERHEAD COST (SCALED)
    ---------------------------------------------------- */
      let overheadTotal = 0;

      for (const o of overheadItems) {
        const oh = await OverheadRepository.findById(o.resource_id);
        if (!oh) {
          return {
            success: false,
            message: "Overhead not found",
          };
        }
        let overheadAmount = 0;
        let description = oh.name;

        if (oh.type === "fixed") {
          overheadAmount = Number(o.applied_value ?? oh.value);
        }

        if (oh.type === "percentage") {
          const rate = Number(o.percentage_value ?? 100);
          overheadAmount =
            Number(oh.monthly_value) *
            (rate / 100) *
            Number(o.expected_duration); // directCost already scaled
          description = `${oh.name} (${o.expected_duration}M ${rate}%)`;
        }

        overheadTotal += overheadAmount;

        invoiceItems.push({
          category: "Overhead",
          description,
          quantity_per_unit: null,
          quantity_total: null,
          rate: null,
          amount: formatINR(overheadAmount),
          // total: formatINR(overheadAmount),
        });
      }
      /* ----------------------------------------------------
       6. INDIRECT EXPENSE COST (SCALED)
    ---------------------------------------------------- */
      let indirectExpenseTotal = 0;
      for (const o of indirectExpenseItems) {
        const totalIndirectExpAmount = await getTotalIndirectCost();

        let indirectAmount = 0;

        if (o.applied_value) {
          const appliedValue = Number(o.applied_value);

          if (appliedValue < 0 || appliedValue > totalIndirectExpAmount) {
            return {
              success: false,
              message: `Applied Value of Indirect Expense must be between 0 and ${totalIndirectExpAmount}`,
            };
          }
          indirectAmount = appliedValue;
        } else indirectAmount = totalIndirectExpAmount;

        indirectExpenseTotal += indirectAmount;
        let description = "Indirect Expense";

        invoiceItems.push({
          category: "Indirect Expense",
          description,
          quantity_per_unit: null,
          quantity_total: null,
          rate: null,
          amount: formatINR(indirectAmount),
          // total: formatINR(overheadAmount),
        });
      }

      /* ----------------------------------------------------
       6. COST BEFORE PROFIT
    ---------------------------------------------------- */
      const costBeforeProfit =
        directCost + overheadTotal + indirectExpenseTotal;

      /* ----------------------------------------------------
       7. PROFIT (SCALED)
    ---------------------------------------------------- */
      const profitValue = Number(meta.profit_value || 0);
      const profitType = meta.profit_type || "Percentage";

      let profit = 0;
      let profitLabel = "Profit";

      if (profitType === "Percentage") {
        profit = costBeforeProfit * (profitValue / 100);
        profitLabel = `Profit (${profitValue}%)`;
      } else {
        profit = profitValue * productionQuantity;
      }

      /* ----------------------------------------------------
       8. ADD SUMMARY LINES TO INVOICE ITEMS
    ---------------------------------------------------- */
      invoiceItems.push({
        category: "Summary",
        description: "Total Cost",
        quantity: null,
        rate: null,
        amount: formatINR(costBeforeProfit),
        // total: formatINR(costBeforeProfit),
      });

      invoiceItems.push({
        category: "Summary",
        description: "Total Profit",
        quantity: null,
        rate: null,
        amount: formatINR(profit),
        // total: formatINR(profit),
      });

      /* ----------------------------------------------------
       9. GST (SCALED)
    ---------------------------------------------------- */
      const taxableValue = costBeforeProfit + profit;
      const gstRate = Number(meta.project_gst || 0);
      const gstAmount = taxableValue * (gstRate / 100);

      invoiceItems.push({
        category: "Tax",
        description: `GST @ ${gstRate}%`,
        quantity: null,
        rate: null,
        amount: formatINR(gstAmount),
        // total: formatINR(gstAmount),
      });

      const finalCost = taxableValue + gstAmount;

      invoiceItems.push({
        category: "Summary",
        description: `Grand Total`,
        quantity: null,
        rate: null,
        amount: formatINR(finalCost),
        // total: formatINR(gstAmount),
      });

      /* ----------------------------------------------------
       9. FINAL RESPONSE
    ---------------------------------------------------- */
      return {
        success: true,
        message: "Cost calculated successfully",
        data: {
          invoice: {
            currency: "INR",
            items: invoiceItems,
            totals: {
              material_total: formatINR(rawMaterialTotal),
              labor_total: formatINR(laborTotal),
              overhead_total: formatINR(overheadTotal),
              indirect_expense_total: formatINR(indirectExpenseTotal),
              cost_before_profit: formatINR(costBeforeProfit),
              profit: formatINR(profit),
              taxable_value: formatINR(taxableValue),
              gst: formatINR(gstAmount),
              grand_total: formatINR(finalCost),
              production_quantity: productionQuantity,
            },
          },
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    }
  },
};

// import { ApiError } from "../utils/ApiError.js";
// import { BASE_PATH } from "../utils/basePath.js";

// import { BomItemRepository } from "../repositories/bomItem.repository.js";
// import { LaborRepository } from "../repositories/labor.repository.js";
// import { OverheadRepository } from "../repositories/overhead.repository.js";

// export const CostCalculationService = {
//   async calculate(payload) {
//     const resources = payload.data || [];
//     const meta = payload.meta || {};

//     if (!Array.isArray(resources) || !resources.length) {
//       throw new ApiError(400, "No resources provided");
//     }

//     /* ----------------------------------------------------
//        1. EXTRACT RESOURCES FROM PAYLOAD
//     ---------------------------------------------------- */
//     const bomIds = new Set();
//     const laborItems = [];
//     const overheadItems = [];

//     for (const r of resources) {
//       if (!r.resource_type || !r.data?.resource_id) {
//         throw new ApiError(400, "Invalid resource payload");
//       }

//       if (r.resource_type === BASE_PATH.bom) {
//         bomIds.add(r.data.resource_id);
//       }

//       if (r.resource_type === BASE_PATH.labors) {
//         laborItems.push(r.data);
//       }

//       if (r.resource_type === BASE_PATH.overheads) {
//         overheadItems.push(r.data);
//       }
//     }

//     if (!bomIds.size) {
//       throw new ApiError(400, "At least one BOM is required");
//     }

//     /* ----------------------------------------------------
//        2. RAW MATERIAL COST (FROM BOM)
//     ---------------------------------------------------- */
//     let materialBaseTotal = 0;
//     let materialGST_ITC = 0;
//     let materialGST_NonITC = 0;

//     for (const bomId of bomIds) {
//       const bomItems = await BomItemRepository.findByBomId(bomId);

//       if (!bomItems.length) {
//         throw new ApiError(404, `No BOM items found for BOM ID ${bomId}`);
//       }

//       for (const item of bomItems) {
//         const qty = parseFloat(item.quantity || 0);
//         const unitPrice = parseFloat(item.material_unit_price || 0);
//         const gstRate = parseFloat(item.material_gst || 0);
//         const isITC = Boolean(item.material_is_gst_itc);

//         const baseCost = qty * unitPrice;
//         materialBaseTotal += baseCost;

//         const gstAmount = baseCost * (gstRate / 100);

//         if (isITC) {
//           materialGST_ITC += gstAmount; // recoverable
//         } else {
//           materialGST_NonITC += gstAmount; // added to cost
//         }
//       }
//     }

//     const rawMaterialTotal = materialBaseTotal + materialGST_NonITC;

//     /* ----------------------------------------------------
//        3. LABOR COST
//     ---------------------------------------------------- */
//     let laborTotal = 0;

//     for (const l of laborItems) {
//       const labor = await LaborRepository.findById(l.resource_id);
//       if (!labor) throw new ApiError(404, "Labor not found");

//       const hours = parseFloat(l.hours || 0);
//       const overtime = parseFloat(l.overtime_hours || 0);

//       // All thee types of labor are considered in the calculation
//       laborTotal +=
//         hours * parseFloat(labor.rate_per_hour) +
//         overtime * parseFloat(labor.overtime_rate);
//     }

//     /* ----------------------------------------------------
//        4. DIRECT COST
//     ---------------------------------------------------- */
//     const directCost = rawMaterialTotal + laborTotal;

//     /* ----------------------------------------------------
//        5. OVERHEAD COST
//     ---------------------------------------------------- */
//     let overheadTotal = 0;

//     for (const o of overheadItems) {
//       const oh = await OverheadRepository.findById(o.resource_id);
//       if (!oh) throw new ApiError(404, "Overhead not found");

//       let overheadAmount = 0;

//       if (oh.type === "fixed") {
//         overheadAmount = parseFloat(o.applied_value ?? oh.value);
//       }

//       if (oh.type === "percentage") {
//         const rate = parseFloat(o.percentage_value ?? oh.value);
//         overheadAmount = directCost * (rate / 100);
//       }

//       overheadTotal += overheadAmount;
//     }

//     /* ----------------------------------------------------
//        6. COST BEFORE PROFIT
//     ---------------------------------------------------- */
//     const costBeforeProfit = directCost + overheadTotal;

//     /* ----------------------------------------------------
//        7. PROFIT
//     ---------------------------------------------------- */
//     const profitValue = parseFloat(meta.profit_value || 0);
//     const profitType = meta.profit_type || "Percentage";

//     let profit = 0;

//     if (profitType === "Percentage") {
//       profit = costBeforeProfit * (profitValue / 100);
//     } else {
//       profit = profitValue;
//     }

//     const taxableValue = costBeforeProfit + profit;

//     /* ----------------------------------------------------
//        8. OUTPUT GST (FINAL PRODUCT)
//     ---------------------------------------------------- */
//     const outputGstRate = parseFloat(meta.project_gst || 0);
//     const outputGST = taxableValue * (outputGstRate / 100);

//     const finalCost = taxableValue + outputGST;

//     /* ----------------------------------------------------
//        9. RESPONSE
//     ---------------------------------------------------- */
//     return {
//       materialBaseTotal: `₹${materialBaseTotal.toFixed(2)}`,
//       materialGstItc: `₹${materialGST_ITC.toFixed(2)}`,
//       materialGstNonItc: `₹${materialGST_NonITC.toFixed(2)}`,
//       rawMaterialTotal: `₹${rawMaterialTotal.toFixed(2)}`,

//       laborTotal: `₹${laborTotal.toFixed(2)}`,
//       overheadTotal: `₹${overheadTotal.toFixed(2)}`,

//       directCost: `₹${directCost.toFixed(2)}`,
//       costBeforeProfit: `₹${costBeforeProfit.toFixed(2)}`,

//       profit: `₹${profit.toFixed(2)}`,
//       taxableValue: `₹${taxableValue.toFixed(2)}`,

//       outputGst: `₹${outputGST.toFixed(2)}`,
//       finalCost: `₹${finalCost.toFixed(2)}`,
//     };
//   },
// };
