import { NotificationRepository } from "../repositories/notification.repository.js";
import { DeliveryService } from "./delivery.service.js";

export const NotificationService = {
  async list(userId) {
    return NotificationRepository.findByUser(userId);
  },

  async create(data) {
    // 1. Save notification
    const notification = await NotificationRepository.create(data);

    // 2. Trigger delivery pipeline
    await DeliveryService.dispatch(notification);

    return notification;
  },

  async markAsRead(id, userId) {
    return NotificationRepository.markAsRead(id, userId);
  },

  async archive(id, userId) {
    return NotificationRepository.archive(id, userId);
  },

  async bulkMarkRead(userId, ids) {
    return NotificationRepository.bulkMarkRead(userId, ids);
  },
};
