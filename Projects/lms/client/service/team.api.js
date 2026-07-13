import { apiUtil } from "@/utils/api";

export const TeamAPI = {
  /**
   * GET /teams
   */
  list: async (params = {}) => {
    return await apiUtil.get("/teams", {
      params,
    });
  },

  /**
   * POST /teams
   */
  create: async (payload) => {
    return await apiUtil.post("/teams", payload);
  },

  /**
   * GET /teams/:id
   */
  getById: async (id) => {
    return await apiUtil.get(`/teams/${id}`);
  },

  /**
   * PATCH /teams/:id
   */
  update: async (id, payload) => {
    return await apiUtil.patch(`/teams/${id}`, payload);
  },

  /**
   * DELETE /teams/:id
   */
  remove: async (id) => {
    return await apiUtil.delete(`/teams/${id}`);
  },

  /**
   * GET /teams/:id/members
   */
  members: async (id) => {
    return await apiUtil.get(`/teams/${id}/members`);
  },

  /**
   * POST /teams/:id/members
   */
  addMember: async (id, payload) => {
    return await apiUtil.post(`/teams/${id}/members`, payload);
  },

  /**
   * DELETE /teams/:id/members/:userId
   */
  removeMember: async (id, userId) => {
    return await apiUtil.delete(`/teams/${id}/members/${userId}`);
  },

  /**
   * PATCH /teams/:id/leader
   */
  setLeader: async (id, payload) => {
    return await apiUtil.patch(`/teams/${id}/leader`, payload);
  },

  /**
   * GET /teams/:id/children
   */
  children: async (id) => {
    return await apiUtil.get(`/teams/${id}/children`);
  },

  /**
   * GET /teams/assignable
   */
  getAssignableTeam: async () => {
    return await apiUtil.get(`/teams/assignable`);
  },
};
