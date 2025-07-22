-- Consolidate mortgage_payments into transactions table with enhanced structure
-- This migration combines mortgage payments with general transactions for better data consistency

-- Step 1: Create new enhanced transaction types
DO $$ 
BEGIN
    -- Drop existing type constraint if it exists
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'transactions_type_check') THEN
        ALTER TABLE public.transactions DROP CONSTRAINT transactions_type_check;
    END IF;
    
    -- Create new enum type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type_new') THEN
        CREATE TYPE transaction_type_new AS ENUM (
            'deposit', 
            'withdrawal', 
            'property_purchase', 
            'property_sale', 
            'property_assignment',
            'mortgage_payment',
            'rent_payment',
            'fee_payment'
        );
    END IF;
END $$;

-- Step 2: Update transactions table structure
ALTER TABLE public.transactions 
    ADD COLUMN IF NOT EXISTS mortgage_id UUID REFERENCES mortgages(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
    ADD COLUMN IF NOT EXISTS payment_date DATE DEFAULT CURRENT_DATE,
    ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update type column to use new enum
ALTER TABLE public.transactions 
    ALTER COLUMN type TYPE transaction_type_new USING type::text::transaction_type_new;

-- Step 3: Migrate data from mortgage_payments to transactions (if table exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'mortgage_payments') THEN
        INSERT INTO public.transactions (
            user_id,
            property_id, 
            mortgage_id,
            type,
            amount,
            description,
            payment_method,
            payment_date,
            notes,
            created_by,
            created_at
        )
        SELECT 
            m.user_id,
            m.property_id,
            mp.mortgage_id,
            'mortgage_payment'::transaction_type_new,
            mp.amount,
            COALESCE(mp.notes, 'Mortgage payment for ' || COALESCE(p.code, 'property')),
            mp.payment_method,
            mp.payment_date,
            mp.notes,
            mp.created_by,
            mp.created_at
        FROM mortgage_payments mp
        JOIN mortgages m ON mp.mortgage_id = m.id
        LEFT JOIN properties p ON m.property_id = p.id
        WHERE NOT EXISTS (
            SELECT 1 FROM transactions t 
            WHERE t.mortgage_id = mp.mortgage_id 
            AND t.amount = mp.amount 
            AND t.payment_date = mp.payment_date
        );
    END IF;
END $$;

-- Step 4: Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_mortgage_id ON public.transactions(mortgage_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_date ON public.transactions(payment_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type_new ON public.transactions(type);

-- Step 5: Update RLS policies for enhanced transactions table
DROP POLICY IF EXISTS "Service role can manage transactions" ON public.transactions;
DROP POLICY IF EXISTS "Block anonymous access to transactions" ON public.transactions;
DROP POLICY IF EXISTS "Allow all for API" ON public.transactions;

-- Create comprehensive RLS policies
CREATE POLICY "Service role can manage transactions" ON public.transactions
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Block anonymous access to transactions" ON public.transactions
    FOR ALL 
    TO anon
    USING (false);

-- Temporary allow all policy for API routes (we handle auth there)
CREATE POLICY "Allow all for API" ON public.transactions 
    FOR ALL 
    USING (true);

-- Step 6: Create view for mortgage payment summary (backward compatibility)
CREATE OR REPLACE VIEW mortgage_payment_summary AS
SELECT 
    t.id,
    t.mortgage_id,
    t.amount,
    t.payment_date,
    t.payment_method,
    t.notes,
    t.created_at,
    t.created_by,
    m.property_id,
    m.user_id
FROM transactions t
JOIN mortgages m ON t.mortgage_id = m.id
WHERE t.type = 'mortgage_payment'
ORDER BY t.payment_date DESC;

-- Step 7: Add helpful functions for transaction queries
CREATE OR REPLACE FUNCTION get_mortgage_payments(mortgage_uuid UUID)
RETURNS TABLE (
    id UUID,
    amount DECIMAL(15,2),
    payment_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.amount,
        t.payment_date,
        t.payment_method,
        t.notes,
        t.created_at
    FROM transactions t
    WHERE t.mortgage_id = mortgage_uuid 
    AND t.type = 'mortgage_payment'
    ORDER BY t.payment_date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_property_transactions(property_uuid UUID)
RETURNS TABLE (
    id UUID,
    type transaction_type_new,
    amount DECIMAL(15,2),
    description TEXT,
    payment_date DATE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.type,
        t.amount,
        t.description,
        t.payment_date,
        t.created_at
    FROM transactions t
    WHERE t.property_id = property_uuid
    ORDER BY t.payment_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Drop the old mortgage_payments table
DROP TABLE IF EXISTS mortgage_payments CASCADE; 