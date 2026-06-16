-- Create a public storage bucket for files embedded in helpdesk articles.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'helpdesk-assets',
  'helpdesk-assets',
  true,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Anyone can read helpdesk assets" ON storage.objects;
CREATE POLICY "Anyone can read helpdesk assets"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'helpdesk-assets');

DROP POLICY IF EXISTS "Service role can manage helpdesk assets" ON storage.objects;
CREATE POLICY "Service role can manage helpdesk assets"
  ON storage.objects
  FOR ALL
  TO service_role
  USING (bucket_id = 'helpdesk-assets')
  WITH CHECK (bucket_id = 'helpdesk-assets');
