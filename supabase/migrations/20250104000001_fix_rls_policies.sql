-- Fix RLS Policy Mismatch - Remove auth.uid() based policies and ensure service role access
-- This migration fixes the security architecture mismatch where policies check auth.uid() 
-- but APIs use service role authentication

-- Drop conflicting policies that check auth.uid() on mortgages
DROP POLICY IF EXISTS "Allow employees/admins to view mortgages" ON mortgages;
DROP POLICY IF EXISTS "Allow employees/admins to insert mortgages" ON mortgages;
DROP POLICY IF EXISTS "Allow employees/admins to update mortgages" ON mortgages;
DROP POLICY IF EXISTS "Allow employees/admins to delete mortgages" ON mortgages;

-- Drop conflicting policies that check auth.uid() on mortgage_payments
DROP POLICY IF EXISTS "Allow employees/admins to view mortgage payments" ON mortgage_payments;
DROP POLICY IF EXISTS "Allow employees/admins to insert mortgage payments" ON mortgage_payments;
DROP POLICY IF EXISTS "Allow employees/admins to update mortgage payments" ON mortgage_payments;
DROP POLICY IF EXISTS "Allow employees/admins to delete mortgage payments" ON mortgage_payments;

-- Drop conflicting policies on properties that check auth.uid()
DROP POLICY IF EXISTS "Allow employees and admins to view properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to insert properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to update properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to delete properties" ON properties;
DROP POLICY IF EXISTS "Allow users to view their properties" ON properties;

-- Create consistent service role policies for mortgages
CREATE POLICY "Service role can manage mortgages" ON mortgages
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to mortgages" ON mortgages
    FOR ALL 
    TO anon
    USING (false);

-- Create consistent service role policies for mortgage_payments
CREATE POLICY "Service role can manage mortgage_payments" ON mortgage_payments
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to mortgage_payments" ON mortgage_payments
    FOR ALL 
    TO anon
    USING (false);

-- Ensure properties table has consistent service role policies
-- (Keep existing "Allow all for API" policy if it exists, otherwise create service role policy)
DROP POLICY IF EXISTS "Allow all for API" ON properties;
CREATE POLICY "Service role can manage properties" ON properties
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to properties" ON properties
    FOR ALL 
    TO anon
    USING (false);

-- Ensure transactions table policies are consistent
-- (These should already be correct from previous migrations)

-- Summary: All database operations now go through service role with authentication/authorization 
-- handled at the API level using JWT verification and fresh database role lookups