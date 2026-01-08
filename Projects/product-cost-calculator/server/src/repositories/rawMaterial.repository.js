import { pool } from "../config/db.js";
import { applyPagination } from "../utils/applyPagination.js";

export const RawMaterialRepository = {
  async create(data) {
    const sql = `
      INSERT INTO raw_materials
      (material_uuid, name, unit_type_id, unit_price, is_gst_itc, gst, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?, 1)
    `;

    const [result] = await pool.execute(sql, [
      data.name,
      data.unit_type_id,
      data.unit_price,
      data.is_gst_itc ?? false,
      data.gst ?? 0,
    ]);

    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT 
        rm.*,
        u.name AS unit_name,
        u.unit_code
      FROM raw_materials rm
      LEFT JOIN units u ON rm.unit_type_id = u.id
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
        rm.*,
        u.name AS unit_name,
        u.unit_code
      FROM raw_materials rm
      LEFT JOIN units u ON rm.unit_type_id = u.id
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
          "unit_name",
          "unit_code",
          "unit_price",
        ].includes(key)
      )
        continue;

      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (!fields.length) return this.findById(id);

    await pool.execute(
      `UPDATE raw_materials SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE raw_materials SET is_active = 0 WHERE id = ?`, [
      id,
    ]);
    return { success: true };
  },

  async createBulk(materials) {
    const placeholders = materials
      .map(() => "(UUID(), ?, ?, ?, ?, ?, 1)")
      .join(", ");

    const values = [];
    materials.forEach((m) => {
      values.push(
        m.name,
        m.unit_type_id,
        m.unit_price,
        m.is_gst_itc ?? false,
        m.gst ?? 0
      );
    });

    const sql = `
      INSERT INTO raw_materials
      (material_uuid, name, unit_type_id, unit_price, is_gst_itc, gst, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);
    return { inserted: materials.length };
  },
};
