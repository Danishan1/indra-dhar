import { db } from "../config/db.js";

export const DeliveryService = {
  async dispatch(notification) {
    const preferences = await this.getPreferences(
      notification.user_id,
      notification.type,
    );

    const channels = [];

    if (preferences.in_app) channels.push("IN_APP");
    if (preferences.email) channels.push("EMAIL");
    if (preferences.whatsapp) channels.push("WHATSAPP");

    for (const channel of channels) {
      await this.createDelivery(notification, channel);
    }
  },

  async getPreferences(userId, type) {
    const res = await db.query(
      `SELECT * FROM notification_preferences
       WHERE user_id = $1 AND notification_type = $2`,
      [userId, type],
    );

    return (
      res.rows[0] || {
        in_app: true,
        email: true,
        whatsapp: false,
      }
    );
  },

  async createDelivery(notification, channel) {
    // 1. Create delivery record
    await db.query(
      `INSERT INTO notification_deliveries
      (notification_id, channel, status)
      VALUES ($1,$2,'PENDING')`,
      [notification.id, channel],
    );

    // 2. Send immediately (or queue later via BullMQ)
    await this.send(channel, notification);
  },

  async send(channel, notification) {
    try {
      switch (channel) {
        case "IN_APP":
          // already stored in DB → nothing to send
          break;

        case "EMAIL":
          // integrate nodemailer / SES later
          console.log("EMAIL SENT", notification.title);
          break;

        case "WHATSAPP":
          // integrate WhatsApp API later
          console.log("WHATSAPP SENT", notification.title);
          break;
      }

      await this.markSuccess(notification.id, channel);
    } catch (err) {
      await this.markFailed(notification.id, channel, err.message);
    }
  },

  async markSuccess(notificationId, channel) {
    await db.query(
      `UPDATE notification_deliveries
       SET status = 'SENT', sent_at = NOW()
       WHERE notification_id = $1 AND channel = $2`,
      [notificationId, channel],
    );
  },

  async markFailed(notificationId, channel, error) {
    await db.query(
      `UPDATE notification_deliveries
       SET status = 'FAILED', error_message = $3
       WHERE notification_id = $1 AND channel = $2`,
      [notificationId, channel, error],
    );
  },
};
