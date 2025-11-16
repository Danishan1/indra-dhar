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

    sql += ` AND is_active = 1`;

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
    const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ?`, [
      email,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (["id", "user_uuid", "created_at", "updated_at"].includes(key))
        continue;
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
    await pool.execute(
      `UPDATE users SET is_active = 0, status = 'inactive' WHERE id = ?`,
      [id]
    );
    return { success: true };
  },

  async createBulk(users) {
    if (!users.length) return [];

    const placeholders = users.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(", ");
    const values = [];
    users.forEach((u) => {
      values.push(
        u.user_uuid,
        u.name,
        u.email,
        u.password_hash,
        u.role,
        u.status,
        true
      );
    });

    const sql = `
      INSERT INTO users
      (user_uuid, name, email, password_hash, role, status, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);

    // Optionally, return all inserted users
    const emails = users.map((u) => u.email);
    const [rows] = await pool.execute(
      `SELECT id, user_uuid, name, email, role, status, is_active, created_at 
       FROM users WHERE email IN (${emails.map(() => "?").join(",")})`,
      emails
    );

    return rows;
  },
};
