import { IngestionRegistry } from "./integration.registry.js";
import { IntegrationService } from "./integration.service.js";

export const LeadIngestionService = {
  async ingest({ tenant_id, type, payload }) {
    // 1. Check if integration is enabled for tenant
    const integration = await IntegrationService.getActiveIntegration(
      tenant_id,
      type,
    );

    if (!integration) {
      throw new Error(`${type} integration not enabled for tenant`);
    }

    // 2. Get handler
    const handler = IngestionRegistry[type];

    if (!handler) {
      throw new Error(`No handler for ${type}`);
    }

    // 3. Normalize
    const normalized = handler.normalize({
      payload,
      config: integration.config,
    });

    return {
      source: type,
      tenant_id,
      data: normalized,
    };
  },
};
