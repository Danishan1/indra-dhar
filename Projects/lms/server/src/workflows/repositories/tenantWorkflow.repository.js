export const TenantWorkflowRepository = {
  async getConfig(tenant_id, workflow_key) {
    const result = await db.query(
      `
SELECT *
FROM tenant_workflows
WHERE tenant_id=$1
AND workflow_key=$2
`,
      [tenant_id, workflow_key],
    );

    return result.rows[0];
  },

  async save(data) {
    await db.query(
      `
INSERT INTO tenant_workflows
(
tenant_id,
workflow_key,
is_active,
config
)

VALUES
($1,$2,$3,$4)

ON CONFLICT
(
tenant_id,
workflow_key
)

DO UPDATE SET

is_active=$3,

config=$4,

updated_at=NOW()

`,
      [data.tenant_id, data.workflow_key, data.is_active, data.config],
    );
  },
};
