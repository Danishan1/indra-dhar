CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100),
  type VARCHAR(50) NOT NULL,
  -- FACEBOOK, INDIAMART, EMAIL, WHATSAPP, SMS
  category VARCHAR(20) NOT NULL,
  -- INBOUND | OUTBOUND
  provider VARCHAR(50),
  -- meta, twilio, smtp, indiamart, etc.
  status VARCHAR(20) DEFAULT 'DISCONNECTED',
  -- CONNECTED | DISCONNECTED | ERROR | DRAFT | CONFIGURED | DISABLED
  config JSONB NOT NULL DEFAULT '{}',
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, type)
);
--
-- =====================================================
--

CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  status VARCHAR(20),
  -- SUCCESS | FAILED
  direction VARCHAR(20),
  -- INBOUND | OUTBOUND
  message TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);