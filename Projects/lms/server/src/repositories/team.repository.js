import { db } from "../config/db.js";

export const TeamRepository = {
  async listByTenant(tenantId) {
    return db.query(
      "SELECT * FROM teams WHERE tenant_id = $1 ORDER BY created_at DESC",
      [tenantId],
    );
  },

  async create({ tenantId, name, managerId }) {
    return db.query(
      `INSERT INTO teams (tenant_id, name, manager_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [tenantId, name, managerId || null],
    );
  },

  async findById(id) {
    return db.query("SELECT * FROM teams WHERE id = $1", [id]);
  },

  async update(id, data) {
    return db.query(
      `UPDATE teams
       SET name = COALESCE($1, name),
           manager_id = COALESCE($2, manager_id),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [data.name, data.managerId, id],
    );
  },

  async remove(id) {
    return db.query("DELETE FROM teams WHERE id = $1", [id]);
  },

  async setManager(teamId, managerId) {
    return db.query(
      `UPDATE teams
       SET manager_id = $1,
           updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [managerId, teamId],
    );
  },

  async getMembers(teamId) {
    return db.query(`SELECT * FROM users WHERE team_id = $1`, [teamId]);
  },
};
