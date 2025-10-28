// services/costCategory.service.js
import { CostCategoryRepository } from "../repositories/costCategory.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { sanitizeInput } from "../utils/sanitizeInput.js";

export const CostCategoryService = {
  async createCategory(payload) {
    const data = sanitizeInput(payload);

    // Check duplicate code
    const existing = await CostCategoryRepository.findByCode(data.code);
    if (existing) throw new ApiError(400, "Category code already exists");

    // Create record
    return CostCategoryRepository.create({
      name: data.name.trim(),
      code: data.code.toUpperCase(),
      cost_type: data.cost_type,
      allocation_basis: data.allocation_basis || "batch",
      is_active: true,
    });
  },

  async getAllCategories(filters = {}) {
    return CostCategoryRepository.findAll(filters);
  },

  async getCategoryById(id) {
    const category = await CostCategoryRepository.findById(id);
    if (!category) throw new ApiError(404, "Category not found");
    return category;
  },

  async updateCategory(id, updates) {
    const sanitized = sanitizeInput(updates);
    const existing = await CostCategoryRepository.findById(id);
    if (!existing) throw new ApiError(404, "Category not found");

    return CostCategoryRepository.update(id, sanitized);
  },

  async deleteCategory(id) {
    const existing = await CostCategoryRepository.findById(id);
    if (!existing) throw new ApiError(404, "Category not found");
    return CostCategoryRepository.delete(id);
  },
};
