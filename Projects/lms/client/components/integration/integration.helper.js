export const INTEGRATION_FIELDS = {
  INDIAMART: [
    {
      name: "apiKey",
      label: "API Key",
      placeholder: "Enter your IndiaMart API key",
      required: true,
    },
    {
      name: "crmKey",
      label: "CRM Key",
      placeholder: "Enter your CRM key (optional)",
      required: false,
    },
  ],

  FACEBOOK: [
    {
      name: "pageAccessToken",
      label: "Page Access Token",
      placeholder: "EAABsbCS1iHgBA...",
      required: true,
    },
    {
      name: "pageId",
      label: "Page ID",
      placeholder: "123456789012345",
      required: true,
    },
  ],

  API: [
    {
      name: "endpoint",
      label: "Endpoint URL",
      placeholder: "https://api.example.com/webhook",
      required: true,
    },
    {
      name: "apiKey",
      label: "API Key",
      placeholder: "Enter your API key",
      required: true,
    },
  ],

  WHATSAPP: [
    {
      name: "accessToken",
      label: "Access Token",
      placeholder: "Enter your WhatsApp Cloud API access token",
      required: true,
    },
    {
      name: "phoneNumberId",
      label: "Phone Number ID",
      placeholder: "123456789012345",
      required: true,
    },
  ],

  SMS: [
    {
      name: "apiKey",
      label: "API Key",
      placeholder: "Enter your SMS provider API key",
      required: true,
    },
    {
      name: "senderId",
      label: "Sender ID",
      placeholder: "e.g. MYAPP",
      required: true,
    },
  ],

  EMAIL: [
    {
      name: "smtpHost",
      label: "SMTP Host",
      placeholder: "smtp.gmail.com",
      required: true,
    },
    {
      name: "smtpPort",
      label: "SMTP Port",
      placeholder: "587",
      required: true,
    },
    {
      name: "username",
      label: "Username",
      placeholder: "noreply@example.com",
      required: true,
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your SMTP password or app password",
      required: true,
    },
  ],
};

export const INTEGRATION_CATALOG = [
  {
    name: "IndiaMart",
    type: "INDIAMART",
    category: "INBOUND",
    provider: "INDIAMART",
  },
  {
    name: "Facebook",
    type: "FACEBOOK",
    category: "INBOUND",
    provider: "META",
  },
  {
    name: "API",
    type: "API",
    category: "INBOUND",
    provider: "CUSTOM",
  },
  {
    name: "WhatsApp",
    type: "WHATSAPP",
    category: "OUTBOUND",
    provider: "META",
  },
  {
    name: "Text Message",
    type: "SMS",
    category: "OUTBOUND",
    provider: "TWILIO",
  },
  {
    name: "Email",
    type: "EMAIL",
    category: "OUTBOUND",
    provider: "SMTP",
  },
];

const DEFAULT_INTEGRATIONS = INTEGRATION_CATALOG.map((item) => ({
  isConfigured: true,
  id: item.type,
  name: item.name,
  type: item.type,
  category: item.category,
  provider: item.provider,
  status: "DISCONNECTED",
  config: {},
}));

export const mergeIntegrations = (tenantIntegrations) => {
  const map = new Map(
    tenantIntegrations.map((integration) => [integration.type, integration]),
  );

  return DEFAULT_INTEGRATIONS.map((integration) => {
    const configured = map.get(integration.type);

    return configured
      ? {
          ...integration,
          ...configured,
          isConfigured: false,
        }
      : integration;
  });
};
