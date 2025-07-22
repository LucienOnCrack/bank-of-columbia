-- Disable Row Level Security temporarily since we're using custom JWT auth
-- We'll handle authorization in our API routes instead

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all for now" ON public.users;
DROP POLICY IF EXISTS "Allow all for now" ON public.properties;  
DROP POLICY IF EXISTS "Allow all for now" ON public.transactions;

-- Disable RLS on all tables
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY; 