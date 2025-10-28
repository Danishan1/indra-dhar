import { CostAllocationRepository } from "../repositories/costAllocation.repository.js";
import { CostCategoryRepository } from "../repositories/costCategory.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const CostAllocationService = {
  async createAllocation(payload) {
    const data = sanitizeInput(payload);

    const category = await CostCategoryRepository.findById(data.category_id);
    if (!category) throw new ApiError(400, "Invalid cost category");

    const validBases = [
      "machine_hours",
      "labor_hours",
      "units_produced",
      "revenue_share",
      "custom_formula",
    ];

    if (!validBases.includes(data.allocation_basis)) {
      throw new ApiError(400, "Invalid allocation basis");
    }

    const percentage = parseFloat(data.allocation_percentage ?? 100.0);
    if (percentage < 0 || percentage > 100) {
      throw new ApiError(400, "Allocation percentage must be between 0 and 100");
    }

    return CostAllocationRepository.create({
      category_id: data.category_id,
      allocation_basis: data.allocation_basis,
      allocation_percentage: percentage,
      formula_expression: data.formula_expression || null,
    });
  },

  async getAllAllocations(filters = {}) {
    return CostAllocationRepository.findAll(filters);
  },

  async getAllocationById(id) {
    const allocation = await CostAllocationRepository.findById(id);
    if (!allocation) throw new ApiError(404, "Cost allocation not found");
    return allocation;
  },

  async updateAllocation(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await CostAllocationRepository.findById(id);
    if (!existing) throw new ApiError(404, "Cost allocation not found");

    if (sanitized.category_id) {
      const category = await CostCategoryRepository.findById(sanitized.category_id);
      if (!category) throw new ApiError(400, "Invalid cost category");
    }

    if (sanitized.allocation_percentage !== undefined) {
      const val = parseFloat(sanitized.allocation_percentage);
      if (isNaN(val) || val < 0 || val > 100) {
        throw new ApiError(400, "Allocation percentage must be between 0 and 100");
      }
    }

    return CostAllocationRepository.update(id, sanitized);
  },

  async deleteAllocation(id) {
    const existing = await CostAllocationRepository.findById(id);
    if (!existing) throw new ApiError(404, "Cost allocation not found");
    return CostAllocationRepository.delete(id);
  },
};
