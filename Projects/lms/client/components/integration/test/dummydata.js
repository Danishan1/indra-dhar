export const dummyIntegrationsResponse = {
  data: [
    {
      id: "int_101",
      tenant_id: "tenant_1",
      name: "Facebook Leads",
      type: "FACEBOOK",
      category: "INBOUND",
      provider: "META",
      status: "CONNECTED",
      config: {
        appId: "fb_app_123456",
        appSecret: "***********",
        pageId: "page_998877",
      },
      created_at: "2026-07-01T10:00:00Z",
      updated_at: "2026-07-05T12:00:00Z",
    },

    {
      id: "int_102",
      tenant_id: "tenant_1",
      name: "IndiaMart Leads Sync",
      type: "INDIAMART",
      category: "INBOUND",
      provider: "INDIAMART",
      status: "DISCONNECTED",
      config: {
        apiKey: "im_key_abc123",
        vendorId: "vendor_7788",
      },
      created_at: "2026-06-28T09:00:00Z",
      updated_at: "2026-06-30T15:00:00Z",
    },

    {
      id: "int_103",
      tenant_id: "tenant_1",
      name: "Custom API Feed",
      type: "API",
      category: "INBOUND",
      provider: "CUSTOM",
      status: "ERROR",
      config: {
        apiKey: "api_test_999",
        endpoint: "https://api.client.com/webhook",
      },
      created_at: "2026-06-20T11:00:00Z",
      updated_at: "2026-07-02T08:00:00Z",
    },

    {
      id: "int_201",
      tenant_id: "tenant_1",
      name: "WhatsApp Notifications",
      type: "WHATSAPP",
      category: "OUTBOUND",
      provider: "META",
      status: "CONNECTED",
      config: {
        token: "wa_token_xxx",
        phoneNumberId: "1234567890",
        businessAccountId: "987654321",
      },
      created_at: "2026-07-03T14:00:00Z",
      updated_at: "2026-07-05T10:00:00Z",
    },

    {
      id: "int_202",
      tenant_id: "tenant_1",
      name: "SMS Alerts",
      type: "SMS",
      category: "OUTBOUND",
      provider: "TWILIO",
      status: "DISCONNECTED",
      config: {
        apiKey: "sms_key_abc",
        senderId: "MYAPP",
      },
      created_at: "2026-06-25T13:00:00Z",
      updated_at: "2026-06-25T13:00:00Z",
    },

    {
      id: "int_203",
      tenant_id: "tenant_1",
      name: "Email SMTP",
      type: "EMAIL",
      category: "OUTBOUND",
      provider: "SMTP",
      status: "CONNECTED",
      config: {
        smtpHost: "smtp.gmail.com",
        smtpUser: "noreply@company.com",
        smtpPass: "********",
        port: 587,
      },
      created_at: "2026-07-02T09:30:00Z",
      updated_at: "2026-07-04T18:00:00Z",
    },
  ],
};
