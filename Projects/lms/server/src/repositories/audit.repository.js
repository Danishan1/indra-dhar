import { db } from "../config/db.js";

export const AuditRepository = {
  async list(tenantId) {
    return db.query(
      `SELECT * FROM audit_logs
       WHERE tenant_id = $1
       ORDER BY created_at DESC
       LIMIT 200`,
      [tenantId],
    );
  },

  async getByEntity(type, id) {
    return db.query(
      `SELECT * FROM audit_logs
       WHERE entity_type = $1 AND entity_id = $2
       ORDER BY created_at DESC`,
      [type, id],
    );
  },

  async getByUser(userId) {
    return db.query(
      `SELECT * FROM audit_logs
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
  },
};
