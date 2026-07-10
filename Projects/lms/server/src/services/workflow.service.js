import { WorkflowRepository } from "../repositories/workflow.repository.js";
import { WorkflowExecutionRepository } from "../repositories/workflowExecution.repository.js";
import { WORKFLOWS } from "../workflows/index.js";

export const WorkflowService = {
  async list(tenant_id) {
    const configs = await WorkflowRepository.findAll(tenant_id);

    return WORKFLOWS.map((workflow) => {
      const config = configs.find((x) => x.workflow_key === workflow.key);

      return {
        key: workflow.key,
        name: workflow.name,
        description: workflow.description,
        event: workflow.event,
        is_active: config ? true : false,
        config: config?.config || {},
        settings: workflow.settings || [],
      };
    });
  },

  async update(tenant_id, workflow_key, data) {
    return WorkflowRepository.upsert({
      tenant_id,
      workflow_key,
      is_active: data.is_active,
      config: data.config || {},
    });
  },

  async remove(tenant_id, workflow_key) {
    return WorkflowRepository.remove({ tenant_id, workflow_key });
  },

  async executions(tenant_id, filters) {
    return WorkflowExecutionRepository.findAll(tenant_id, filters);
  },

  async execution(tenant_id, id) {
    return WorkflowExecutionRepository.findById(tenant_id, id);
  },

  catalog() {
    return WorkflowRepository.catalog();
  },

  async install({ tenant_id, workflow_key, config }) {
    const exists = WORKFLOW_CATALOG.find((x) => x.key === workflow_key);

    if (!exists) {
      throw new Error("Workflow not found");
    }

    return WorkflowRepository.install({
      tenant_id,
      workflow_key,
      config,
    });
  },
};
