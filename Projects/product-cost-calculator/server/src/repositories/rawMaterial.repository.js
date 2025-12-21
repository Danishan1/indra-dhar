import { pool } from "../config/db.js";
import { applyPagination } from "../utils/applyPagination.js";

export const RawMaterialRepository = {
  async create(data) {
    const sql = `
      INSERT INTO raw_materials
      (material_uuid, name, unit_type, unit_price, is_active, gst)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.unit_type,
      data.unit_price,
      true,
      data.gst || 0.0,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
    SELECT rm.*
    FROM raw_materials rm
    WHERE rm.is_active = 1
  `;
    const params = [];

    if (filters.name) {
      sql += ` AND rm.name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    sql += ` ORDER BY rm.created_at DESC`;
    sql = applyPagination(sql, filters);

    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `
      SELECT 
        rm.*
      FROM raw_materials rm
      WHERE rm.id = ?
    `;
    const [rows] = await pool.execute(sql, [id]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (
        [
          "id",
          "material_uuid",
          "created_at",
          "updated_at",
          "vendor_name",
        ].includes(key)
      )
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

  async createBulk(materials) {
    if (materials.length === 0) return [];

    const placeholders = materials
      .map(() => "(UUID(), ?, ?, ?, ?, true)")
      .join(", ");
    const values = [];
    materials.forEach((m) => {
      values.push(m.name, m.unit_type, m.unit_price, m.type);
    });

    const sql = `
      INSERT INTO raw_materials
      (material_uuid, name, unit_type, unit_price, gst, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);

    return this.findAll(); // returns all active materials; can modify to return only inserted
  },
};
