import { AuditService } from "../services/audit.service.js";

export const AuditController = {
  async list(req, res) {
    const logs = await AuditService.list(req.user.tenant_id);
    res.json(logs);
  },

  async getByEntity(req, res) {
    const logs = await AuditService.getByEntity(req.params.type, req.params.id);

    res.json(logs);
  },

  async getByUser(req, res) {
    const logs = await AuditService.getByUser(req.params.userId);
    res.json(logs);
  },
};
