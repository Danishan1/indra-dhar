import { indiaMartWebhookSchema } from "../validators/indiamart.validator.js";
import { processIndiaMartLead } from "../services/indiamart.service.js";
import { IntegrationRepository } from "../repositories/integration.repository.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";

export async function receiveIndiaMartLead(req, res) {
  const webhookToken = req.query.token;

  if (!webhookToken) {
    return res.sendStatus(401);
  }

  const integration = await IntegrationRepository.findByWebhookToken(
    INTEGRATION_TYPE.INDIAMART,
    webhookToken,
  );

  if (!integration) {
    return res.sendStatus(403);
  }

  const payload = indiaMartWebhookSchema.parse(req.body);

  await processIndiaMartLead(payload, integration.tenant_id);

  return res.sendStatus(200);
}
