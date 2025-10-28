import { pool } from "../config/db.js";

export const CostCategoryRepository = {
  async create(data) {
    const sql = `
      INSERT INTO cost_categories 
      (name, code, cost_type, allocation_basis, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.code,
      data.cost_type,
      data.allocation_basis || "batch",
      data.is_active ?? true,
    ]);

    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `SELECT * FROM cost_categories WHERE 1=1`;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ` AND is_active = ?`;
      params.push(filters.is_active);
    }

    sql += ` ORDER BY created_at DESC`;

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM cost_categories WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByCode(code) {
    const [rows] = await pool.execute(
      `SELECT * FROM cost_categories WHERE code = ?`,
      [code]
    );
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = ?`);
      values.push(value);
    });

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE cost_categories SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    const sql = `UPDATE cost_categories SET is_active = 0 WHERE id = ?`;
    await pool.execute(sql, [id]);
    return { success: true };
  },
};
