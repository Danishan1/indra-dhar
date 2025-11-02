import { pool } from "../config/db.js";

export const UtilityRepository = {
  async create(data) {
    const sql = `
      INSERT INTO utilities
      (utility_uuid, name, cost_per_unit, unit_type)
      VALUES (UUID(), ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.cost_per_unit,
      data.unit_type,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT *
      FROM utilities
      WHERE 1=1
    `;
    const params = [];

    if (filters.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    if (filters.unit_type) {
      sql += ` AND unit_type = ?`;
      params.push(filters.unit_type);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM utilities WHERE id = ?`, [
      id,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "utility_uuid", "created_at", "updated_at"].includes(key))
        fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE utilities SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`DELETE FROM utilities WHERE id = ?`, [id]);
    return { success: true };
  },
};
