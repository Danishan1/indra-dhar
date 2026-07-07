import { IntegrationRepository } from "../repositories/integration.repository.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";
import { fetchIndiaMartLead } from "../integration/client/indiamart.client.js";
import { LeadIngestionService } from "../integration/leadIngestion.service.js";

export async function processIndiaMartLead(webhookPayload, tenantId) {
  const configInfo = await IntegrationRepository.findByType(
    tenantId,
    INTEGRATION_TYPE.INDIAMART,
  );

  if (!configInfo) {
    throw new Error("IndiaMART integration not configured");
  }

  const leadData = await fetchIndiaMartLead(
    webhookPayload.query_id,
    configInfo.config,
  );

  await LeadIngestionService.ingest({
    tenantId,
    type: INTEGRATION_TYPE.INDIAMART,
    payload: leadData,
  });
}
