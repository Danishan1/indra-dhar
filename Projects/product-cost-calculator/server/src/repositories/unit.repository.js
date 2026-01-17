import { pool } from "../config/db.js";

export const UnitRepository = {
  async create(data) {
    const sql = `
      INSERT INTO units (name, unit_code,  decimal_allowed)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.unit_code,
      data.decimal_allowed ?? true,
    ]);
    return this.findById(result.insertId);
  },

  async bulkCreate(units = []) {
    if (!units.length) return [];

    const sql = `
      INSERT INTO units (name, unit_code,  decimal_allowed)
      VALUES ?, ?, ?
    `;

    const values = units.map((u) => [
      u.name,
      u.unit_code,
      u.decimal_allowed ?? true,
    ]);

    await pool.query(sql, [values]);
    return { inserted: units.length };
  },

  async findAll() {
    const [rows] = await pool.execute(
      `SELECT * FROM units ORDER BY created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM units WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async findByName(name) {
    const [rows] = await pool.execute(`SELECT * FROM units WHERE name = ?`, [
      name,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "created_at", "updated_at"].includes(key)) continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (!fields.length) return this.findById(id);

    await pool.execute(`UPDATE units SET ${fields.join(", ")} WHERE id = ?`, [
      ...values,
      id,
    ]);

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`DELETE FROM units WHERE id = ?`, [id]);
    return { success: true };
  },
};
