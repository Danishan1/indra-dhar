import { TeamService } from "../services/team.service.js";

export const TeamController = {
  async list(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const teams = await TeamService.list(tenantId);

      res.json(teams);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const team = await TeamService.create(tenantId, req.body);

      res.status(201).json(team);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const team = await TeamService.getById(req.params.id, tenantId);

      res.json(team);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const team = await TeamService.update(req.params.id, tenantId, req.body);

      res.json(team);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      await TeamService.remove(req.params.id, tenantId);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getMembers(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const members = await TeamService.getMembers(req.params.id, tenantId);

      res.json(members);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async assignManager(req, res) {
    try {
      const tenantId = req.user.tenant_id;
      const { managerId } = req.body;

      const team = await TeamService.assignManager(
        req.params.id,
        managerId,
        tenantId,
      );

      res.json(team);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
