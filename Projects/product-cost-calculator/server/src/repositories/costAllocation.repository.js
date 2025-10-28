import { pool } from "../config/db.js";

export const CostAllocationRepository = {
  async create(data) {
    const sql = `
      INSERT INTO cost_allocations 
      (category_id, allocation_basis, allocation_percentage, formula_expression, is_active)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.category_id,
      data.allocation_basis,
      data.allocation_percentage ?? 100.0,
      data.formula_expression || null,
      true,
    ]);

    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT 
        ca.*, 
        cc.name AS category_name
      FROM cost_allocations ca
      LEFT JOIN cost_categories cc ON ca.category_id = cc.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.category_id) {
      sql += ` AND ca.category_id = ?`;
      params.push(filters.category_id);
    }

    if (filters.is_active !== undefined) {
      sql += ` AND ca.is_active = ?`;
      params.push(filters.is_active);
    }

    sql += ` ORDER BY ca.created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        ca.*, 
        cc.name AS category_name
      FROM cost_allocations ca
      LEFT JOIN cost_categories cc ON ca.category_id = cc.id
      WHERE ca.id = ?
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

    const sql = `UPDATE cost_allocations SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE cost_allocations SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },
};
