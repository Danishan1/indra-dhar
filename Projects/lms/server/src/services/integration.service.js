import { IntegrationRepository } from "../repositories/integration.repository.js";

export const IntegrationService = {
  async create(tenant_id, data) {
    return IntegrationRepository.create({
      tenant_id,
      ...data,
    });
  },

  async list(tenant_id) {
    return IntegrationRepository.findAll(tenant_id);
  },

  async getById(id, tenant_id) {
    return IntegrationRepository.findById(id, tenant_id);
  },

  async update(id, tenant_id, data) {
    return IntegrationRepository.update(id, tenant_id, data);
  },

  async remove(id, tenant_id) {
    return IntegrationRepository.delete(id, tenant_id);
  },

  /**
   * Get active integration by type
   * (USED IN PIPELINE + NOTIFICATIONS)
   */
  async getByType(tenant_id, type) {
    const list = await IntegrationRepository.findAll(tenant_id);

    return list.find((i) => i.type === type && i.status === "CONNECTED");
  },
};
