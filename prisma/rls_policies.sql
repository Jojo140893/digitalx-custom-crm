-- ============================================================================
-- DigitalX Enterprise CRM — Supabase Postgres Row-Level Security (RLS) Setup
-- Enforces tenant data isolation at the database level for all 12 domain tables.
-- ============================================================================

-- Helper function to extract tenant ID from current GUC context or Supabase JWT
CREATE OR REPLACE FUNCTION current_tenant_id() RETURNS text AS $$
BEGIN
  RETURN COALESCE(
    NULLIF(current_setting('app.current_tenant_id', true), ''),
    (auth.jwt() ->> 'tenant_id')
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ----------------------------------------------------------------------------
-- 1. ENABLE ROW-LEVEL SECURITY ON ALL TENANT-SCOPED TABLES
-- ----------------------------------------------------------------------------

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Client" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Activity" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TimeLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CallRecord" ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 2. CREATE TENANT ISOLATION POLICIES (FAIL CLOSED FOR ZERO MATCHES)
-- ----------------------------------------------------------------------------

-- Table: User
DROP POLICY IF EXISTS tenant_isolation_user ON "User";
CREATE POLICY tenant_isolation_user ON "User"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Lead
DROP POLICY IF EXISTS tenant_isolation_lead ON "Lead";
CREATE POLICY tenant_isolation_lead ON "Lead"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Client
DROP POLICY IF EXISTS tenant_isolation_client ON "Client";
CREATE POLICY tenant_isolation_client ON "Client"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Project
DROP POLICY IF EXISTS tenant_isolation_project ON "Project";
CREATE POLICY tenant_isolation_project ON "Project"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Task
DROP POLICY IF EXISTS tenant_isolation_task ON "Task";
CREATE POLICY tenant_isolation_task ON "Task"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Proposal
DROP POLICY IF EXISTS tenant_isolation_proposal ON "Proposal";
CREATE POLICY tenant_isolation_proposal ON "Proposal"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Invoice
DROP POLICY IF EXISTS tenant_isolation_invoice ON "Invoice";
CREATE POLICY tenant_isolation_invoice ON "Invoice"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: Activity
DROP POLICY IF EXISTS tenant_isolation_activity ON "Activity";
CREATE POLICY tenant_isolation_activity ON "Activity"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: TimeLog
DROP POLICY IF EXISTS tenant_isolation_timelog ON "TimeLog";
CREATE POLICY tenant_isolation_timelog ON "TimeLog"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: AuditLog
DROP POLICY IF EXISTS tenant_isolation_auditlog ON "AuditLog";
CREATE POLICY tenant_isolation_auditlog ON "AuditLog"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: WebhookLog
DROP POLICY IF EXISTS tenant_isolation_webhooklog ON "WebhookLog";
CREATE POLICY tenant_isolation_webhooklog ON "WebhookLog"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');

-- Table: CallRecord
DROP POLICY IF EXISTS tenant_isolation_callrecord ON "CallRecord";
CREATE POLICY tenant_isolation_callrecord ON "CallRecord"
  FOR ALL
  USING ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin')
  WITH CHECK ("tenantId" = current_tenant_id() OR current_tenant_id() = 'super-admin');
