import { pool } from "../config/db.js";

export const BomItemRepository = {
  async create(data) {
    const [result] = await pool.execute(
      `
      INSERT INTO bom_items
      (bom_meta_id, material_id, quantity, decimal_allowed)
      VALUES (?, ?, ?, ?)
      `,
      [
        data.bom_meta_id,
        data.material_id,
        data.quantity,
        data.decimal_allowed ?? true,
      ]
    );
    return this.findById(result.insertId);
  },

  async findByBomId(bomId) {
    const [rows] = await pool.execute(
      `
      SELECT bi.*, 
        rm.name AS material_name, 
        rm.unit_price AS material_unit_price, 
        rm.is_gst_itc AS material_is_gst_itc, 
        rm.gst AS material_gst 
      FROM bom_items bi
      JOIN raw_materials rm ON rm.id = bi.material_id
      WHERE bi.bom_meta_id = ?
      `,
      [bomId]
    );
    return rows;
  },
  async findByItemId(itemId) {
    const [[rows]] = await pool.execute(
      `
      SELECT 
        rm.name AS material_name, 
        rm.unit_price AS material_unit_price, 
        rm.is_gst_itc AS material_is_gst_itc, 
        rm.gst AS material_gst,
        bi.*
      FROM bom_items bi
      JOIN raw_materials rm ON rm.id = bi.material_id
      WHERE bi.id = ?
      `,
      [itemId]
    );

    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(`SELECT * FROM bom_items WHERE id = ?`, [
      id,
    ]);
    return rows[0] || null;
  },

  async update(id, updates) {
    const fields = [];
    const values = [];

    for (const [k, v] of Object.entries(updates)) {
      if (
        [
          "material_name",
          "material_unit_price",
          "material_is_gst_itc",
          "material_gst",
          "id",
          "bom_meta_id",
          "created_at",
          "updated_at",
        ].includes(k)
      )
        continue;
      fields.push(`${k} = ?`);
      values.push(v);
    }

    await pool.execute(
      `UPDATE bom_items SET ${fields.join(", ")} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  },

  async delete(id) {
    await pool.execute(`DELETE FROM bom_items WHERE id = ?`, [id]);
    return { success: true };
  },

  async createBulk(items) {
    if (!items || !items.length) return { inserted: 0 };

    // Build placeholders for each row
    const placeholders = items.map(() => "(?, ?, ?, ?)").join(", ");

    // Flatten values
    const values = [];
    items.forEach((item) => {
      values.push(
        item.bom_meta_id,
        item.material_id,
        item.quantity,
        item.decimal_allowed ?? true
      );
    });

    const sql = `
      INSERT INTO bom_items
      (bom_meta_id, material_id, quantity, decimal_allowed)
      VALUES ${placeholders}
    `;

    const [result] = await pool.execute(sql, values);

    return { inserted: result.affectedRows };
  },
};
