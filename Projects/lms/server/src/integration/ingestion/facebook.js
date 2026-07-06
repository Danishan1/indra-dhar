export const FacebookIngestion = {
  normalize({ payload }) {
    return {
      first_name: payload.full_name?.split(" ")[0],
      last_name: payload.full_name?.split(" ").slice(1).join(" "),
      email: payload.email,
      mobile: payload.phone,
      source_external_id: payload.lead_id,
      metadata: {
        ad_id: payload.ad_id,
        campaign_id: payload.campaign_id,
      },
    };
  },
};
