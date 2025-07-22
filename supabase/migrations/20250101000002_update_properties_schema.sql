-- Update properties table to match PropertyData interface
-- First, backup existing data if any exists
CREATE TABLE IF NOT EXISTS properties_backup AS SELECT * FROM public.properties;

-- Drop the existing properties table
DROP TABLE IF EXISTS public.properties CASCADE;

-- Create property status and type enums
CREATE TYPE property_status AS ENUM ('Available', 'Leased', 'Pending', 'Maintenance');
CREATE TYPE property_type AS ENUM ('Residential', 'Commercial', 'Industrial', 'Land', 'Office', 'Retail');

-- Recreate properties table with new schema
CREATE TABLE public.properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    municipality TEXT NOT NULL,
    type property_type NOT NULL DEFAULT 'Residential',
    holder_roblox_name TEXT NOT NULL,
    holder_roblox_id TEXT NOT NULL,
    neighbourhood TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    lease_price NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status property_status NOT NULL DEFAULT 'Available',
    images JSONB DEFAULT '[]'::jsonb, -- Store image metadata as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES public.users(id) NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_properties_municipality ON public.properties(municipality);
CREATE INDEX idx_properties_type ON public.properties(type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_code ON public.properties(code);
CREATE INDEX idx_properties_holder_roblox_id ON public.properties(holder_roblox_id);
CREATE INDEX idx_properties_created_by ON public.properties(created_by);

-- Add updated_at trigger
CREATE TRIGGER set_updated_at_properties
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow employees and admins to manage properties
CREATE POLICY "Allow employees and admins to view properties" ON public.properties 
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('employee', 'admin')
    )
);

CREATE POLICY "Allow employees and admins to insert properties" ON public.properties 
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('employee', 'admin')
    )
);

CREATE POLICY "Allow employees and admins to update properties" ON public.properties 
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('employee', 'admin')
    )
);

CREATE POLICY "Allow employees and admins to delete properties" ON public.properties 
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM public.users 
        WHERE users.id = auth.uid() 
        AND users.role IN ('employee', 'admin')
    )
);

-- Allow users to view properties assigned to them
CREATE POLICY "Allow users to view their properties" ON public.properties 
FOR SELECT USING (
    holder_roblox_id = (
        SELECT roblox_id FROM public.users WHERE id = auth.uid()
    )
);

-- Temporary allow all policy for API routes (we handle auth there)
CREATE POLICY "Allow all for API" ON public.properties FOR ALL USING (true); 