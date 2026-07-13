import { DashboardRepository } from "../repositories/dashboard.repository.js";

export const DashboardService = {
  async overview(tenantId) {
    const [summary, teams] = await Promise.all([
      DashboardRepository.summary(tenantId),

      DashboardRepository.teamHierarchy(tenantId),
    ]);

    return {
      summary,

      teams,
    };
  },
};
