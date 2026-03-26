ALTER TABLE profiles
ADD COLUMN revelator_enterprise_id INTEGER,
ADD COLUMN revelator_setup_status TEXT DEFAULT 'not_started',
ADD COLUMN revelator_error TEXT;

CREATE INDEX idx_profiles_revelator_enterprise_id ON profiles(revelator_enterprise_id) WHERE revelator_enterprise_id IS NOT NULL;
