import { NotificationRegistry } from "./integration.registry";
import { IntegrationService } from "./integration.service";

export const NotificationService = {
  async send({ tenant_id, type, payload }) {
    const integration = await IntegrationService.getActiveIntegration(
      tenant_id,
      type,
    );

    if (!integration) return;

    const provider = NotificationRegistry[type];

    if (!provider) return;

    return provider.send({
      config: integration.config,
      payload,
    });
  },
};
