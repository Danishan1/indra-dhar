import { DashboardService } from "../services/dashboard.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const DashboardController = {
  overview: async (req, res) => {
    const data = await DashboardService.overview(req.user.tenant_id);

    return ApiResponse.success({
      res,
      data,
      message: "Dashboard loaded successfully",
    });
  },
};
