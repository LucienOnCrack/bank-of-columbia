-- Fix RLS Policy Mismatch for core tables only
-- This migration fixes the security architecture mismatch where policies check auth.uid() 
-- but APIs use service role authentication

-- Only fix policies for tables that definitely exist: users, properties, transactions

-- Drop conflicting policies on properties that check auth.uid() (if they exist)
DROP POLICY IF EXISTS "Allow employees and admins to view properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to insert properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to update properties" ON properties;
DROP POLICY IF EXISTS "Allow employees and admins to delete properties" ON properties;
DROP POLICY IF EXISTS "Allow users to view their properties" ON properties;

-- Ensure properties table has consistent service role policies
-- Drop the existing "Allow all for API" policy and create proper service role policy
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

-- Ensure transactions table policies are consistent (should already be correct)
-- But let's make sure they match the service role pattern
DROP POLICY IF EXISTS "Allow all for API" ON transactions;

-- Create consistent service role policy for transactions if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'transactions' 
        AND policyname = 'Service role can manage transactions'
    ) THEN
        CREATE POLICY "Service role can manage transactions" ON transactions
            FOR ALL 
            TO service_role
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- Ensure anonymous access is blocked for transactions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'transactions' 
        AND policyname = 'Block anonymous access to transactions'
    ) THEN
        CREATE POLICY "Block anonymous access to transactions" ON transactions
            FOR ALL 
            TO anon
            USING (false);
    END IF;
END $$;

-- Summary: Core database operations now go through service role with authentication/authorization 
-- handled at the API level using JWT verification and fresh database role lookups