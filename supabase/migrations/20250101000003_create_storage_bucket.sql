-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true);

-- Create storage policies
-- Allow employees and admins to upload images
CREATE POLICY "Allow employees and admins to upload property images" 
ON storage.objects FOR INSERT 
WITH CHECK (
    bucket_id = 'property-images' AND
    auth.role() = 'authenticated'
);

-- Allow public read access to property images
CREATE POLICY "Allow public read access to property images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'property-images');

-- Allow employees and admins to delete property images
CREATE POLICY "Allow employees and admins to delete property images" 
ON storage.objects FOR DELETE 
USING (
    bucket_id = 'property-images' AND
    auth.role() = 'authenticated'
);

-- Allow employees and admins to update property images
CREATE POLICY "Allow employees and admins to update property images" 
ON storage.objects FOR UPDATE 
USING (
    bucket_id = 'property-images' AND
    auth.role() = 'authenticated'
); 