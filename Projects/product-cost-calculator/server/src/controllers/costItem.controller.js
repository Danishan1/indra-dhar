// // controllers/costItem.controller.js
// import { CostItemService } from "../services/costItem.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// export const CostItemController = {
//   async create(req, res, next) {
//     try {
//       const item = await CostItemService.createItem(req.body);
//       return ApiResponse.success(res, item, "Cost item created successfully");
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getAll(req, res, next) {
//     try {
//       const items = await CostItemService.getAllItems(req.query);
//       return ApiResponse.success(res, items);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getOne(req, res, next) {
//     try {
//       const item = await CostItemService.getItemById(req.params.id);
//       return ApiResponse.success(res, item);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async update(req, res, next) {
//     try {
//       const item = await CostItemService.updateItem(req.params.id, req.body);
//       return ApiResponse.success(res, item, "Cost item updated successfully");
//     } catch (err) {
//       next(err);
//     }
//   },

//   async remove(req, res, next) {
//     try {
//       await CostItemService.deleteItem(req.params.id);
//       return ApiResponse.success(
//         res,
//         null,
//         "Cost item deactivated successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },
// };
