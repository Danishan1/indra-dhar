import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const UserRepository = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO users (
      tenant_id,
      manager_id,
      first_name,
      last_name,
      email,
      mobile,
      password_hash
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *`,
      [
        data.tenant_id,
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

      CONCAT_WS(' ', m.first_name, m.last_name) AS manager,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', tm.id,
            'name', tm.name,
            'is_leader', tmem.is_leader
          )
        ) FILTER (WHERE tm.id IS NOT NULL),
        '[]'
      ) AS teams

    FROM users u

    JOIN tenants t
      ON t.id = u.tenant_id

    LEFT JOIN users m
      ON m.id = u.manager_id

    LEFT JOIN team_members tmem
      ON tmem.user_id = u.id

    LEFT JOIN teams tm
      ON tm.id = tmem.team_id

    WHERE u.tenant_id = $1

    GROUP BY
      u.id,
      t.name,
      m.first_name,
      m.last_name

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

      CASE
        WHEN m.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', m.id,
          'name', CONCAT_WS(' ', m.first_name, m.last_name),
          'email', m.email
        )
      END AS manager,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', tm.id,
            'name', tm.name,
            'is_leader', tmem.is_leader
          )
        ) FILTER (WHERE tm.id IS NOT NULL),
        '[]'
      ) AS teams

    FROM users u

    JOIN tenants t
      ON t.id = u.tenant_id

    LEFT JOIN users m
      ON m.id = u.manager_id

    LEFT JOIN team_members tmem
      ON tmem.user_id = u.id

    LEFT JOIN teams tm
      ON tm.id = tmem.team_id

    WHERE u.id = $1

    GROUP BY
      u.id,
      t.id,
      m.id
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

  async assignTeam(userId, teamId, isLeader = false) {
    const result = await db.query(
      `
    INSERT INTO team_members (
      user_id,
      team_id,
      is_leader
    )
    VALUES ($1,$2,$3)
    ON CONFLICT (team_id, user_id)
    DO UPDATE
    SET is_leader = EXCLUDED.is_leader
    `,
      [userId, teamId, isLeader],
    );

    return dbResponse.count(result);
  },

  async removeFromTeam(userId, teamId) {
    const result = await db.query(
      `
    DELETE FROM team_members
    WHERE user_id = $1
      AND team_id = $2
    `,
      [userId, teamId],
    );

    return dbResponse.count(result);
  },

  async getRandomAssignableUser({ tenant_id, team_id = null }) {
    const result = await db.query(
      `
    SELECT
      u.id,
      u.first_name,
      u.last_name,
      u.email
    FROM users u
    WHERE u.tenant_id = $1
      AND u.is_active = TRUE
      AND (
        $2::uuid IS NULL
        OR EXISTS (
          SELECT 1
          FROM team_members tm
          WHERE tm.user_id = u.id
            AND tm.team_id = $2
        )
      )
    ORDER BY RANDOM()
    LIMIT 1
    `,
      [tenant_id, team_id],
    );

    return dbResponse.single(result);
  },
};
