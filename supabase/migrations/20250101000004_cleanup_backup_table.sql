-- Clean up backup properties table
-- This table was created during schema migration as a safety measure
-- Now that the migration is complete and data is verified, we can remove it

DROP TABLE IF EXISTS properties_backup; 