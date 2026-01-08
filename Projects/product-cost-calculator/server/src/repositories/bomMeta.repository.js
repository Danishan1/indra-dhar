import { pool } from "../config/db.js";

export const BomMetaRepository = {
  async create(data) {
    const [result] = await pool.execute(
      `INSERT INTO bom_meta (name) VALUES (?)`,
      [data.name]
    );
    return this.findById(result.insertId);
  },

  async findAll() {
    const [rows] = await pool.execute(
      `SELECT * FROM bom_meta ORDER BY created_at DESC`
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM bom_meta WHERE id = ?`, [
      id,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    await pool.execute(`UPDATE bom_meta SET name = ? WHERE id = ?`, [
      updates.name,
      id,
    ]);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`DELETE FROM bom_meta WHERE id = ?`, [id]);
    return { success: true };
  },
};
