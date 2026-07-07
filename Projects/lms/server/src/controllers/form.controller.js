import { formLeadSchema } from "../validators/form.validator.js";
import { IntegrationRepository } from "../repositories/integration.repository.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";
import { LeadIngestionService } from "../integration/leadIngestion.service.js";

export async function receiveFormLead(req, res) {
  const token = req.query.token;

  if (!token) {
    return res.sendStatus(401);
  }

  const integration = await IntegrationRepository.findByApiToken(
    INTEGRATION_TYPE.FORM,
    token,
  );

  if (!integration) {
    return res.sendStatus(403);
  }

  const payload = formLeadSchema.parse(req.body);

  await LeadIngestionService.ingest({
    tenantId: integration.tenant_id,
    type: INTEGRATION_TYPE.FORM,
    payload,
  });

  return res.sendStatus(200);
}
