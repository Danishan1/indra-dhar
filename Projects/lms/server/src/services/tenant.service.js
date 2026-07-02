import { TenantRepository } from "../repositories/tenant.repository.js";

export const TenantService = {
  create: async (data) => {
    return TenantRepository.create(data);
  },

  list: async () => {
    return TenantRepository.list();
  },

  getById: async (id) => {
    return TenantRepository.findById(id);
  },

  update: async (id, data) => {
    return TenantRepository.update(id, data);
  },

  remove: async (id) => {
    return TenantRepository.remove(id);
  },
};
