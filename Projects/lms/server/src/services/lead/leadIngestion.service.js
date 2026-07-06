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

    // 3. Normalize
    const normalized = this.normalize({
      data: payload,
      source: type,
    });

    return {
      source: type,
      tenant_id,
      data: normalized,
    };
  },

  normalize({ source, data }) {
    switch (source) {
      case "MANUAL":
        return this.fromManual(data);

      case "FACEBOOK":
        return this.fromFacebook(data);

      case "INDIAMART":
        return this.fromIndiaMart(data);

      case "EMAIL":
        return this.fromEmail(data);

      case "EXCEL":
        return this.fromExcel(data);

      case "API":
      default:
        return this.fromApi(data);
    }
  },
  fromManual(data) {
    return {
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      mobile: data.mobile,
      company: data.company,
      budget: data.budget,
      product_interest: data.product_interest,
      source_external_id: null,
    };
  },
  fromFacebook(data) {
    return {
      first_name: data.full_name?.split(" ")[0],
      last_name: data.full_name?.split(" ").slice(1).join(" "),
      email: data.email,
      mobile: data.phone_number,
      source_external_id: data.lead_id,
      metadata: {
        ad_id: data.ad_id,
        campaign_id: data.campaign_id,
      },
    };
  },
  fromIndiaMart(data) {
    return {
      first_name: data.name,
      mobile: data.mobile,
      email: data.email,
      company: data.company_name,
      product_interest: data.query,
      source_external_id: data.lead_id,
    };
  },
  fromEmail(data) {
    return {
      first_name: data.from_name,
      email: data.from_email,
      product_interest: data.subject,
      remarks: data.body,
      source_external_id: data.message_id,
    };
  },
  fromExcel(data) {
    return {
      first_name: data["First Name"],
      last_name: data["Last Name"],
      email: data["Email"],
      mobile: data["Mobile"],
      company: data["Company"],
      budget: data["Budget"],
    };
  },
};
