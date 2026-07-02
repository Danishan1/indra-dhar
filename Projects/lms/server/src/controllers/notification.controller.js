import { NotificationService } from "../services/notification.service.js";

export const NotificationController = {
  async list(req, res) {
    const data = await NotificationService.list(req.user.id);
    res.json(data);
  },

  async markAsRead(req, res) {
    const result = await NotificationService.markAsRead(
      req.params.id,
      req.user.id,
    );

    res.json(result);
  },

  async archive(req, res) {
    const result = await NotificationService.archive(
      req.params.id,
      req.user.id,
    );

    res.json(result);
  },

  async create(req, res) {
    const notification = await NotificationService.create({
      ...req.body,
      tenant_id: req.user.tenant_id,
    });

    res.json(notification);
  },

  async bulkMarkRead(req, res) {
    const result = await NotificationService.bulkMarkRead(
      req.user.id,
      req.body.ids,
    );

    res.json(result);
  },
};
