import { apiUtil } from "@/utils/api";

export const DashboardAPI = {
  overview: async () => {
    return await apiUtil.get("/dashboard");
  },
};
