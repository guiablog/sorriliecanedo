-- Create 'imagens' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('imagens', 'imagens', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policy for authenticated users to upload to 'imagens' bucket
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagens');

-- RLS Policy for anyone to view images in 'imagens' bucket
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'imagens');

-- RLS Policy for authenticated users to update their own images
DROP POLICY IF EXISTS "Authenticated users can update their own images" ON storage.objects;
CREATE POLICY "Authenticated users can update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (auth.uid() = owner);

-- RLS Policy for authenticated users to delete their own images
DROP POLICY IF EXISTS "Authenticated users can delete their own images" ON storage.objects;
CREATE POLICY "Authenticated users can delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING (auth.uid() = owner);
