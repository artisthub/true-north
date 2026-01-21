-- Create pitch_submissions table for /pitch form
CREATE TABLE IF NOT EXISTS pitch_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Submitter Details
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  enterprise_name TEXT NOT NULL,
  true_north_account_id TEXT NOT NULL,

  -- Release Details
  release_title TEXT NOT NULL,
  release_artists TEXT NOT NULL,
  release_type TEXT NOT NULL,
  release_stage TEXT NOT NULL,
  release_date DATE NOT NULL,
  true_north_release_id TEXT NOT NULL,
  upc_code TEXT NOT NULL,
  label_name TEXT NOT NULL,
  territory_restrictions TEXT NOT NULL,

  -- Track Details
  track_name TEXT NOT NULL,
  isrc_code TEXT NOT NULL,
  instrumental TEXT NOT NULL,
  primary_genre TEXT NOT NULL,
  secondary_genres TEXT[] DEFAULT '{}',
  lyrics_language TEXT NOT NULL,
  track_instruments TEXT NOT NULL,
  mood_keywords TEXT[] DEFAULT '{}',

  -- Artist Profiles
  spotify_profile TEXT NOT NULL,
  spotify_listeners TEXT NOT NULL,
  instagram_profile TEXT NOT NULL,
  instagram_followers TEXT NOT NULL,
  youtube_channel TEXT,
  youtube_subscribers TEXT,
  tiktok_profile TEXT,
  tiktok_followers TEXT,
  deezer_profile TEXT,
  deezer_fans TEXT,
  other_profiles TEXT,
  social_activity TEXT[] DEFAULT '{}',
  meta_reels_participation TEXT[] DEFAULT '{}',
  top_social_content TEXT,
  collaborating_artist TEXT,

  -- Marketing Details
  main_pitch TEXT NOT NULL,
  playlist_fit TEXT,
  behind_the_music TEXT,
  marketing_plan TEXT NOT NULL,
  primary_territories TEXT[] DEFAULT '{}',
  age_demographics TEXT,
  official_video TEXT,
  priority_dsps TEXT[] DEFAULT '{}',
  direct_pitching TEXT NOT NULL,

  -- Consent
  consent BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create index on created_at for sorting
CREATE INDEX idx_pitch_submissions_created_at ON pitch_submissions(created_at DESC);

-- Create index on email for lookups
CREATE INDEX idx_pitch_submissions_email ON pitch_submissions(email);

-- Enable Row Level Security
ALTER TABLE pitch_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (API) to insert
CREATE POLICY "Service role can insert pitch submissions"
  ON pitch_submissions
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Create policy for service role to read all
CREATE POLICY "Service role can read pitch submissions"
  ON pitch_submissions
  FOR SELECT
  TO service_role
  USING (true);
