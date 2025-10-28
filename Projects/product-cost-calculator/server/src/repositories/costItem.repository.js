import { pool } from "../config/db.js";

export const CostItemRepository = {
  async create(data) {
    const sql = `
      INSERT INTO cost_items 
      (category_id, name, unit_type, default_rate, vendor_id, is_variable, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.category_id,
      data.name,
      data.unit_type || null,
      data.default_rate || 0.0,
      data.vendor_id || null,
      data.is_variable ?? true,
      true,
    ]);

    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT 
        ci.*, 
        cc.name AS category_name, 
        v.name AS vendor_name 
      FROM cost_items ci
      LEFT JOIN cost_categories cc ON ci.category_id = cc.id
      LEFT JOIN vendors v ON ci.vendor_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category_id) {
      sql += ` AND ci.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.is_active !== undefined) {
      sql += ` AND ci.is_active = ?`;
      params.push(filters.is_active);
    }

    sql += ` ORDER BY ci.created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        ci.*, 
        cc.name AS category_name, 
        v.name AS vendor_name 
      FROM cost_items ci
      LEFT JOIN cost_categories cc ON ci.category_id = cc.id
      LEFT JOIN vendors v ON ci.vendor_id = v.id
      WHERE ci.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE cost_items SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE cost_items SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },
};
