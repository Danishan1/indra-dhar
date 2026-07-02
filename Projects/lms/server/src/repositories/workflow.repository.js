import { db } from "../config/db.js";

export const WorkflowRepository = {
  async createRule(data) {
    return db.query(
      `INSERT INTO workflow_rules
      (tenant_id, name, description, trigger_event, is_active, priority)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        data.tenant_id,
        data.name,
        data.description,
        data.trigger_event,
        data.is_active,
        data.priority,
      ],
    );
  },

  async listRules(tenantId) {
    return db.query(`SELECT * FROM workflow_rules WHERE tenant_id = $1`, [
      tenantId,
    ]);
  },

  async getRule(id) {
    return db.query(`SELECT * FROM workflow_rules WHERE id = $1`, [id]);
  },

  async updateRule(id, data) {
    return db.query(
      `UPDATE workflow_rules SET
        name = COALESCE($2, name),
        description = COALESCE($3, description),
        is_active = COALESCE($4, is_active),
        updated_at = NOW()
       WHERE id = $1`,
      [id, data.name, data.description, data.is_active],
    );
  },

  async deleteRule(id) {
    return db.query(`DELETE FROM workflow_rules WHERE id = $1`, [id]);
  },

  async addCondition(ruleId, data) {
    return db.query(
      `INSERT INTO workflow_conditions
      (rule_id, field_name, operator, value, logical_operator)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        ruleId,
        data.field_name,
        data.operator,
        data.value,
        data.logical_operator,
      ],
    );
  },

  async addAction(ruleId, data) {
    return db.query(
      `INSERT INTO workflow_actions
      (rule_id, action_type, action_config)
      VALUES ($1,$2,$3)
      RETURNING *`,
      [ruleId, data.action_type, JSON.stringify(data.action_config)],
    );
  },

  async getFullRule(id) {
    const rule = await db.query(`SELECT * FROM workflow_rules WHERE id = $1`, [
      id,
    ]);

    const conditions = await db.query(
      `SELECT * FROM workflow_conditions WHERE rule_id = $1`,
      [id],
    );

    const actions = await db.query(
      `SELECT * FROM workflow_actions WHERE rule_id = $1`,
      [id],
    );

    return {
      ...rule.rows[0],
      conditions: conditions.rows,
      actions: actions.rows,
    };
  },

  async getExecutions(filters) {
    return db.query(
      `SELECT * FROM workflow_executions
       ORDER BY executed_at DESC
       LIMIT 100`,
    );
  },
};
