-- Create mortgages table
CREATE TABLE IF NOT EXISTS mortgages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_total DECIMAL(15,2) NOT NULL CHECK (amount_total > 0),
    amount_paid DECIMAL(15,2) DEFAULT 0 CHECK (amount_paid >= 0),
    start_date DATE NOT NULL,
    payment_frequency VARCHAR(10) NOT NULL CHECK (payment_frequency IN ('daily', 'weekly')),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    next_payment_due DATE NOT NULL,
    last_payment_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'defaulted')),
    initial_deposit DECIMAL(15,2) DEFAULT 0 CHECK (initial_deposit >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
);

-- Create mortgage_payments table to track individual payments
CREATE TABLE IF NOT EXISTS mortgage_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mortgage_id UUID NOT NULL REFERENCES mortgages(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES users(id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mortgages_property_id ON mortgages(property_id);
CREATE INDEX IF NOT EXISTS idx_mortgages_user_id ON mortgages(user_id);
CREATE INDEX IF NOT EXISTS idx_mortgages_status ON mortgages(status);
CREATE INDEX IF NOT EXISTS idx_mortgages_next_payment_due ON mortgages(next_payment_due);

CREATE INDEX IF NOT EXISTS idx_mortgage_payments_mortgage_id ON mortgage_payments(mortgage_id);
CREATE INDEX IF NOT EXISTS idx_mortgage_payments_payment_date ON mortgage_payments(payment_date);

-- Add RLS policies for security
ALTER TABLE mortgages ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_payments ENABLE ROW LEVEL SECURITY;

-- Policy to allow employees and admins to view all mortgages
CREATE POLICY "Allow employees/admins to view mortgages" ON mortgages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Policy to allow employees and admins to insert mortgages
CREATE POLICY "Allow employees/admins to insert mortgages" ON mortgages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Policy to allow employees and admins to update mortgages
CREATE POLICY "Allow employees/admins to update mortgages" ON mortgages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Policy to allow employees and admins to delete mortgages
CREATE POLICY "Allow employees/admins to delete mortgages" ON mortgages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Similar policies for mortgage_payments
CREATE POLICY "Allow employees/admins to view mortgage payments" ON mortgage_payments
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

CREATE POLICY "Allow employees/admins to insert mortgage payments" ON mortgage_payments
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

CREATE POLICY "Allow employees/admins to update mortgage payments" ON mortgage_payments
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

CREATE POLICY "Allow employees/admins to delete mortgage payments" ON mortgage_payments
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_mortgages_updated_at 
    BEFORE UPDATE ON mortgages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 