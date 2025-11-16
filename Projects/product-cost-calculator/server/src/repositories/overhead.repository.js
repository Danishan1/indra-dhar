import { pool } from "../config/db.js";

export const OverheadRepository = {
  async create(data) {
    const sql = `
      INSERT INTO overheads
      (overhead_uuid, name, type, value, frequency, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.type,
      data.value,
      data.frequency || "per_batch",
      true,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT *
      FROM overheads
      WHERE 1=1
    `;
    const params = [];

    sql += ` AND is_active = 1`;

    if (filters.type) {
      sql += ` AND type = ?`;
      params.push(filters.type);
    }

    if (filters.frequency) {
      sql += ` AND frequency = ?`;
      params.push(filters.frequency);
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
    const [rows] = await pool.execute(`SELECT * FROM overheads WHERE id = ?`, [
      id,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "overhead_uuid", "created_at", "updated_at"].includes(key))
        continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE overheads SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE overheads SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },

  async createBulk(overheads) {
    if (overheads.length === 0) return [];

    const placeholders = overheads
      .map(() => "(UUID(), ?, ?, ?, ?, true)")
      .join(", ");
    const values = [];
    overheads.forEach((o) => {
      values.push(
        o.name,
        o.type,
        o.value,
        o.frequency || "per_batch",
      );
    });

    const sql = `
      INSERT INTO overheads
      (overhead_uuid, name, type, value, frequency, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);

    return this.findAll(); // returns all active overheads; can modify to return only inserted
  },
};
