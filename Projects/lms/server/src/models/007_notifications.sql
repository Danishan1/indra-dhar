--
-- =====================================================
--

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
  status VARCHAR(20) DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'READ', 'ARCHIVED')),
  channel VARCHAR(20) DEFAULT 'IN_APP' CHECK (channel IN ('IN_APP', 'EMAIL', 'WHATSAPP')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  in_app BOOLEAN DEFAULT TRUE,
  email BOOLEAN DEFAULT TRUE,
  whatsapp BOOLEAN DEFAULT FALSE,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, notification_type)
);
--
-- =====================================================
--

CREATE TABLE notification_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'RETRYING')),
  provider VARCHAR(50),
  provider_message_id TEXT,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50) NOT NULL,
  channel VARCHAR(20) NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, name, channel)
);
--
-- =====================================================
--

CREATE TABLE notification_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  trigger_event VARCHAR(50) NOT NULL,
  template_id UUID REFERENCES notification_templates(id),
  default_channel VARCHAR(20) DEFAULT 'IN_APP',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
--
-- =====================================================
--

CREATE INDEX idx_notifications_user ON notifications(user_id, status);
CREATE INDEX idx_notifications_tenant ON notifications(tenant_id);
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notification_deliveries_status ON notification_deliveries(status);
CREATE INDEX idx_notification_templates_tenant ON notification_templates(tenant_id);
