import { fetchFacebookLead } from "../integration/client/facebook.client.js";
import { LeadIngestionService } from "../integration/leadIngestion.service.js";
import { INTEGRATION_TYPE } from "../validators/integration.validator.js";
import { IntegrationRepository } from "../repositories/integration.repository.js";

export async function processFacebookLead(webhookPayload, tenantId) {
  const configInfo = await IntegrationRepository.findByType(
    tenantId,
    INTEGRATION_TYPE.FACEBOOK,
  );

  if (!configInfo) {
    throw new Error("Facebook integration not configured");
  }

  for (const entry of webhookPayload.entry) {
    for (const change of entry.changes) {
      const leadData = await fetchFacebookLead(
        change.value.leadgen_id,
        configInfo.config,
      );

      await LeadIngestionService.ingest({
        tenantId,
        type: INTEGRATION_TYPE.FACEBOOK,
        payload: leadData,
      });
    }
  }
}
