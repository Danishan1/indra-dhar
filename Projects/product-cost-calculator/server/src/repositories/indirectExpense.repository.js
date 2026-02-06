import { pool } from "../config/db.js";
import { applyPagination } from "../utils/applyPagination.js";
import { normalizeOverheadValues } from "../utils/normalizeOverheadValues.js";

export const IndirectExpRepository = {
  async create(data) {
    const sql = `
      INSERT INTO indirect_expense
      (indirect_expense_uuid, name, type, value, frequency, is_active)
      VALUES (UUID(), ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      data.name,
      data.type,
      data.value,
      data.frequency,
      true,
    ]);
    return this.findById(result.insertId);
  },

  async findAll(filters = {}) {
    let sql = `
      SELECT *
      FROM indirect_expense
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
    sql = applyPagination(sql, filters);
    const [rows] = await pool.execute(sql, params);

    return rows.map((row) => ({
      ...row,
      ...normalizeOverheadValues(row.value, row.frequency),
    }));
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM indirect_expense WHERE id = ?`, [
      id,
    ]);

    return {
      ...rows[0],
      ...normalizeOverheadValues(rows[0].value, rows[0].frequency),
    };
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(updates)) {
      if (
        [
          "id",
          "indirect_expense_uuid",
          "created_at",
          "updated_at",
          "monthly_value",
          "yearly_value",
          "per_hour_value",
        ].includes(key)
      )
        continue;
      fields.push(`${key} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findById(id);

    const sql = `UPDATE indirect_expense SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id);
    await pool.execute(sql, values);
    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`UPDATE indirect_expense SET is_active = 0 WHERE id = ?`, [id]);
    return { success: true };
  },

  async createBulk(indirectExp) {
    if (indirectExp.length === 0) return [];

    const placeholders = indirectExp
      .map(() => "(UUID(), ?, ?, ?, ?, true)")
      .join(", ");
    const values = [];
    indirectExp.forEach((o) => {
      values.push(o.name, o.type, o.value, o.frequency);
    });

    const sql = `
      INSERT INTO indirect_expense
      (indirect_expense_uuid, name, type, value, frequency, is_active)
      VALUES ${placeholders}
    `;

    await pool.execute(sql, values);

    return this.findAll(); // returns all active overheads; can modify to return only inserted
  },
};
