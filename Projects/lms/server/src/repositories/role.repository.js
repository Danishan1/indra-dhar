import { db } from "../config/db.js";

export const RoleRepository = {
  async listByTenant(tenantId) {
    return db.query(
      "SELECT * FROM roles WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenantId],
    );
  },

  async create({ tenantId, name, description, systemRole }) {
    return db.query(
      `INSERT INTO roles (tenant_id, name, description, system_role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [tenantId, name, description, systemRole || false],
    );
  },

  async findById(id) {
    return db.query("SELECT * FROM roles WHERE id = $1", [id]);
  },

  async update(id, data) {
    return db.query(
      `UPDATE roles
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [data.name, data.description, id],
    );
  },

  async remove(id) {
    return db.query("DELETE FROM roles WHERE id = $1", [id]);
  },
};
