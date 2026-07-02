import { db } from "../config/db.js";

export const TaskRepository = {
  async create(data) {
    return db.query(
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
  },

  async findAll(tenantId, filters) {
    return db.query(
      `SELECT * FROM tasks
       WHERE tenant_id = $1
       ORDER BY due_date ASC`,
      [tenantId],
    );
  },

  async findById(id) {
    return db.query(`SELECT * FROM tasks WHERE id = $1`, [id]);
  },

  async update(id, data) {
    return db.query(
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
  },

  async delete(id) {
    return db.query(`DELETE FROM tasks WHERE id = $1`, [id]);
  },

  async assign(taskId, userId) {
    return db.query(
      `UPDATE tasks
       SET assigned_to = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, userId],
    );
  },

  async getAssigned(taskId) {
    const res = await db.query(`SELECT assigned_to FROM tasks WHERE id = $1`, [
      taskId,
    ]);
    return res.rows[0]?.assigned_to;
  },

  async getStatus(taskId) {
    const res = await db.query(`SELECT status FROM tasks WHERE id = $1`, [
      taskId,
    ]);
    return res.rows[0]?.status;
  },

  async updateStatus(taskId, status) {
    return db.query(
      `UPDATE tasks
       SET status = $2,
           completed_at = CASE WHEN $2 = 'COMPLETED' THEN NOW() ELSE completed_at END,
           updated_at = NOW()
       WHERE id = $1`,
      [taskId, status],
    );
  },

  async setOutcome(taskId, outcome) {
    return db.query(
      `UPDATE tasks SET outcome = $2, updated_at = NOW()
       WHERE id = $1`,
      [taskId, outcome],
    );
  },

  async addComment(taskId, comment, userId) {
    return db.query(
      `INSERT INTO task_comments (task_id, comment, user_id)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [taskId, comment, userId],
    );
  },

  async logHistory(taskId, data) {
    return db.query(
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
  },

  async getHistory(taskId) {
    return db.query(
      `SELECT * FROM task_history
       WHERE task_id = $1
       ORDER BY changed_at DESC`,
      [taskId],
    );
  },

  async getComments({ taskId, tenant_id, limit = 50, offset = 0 }) {
    const query = `
      SELECT
        tc.id,
        tc.task_id,
        tc.comment,
        tc.created_at,
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email
      FROM task_comments tc
      JOIN tasks t ON t.id = tc.task_id
      LEFT JOIN users u ON u.id = tc.user_id
      WHERE tc.task_id = $1
        AND t.tenant_id = $2
      ORDER BY tc.created_at ASC
      LIMIT $3 OFFSET $4;
    `;

    const values = [taskId, tenant_id, limit, offset];

    const result = await db.query(query, values);
    return result.rows;
  },
};
