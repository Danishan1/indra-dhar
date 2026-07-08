import { apiUtil } from "@/utils/api";

export const LeadAPI = {
  /**
   * GET /leads
   */
  list: async (params = {}) => {
    return await apiUtil.get("/leads", {
      params,
    });
  },

  /**
   * POST /leads
   */
  create: async (payload) => {
    return await apiUtil.post("/leads", payload);
  },

  /**
   * GET /leads/:id
   */
  getById: async (id) => {
    return await apiUtil.get(`/leads/${id}`);
  },

  /**
   * PATCH /leads/:id
   */
  update: async (id, payload) => {
    return await apiUtil.patch(`/leads/${id}`, payload);
  },

  /**
   * DELETE /leads/:id
   */
  remove: async (id) => {
    return await apiUtil.delete(`/leads/${id}`);
  },

  /**
   * POST /leads/:id/assign
   */
  assign: async (id, payload) => {
    return await apiUtil.post(`/leads/${id}/assign`, payload);
  },

  /**
   * POST /leads/:id/stage
   */
  changeStage: async (id, payload) => {
    return await apiUtil.post(`/leads/${id}/stage`, payload);
  },

  /**
   * POST /leads/:id/status
   */
  updateStatus: async (id, payload) => {
    return await apiUtil.post(`/leads/${id}/status`, payload);
  },

  /**
   * POST /leads/:id/notes
   */
  addNote: async (id, payload) => {
    return await apiUtil.post(`/leads/${id}/notes`, payload);
  },

  /**
   * POST /leads/:id/attachments
   */
  uploadAttachment: async (id, formData) => {
    return await apiUtil.post(`/leads/${id}/attachments`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * GET /leads/:id/timeline
   */
  timeline: async (id) => {
    return await apiUtil.get(`/leads/${id}/timeline`);
  },

  /**
   * GET /leads/:id/duplicates
   */
  duplicates: async (id) => {
    return await apiUtil.get(`/leads/${id}/duplicates`);
  },
};
