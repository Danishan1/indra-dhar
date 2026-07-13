import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const TeamRepository = {
  async create(data) {
    const result = await db.query(
      `
      INSERT INTO teams (
        tenant_id,
        parent_team_id,
        name,
        description
      )
      VALUES ($1,$2,$3,$4)
      RETURNING *
      `,
      [data.tenant_id, data.parent_team_id, data.name, data.description],
    );

    return dbResponse.single(result);
  },

  async list(tenantId) {
    const result = await db.query(
      `
      SELECT
        t.id,
        t.name,
        t.description,

        t.parent_team_id,

        parent.name AS parent_team,

        t.created_at,
        t.updated_at,

        COUNT(tm.user_id)::INT AS members_count

      FROM teams t

      LEFT JOIN teams parent
        ON parent.id = t.parent_team_id

      LEFT JOIN team_members tm
        ON tm.team_id = t.id

      WHERE t.tenant_id = $1

      GROUP BY
        t.id,
        parent.name

      ORDER BY t.name
      `,
      [tenantId],
    );

    return dbResponse.many(result);
  },

  async listWithMembers(tenantId) {
    const result = await db.query(
      `
    SELECT
      t.id,
      t.name,
      t.description,

      COALESCE(
        json_agg(
          jsonb_build_object(
            'id', u.id,
            'first_name', u.first_name,
            'last_name', u.last_name,
            'full_name', CONCAT_WS(' ', u.first_name, u.last_name),
            'email', u.email,
            'mobile', u.mobile,
            'is_leader', tm.is_leader
          )
          ORDER BY u.first_name
        )
        FILTER (WHERE u.id IS NOT NULL),
        '[]'
      ) AS members

    FROM teams t

    LEFT JOIN team_members tm
      ON tm.team_id = t.id

    LEFT JOIN users u
      ON u.id = tm.user_id
      AND u.is_active = TRUE

    WHERE t.tenant_id = $1

    GROUP BY t.id

    ORDER BY t.name
    `,
      [tenantId],
    );

    return dbResponse.many(result);
  },

  async findById(id) {
    const result = await db.query(
      `
      SELECT
        t.id,
        t.name,
        t.description,

        t.parent_team_id,

        CASE
          WHEN parent.id IS NULL THEN NULL
          ELSE json_build_object(
            'id', parent.id,
            'name', parent.name
          )
        END AS parent_team,


        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', u.id,
              'name', CONCAT_WS(' ', u.first_name, u.last_name),
              'email', u.email,
              'is_leader', tm.is_leader
            )
          )
          FILTER (WHERE u.id IS NOT NULL),
          '[]'
        ) AS members,


        t.created_at,
        t.updated_at

      FROM teams t

      LEFT JOIN teams parent
        ON parent.id = t.parent_team_id

      LEFT JOIN team_members tm
        ON tm.team_id = t.id

      LEFT JOIN users u
        ON u.id = tm.user_id

      WHERE t.id = $1

      GROUP BY
        t.id,
        parent.id

      `,
      [id],
    );

    return dbResponse.single(result);
  },

  async update(id, data) {
    const result = await db.query(
      `
      UPDATE teams
      SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        parent_team_id = COALESCE($3, parent_team_id),
        updated_at = NOW()

      WHERE id = $4

      RETURNING *
      `,
      [data.name, data.description, data.parent_team_id, id],
    );

    return dbResponse.single(result);
  },

  async remove(id) {
    const result = await db.query(
      `
      DELETE FROM teams
      WHERE id = $1
      `,
      [id],
    );

    return dbResponse.count(result);
  },

  async listMembers(teamId) {
    const result = await db.query(
      `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        CONCAT_WS(' ', u.first_name, u.last_name) AS full_name,
        u.email,
        u.mobile,

        tm.is_leader,
        tm.joined_at

      FROM team_members tm

      INNER JOIN users u
        ON u.id = tm.user_id

      WHERE tm.team_id = $1

      ORDER BY
        tm.is_leader DESC,
        u.first_name
      `,
      [teamId],
    );

    return dbResponse.many(result);
  },

  async addMember(data) {
    const result = await db.query(
      `
      INSERT INTO team_members (
        team_id,
        user_id,
        is_leader
      )
      VALUES ($1,$2,$3)

      ON CONFLICT (team_id,user_id)

      DO UPDATE SET
        is_leader = EXCLUDED.is_leader

      RETURNING *
      `,
      [data.team_id, data.user_id, data.is_leader],
    );

    return dbResponse.single(result);
  },

  async removeMember(teamId, userId) {
    const result = await db.query(
      `
      DELETE FROM team_members
      WHERE team_id = $1
        AND user_id = $2
      `,
      [teamId, userId],
    );

    return dbResponse.count(result);
  },

  async setLeader(teamId, userId, isLeader) {
    const result = await db.query(
      `
      UPDATE team_members
      SET is_leader = $1
      WHERE team_id = $2
        AND user_id = $3

      RETURNING *
      `,
      [isLeader, teamId, userId],
    );

    return dbResponse.single(result);
  },

  async listChildren(teamId) {
    const result = await db.query(
      `
      SELECT
        id,
        name,
        description,
        parent_team_id,
        created_at

      FROM teams

      WHERE parent_team_id = $1

      ORDER BY name
      `,
      [teamId],
    );

    return dbResponse.many(result);
  },

  async getParent(id) {
    const result = await db.query(
      `
    SELECT
      id,
      parent_team_id

    FROM teams

    WHERE id = $1
    `,
      [id],
    );

    return result.rows[0] || null;
  },
};
