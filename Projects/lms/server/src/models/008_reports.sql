--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_lead_funnel AS
SELECT tenant_id,
  pipeline,
  stage,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (
    WHERE closed_at IS NOT NULL
  ) AS closed_leads,
  COUNT(*) FILTER (
    WHERE is_duplicate = TRUE
  ) AS duplicates,
  MIN(created_at) AS first_lead_at,
  MAX(created_at) AS last_lead_at
FROM leads
GROUP BY tenant_id,
  pipeline,
  stage;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_lead_source_report AS
SELECT tenant_id,
  source AS source_name,
  COUNT(id) AS total_leads,
  COUNT(id) FILTER (
    WHERE closed_at IS NOT NULL
  ) AS won_leads,
  ROUND(
    COUNT(id) FILTER (
      WHERE closed_at IS NOT NULL
    )::NUMERIC / NULLIF(COUNT(id), 0) * 100,
    2
  ) AS conversion_rate
FROM leads
GROUP BY tenant_id,
  source;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_user_performance AS
SELECT l.tenant_id,
  l.assigned_to AS user_id,
  COUNT(l.id) AS total_leads,
  COUNT(l.id) FILTER (
    WHERE l.closed_at IS NOT NULL
  ) AS won_leads,
  COUNT(l.id) FILTER (
    WHERE l.closed_at IS NULL
      AND l.stage IS NOT NULL
  ) AS active_leads,
  ROUND(
    COUNT(l.id) FILTER (
      WHERE l.closed_at IS NOT NULL
    )::NUMERIC / NULLIF(COUNT(l.id), 0) * 100,
    2
  ) AS conversion_rate
FROM leads l
GROUP BY l.tenant_id,
  l.assigned_to;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_team_performance AS
SELECT l.tenant_id,
  l.team_id,
  COUNT(l.id) AS total_leads,
  COUNT(l.id) FILTER (
    WHERE l.closed_at IS NOT NULL
  ) AS won_leads,
  ROUND(
    COUNT(l.id) FILTER (
      WHERE l.closed_at IS NOT NULL
    )::NUMERIC / NULLIF(COUNT(l.id), 0) * 100,
    2
  ) AS conversion_rate
FROM leads l
GROUP BY l.tenant_id,
  l.team_id;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_pipeline_velocity AS
SELECT id AS lead_id,
  tenant_id,
  MIN(created_at) AS entered_pipeline_at,
  MAX(closed_at) AS closed_at,
  EXTRACT(
    DAY
    FROM (
        MAX(created_at) FILTER (
          WHERE closed_at IS NOT NULL
        ) - MIN(created_at)
      )
  ) AS days_to_close
FROM leads
GROUP BY id,
  tenant_id;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_task_stats AS
SELECT tenant_id,
  assigned_to,
  COUNT(*) AS total_tasks,
  COUNT(*) FILTER (
    WHERE status = 'COMPLETED'
  ) AS completed_tasks,
  COUNT(*) FILTER (
    WHERE status = 'OVERDUE'
  ) AS overdue_tasks,
  ROUND(
    COUNT(*) FILTER (
      WHERE status = 'COMPLETED'
    )::NUMERIC / NULLIF(COUNT(*), 0) * 100,
    2
  ) AS completion_rate
FROM tasks
GROUP BY tenant_id,
  assigned_to;
--
-- =====================================================
--

CREATE MATERIALIZED VIEW mv_lead_aging AS
SELECT tenant_id,
  id AS lead_id,
  assigned_to,
  stage,
  created_at,
  NOW() - created_at AS age,
  CASE
    WHEN NOW() - created_at < INTERVAL '3 days' THEN 'FRESH'
    WHEN NOW() - created_at < INTERVAL '7 days' THEN 'WARM'
    WHEN NOW() - created_at < INTERVAL '15 days' THEN 'STUCK'
    ELSE 'CRITICAL'
  END AS aging_status
FROM leads
WHERE closed_at IS NULL;
--
-- =====================================================
--

CREATE OR REPLACE FUNCTION refresh_reports() RETURNS VOID AS $$ BEGIN REFRESH MATERIALIZED VIEW mv_lead_funnel;
REFRESH MATERIALIZED VIEW mv_lead_source_report;
REFRESH MATERIALIZED VIEW mv_user_performance;
REFRESH MATERIALIZED VIEW mv_team_performance;
REFRESH MATERIALIZED VIEW mv_pipeline_velocity;
REFRESH MATERIALIZED VIEW mv_task_stats;
REFRESH MATERIALIZED VIEW mv_lead_aging;
END;
$$ LANGUAGE plpgsql;
--
-- =====================================================
--

CREATE TABLE report_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  report_type VARCHAR(50) NOT NULL,
  query JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);