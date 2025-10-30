// // controllers/costCategory.controller.js
// import { CostCategoryService } from "../services/costCategory.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// export const CostCategoryController = {
//   async create(req, res, next) {
//     try {
//       const category = await CostCategoryService.createCategory(req.body);
//       return ApiResponse.success(
//         res,
//         category,
//         "Category created successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getAll(req, res, next) {
//     try {
//       const categories = await CostCategoryService.getAllCategories(req.query);
//       return ApiResponse.success(res, categories);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getOne(req, res, next) {
//     try {
//       const category = await CostCategoryService.getCategoryById(req.params.id);
//       return ApiResponse.success(res, category);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async update(req, res, next) {
//     try {
//       const category = await CostCategoryService.updateCategory(
//         req.params.id,
//         req.body
//       );
//       return ApiResponse.success(
//         res,
//         category,
//         "Category updated successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },

//   async remove(req, res, next) {
//     try {
//       await CostCategoryService.deleteCategory(req.params.id);
//       return ApiResponse.success(
//         res,
//         null,
//         "Category deactivated successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },
// };
