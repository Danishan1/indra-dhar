import { TeamRepository } from "../repositories/team.repository.js";

export const TeamService = {
  async list(tenantId) {
    const res = await TeamRepository.listByTenant(tenantId);
    return res.rows;
  },

  async create(tenantId, data) {
    const res = await TeamRepository.create({
      tenantId,
      name: data.name,
      managerId: data.managerId,
    });

    return res.rows[0];
  },

  async getById(id, tenantId) {
    const res = await TeamRepository.findById(id);

    const team = res.rows[0];
    if (!team) throw new Error("Team not found");

    if (team.tenant_id !== tenantId) {
      throw new Error("Forbidden");
    }

    return team;
  },

  async update(id, tenantId, data) {
    const existing = await TeamRepository.findById(id);
    const team = existing.rows[0];

    if (!team) throw new Error("Team not found");
    if (team.tenant_id !== tenantId) throw new Error("Forbidden");

    const res = await TeamRepository.update(id, data);
    return res.rows[0];
  },

  async remove(id, tenantId) {
    const existing = await TeamRepository.findById(id);
    const team = existing.rows[0];

    if (!team) throw new Error("Team not found");
    if (team.tenant_id !== tenantId) throw new Error("Forbidden");

    await TeamRepository.remove(id);
    return true;
  },

  async getMembers(teamId, tenantId) {
    const teamRes = await TeamRepository.findById(teamId);
    const team = teamRes.rows[0];

    if (!team) throw new Error("Team not found");
    if (team.tenant_id !== tenantId) throw new Error("Forbidden");

    const membersRes = await TeamRepository.getMembers(teamId);
    return membersRes.rows;
  },

  async assignManager(teamId, managerId, tenantId) {
    const teamRes = await TeamRepository.findById(teamId);
    const team = teamRes.rows[0];

    if (!team) throw new Error("Team not found");
    if (team.tenant_id !== tenantId) throw new Error("Forbidden");

    const updated = await TeamRepository.setManager(teamId, managerId);
    return updated.rows[0];
  },
};
