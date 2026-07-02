import { RoleService } from "../services/role.service.js";

export const RoleController = {
  async list(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const roles = await RoleService.list(tenantId);

      res.json(roles);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async create(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const role = await RoleService.create(tenantId, req.body);

      res.status(201).json(role);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const role = await RoleService.getById(req.params.id, tenantId);

      res.json(role);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  async update(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      const role = await RoleService.update(req.params.id, tenantId, req.body);

      res.json(role);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async remove(req, res) {
    try {
      const tenantId = req.user.tenant_id;

      await RoleService.remove(req.params.id, tenantId);

      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
};
