-- Add interest rate column to mortgages table
ALTER TABLE mortgages 
ADD COLUMN interest_rate DECIMAL(5,4) NOT NULL DEFAULT 0.0500 
CHECK (interest_rate >= 0 AND interest_rate <= 1);

-- Update payment frequency constraint to include bi-daily
ALTER TABLE mortgages 
DROP CONSTRAINT mortgages_payment_frequency_check;

ALTER TABLE mortgages 
ADD CONSTRAINT mortgages_payment_frequency_check 
CHECK (payment_frequency IN ('daily', 'bi-daily', 'weekly'));

-- Add comment for clarity
COMMENT ON COLUMN mortgages.interest_rate IS 'Annual interest rate as decimal (e.g., 0.05 for 5%)';