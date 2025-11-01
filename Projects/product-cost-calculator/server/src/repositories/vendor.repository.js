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
    // 1 Fetch existing record from DB
    const existing = await this.findById(id);
    if (!existing) throw new Error(`Vendor with id ${id} not found`);

    // 2 Determine changed fields
    const fields = [];
    const values = [];

    for (const [key, newValue] of Object.entries(updates)) {
      if (key === "id" || key === "created_at" || key === "updated_at")
        continue; // skip immutable fields like id

      const oldValue = existing[key];

      // Only add if value actually changed (also handle null vs empty string)
      const changed =
        (oldValue ?? null) !== (newValue ?? null) &&
        !(oldValue == null && newValue === "") &&
        !(oldValue === "" && newValue == null);

      if (changed) {
        fields.push(`${key} = ?`);
        values.push(newValue);
      }
    }

    // 3 If no changes, return existing record
    if (fields.length === 0) {
      console.log("No changes detected — skipping update.");
      return existing;
    }

    // 4 Build and execute SQL query
    const sql = `UPDATE vendors SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);

    await pool.execute(sql, values);

    // 5 Return fresh record
    return this.findById(id);
  },
  async delete(id) {
    await pool.execute(`DELETE FROM vendors WHERE id = ?`, [id]);
    return { success: true };
  },
};
