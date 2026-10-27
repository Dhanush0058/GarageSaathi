-- =========================================================================
-- GARAGESAARTHI VEHICLE INSPECTION SYSTEM — PRODUCTION DATABASE MIGRATION
-- Multi-Tenant PostgreSQL Schema with Row Level Security & Live Score Trigger
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean drop if recreating
DROP TRIGGER IF EXISTS trigger_recalculate_inspection_scores ON inspection_item_results;
DROP FUNCTION IF EXISTS recalculate_inspection_scores();
DROP TRIGGER IF EXISTS trigger_update_inspections_timestamp ON inspections;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- -------------------------------------------------------------------------
-- 1. Organizations (Garages / Service Chains)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    gst_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 2. Branches (Workshop Locations)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    phone TEXT,
    address TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 3. Profiles (Staff & Roles linked to Supabase Auth)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'owner', 'manager', 'inspector', 'reviewer')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 4. Customers
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT,
    city TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_customers_org_phone ON customers(organization_id, phone);

-- -------------------------------------------------------------------------
-- 5. Vehicles
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    registration_number TEXT NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    variant TEXT,
    fuel_type TEXT NOT NULL DEFAULT 'Petrol' CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid')),
    transmission TEXT NOT NULL DEFAULT 'Manual' CHECK (transmission IN ('Manual', 'Automatic')),
    vin TEXT,
    engine_number TEXT,
    odometer INTEGER NOT NULL DEFAULT 0,
    fuel_level TEXT NOT NULL DEFAULT 'Empty' CHECK (fuel_level IN ('Empty', '1/4', '1/2', '3/4', 'Full')),
    manufacturing_year INTEGER,
    color TEXT,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_org_vehicle_reg UNIQUE (organization_id, registration_number)
);

CREATE INDEX IF NOT EXISTS idx_vehicles_org_reg ON vehicles(organization_id, registration_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_customer ON vehicles(customer_id);

-- -------------------------------------------------------------------------
-- 6. Inspections
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    report_id TEXT NOT NULL,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    inspector_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    inspector_name TEXT NOT NULL,
    inspection_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'approved')),
    odometer INTEGER NOT NULL DEFAULT 0,
    fuel_level TEXT NOT NULL DEFAULT 'Empty' CHECK (fuel_level IN ('Empty', '1/4', '1/2', '3/4', 'Full')),
    dealer_source TEXT,
    inspection_type TEXT NOT NULL DEFAULT 'PDI',
    notes TEXT,
    
    -- Real-time metrics
    total_items INTEGER NOT NULL DEFAULT 336,
    scored_items INTEGER NOT NULL DEFAULT 0,
    passed_items INTEGER NOT NULL DEFAULT 0,
    failed_items INTEGER NOT NULL DEFAULT 0,
    pending_items INTEGER NOT NULL DEFAULT 336,
    pass_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    completion_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,

    completed_at TIMESTAMPTZ,
    certified_by TEXT,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_org_report_id UNIQUE (organization_id, report_id)
);

CREATE INDEX IF NOT EXISTS idx_inspections_org_report ON inspections(organization_id, report_id);
CREATE INDEX IF NOT EXISTS idx_inspections_vehicle ON inspections(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);

-- -------------------------------------------------------------------------
-- 7. Inspection Item Results (Exact 336 PDF checks)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_item_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL, -- e.g. 'EXT-01-01'
    category_name TEXT NOT NULL,
    category_code TEXT NOT NULL,
    subsection_name TEXT NOT NULL,
    item_name TEXT NOT NULL,
    item_order INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PASS', 'FAIL', 'PENDING')),
    remarks TEXT,
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    reference_value TEXT,
    updated_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_inspection_item UNIQUE (inspection_id, item_id)
);

CREATE INDEX IF NOT EXISTS idx_item_results_inspection ON inspection_item_results(inspection_id);
CREATE INDEX IF NOT EXISTS idx_item_results_status ON inspection_item_results(status);

-- -------------------------------------------------------------------------
-- 8. Inspection Photos & Evidence
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    result_id UUID REFERENCES inspection_item_results(id) ON DELETE SET NULL,
    category_code TEXT,
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT NOT NULL DEFAULT 'image/jpeg',
    caption TEXT,
    photo_type TEXT NOT NULL DEFAULT 'general' CHECK (photo_type IN ('vehicle_front', 'vehicle_rear', 'vehicle_odometer', 'evidence_fail', 'supporting_doc', 'general')),
    sync_status TEXT NOT NULL DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending_upload', 'failed')),
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_photos_inspection ON inspection_photos(inspection_id);
CREATE INDEX IF NOT EXISTS idx_photos_result ON inspection_photos(result_id);

