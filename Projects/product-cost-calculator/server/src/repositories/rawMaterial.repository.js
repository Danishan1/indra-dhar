import { pool } from "../config/db.js";

export const RawMaterialRepository = {
  async create(data) {
    const sql = `
      INSERT INTO raw_materials
      (material_uuid, name, unit_type, unit_price, stock_quantity, reorder_level, vendor_id, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.unit_type,
      data.unit_price,
      data.stock_quantity || 0,
      data.reorder_level || 0,
      data.vendor_id || null,
      true,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT
        rm.*, 
        v.name AS vendor_name
      FROM raw_materials rm
      LEFT JOIN vendors v ON rm.vendor_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.is_active !== undefined) {
      sql += ` AND rm.is_active = ?`;
      params.push(filters.is_active);
    }

    if (filters.vendor_id) {
      sql += ` AND rm.vendor_id = ?`;
      params.push(filters.vendor_id);
    }

    if (filters.name) {
      sql += ` AND rm.name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    sql += ` ORDER BY rm.created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        rm.*, 
        v.name AS vendor_name
      FROM raw_materials rm
      LEFT JOIN vendors v ON rm.vendor_id = v.id
      WHERE rm.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "material_uuid","created_at", "updated_at", "vendor_name"].includes(key))
        continue; // skip immutable fields like id
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE raw_materials SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE raw_materials SET is_active = 0 WHERE id = ?`, [
      id,
    ]);
    return { success: true };
  },
};
