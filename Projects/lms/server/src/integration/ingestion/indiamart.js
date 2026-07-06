export const IndiaMartIngestion = {
  normalize({ payload }) {
    return {
      first_name: payload.name,
      mobile: payload.mobile,
      email: payload.email,
      company: payload.company,
      product_interest: payload.query,
      source_external_id: payload.lead_id,
    };
  },
};
