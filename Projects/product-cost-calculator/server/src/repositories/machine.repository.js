import { pool } from "../config/db.js";

export const MachineRepository = {
  async create(data) {
    const sql = `
      INSERT INTO machines
      (machine_uuid, name, cost_per_hour, maintenance_cost, is_active)
      VALUES (UUID(), ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.cost_per_hour,
      data.maintenance_cost || 0.0,
      true,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT *
      FROM machines
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = ?`;
      params.push(filters.is_active);
    }

    if (filters.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `SELECT * FROM machines WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "machine_uuid", "created_at", "updated_at"].includes(key))
        fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE machines SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE machines SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },
};
