import { facebookWebhookSchema } from "../validators/facebook.validator.js";
import { processFacebookLead } from "../services/facebook.service.js";
import { IntegrationRepository } from "../repositories/integration.repository.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";

export async function verifyWebhook(req, res) {
  const verifyToken = req.query["hub.verify_token"];

  if (!verifyToken) {
    return res.sendStatus(403);
  }

  const configInfo =
    await IntegrationRepository.findFacebookByVerifyToken(verifyToken);

  if (!configInfo) {
    return res.sendStatus(403);
  }

  return res.status(200).send(req.query["hub.challenge"]);
}

export async function receiveLeadWebhook(req, res) {
  const payload = facebookWebhookSchema.parse(req.body);

  const pageId = payload.entry[0].id;

  const integration = await IntegrationRepository.findFacebookByPageId(pageId);

  if (!integration) {
    return res.sendStatus(403);
  }

  await processFacebookLead(payload, integration.tenant_id);

  return res.sendStatus(200);
}
