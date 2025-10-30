import { pool } from "../config/db.js";

export const VendorRepository = {
  async create(data) {
    const sql = `
      INSERT INTO vendors
      (vendor_uuid, name, contact_name, email, phone, address)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.name,
      data.contact_name || null,
      data.email || null,
      data.phone || null,
      data.address || null,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `SELECT * FROM vendors WHERE 1=1`;
    const params = [];

    if (filters.name) {
      sql += ` AND name LIKE ?`;
      params.push(`%${filters.name}%`);
    }

    if (filters.email) {
      sql += ` AND email LIKE ?`;
      params.push(`%${filters.email}%`);
    }

    sql += ` ORDER BY created_at DESC`;
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  async findById(id) {
    const sql = `SELECT * FROM vendors WHERE id = ?`;
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

    const sql = `UPDATE vendors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`DELETE FROM vendors WHERE id = ?`, [id]);
    return { success: true };
  },
};
