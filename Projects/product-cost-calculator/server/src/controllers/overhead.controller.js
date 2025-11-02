import { OverheadService } from "../services/overhead.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const OverheadController = {
  async create(req, res, next) {
    try {
      const overhead = await OverheadService.createOverhead(req.body);
      return ApiResponse.success(
        res,
        overhead,
        "Overhead created successfully"
      );
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await OverheadService.getAllOverheads(req.query);
      return ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const record = await OverheadService.getOverheadById(req.params.id);
      return ApiResponse.success(res, record);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await OverheadService.updateOverhead(
        req.params.id,
        req.body
      );
      return ApiResponse.success(res, updated, "Overhead updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await OverheadService.deleteOverhead(req.params.id);
      return ApiResponse.success(
        res,
        null,
        "Overhead deactivated successfully"
      );
    } catch (err) {
      next(err);
    }
  },
};
