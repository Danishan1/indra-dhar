// // services/costItem.service.js
// import { CostItemRepository } from "../repositories/costItem.repository.js";
// import { CostCategoryRepository } from "../repositories/costCategory.repository.js";
// import { ApiError } from "../utils/ApiError.js";
// import { sanitizeInput } from "../utils/sanitizeInput.js";

// export const CostItemService = {
//   async createItem(payload) {
//     const data = sanitizeInput(payload);

//     // Validate category
//     const category = await CostCategoryRepository.findById(data.category_id);
//     if (!category) throw new ApiError(400, "Invalid cost category");

//     // Create cost item
//     return CostItemRepository.create({
//       category_id: data.category_id,
//       name: data.name.trim(),
//       unit_type: data.unit_type || null,
//       default_rate: parseFloat(data.default_rate || 0),
//       vendor_id: data.vendor_id || null,
//       is_variable: data.is_variable ?? true,
//     });
//   },

//   async getAllItems(filters = {}) {
//     return CostItemRepository.findAll(filters);
//   },

//   async getItemById(id) {
//     const item = await CostItemRepository.findById(id);
//     if (!item) throw new ApiError(404, "Cost item not found");
//     return item;
//   },

//   async updateItem(id, updates) {
//     const sanitized = sanitizeInput(updates);
//     const existing = await CostItemRepository.findById(id);
//     if (!existing) throw new ApiError(404, "Cost item not found");

//     if (sanitized.category_id) {
//       const category = await CostCategoryRepository.findById(sanitized.category_id);
//       if (!category) throw new ApiError(400, "Invalid cost category");
//     }

//     return CostItemRepository.update(id, sanitized);
//   },

//   async deleteItem(id) {
//     const existing = await CostItemRepository.findById(id);
//     if (!existing) throw new ApiError(404, "Cost item not found");
//     return CostItemRepository.delete(id);
//   },
// };
