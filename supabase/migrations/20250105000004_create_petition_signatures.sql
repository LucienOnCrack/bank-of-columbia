-- Create petition_signatures table to store petition responses
CREATE TABLE petition_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roblox_username TEXT NOT NULL,
    current_customer BOOLEAN NOT NULL,
    interested_mortgage_payments BOOLEAN NOT NULL,
    interested_rent_payments BOOLEAN NOT NULL,
    interested_savings_account BOOLEAN NOT NULL,
    interested_credit_card BOOLEAN NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure one signature per user
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE petition_signatures ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can read their own petition signatures
CREATE POLICY "Users can read own petition signatures" ON petition_signatures
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own petition signatures
CREATE POLICY "Users can insert own petition signatures" ON petition_signatures
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Employees and admins can read all petition signatures
CREATE POLICY "Employees can read all petition signatures" ON petition_signatures
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role IN ('employee', 'admin')
        )
    );

-- Admins can delete petition signatures
CREATE POLICY "Admins can delete petition signatures" ON petition_signatures
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id::text = auth.uid()::text 
            AND users.role = 'admin'
        )
    );

-- Create index for performance
CREATE INDEX idx_petition_signatures_user_id ON petition_signatures(user_id);
CREATE INDEX idx_petition_signatures_signed_at ON petition_signatures(signed_at);