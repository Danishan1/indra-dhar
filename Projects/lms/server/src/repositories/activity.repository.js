import { db } from "../config/db.js";

export const ActivityRepository = {
  async list(tenantId) {
    return db.query(
      `SELECT * FROM activities
       WHERE tenant_id = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [tenantId],
    );
  },

  async getByLead(leadId) {
    return db.query(
      `SELECT * FROM activities
       WHERE lead_id = $1
       ORDER BY created_at DESC`,
      [leadId],
    );
  },

  async getByEntity(type, id) {
    return db.query(
      `SELECT * FROM activities
       WHERE entity_type = $1 AND entity_id = $2
       ORDER BY created_at DESC`,
      [type, id],
    );
  },

  async create(data) {
    return db.query(
      `INSERT INTO activities
      (tenant_id, lead_id, user_id, entity_type, entity_id, activity_type,
       title, description, old_value, new_value, metadata, source)
       VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *`,
      [
        data.tenant_id,
        data.lead_id,
        data.user_id,
        data.entity_type,
        data.entity_id,
        data.activity_type,
        data.title,
        data.description,
        JSON.stringify(data.old_value),
        JSON.stringify(data.new_value),
        JSON.stringify(data.metadata),
        data.source || "SYSTEM",
      ],
    );
  },
};
