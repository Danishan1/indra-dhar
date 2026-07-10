import { db } from "../config/db.js";
import { dbResponse } from "../utils/dbResponse.js";
import { WORKFLOW_CATALOG } from "../workflows/definitions/workflow.catalog.js";
import { WORKFLOWS } from "../workflows/index.js";

export const WorkflowRepository = {
  async findAll(tenant_id) {
    const result = await db.query(
      `
        SELECT *
        FROM tenant_workflows
        WHERE tenant_id = $1
        ORDER BY created_at DESC
      `,
      [tenant_id],
    );

    return dbResponse.many(result);
  },

  async findOne(tenant_id, workflow_key) {
    const result = await db.query(
      `
        SELECT *
        FROM tenant_workflows
        WHERE tenant_id = $1
        AND workflow_key = $2
      `,
      [tenant_id, workflow_key],
    );

    return dbResponse.single(result);
  },

  async upsert({ tenant_id, workflow_key, is_active, config }) {
    const result = await db.query(
      `
        INSERT INTO tenant_workflows (
          tenant_id,
          workflow_key,
          is_active,
          config
        )
        VALUES ($1, $2, $3, $4)

        ON CONFLICT (
          tenant_id,
          workflow_key
        )

        DO UPDATE SET
          is_active = $3,
          config = $4,
          updated_at = NOW()

        RETURNING *
      `,
      [tenant_id, workflow_key, is_active, config],
    );

    return dbResponse.single(result);
  },

  async install(tenant_id, workflow_key, config = {}) {
    const workflow = WORKFLOWS.find(
      (workflow) => workflow.key === workflow_key,
    );

    if (!workflow) {
      throw new Error("Workflow not found");
    }

    return this.upsert({
      tenant_id,
      workflow_key,
      is_active: true,
      config,
    });
  },

  catalog() {
    return WORKFLOW_CATALOG;
  },

  async remove({ tenant_id, workflow_key }) {
    const result = await db.query(
      `
        DELETE
        FROM tenant_workflows
        WHERE tenant_id = $1
        AND workflow_key = $2
        RETURNING *
      `,
      [tenant_id, workflow_key],
    );

    return dbResponse.single(result);
  },

  async update({ tenant_id, workflow_key, is_active, config }) {
    const result = await db.query(
      `
        UPDATE tenant_workflows
        SET
          is_active = COALESCE($3, is_active),
          config = COALESCE($4, config),
          updated_at = NOW()
        WHERE tenant_id = $1
        AND workflow_key = $2
        RETURNING *
      `,
      [tenant_id, workflow_key, is_active, config],
    );

    return dbResponse.single(result);
  },
};
