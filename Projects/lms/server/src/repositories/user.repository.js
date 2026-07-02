import { db } from "../config/db.js";

export const UserRepository = {
  create: (data) =>
    db.query(
      `INSERT INTO users (
        tenant_id, role_id, team_id, manager_id,
        first_name, last_name, email, mobile, password_hash
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        data.tenant_id,
        data.role_id,
        data.team_id,
        data.manager_id,
        data.first_name,
        data.last_name,
        data.email,
        data.mobile,
        data.password_hash,
      ],
    ),

  list: (tenantId) =>
    db.query(`SELECT * FROM users WHERE tenant_id = $1`, [tenantId]),

  findById: (id) => db.query(`SELECT * FROM users WHERE id = $1`, [id]),

  update: (id, data) =>
    db.query(
      `UPDATE users SET first_name=$1, last_name=$2, updated_at=NOW()
       WHERE id=$3 RETURNING *`,
      [data.first_name, data.last_name, id],
    ),

  updateStatus: (id, isActive) =>
    db.query(`UPDATE users SET is_active=$1 WHERE id=$2`, [isActive, id]),

  assignRole: (id, roleId) =>
    db.query(`UPDATE users SET role_id=$1 WHERE id=$2`, [roleId, id]),

  assignTeam: (id, teamId) =>
    db.query(`UPDATE users SET team_id=$1 WHERE id=$2`, [teamId, id]),
};
