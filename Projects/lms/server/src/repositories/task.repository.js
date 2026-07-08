import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const TaskRepository = {
  async create(data) {
    const result = await db.query(
      `INSERT INTO tasks
      (tenant_id, lead_id, assigned_to, task_type_id, title, description, priority, due_date, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        data.tenant_id,
        data.lead_id,
        data.assigned_to,
        data.task_type_id,
        data.title,
        data.description,
        data.priority,
        data.due_date,
        data.created_by,
      ],
    );

    return dbResponse.single(result);
  },

  async findAll(tenantId) {
    const result = await db.query(
      `
    SELECT
      t.id,
      t.title AS task,

      CONCAT_WS(' ', u.first_name, u.last_name) AS assigned,

      t.priority,
      t.status,
      t.due_date AS due

    FROM tasks t

    INNER JOIN users u
      ON u.id = t.assigned_to

    WHERE t.tenant_id = $1

    ORDER BY t.due_date ASC
    `,
      [tenantId],
    );

    return dbResponse.many(result);
  },

  async findById(id) {
    const taskResult = await db.query(
      `
    SELECT
      t.id,
      t.title,
      t.description,
      t.priority,
      t.status,
      t.outcome,
      t.due_date,
      t.start_time,
      t.completed_at,
      t.reminder_at,
      t.created_at,
      t.updated_at,

      CASE
        WHEN tt.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', tt.id,
          'name', tt.name
        )
      END AS task_type,

      json_build_object(
        'id', assignee.id,
        'name', CONCAT_WS(' ', assignee.first_name, assignee.last_name),
        'email', assignee.email,
        'avatar_url', assignee.avatar_url
      ) AS assigned_to,

      CASE
        WHEN lead.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', lead.id,
          'lead_number', lead.lead_number,
          'name', CONCAT_WS(' ', lead.first_name, lead.last_name),
          'company', lead.company
        )
      END AS lead,

      CASE
        WHEN creator.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', creator.id,
          'name', CONCAT_WS(' ', creator.first_name, creator.last_name)
        )
      END AS created_by

    FROM tasks t

    LEFT JOIN task_types tt
      ON tt.id = t.task_type_id

    INNER JOIN users assignee
      ON assignee.id = t.assigned_to

    LEFT JOIN leads lead
      ON lead.id = t.lead_id

    LEFT JOIN users creator
      ON creator.id = t.created_by

    WHERE t.id = $1
    `,
      [id],
    );

    const commentsResult = await db.query(
      `
    SELECT
      tc.id,
      tc.task_id,
      tc.comment,
      tc.created_at,

      u.id AS user_id,
      CONCAT_WS(' ', u.first_name, u.last_name) AS user_name,
      u.email AS user_email,
      u.avatar_url

    FROM task_comments tc

    LEFT JOIN users u
      ON u.id = tc.user_id

    WHERE tc.task_id = $1

    ORDER BY tc.created_at ASC
    `,
      [id],
    );

    const historyResult = await db.query(
      `
    SELECT
      th.id,
      th.old_status,
      th.new_status,
      th.old_assigned_to,
      th.new_assigned_to,
      th.remarks,
      th.changed_at,

      CASE
        WHEN changer.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', changer.id,
          'name', CONCAT_WS(' ', changer.first_name, changer.last_name)
        )
      END AS changed_by

    FROM task_history th

    LEFT JOIN users changer
      ON changer.id = th.changed_by

    WHERE th.task_id = $1

    ORDER BY th.changed_at DESC
    `,
      [id],
    );

    return {
      tasks: dbResponse.single(taskResult),
      comments: dbResponse.many(commentsResult),
      history: dbResponse.many(historyResult),
    };
  },

  async update(id, data) {
    const result = await db.query(
      `UPDATE tasks SET
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        priority = COALESCE($4, priority),
        due_date = COALESCE($5, due_date),
        updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, data.title, data.description, data.priority, data.due_date],
    );
    return dbResponse.single(result);
  },

  async delete(id) {
    const result = await db.query(`DELETE FROM tasks WHERE id = $1`, [id]);
    return dbResponse.count(result);
  },

  async assign(taskId, userId) {
    const result = await db.query(
      `UPDATE tasks
       SET assigned_to = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, userId],
    );

    return dbResponse.single(result);
  },

  async getAssigned(taskId) {
    const result = await db.query(
      `
    SELECT
      json_build_object(
        'id', u.id,
        'name', CONCAT_WS(' ', u.first_name, u.last_name),
        'email', u.email,
        'avatar_url', u.avatar_url
      ) AS assigned_to

    FROM tasks t

    INNER JOIN users u
      ON u.id = t.assigned_to

    WHERE t.id = $1
    `,
      [taskId],
    );

    return dbResponse.single(result);
  },

  async getStatus(taskId) {
    const res = await db.query(`SELECT status FROM tasks WHERE id = $1`, [
      taskId,
    ]);
    const result = res.rows[0]?.status;
    return result;
  },

  async updateStatus(taskId, status) {
    const result = await db.query(
      `UPDATE tasks
       SET status = $2,
           completed_at = CASE WHEN $2 = 'COMPLETED' THEN NOW() ELSE completed_at END,
           updated_at = NOW()
       WHERE id = $1`,
      [taskId, status],
    );

    return dbResponse.single(result);
  },

  async setOutcome(taskId, outcome) {
    const result = await db.query(
      `UPDATE tasks SET outcome = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, outcome],
    );

    return dbResponse.single(result);
  },

  async addComment(taskId, comment, userId) {
    const result = await db.query(
      `INSERT INTO task_comments (task_id, comment, user_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [taskId, comment, userId],
    );

    return dbResponse.single(result);
  },

  async logHistory(taskId, data) {
    const result = await db.query(
      `INSERT INTO task_history
       (task_id, old_status, new_status, old_assigned_to, new_assigned_to, changed_by)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        taskId,
        data.old_status,
        data.new_status,
        data.old_assigned_to,
        data.new_assigned_to,
        data.changed_by,
      ],
    );

    return dbResponse.single(result);
  },

  async getHistory(taskId) {
    const result = await db.query(
      `
    SELECT
      th.id,
      th.old_status,
      th.new_status,
      th.remarks,
      th.changed_at,

      CASE
        WHEN old_user.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', old_user.id,
          'name', CONCAT_WS(' ', old_user.first_name, old_user.last_name)
        )
      END AS old_assigned_to,

      CASE
        WHEN new_user.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', new_user.id,
          'name', CONCAT_WS(' ', new_user.first_name, new_user.last_name)
        )
      END AS new_assigned_to,

      CASE
        WHEN changer.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', changer.id,
          'name', CONCAT_WS(' ', changer.first_name, changer.last_name)
        )
      END AS changed_by

    FROM task_history th

    LEFT JOIN users old_user
      ON old_user.id = th.old_assigned_to

    LEFT JOIN users new_user
      ON new_user.id = th.new_assigned_to

    LEFT JOIN users changer
      ON changer.id = th.changed_by

    WHERE th.task_id = $1

    ORDER BY th.changed_at DESC
    `,
      [taskId],
    );

    return dbResponse.many(result);
  },

  async getComments({ taskId, tenant_id, limit = 50, offset = 0 }) {
    const query = `
    SELECT
      tc.id,
      tc.task_id,
      tc.comment,
      tc.created_at,

      u.id AS user_id,
      CONCAT_WS(' ', u.first_name, u.last_name) AS user_name,
      u.email AS user_email,
      u.avatar_url

    FROM task_comments tc

    JOIN tasks t
      ON t.id = tc.task_id

    LEFT JOIN users u
      ON u.id = tc.user_id

    WHERE tc.task_id = $1
      AND t.tenant_id = $2

    ORDER BY tc.created_at ASC

    LIMIT $3 OFFSET $4;
  `;

    const result = await db.query(query, [taskId, tenant_id, limit, offset]);

    return dbResponse.many(result);
  },
};
