CREATE TABLE tenant_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_key VARCHAR(150) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, workflow_key)
);
--
-- =====================================================
--

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  workflow_key VARCHAR(150),
  event VARCHAR(100),
  payload JSONB,
  status VARCHAR(20) CHECK(
    status IN('SUCCESS', 'FAILED', 'SKIPPED')
  ),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);