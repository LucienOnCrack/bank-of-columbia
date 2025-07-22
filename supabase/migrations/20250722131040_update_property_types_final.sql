-- Update property types to new house-based categorization
-- This migration updates both existing data and the schema

-- Step 1: Remove default value to avoid dependency issues
ALTER TABLE public.properties ALTER COLUMN type DROP DEFAULT;

-- Step 2: Convert type column to text first
ALTER TABLE public.properties ALTER COLUMN type TYPE text;

-- Step 3: Update existing property data to new house types (now that column is text)
UPDATE public.properties 
SET type = CASE 
    WHEN type = 'Residential' THEN 'Medium House'
    WHEN type = 'Commercial' THEN 'Large House'
    WHEN type = 'Industrial' THEN 'Large House'
    WHEN type = 'Land' THEN 'Small House'
    WHEN type = 'Office' THEN 'Medium House'
    WHEN type = 'Retail' THEN 'Medium Row House'
    ELSE type
END;

-- Step 4: Drop the old enum type
DROP TYPE IF EXISTS property_type;

-- Step 5: Create new property type enum with house categories
CREATE TYPE property_type AS ENUM (
    'Small House', 
    'Small Row House', 
    'Medium House', 
    'Medium Row House', 
    'Large House', 
    'Large Row House'
);

-- Step 6: Convert the column back to the new enum type
ALTER TABLE public.properties 
    ALTER COLUMN type TYPE property_type USING type::property_type,
    ALTER COLUMN type SET DEFAULT 'Small House';
