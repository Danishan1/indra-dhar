import { CostCalculationService } from "../services/costCalculation.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const CostCalculationController = {
  async calculate(req, res, next) {
    try {
      const result = await CostCalculationService.calculate(req.body);
      if (result.success) {
        return ApiResponse.success(
          res,
          result.data,
          "Cost calculated successfully",
        );
      } else return ApiResponse.error(res, result.message);
    } catch (err) {
      next();
    }
  },
};
