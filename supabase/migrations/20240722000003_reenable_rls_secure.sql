-- RE-ENABLE ROW LEVEL SECURITY (CRITICAL FOR DATA PROTECTION)
-- Since we're using custom JWT auth, we'll restrict access to service role only
-- All user operations must go through our authenticated API routes

-- Re-enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create secure policies that only allow service role access
-- This ensures all operations go through our authenticated API

-- Users table policies
CREATE POLICY "Service role can manage users" ON public.users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to users" ON public.users
    FOR ALL 
    TO anon
    USING (false);

-- Properties table policies  
CREATE POLICY "Service role can manage properties" ON public.properties
    FOR ALL
    TO service_role  
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to properties" ON public.properties
    FOR ALL
    TO anon
    USING (false);

-- Transactions table policies
CREATE POLICY "Service role can manage transactions" ON public.transactions
    FOR ALL
    TO service_role
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to transactions" ON public.transactions
    FOR ALL
    TO anon
    USING (false);

-- Ensure our API uses service role for all database operations
-- User authentication/authorization will be handled in API routes with JWT verification 