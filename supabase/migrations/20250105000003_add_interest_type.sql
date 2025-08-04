-- Add interest type column to mortgages table
ALTER TABLE mortgages 
ADD COLUMN interest_type VARCHAR(10) NOT NULL DEFAULT 'fixed' 
CHECK (interest_type IN ('fixed', 'compound'));

-- Add comment for clarity
COMMENT ON COLUMN mortgages.interest_type IS 'Type of interest calculation: fixed (simple) or compound (compounded per payment frequency)';