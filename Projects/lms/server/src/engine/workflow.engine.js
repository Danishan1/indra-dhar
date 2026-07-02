import { db } from "../config/db.js";

export const WorkflowEngine = {
  async execute(rule, leadId, payload) {
    try {
      // 1. Check conditions
      const conditionsOk = await this.evaluateConditions(
        rule.conditions,
        payload,
      );

      if (!conditionsOk) {
        return this.log(rule, leadId, "SKIPPED", null);
      }

      // 2. Execute actions
      for (const action of rule.actions) {
        await this.executeAction(action, leadId, payload);
      }

      return this.log(rule, leadId, "SUCCESS", null);
    } catch (err) {
      return this.log(rule, leadId, "FAILED", err.message);
    }
  },

  async evaluateConditions(conditions, payload) {
    let result = true;

    for (const cond of conditions) {
      const fieldValue = payload[cond.field_name];

      switch (cond.operator) {
        case "=":
          result = result && fieldValue == cond.value;
          break;

        case "!=":
          result = result && fieldValue != cond.value;
          break;

        case "IN":
          result = result && cond.value.split(",").includes(fieldValue);
          break;

        case "CONTAINS":
          result = result && fieldValue?.includes(cond.value);
          break;
      }
    }

    return result;
  },

  async executeAction(action, leadId, payload) {
    switch (action.action_type) {
      case "UPDATE_LEAD_STAGE":
        await db.query(`UPDATE leads SET stage_id = $1 WHERE id = $2`, [
          action.action_config.stage_id,
          leadId,
        ]);
        break;

      case "ASSIGN_LEAD":
        await db.query(`UPDATE leads SET assigned_to = $1 WHERE id = $2`, [
          action.action_config.user_id,
          leadId,
        ]);
        break;

      case "CREATE_TASK":
        await db.query(
          `INSERT INTO tasks
          (tenant_id, lead_id, assigned_to, title, due_date)
          VALUES ($1,$2,$3,$4,$5)`,
          [
            action.action_config.tenant_id,
            leadId,
            action.action_config.assigned_to,
            action.action_config.title,
            action.action_config.due_date,
          ],
        );
        break;

      case "SEND_NOTIFICATION":
        await db.query(
          `INSERT INTO notifications
          (tenant_id, user_id, title, message, type)
          VALUES ($1,$2,$3,$4,$5)`,
          [
            action.action_config.tenant_id,
            action.action_config.user_id,
            action.action_config.title,
            action.action_config.message,
            "WORKFLOW",
          ],
        );
        break;
    }
  },

  async log(rule, leadId, status, error) {
    return db.query(
      `INSERT INTO workflow_executions
      (rule_id, lead_id, status, error_message)
      VALUES ($1,$2,$3,$4)`,
      [rule.id, leadId, status, error],
    );
  },
};
