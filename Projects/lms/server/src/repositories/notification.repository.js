import { db } from "../config/db.js";

export const NotificationRepository = {
  async findByUser(userId) {
    return db.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
  },

  async create(data) {
    return db.query(
      `INSERT INTO notifications
      (tenant_id, user_id, title, message, type, entity_type, entity_id, priority, channel, metadata)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [
        data.tenant_id,
        data.user_id,
        data.title,
        data.message,
        data.type,
        data.entity_type,
        data.entity_id,
        data.priority,
        data.channel,
        JSON.stringify(data.metadata || {}),
      ],
    );
  },

  async markAsRead(id, userId) {
    return db.query(
      `UPDATE notifications
       SET status = 'READ', read_at = NOW()
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
  },

  async archive(id, userId) {
    return db.query(
      `UPDATE notifications
       SET status = 'ARCHIVED'
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
  },

  async bulkMarkRead(userId, ids) {
    return db.query(
      `UPDATE notifications
       SET status = 'READ', read_at = NOW()
       WHERE user_id = $1 AND id = ANY($2)`,
      [userId, ids],
    );
  },
};
