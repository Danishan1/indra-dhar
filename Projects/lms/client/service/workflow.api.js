import { apiUtil } from "@/utils/api";

export const WorkflowAPI = {
  async list() {
    return await apiUtil.get("/workflow");
  },

  async update(key, payload) {
    return await apiUtil.put(`/workflow/${key}`, payload);
  },

  async executions(params = {}) {
    return await apiUtil.get("/workflow/executions", {
      params,
    });
  },

  async execution(id) {
    return await apiUtil.get(`/workflow/executions/${id}`);
  },

  async catalog() {
    return await apiUtil.get("/workflow/catalog");
  },

  async install(key, payload = {}) {
    return await apiUtil.post(`/workflow/${key}/install`, payload);
  },

  async remove(key) {
    return await apiUtil.delete(`/workflow/${key}`);
  },
};
