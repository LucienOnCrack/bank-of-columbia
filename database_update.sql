-- Direct SQL to update your database with new property types
-- Run this on your production/remote database

-- Step 1: Update existing property data to new house types
UPDATE public.properties 
SET type = CASE 
    WHEN type = 'Residential' THEN 'Medium House'
    WHEN type = 'Commercial' THEN 'Large House'
    WHEN type = 'Industrial' THEN 'Large House'
    WHEN type = 'Land' THEN 'Small House'
    WHEN type = 'Office' THEN 'Medium House'
    WHEN type = 'Retail' THEN 'Medium Row House'
    ELSE type
END::text;

-- Step 2: Convert type column to text temporarily
ALTER TABLE public.properties ALTER COLUMN type TYPE text;

-- Step 3: Drop the old enum type
DROP TYPE IF EXISTS property_type;

-- Step 4: Create new property type enum with house categories
CREATE TYPE property_type AS ENUM (
    'Small House', 
    'Small Row House', 
    'Medium House', 
    'Medium Row House', 
    'Large House', 
    'Large Row House'
);

-- Step 5: Convert the column back to the new enum type
ALTER TABLE public.properties 
    ALTER COLUMN type TYPE property_type USING type::property_type,
    ALTER COLUMN type SET DEFAULT 'Small House';

-- Step 6: Verify the update worked
SELECT DISTINCT type, COUNT(*) as count 
FROM public.properties 
GROUP BY type 
ORDER BY type; 