import { db } from "../config/db.js";

export const IntegrationService = {
  async getActiveIntegration(tenant_id, type) {
    const result = await db.query(
      `SELECT * FROM integrations
       WHERE tenant_id = $1
       AND type = $2
       AND is_active = true`,
      [tenant_id, type],
    );

    return result.rows[0];
  },

  async listByCategory(tenant_id, category) {
    const result = await db.query(
      `SELECT * FROM integrations
       WHERE tenant_id = $1
       AND category = $2
       AND is_active = true`,
      [tenant_id, category],
    );

    return result.rows;
  },
};
