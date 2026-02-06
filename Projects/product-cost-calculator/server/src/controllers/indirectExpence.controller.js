import { IndirectExpenseService } from "../services/indirectExpense.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const IndirectExpenseController = {
  async create(req, res, next) {
    try {
      const overhead = await IndirectExpenseService.createIndirectExpense(
        req.body,
      );
      return ApiResponse.success(
        res,
        overhead,
        "Indirect expense created successfully",
      );
    } catch (err) {
      next(err);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await IndirectExpenseService.getAllIndirectExpenses(
        req.query,
      );
      return ApiResponse.success(res, data);
    } catch (err) {
      next(err);
    }
  },

  async getOne(req, res, next) {
    try {
      const record = await IndirectExpenseService.getIndirectExpenseById(
        req.params.id,
      );
      return ApiResponse.success(res, record);
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const updated = await IndirectExpenseService.updateIndirectExpense(
        req.params.id,
        req.body,
      );
      return ApiResponse.success(
        res,
        updated,
        "Indirect expense updated successfully",
      );
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await IndirectExpenseService.deleteIndirectExpense(req.params.id);
      return ApiResponse.success(
        res,
        null,
        "Indirect expense deactivated successfully",
      );
    } catch (err) {
      next(err);
    }
  },
  async bulkCreate(req, res, next) {
    try {
      const overheads = await IndirectExpenseService.createIndirectExpBulk(
        req.body,
      );
      return ApiResponse.success(
        res,
        overheads,
        "Indirect expenses inserted successfully",
      );
    } catch (err) {
      next(err);
    }
  },
};
