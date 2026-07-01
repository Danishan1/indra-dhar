// import { VendorService } from "../services/vendor.service.js";
// import { ApiResponse } from "../utils/ApiResponse.js";

// export const VendorController = {
//   async create(req, res, next) {
//     try {
//       const vendor = await VendorService.createVendor(req.body);
//       return ApiResponse.success(res, vendor, "Vendor created successfully");
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getAll(req, res, next) {
//     try {
//       const vendors = await VendorService.getAllVendors(req.query);
//       return ApiResponse.success(res, vendors);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async getOne(req, res, next) {
//     try {
//       const vendor = await VendorService.getVendorById(req.params.id);
//       return ApiResponse.success(res, vendor);
//     } catch (err) {
//       next(err);
//     }
//   },

//   async update(req, res, next) {
//     try {
//       const vendor = await VendorService.updateVendor(req.params.id, req.body);
//       return ApiResponse.success(res, vendor, "Vendor updated successfully");
//     } catch (err) {
//       next(err);
//     }
//   },

//   async remove(req, res, next) {
//     try {
//       await VendorService.deleteVendor(req.params.id);
//       return ApiResponse.success(res, null, "Vendor deleted successfully");
//     } catch (err) {
//       next(err);
//     }
//   },
// };
