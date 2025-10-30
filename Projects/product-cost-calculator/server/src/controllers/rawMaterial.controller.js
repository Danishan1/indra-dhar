import { RawMaterialService } from "../services/rawMaterial.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const RawMaterialController = {
  async create(req, res, next) {
    try {
      const material = await RawMaterialService.createMaterial(req.body);
      return ApiResponse.success(res, material, "Raw material created successfully");
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const materials = await RawMaterialService.getAllMaterials(req.query);
      return ApiResponse.success(res, materials);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const material = await RawMaterialService.getMaterialById(req.params.id);
      return ApiResponse.success(res, material);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const material = await RawMaterialService.updateMaterial(req.params.id, req.body);
      return ApiResponse.success(res, material, "Raw material updated successfully");
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await RawMaterialService.deleteMaterial(req.params.id);
      return ApiResponse.success(res, null, "Raw material deactivated successfully");
    } catch (err) {
      next(err);
    }
  },
};
