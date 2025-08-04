-- Rename lease_price column to property_value
ALTER TABLE properties 
RENAME COLUMN lease_price TO property_value;

-- Add comment for clarity
COMMENT ON COLUMN properties.property_value IS 'Total value/worth of the property';