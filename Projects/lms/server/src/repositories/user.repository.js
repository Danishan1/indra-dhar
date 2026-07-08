import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const UserRepository = {
  async create(data) {
    const result = await db.query(
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
    );

    return dbResponse.single(result);
  },

  async list(tenantId) {
    const result = await db.query(
      `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      CONCAT_WS(' ', u.first_name, u.last_name) AS full_name,
      u.email,
      u.mobile,
      u.avatar_url,
      u.is_active,
      u.email_verified,
      u.mobile_verified,
      u.last_login,
      u.created_at,

      t.name AS tenant,

      r.name AS role,

      tm.name AS team,

      CONCAT_WS(' ', m.first_name, m.last_name) AS manager

    FROM users u

    INNER JOIN tenants t
      ON t.id = u.tenant_id

    INNER JOIN roles r
      ON r.id = u.role_id

    LEFT JOIN teams tm
      ON tm.id = u.team_id

    LEFT JOIN users m
      ON m.id = u.manager_id

    WHERE u.tenant_id = $1

    ORDER BY u.first_name, u.last_name
    `,
      [tenantId],
    );

    return dbResponse.many(result);
  },

  async findById(id) {
    const result = await db.query(
      `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      CONCAT_WS(' ', u.first_name, u.last_name) AS full_name,
      u.email,
      u.mobile,
      u.avatar_url,
      u.is_active,
      u.email_verified,
      u.mobile_verified,
      u.last_login,
      u.created_at,
      u.updated_at,

      json_build_object(
        'id', t.id,
        'name', t.name,
        'code', t.code
      ) AS tenant,

      json_build_object(
        'id', r.id,
        'name', r.name
      ) AS role,

      CASE
        WHEN tm.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', tm.id,
          'name', tm.name
        )
      END AS team,

      CASE
        WHEN m.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', m.id,
          'name', CONCAT_WS(' ', m.first_name, m.last_name),
          'email', m.email
        )
      END AS manager

    FROM users u

    INNER JOIN tenants t
      ON t.id = u.tenant_id

    INNER JOIN roles r
      ON r.id = u.role_id

    LEFT JOIN teams tm
      ON tm.id = u.team_id

    LEFT JOIN users m
      ON m.id = u.manager_id

    WHERE u.id = $1
    `,
      [id],
    );

    return dbResponse.single(result);
  },

  async update(id, data) {
    const result = await db.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [data.first_name, data.last_name, id],
    );

    return dbResponse.single(result);
  },

  async updateStatus(id, isActive) {
    const result = await db.query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2`,
      [isActive, id],
    );

    return dbResponse.count(result);
  },

  async assignRole(id, roleId) {
    const result = await db.query(
      `UPDATE users
       SET role_id = $1
       WHERE id = $2`,
      [roleId, id],
    );

    return dbResponse.count(result);
  },

  async assignTeam(id, teamId) {
    const result = await db.query(
      `UPDATE users
       SET team_id = $1
       WHERE id = $2`,
      [teamId, id],
    );

    return dbResponse.count(result);
  },

  async getRandomAssignableUser({ tenant_id, team_id = null }) {
    const result = await db.query(
      `
      SELECT
        id,
        first_name,
        last_name,
        email,
        team_id
      FROM users
      WHERE tenant_id = $1
        AND is_active = TRUE
        AND ($2::uuid IS NULL OR team_id = $2)
      ORDER BY RANDOM()
      LIMIT 1
      `,
      [tenant_id, team_id],
    );

    return dbResponse.single(result);
  },
};
