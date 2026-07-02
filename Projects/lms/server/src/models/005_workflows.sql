--
-- =====================================================
--

CREATE TABLE workflow_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  trigger_event VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  priority INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);
--
-- =====================================================
--

CREATE TABLE workflow_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES workflow_rules(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  operator VARCHAR(20) NOT NULL CHECK (
    operator IN (
      '=',
      '!=',
      '>',
      '<',
      '>=',
      '<=',
      'IN',
      'NOT_IN',
      'CONTAINS',
      'NOT_CONTAINS'
    )
  ),
  value TEXT,
  logical_operator VARCHAR(10) DEFAULT 'AND' CHECK (logical_operator IN ('AND', 'OR')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE workflow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID NOT NULL REFERENCES workflow_rules(id) ON DELETE CASCADE,
  action_type VARCHAR(50) NOT NULL,
  action_config JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id UUID REFERENCES workflow_rules(id),
  lead_id UUID REFERENCES leads(id),
  triggered_by VARCHAR(50),
  trigger_payload JSONB,
  status VARCHAR(20) CHECK (status IN ('SUCCESS', 'FAILED', 'SKIPPED')),
  error_message TEXT,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE INDEX idx_workflow_conditions_rule ON workflow_conditions(rule_id);
CREATE INDEX idx_workflow_actions_rule ON workflow_actions(rule_id);
CREATE INDEX idx_workflow_exec_rule ON workflow_executions(rule_id);
CREATE INDEX idx_workflow_exec_lead ON workflow_executions(lead_id);
