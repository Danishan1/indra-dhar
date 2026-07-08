import { LeadWorkflowService } from "../services/lead/leadWorkflow.service.js";
import { IngestionRegistry } from "./integration.registry.js";
import { IntegrationService } from "./integration.service.js";

export const LeadIngestionService = {
  async ingest({ tenant_id, type, payload }) {
    const integration = await IntegrationService.getActiveIntegration(
      tenant_id,
      type,
    );

    if (!integration) {
      throw new Error(`${type} integration not enabled`);
    }

    const handler = IngestionRegistry[type];

    if (!handler) {
      throw new Error(`No handler for ${type}`);
    }

    const normalized = handler.normalize({
      payload,
      config: integration.config,
    });

    return LeadWorkflowService.process({
      tenant_id,
      source: type,
      data: normalized,
    });
  },
};
