import { CostCalculationService } from "../services/costCalculation.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const CostCalculationController = {
  async calculate(req, res, next) {
    try {
      const result = await CostCalculationService.calculate(req.body);
      return ApiResponse.success(res, result, "Cost calculated successfully");
    } catch (err) {
      next(err);
    }
  },
};
