import { BomMetaService } from "../services/bomMeta.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const BomMetaController = {
  async create(req, res, next) {
    try {
      const bom = await BomMetaService.create(req.body);
      return ApiResponse.success(res, bom, "BOM created");
    } catch (e) {
      next(e);
    }
  },

  async getAll(req, res, next) {
    try {
      return ApiResponse.success(res, await BomMetaService.getAll());
    } catch (e) {
      next(e);
    }
  },

  async getOne(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        await BomMetaService.getById(req.params.id)
      );
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        await BomMetaService.update(req.params.id, req.body),
        "BOM updated"
      );
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await BomMetaService.delete(req.params.id);
      return ApiResponse.success(res, null, "BOM deleted");
    } catch (e) {
      next(e);
    }
  },
};