-- -------------------------------------------------------------------------
-- 9. Audit Activity Logs
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inspection_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -------------------------------------------------------------------------
-- 10. Database Functions & Triggers
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inspections_timestamp
    BEFORE UPDATE ON inspections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Server-side Automatic Recalculation of Scores
CREATE OR REPLACE FUNCTION recalculate_inspection_scores()
RETURNS TRIGGER AS $$
DECLARE
    v_inspection_id UUID;
    v_total INTEGER;
    v_passed INTEGER;
    v_failed INTEGER;
    v_pending INTEGER;
    v_scored INTEGER;
    v_pass_pct NUMERIC(5,2);
    v_comp_pct NUMERIC(5,2);
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_inspection_id := OLD.inspection_id;
    ELSE
        v_inspection_id := NEW.inspection_id;
    END IF;

    -- Aggregate counts
    SELECT 
        COUNT(*),
        COUNT(*) FILTER (WHERE status = 'PASS'),
        COUNT(*) FILTER (WHERE status = 'FAIL'),
        COUNT(*) FILTER (WHERE status = 'PENDING')
    INTO 
        v_total,
        v_passed,
        v_failed,
        v_pending
    FROM inspection_item_results
    WHERE inspection_id = v_inspection_id;

    v_scored := v_passed + v_failed;

    -- Transparent formula: pass % = (passed / scored) * 100
    -- If 0 scored, pass % is 0.00
    IF v_scored > 0 THEN
        v_pass_pct := ROUND((v_passed::NUMERIC / v_scored::NUMERIC) * 100, 2);
    ELSE
        v_pass_pct := 0.00;
    END IF;

    IF v_total > 0 THEN
        v_comp_pct := ROUND((v_scored::NUMERIC / v_total::NUMERIC) * 100, 2);
    ELSE
        v_comp_pct := 0.00;
    END IF;

    -- Update parent inspection record
    UPDATE inspections
    SET 
        total_items = v_total,
        passed_items = v_passed,
        failed_items = v_failed,
        pending_items = v_pending,
        scored_items = v_scored,
        pass_percentage = v_pass_pct,
        completion_percentage = v_comp_pct,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_inspection_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_recalculate_inspection_scores
    AFTER INSERT OR UPDATE OR DELETE ON inspection_item_results
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_inspection_scores();

-- -------------------------------------------------------------------------
-- 11. Row Level Security (RLS)
-- -------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_item_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get user organization id
CREATE OR REPLACE FUNCTION get_user_org_id()
RETURNS UUID AS $$
    SELECT organization_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: users can read their own profile and members in same organization
CREATE POLICY "profiles_select_own_org" ON profiles
    FOR SELECT TO authenticated
    USING (organization_id = get_user_org_id());

CREATE POLICY "profiles_update_self" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

-- Customers: scoped to organization
CREATE POLICY "customers_org_isolation" ON customers
    FOR ALL TO authenticated
    USING (organization_id = get_user_org_id())
    WITH CHECK (organization_id = get_user_org_id());

-- Vehicles: scoped to organization
CREATE POLICY "vehicles_org_isolation" ON vehicles
    FOR ALL TO authenticated
    USING (organization_id = get_user_org_id())
    WITH CHECK (organization_id = get_user_org_id());

-- Inspections: scoped to organization
CREATE POLICY "inspections_org_isolation" ON inspections
    FOR ALL TO authenticated
    USING (organization_id = get_user_org_id())
    WITH CHECK (organization_id = get_user_org_id());

-- Inspection item results: accessible if inspection belongs to user's org
CREATE POLICY "results_org_isolation" ON inspection_item_results
    FOR ALL TO authenticated
    USING (
        inspection_id IN (
            SELECT id FROM inspections WHERE organization_id = get_user_org_id()
        )
    )
    WITH CHECK (
        inspection_id IN (
            SELECT id FROM inspections WHERE organization_id = get_user_org_id()
        )
    );

-- Inspection photos: accessible if inspection belongs to user's org
CREATE POLICY "photos_org_isolation" ON inspection_photos
    FOR ALL TO authenticated
    USING (
        inspection_id IN (
            SELECT id FROM inspections WHERE organization_id = get_user_org_id()
        )
    )
    WITH CHECK (
        inspection_id IN (
            SELECT id FROM inspections WHERE organization_id = get_user_org_id()
        )
    );

-- Inspection activity logs: read/write in org
CREATE POLICY "logs_org_isolation" ON inspection_activity_logs
    FOR ALL TO authenticated
    USING (
        inspection_id IN (
            SELECT id FROM inspections WHERE organization_id = get_user_org_id()
        )
    );

-- Storage Buckets Configuration (Run in Supabase SQL editor)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-photos', 'inspection-photos', false) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('inspection-reports', 'inspection-reports', false) ON CONFLICT DO NOTHING;
