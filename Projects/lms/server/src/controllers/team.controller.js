import { TeamService } from "../services/team.service.js";

export const TeamController = {
  async list(req, res) {
    const tenantId = req.user.tenant_id;

    const teams = await TeamService.list(tenantId);

    res.json(teams);
  },

  async create(req, res) {
    const tenantId = req.user.tenant_id;

    const team = await TeamService.create(tenantId, req.body);

    res.status(201).json(team);
  },

  async getById(req, res) {
    const tenantId = req.user.tenant_id;

    const team = await TeamService.getById(req.params.id, tenantId);

    res.json(team);
  },

  async update(req, res) {
    const tenantId = req.user.tenant_id;

    const team = await TeamService.update(req.params.id, tenantId, req.body);

    res.json(team);
  },

  async remove(req, res) {
    const tenantId = req.user.tenant_id;

    await TeamService.remove(req.params.id, tenantId);

    res.json({ success: true });
  },

  async getMembers(req, res) {
    const tenantId = req.user.tenant_id;

    const members = await TeamService.getMembers(req.params.id, tenantId);

    res.json(members);
  },

  async assignManager(req, res) {
    const tenantId = req.user.tenant_id;
    const { managerId } = req.body;

    const team = await TeamService.assignManager(
      req.params.id,
      managerId,
      tenantId,
    );

    res.json(team);
  },
};
