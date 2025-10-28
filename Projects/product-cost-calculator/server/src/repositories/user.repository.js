import { pool } from "../config/db.js";

export const UserRepository = {
  async create(data) {
    const sql = `
      INSERT INTO users (user_uuid, name, email, password_hash, role, status, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [
      data.user_uuid,
      data.name,
      data.email,
      data.password_hash,
      data.role || "user",
      data.status || "active",
      true,
    ]);

    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `SELECT id, user_uuid, name, email, role, status, is_active, created_at FROM users WHERE 1=1`;
    const params = [];

    if (filters.role) {
      sql += ` AND role = ?`;
      params.push(filters.role);
    }

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
      `SELECT id, user_uuid, name, email, role, status, is_active, created_at FROM users WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [email]);
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

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async softDelete(id) {
    await pool.execute(`UPDATE users SET is_active = 0, status = 'inactive' WHERE id = ?`, [id]);
    return { success: true };
  },
};
