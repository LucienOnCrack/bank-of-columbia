-- Update property types to match new house-based categorization
-- Drop and recreate the enum with new values

-- First, update any existing data to use new property types
-- Map old types to new types as a reasonable approximation
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

-- Drop the existing enum type (this will temporarily remove the constraint)
ALTER TABLE public.properties ALTER COLUMN type TYPE text;
DROP TYPE IF EXISTS property_type;

-- Create new property type enum with house-based categories
CREATE TYPE property_type AS ENUM (
    'Small House', 
    'Small Row House', 
    'Medium House', 
    'Medium Row House', 
    'Large House', 
    'Large Row House'
);

-- Update the column to use the new enum type
ALTER TABLE public.properties 
    ALTER COLUMN type TYPE property_type USING type::property_type,
    ALTER COLUMN type SET DEFAULT 'Small House';

-- Update any remaining text values to valid enum values (fallback)
UPDATE public.properties 
SET type = 'Medium House'::property_type 
WHERE type::text NOT IN ('Small House', 'Small Row House', 'Medium House', 'Medium Row House', 'Large House', 'Large Row House'); 