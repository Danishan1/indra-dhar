const integrationConfigMap = {
  FACEBOOK: {
    pageId: "page_id",
    verifyToken: "verify_token",
    accessToken: "access_token",
  },

  INDIAMART: {
    apiKey: "api_key",
  },

  FORM: {
    apiToken: "api_token",
  },

  EMAIL: {
    host: "host",
    port: "port",
    username: "username",
    password: "password",
  },

  WHATSAPP: {
    phoneNumberId: "phone_number_id",
    businessId: "business_id",
    accessToken: "access_token",
  },

  SMS: {
    accountSid: "account_sid",
    authToken: "auth_token",
    senderNumber: "sender_number",
  },
};

export function mapIntegrationConfig(type, config = {}) {
  const mapping = integrationConfigMap[type];

  if (!mapping) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(mapping).map(([key, value]) => [key, config[value] ?? null]),
  );
}
