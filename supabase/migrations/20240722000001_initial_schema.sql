-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom user role type
CREATE TYPE user_role AS ENUM ('user', 'employee', 'admin');

-- Create users table (standalone, no auth.users dependency)
CREATE TABLE public.users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    roblox_id TEXT UNIQUE NOT NULL,
    roblox_name TEXT NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    balance NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create properties table
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    address TEXT NOT NULL,
    description TEXT,
    value NUMERIC(15,2) NOT NULL,
    assigned_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create transactions table for property transfers and balance changes
CREATE TABLE public.transactions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'property_purchase', 'property_sale', 'property_assignment')),
    amount NUMERIC(15,2) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_properties
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Note: Since we're not using Supabase Auth, we'll need to implement
-- our own authentication context. For now, we'll disable RLS and 
-- handle permissions in our API routes

-- Temporarily allow all operations (we'll handle auth in our API)
CREATE POLICY "Allow all for now" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.properties FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON public.transactions FOR ALL USING (true);

-- Create indexes for performance
CREATE INDEX idx_users_roblox_id ON public.users(roblox_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_assigned_by ON public.properties(assigned_by);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_property_id ON public.transactions(property_id);
CREATE INDEX idx_transactions_type ON public.transactions(type); 