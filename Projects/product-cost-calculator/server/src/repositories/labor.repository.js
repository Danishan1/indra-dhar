import { pool } from "../config/db.js";

export const LaborRepository = {
  async create(data) {
    const sql = `
      INSERT INTO labors
      (labor_uuid, name, type, rate_per_hour, overtime_rate, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.type,
      data.rate_per_hour,
      data.overtime_rate || 0.0,
      true,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT *
      FROM labors
      WHERE 1=1
    `;
    const params = [];

    if (filters.type) {
      sql += ` AND type = ?`;
      params.push(filters.type);
    }

    sql += ` AND is_active = 1`;

    if (filters.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `SELECT * FROM labors WHERE id = ?`;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "labor_uuid", "created_at", "updated_at"].includes(key))
        continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE labors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE labors SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },
};
