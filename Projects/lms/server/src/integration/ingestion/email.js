export const EmailIngestion = {
  normalize({ payload }) {
    return {
      first_name: payload.from_name,
      email: payload.from_email,
      remarks: payload.body,
      product_interest: payload.subject,
      source_external_id: payload.message_id,
    };
  },
};
