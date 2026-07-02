import { ActivityService } from "../services/activity.service.js";

export const ActivityController = {
  async list(req, res) {
    const data = await ActivityService.list(req.user.tenant_id);
    res.json(data);
  },

  async getByLead(req, res) {
    const data = await ActivityService.getByLead(req.params.leadId);
    res.json(data);
  },

  async getByEntity(req, res) {
    const { type, id } = req.params;
    const data = await ActivityService.getByEntity(type, id);
    res.json(data);
  },

  async create(req, res) {
    const activity = await ActivityService.create({
      ...req.body,
      tenant_id: req.user.tenant_id,
      user_id: req.user.id,
    });

    res.json(activity);
  },
};
