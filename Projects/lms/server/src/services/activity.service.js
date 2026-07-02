import { ActivityRepository } from "../repositories/activity.repository.js";

export const ActivityService = {
  async list(tenantId) {
    return ActivityRepository.list(tenantId);
  },

  async getByLead(leadId) {
    return ActivityRepository.getByLead(leadId);
  },

  async getByEntity(type, id) {
    return ActivityRepository.getByEntity(type, id);
  },

  async create(data) {
    return ActivityRepository.create(data);
  },
};
