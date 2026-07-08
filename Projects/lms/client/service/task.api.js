import { apiUtil } from "@/utils/api";

export const TaskAPI = {
  async list(params = {}) {
    return await apiUtil.get("/tasks", {
      params,
    });
  },

  async getById(id) {
    return await apiUtil.get(`/tasks/${id}`);
  },

  async create(payload) {
    return await apiUtil.post("/tasks", payload);
  },

  async update(id, payload) {
    return await apiUtil.patch(`/tasks/${id}`, payload);
  },

  async remove(id) {
    return await apiUtil.delete(`/tasks/${id}`);
  },

  async assign(id, payload) {
    return await apiUtil.patch(
      `/tasks/${id}/assign`,

      payload,
    );
  },

  async changeStatus(id, payload) {
    return await apiUtil.patch(
      `/tasks/${id}/status`,

      payload,
    );
  },

  async setOutcome(id, payload) {
    return await apiUtil.patch(
      `/tasks/${id}/outcome`,

      payload,
    );
  },

  async addComment(id, payload) {
    return await apiUtil.post(
      `/tasks/${id}/comments`,

      payload,
    );
  },

  async comments(id, params = {}) {
    return await apiUtil.get(
      `/tasks/${id}/comments`,

      {
        params,
      },
    );
  },

  async history(id) {
    return await apiUtil.get(`/tasks/${id}/history`);
  },
};
