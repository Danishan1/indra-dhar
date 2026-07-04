import { db } from "../config/db.js";

export const TenantRepository = {
  create: (data) =>
    db.query(
      `INSERT INTO tenants (name, code, logo_url, status)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [data.name, data.code, data.logo_url, data.status],
    ),

  list: () => db.query(`SELECT * FROM tenants ORDER BY created_at DESC`),

  findById: (id) => db.query(`SELECT * FROM tenants WHERE id = $1`, [id]),
  findIdByCode: async (code) => {
    const result = await db.query(`SELECT id FROM tenants WHERE code = $1`, [
      code,
    ]);

    return result.rows[0].id;
  },

  update: (id, data) =>
    db.query(
      `UPDATE tenants SET name=$1, logo_url=$2, status=$3, updated_at=NOW()
       WHERE id=$4 RETURNING *`,
      [data.name, data.logo_url, data.status, id],
    ),

  remove: (id) =>
    db.query(`UPDATE tenants SET status='SUSPENDED' WHERE id=$1`, [id]),
};
