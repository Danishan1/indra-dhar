import { db } from "../config/db.js";

export const SessionRepository = {
  async listByUser(userId) {
    return db.query(
      `SELECT * FROM sessions
       WHERE user_id = $1 AND revoked_at IS NULL
       ORDER BY created_at DESC`,
      [userId],
    );
  },

  async findById(id) {
    return db.query("SELECT * FROM sessions WHERE id = $1", [id]);
  },

  async revokeById(id) {
    return db.query("UPDATE sessions SET revoked_at = NOW() WHERE id = $1", [
      id,
    ]);
  },

  async revokeAllByUser(userId) {
    return db.query(
      `UPDATE sessions
       SET revoked_at = NOW()
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [userId],
    );
  },
};
