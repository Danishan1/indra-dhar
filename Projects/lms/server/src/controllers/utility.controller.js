import { UtilityService } from "../services/utility.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const UtilityController = {
  async create(req, res, next) {
    try {
      const utility = await UtilityService.createUtility(req.body);
      return ApiResponse.success(res, utility, "Utility created successfully");
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await UtilityService.getAllUtilities(req.query);
      return ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const utility = await UtilityService.getUtilityById(req.params.id);
      return ApiResponse.success(res, utility);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await UtilityService.updateUtility(
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, updated, "Utility updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await UtilityService.deleteUtility(req.params.id);
      return ApiResponse.success(res, null, "Utility deleted successfully");
    } catch (err) {
      next(err);
    }
  },

  async bulkCreate(req, res, next) {
    try {
      const utilities = await UtilityService.createUtilitiesBulk(req.body);
      return ApiResponse.success(
        res,
        utilities,
        "Utilities inserted successfully"
      );
    } catch (err) {
      next(err);
    }
  },
};
