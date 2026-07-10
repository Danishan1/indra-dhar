import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";

export const WorkflowExecutionRepository = {
  async findAll(tenant_id, filters = {}) {
    const result = await db.query(
      `
        SELECT *
        FROM workflow_executions
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3
      `,
      [tenant_id, filters.limit || 50, filters.offset || 0],
    );

    return dbResponse.many(result);
  },

  async findById(tenant_id, id) {
    const result = await db.query(
      `
        SELECT *
        FROM workflow_executions
        WHERE tenant_id = $1
        AND id = $2
      `,
      [tenant_id, id],
    );

    return dbResponse.single(result);
  },

  async executions({ tenant_id, limit, offset }) {
    const result = await db.query(
      `
        SELECT *
        FROM workflow_executions
        WHERE tenant_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3
      `,
      [tenant_id, limit, offset],
    );

    return dbResponse.many(result);
  },
};
