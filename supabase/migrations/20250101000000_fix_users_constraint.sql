-- Fix users table foreign key constraint issue
-- Drop any incorrect foreign key constraints on users table

-- Drop the problematic foreign key constraint if it exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_id_fkey' 
        AND table_name = 'users'
    ) THEN
        ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
    END IF;
END $$;

-- Ensure users table structure is correct
-- The users table should be standalone with no foreign key constraints on its ID
-- Only other tables should reference users.id

-- Verify the table structure is correct
DO $$
BEGIN
    -- Ensure UUID extension is available
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Recreate the table if needed with correct structure
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') THEN
        CREATE TABLE public.users (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            roblox_id TEXT UNIQUE NOT NULL,
            roblox_name TEXT NOT NULL,
            role user_role DEFAULT 'user' NOT NULL,
            balance NUMERIC(15,2) DEFAULT 0.00 NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
    END IF;
END $$; 