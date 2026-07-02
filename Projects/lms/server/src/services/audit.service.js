import { AuditRepository } from "../repositories/audit.repository.js";

export const AuditService = {
  async list(tenantId) {
    return AuditRepository.list(tenantId);
  },

  async getByEntity(type, id) {
    return AuditRepository.getByEntity(type, id);
  },

  async getByUser(userId) {
    return AuditRepository.getByUser(userId);
  },
};
