import { RoleRepository } from "../repositories/role.repository.js";

export const RoleService = {
  async list(tenantId) {
    const res = await RoleRepository.listByTenant(tenantId);
    return res.rows;
  },

  async create(tenantId, data) {
    const res = await RoleRepository.create({
      tenantId,
      name: data.name,
      description: data.description,
      systemRole: data.systemRole,
    });

    return res.rows[0];
  },

  async getById(id, tenantId) {
    const res = await RoleRepository.findById(id);

    const role = res.rows[0];
    if (!role) throw new Error("Role not found");

    // tenant isolation check (VERY IMPORTANT)
    if (role.tenant_id !== tenantId) {
      throw new Error("Forbidden");
    }

    return role;
  },

  async update(id, tenantId, data) {
    const existing = await RoleRepository.findById(id);
    const role = existing.rows[0];

    if (!role) throw new Error("Role not found");
    if (role.tenant_id !== tenantId) throw new Error("Forbidden");

    const res = await RoleRepository.update(id, data);
    return res.rows[0];
  },

  async remove(id, tenantId) {
    const existing = await RoleRepository.findById(id);
    const role = existing.rows[0];

    if (!role) throw new Error("Role not found");
    if (role.tenant_id !== tenantId) throw new Error("Forbidden");

    await RoleRepository.remove(id);
    return true;
  },
};
