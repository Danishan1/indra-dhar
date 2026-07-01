import { LaborService } from "../services/labor.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const LaborController = {
  async create(req, res, next) {
    try {
      const labor = await LaborService.createLabor(req.body);
      return ApiResponse.success(res, labor, "Labor created successfully");
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const labors = await LaborService.getAllLabors(req.query);
      return ApiResponse.success(res, labors);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const labor = await LaborService.getLaborById(req.params.id);
      return ApiResponse.success(res, labor);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const labor = await LaborService.updateLabor(req.params.id, req.body);
      return ApiResponse.success(res, labor, "Labor updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await LaborService.deleteLabor(req.params.id);
      return ApiResponse.success(res, null, "Labor deactivated successfully");
    } catch (err) {
      next(err);
    }
  },

  async bulkCreate(req, res, next) {
    try {
      const labors = await LaborService.createLaborsBulk(req.body);
      return ApiResponse.success(res, labors, "Labors inserted successfully");
    } catch (err) {
      next(err);
    }
  },
};
