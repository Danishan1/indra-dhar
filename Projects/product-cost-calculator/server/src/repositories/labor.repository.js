import { pool } from "../config/db.js";
import { applyPagination } from "../utils/applyPagination.js";

export const LaborRepository = {
  async create(data) {
    const sql = `
      INSERT INTO labors
      (labor_uuid, name, rate_per_hour, overtime_rate, labor_type, remark, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.rate_per_hour,
      data.overtime_rate || 0.0,
      data.labor_type,
      data.remark,
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

    sql += ` AND is_active = 1`;

    if (filters.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    sql += ` ORDER BY created_at DESC`;

    sql = applyPagination(sql, params, filters);

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

  async createBulk(labors) {
    if (labors.length === 0) return [];

    const placeholders = labors
      .map(() => "(UUID(), ?, ?, ?, ?, ?, true)")
      .join(", ");
    const values = [];
    labors.forEach((l) => {
      values.push(l.name, l.rate_per_hour, l.overtime_rate || 0, l.labor_type,  l.remark);
      // values.push(l.name, l.type, l.rate_per_hour, l.overtime_rate || 0); // if using type
    });

    const sql = `
      INSERT INTO labors
      (labor_uuid, name, rate_per_hour, overtime_rate, labor_type, remark, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);

    return this.findAll(); // return all active labors; can modify to return inserted only
  },
};
