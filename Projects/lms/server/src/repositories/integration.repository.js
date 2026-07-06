import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const IntegrationRepository = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO integrations
       (tenant_id, name, type, category, provider, config, status)
       VALUES ($1,$2,$3,$4,$5,$6,'CONNECTED')
       RETURNING *`,
      [
        data.tenant_id,
        data.name,
        data.type,
        data.category,
        data.provider || null,
        JSON.stringify(data.config || {}),
      ],
    );

    return dbResponse.single(result);
  },

  async findAll(tenant_id) {
    const result = await db.query(
      `SELECT * FROM integrations
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenant_id],
    );

    return dbResponse.many(result);
  },

  async findById(id, tenant_id) {
    const result = await db.query(
      `SELECT * FROM integrations
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenant_id],
    );

    return dbResponse.single(result);
  },

  async update(id, tenant_id, data) {
    const result = await db.query(
      `UPDATE integrations
       SET
        name = COALESCE($3, name),
        provider = COALESCE($4, provider),
        status = COALESCE($5, status),
        config = COALESCE($6, config),
        updated_at = NOW()
       WHERE id = $1 AND tenant_id = $2
       RETURNING *`,
      [
        id,
        tenant_id,
        data.name,
        data.provider,
        data.status,
        data.config ? JSON.stringify(data.config) : null,
      ],
    );

    return dbResponse.single(result);
  },

  async delete(id, tenant_id) {
    const result = await db.query(
      `DELETE FROM integrations
       WHERE id = $1 AND tenant_id = $2
       RETURNING id`,
      [id, tenant_id],
    );

    return dbResponse.single(result);
  },
};
