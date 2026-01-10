import { BomItemService } from "../services/bomItem.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const BomItemController = {
  async create(req, res, next) {
    console.log("REQ BODY IN CONTROLLER:", req.body);
    try {
      return ApiResponse.success(
        res,
        await BomItemService.create(req.body),
        "BOM item added"
      );
    } catch (e) {
      next(e);
    }
  },

  async getByBom(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        await BomItemService.getByBom(req.params.bomId)
      );
    } catch (e) {
      next(e);
    }
  },
  async getOne(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        await BomItemService.getOne(req.params.itemId)
      );
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      return ApiResponse.success(
        res,
        await BomItemService.update(req.params.id, req.body),
        "BOM item updated"
      );
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      await BomItemService.delete(req.params.id);
      return ApiResponse.success(res, null, "BOM item removed");
    } catch (e) {
      next(e);
    }
  },

  async bulkCreate(req, res, next) {
    try {
      const bomItems = await BomItemService.createBomItemsBulk(req.body);
      return ApiResponse.success(
        res,
        bomItems,
        "BOM items inserted successfully"
      );
    } catch (err) {
      next(err);
    }
  },
};
