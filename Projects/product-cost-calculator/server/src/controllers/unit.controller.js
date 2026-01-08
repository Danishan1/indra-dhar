import { UnitService } from "../services/unit.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const UnitController = {
  async create(req, res, next) {
    try {
      const unit = await UnitService.createUnit(req.body);
      return ApiResponse.success(res, unit, "Unit created successfully");
    } catch (err) {
      next(err);
    }
  },

  async bulkCreate(req, res, next) {
    try {
      const result = await UnitService.bulkCreateUnits(req.body);
      return ApiResponse.success(res, result, "Units created successfully");
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const units = await UnitService.getAllUnits();
      return ApiResponse.success(res, units);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const unit = await UnitService.getUnitById(req.params.id);
      return ApiResponse.success(res, unit);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const unit = await UnitService.updateUnit(req.params.id, req.body);
      return ApiResponse.success(res, unit, "Unit updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await UnitService.deleteUnit(req.params.id);
      return ApiResponse.success(res, null, "Unit deleted successfully");
    } catch (err) {
      next(err);
    }
  },
};
