--
-- =====================================================
--

CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE
  SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    activity_type VARCHAR(50) NOT NULL,
    title TEXT,
    description TEXT,
    old_value JSONB,
    new_value JSONB,
    metadata JSONB,
    source VARCHAR(50) DEFAULT 'SYSTEM',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE INDEX idx_activities_tenant ON activities(tenant_id);
CREATE INDEX idx_activities_lead ON activities(lead_id, created_at DESC);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_user ON activities(user_id);
CREATE INDEX idx_activities_created ON activities(created_at DESC);
--
-- =====================================================
--

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE
  SET NULL,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
