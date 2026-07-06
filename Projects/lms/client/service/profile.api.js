import { useAPICaller } from "@/hooks";
import { apiUtil } from "@/utils/api";

export const ProfileAPI = {
  useMe: () => {
    return useAPICaller("/auth/me");
  },
};
