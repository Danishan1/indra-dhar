CREATE TABLE lead_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);
--
-- =====================================================
--

CREATE TABLE lead_priorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(20),
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);
--
-- =====================================================
--

CREATE TABLE pipelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, name)
);
--
-- =====================================================
--

CREATE TABLE pipeline_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  sequence INT NOT NULL,
  stage_type VARCHAR(20) NOT NULL CHECK(stage_type IN ('OPEN', 'SUCCESS', 'FAILURE')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(pipeline_id, sequence),
  UNIQUE(pipeline_id, name)
);
--
-- =====================================================
--

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lead_number VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  company VARCHAR(200),
  mobile VARCHAR(20),
  email CITEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  product_interest VARCHAR(255),
  budget NUMERIC(18, 2),
  source_id UUID REFERENCES lead_sources(id),
  priority_id UUID REFERENCES lead_priorities(id),
  pipeline_id UUID REFERENCES pipelines(id),
  stage_id UUID REFERENCES pipeline_stages(id),
  assigned_to UUID REFERENCES users(id),
  manager_id UUID REFERENCES users(id),
  team_id UUID REFERENCES teams(id),
  created_by UUID NOT NULL REFERENCES users(id),
  closed_at TIMESTAMPTZ,
  is_duplicate BOOLEAN NOT NULL DEFAULT FALSE,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, lead_number)
);
--
-- =====================================================
--

CREATE TABLE lead_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  from_user UUID REFERENCES users(id),
  to_user UUID REFERENCES users(id),
  assigned_by UUID REFERENCES users(id),
  assignment_method VARCHAR(30) CHECK (
    assignment_method IN ('MANUAL', 'ROUND_ROBIN', 'RULE')
  ),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE lead_stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  old_stage_id UUID REFERENCES pipeline_stages(id),
  new_stage_id UUID REFERENCES pipeline_stages(id),
  changed_by UUID REFERENCES users(id),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE lead_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  mime_type VARCHAR(100),
  file_size BIGINT,
  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE lead_duplicates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  duplicate_of UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  match_type VARCHAR(50),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE INDEX idx_leads_tenant ON leads(tenant_id);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_leads_stage ON leads(stage_id);
CREATE INDEX idx_leads_pipeline ON leads(pipeline_id);
CREATE INDEX idx_leads_source ON leads(source_id);
CREATE INDEX idx_leads_priority ON leads(priority_id);
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_mobile ON leads(mobile);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_assignment_lead ON lead_assignments(lead_id);
CREATE INDEX idx_stage_history ON lead_stage_history(lead_id);
CREATE INDEX idx_notes_lead ON lead_notes(lead_id);
CREATE INDEX idx_attachment_lead ON lead_attachments(lead_id);
