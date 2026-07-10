import { WORKFLOWS } from "../index.js";
import { TenantWorkflowRepository } from "../repositories/tenantWorkflow.repository.js";
import { ConditionEngine } from "./condition.engine.js";
import { ActionEngine } from "./action.engine.js";

export const WorkflowEngine = {
  async trigger({
    tenant_id,
    event,
    payload,
  }) {
    const workflows = WORKFLOWS.filter((w) => w.event === event);

    for (const workflow of workflows) {
      const config = await TenantWorkflowRepository.getConfig(
        tenant_id,
        workflow.key,
      );

      if (config && !config.is_active) continue;

      const matched = ConditionEngine.check(workflow.conditions, payload);

      if (!matched) continue;

      await ActionEngine.execute({
        tenant_id,
        actions: workflow.actions,
        payload,
      });
    }
  },
};
