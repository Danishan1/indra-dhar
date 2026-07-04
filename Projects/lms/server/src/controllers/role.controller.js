import { RoleService } from "../services/role.service.js";

export const RoleController = {
  async list(req, res) {
    const tenantId = req.user.tenant_id;

    const roles = await RoleService.list(tenantId);

    res.json(roles);
  },

  async create(req, res) {
    const tenantId = req.user.tenant_id;

    const role = await RoleService.create(tenantId, req.body);

    res.status(201).json(role);
  },

  async getById(req, res) {
    const tenantId = req.user.tenant_id;

    const role = await RoleService.getById(req.params.id, tenantId);

    res.json(role);
  },

  async update(req, res) {
    const tenantId = req.user.tenant_id;

    const role = await RoleService.update(req.params.id, tenantId, req.body);

    res.json(role);
  },

  async remove(req, res) {
    const tenantId = req.user.tenant_id;

    await RoleService.remove(req.params.id, tenantId);

    res.json({ success: true });
  },
};
