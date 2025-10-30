// import { CostAllocationService } from "../services/costAllocation.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// export const CostAllocationController = {
//   async create(req, res, next) {
//     try {
//       const allocation = await CostAllocationService.createAllocation(req.body);
//       return ApiResponse.success(
//         res,
//         allocation,
//         "Cost allocation rule created successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getAll(req, res, next) {
//     try {
//       const allocations = await CostAllocationService.getAllAllocations(
//         req.query
//       );
//       return ApiResponse.success(res, allocations);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getOne(req, res, next) {
//     try {
//       const allocation = await CostAllocationService.getAllocationById(
//         req.params.id
//       );
//       return ApiResponse.success(res, allocation);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async update(req, res, next) {
//     try {
//       const allocation = await CostAllocationService.updateAllocation(
//         req.params.id,
//         req.body
//       );
//       return ApiResponse.success(
//         res,
//         allocation,
//         "Cost allocation updated successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },

//   async remove(req, res, next) {
//     try {
//       await CostAllocationService.deleteAllocation(req.params.id);
//       return ApiResponse.success(
//         res,
//         null,
//         "Cost allocation deactivated successfully"
//       );
//     } catch (err) {
//       next(err);
//     }
//   },
// };
