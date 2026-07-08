-- =============================================================================
-- Constituency Development Platform — Supabase SQL Migration
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =============================================================================

-- 0. Extensions
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table
-- ---------------------------------------------------------------------------
-- Stores user metadata linked to Supabase Auth (auth.users).
-- Role defaults to 'citizen'; MP accounts are seeded by email.
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL DEFAULT '',
  email       TEXT NOT NULL,
  phone       TEXT DEFAULT '',
  constituency TEXT DEFAULT '',
  role        TEXT NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen', 'mp')),
  avatar_url  TEXT DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_profiles_email      ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role       ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_constituency ON public.profiles(constituency);

-- 3. Auto-create profile on user signup
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'citizen')
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Auto-update updated_at
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 5. Row-Level Security (RLS)
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Service role / admin can read all profiles (used by backend)
DROP POLICY IF EXISTS "Service role can read all profiles" ON public.profiles;
CREATE POLICY "Service role can read all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- 6. Auto-promote MP accounts on profile creation
-- ---------------------------------------------------------------------------
-- When a user signs up with one of the official MP email addresses, this trigger
-- automatically sets their role to 'mp'.
CREATE OR REPLACE FUNCTION public.handle_mp_promotion()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  IF NEW.email IN ('mp.northchennai@gov.in', 'mp.mumbai@gov.in', 'mp.surat@gov.in') THEN
    NEW.role := 'mp';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_mp_promotion ON public.profiles;
CREATE TRIGGER on_profile_mp_promotion
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_mp_promotion();

-- Also promote existing profiles matching MP emails (idempotent — safe to run anytime)
DO $$
BEGIN
  UPDATE public.profiles SET role = 'mp'
  WHERE email IN ('mp.northchennai@gov.in', 'mp.mumbai@gov.in', 'mp.surat@gov.in')
    AND role IS DISTINCT FROM 'mp';
END;
$$;

-- 7. For convenience: a view that joins auth.users with profiles
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT
  p.id,
  p.full_name,
  p.email,
  p.phone,
  p.constituency,
  p.role,
  p.avatar_url,
  p.created_at,
  p.updated_at
FROM public.profiles p;


-- 8. Complaints table
-- ---------------------------------------------------------------------------
-- NOTE: The backend SQLAlchemy model may have already created this table with
-- VARCHAR columns (not UUID). The RLS policies below use auth.uid()::text
-- casts to handle the type mismatch between UUID and VARCHAR.

-- Ensure the id column is VARCHAR(32) to match the backend model
-- (if table was already created by SQLAlchemy with String(32) PK)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'complaints' AND table_schema = 'public') THEN
    CREATE TABLE public.complaints (
      id                TEXT PRIMARY KEY,
      complaint_uid     TEXT,
      title             TEXT NOT NULL,
      description       TEXT,
      category          TEXT NOT NULL DEFAULT 'other',
      sector            TEXT,
      department        TEXT,
      severity          TEXT DEFAULT 'medium',
      status            TEXT DEFAULT 'pending',
      gps_latitude      DOUBLE PRECISION,
      gps_longitude     DOUBLE PRECISION,
      gps_accuracy      DOUBLE PRECISION,
      gps_altitude      DOUBLE PRECISION,
      gps_speed         DOUBLE PRECISION,
      gps_heading       DOUBLE PRECISION,
      gps_timestamp     TIMESTAMPTZ,
      village           TEXT,
      ward              TEXT,
      taluka            TEXT,
      district          TEXT,
      state             TEXT,
      pincode           TEXT,
      assembly_constituency TEXT,
      lok_sabha_constituency TEXT,
      constituency_name TEXT,
      nearest_landmark  TEXT,
      verification_status      TEXT DEFAULT 'unverified',
      verification_confidence  DOUBLE PRECISION DEFAULT 0,
      evidence_score          DOUBLE PRECISION DEFAULT 0,
      duplicate_probability    DOUBLE PRECISION DEFAULT 0,
      cluster_id              TEXT,
      duplicate_count         INTEGER DEFAULT 0,
      ai_detected_category    TEXT,
      ai_detected_department  TEXT,
      ai_detected_sector      TEXT,
      ai_confidence           DOUBLE PRECISION DEFAULT 0,
      priority_prediction      DOUBLE PRECISION DEFAULT 0,
      estimated_resolution_days INTEGER,
      images  TEXT,
      voice_url TEXT,
      video_url TEXT,
      citizen_id TEXT,
      citizen_name TEXT,
      heatmap_key TEXT,
      original_language TEXT,
      language_code TEXT,
      original_text TEXT,
      final_text TEXT,
      english_translation TEXT,
      created_at  TIMESTAMPTZ DEFAULT now(),
      updated_at  TIMESTAMPTZ DEFAULT now()
    );
  END IF;
END;
$$;

-- Add the complaint_uid unique index if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_complaints_uid') THEN
    CREATE UNIQUE INDEX IF NOT EXISTS idx_complaints_uid ON public.complaints(complaint_uid);
  END IF;
END;
$$;

-- Indexes for complaints (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_complaints_citizen   ON public.complaints(citizen_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status    ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category  ON public.complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_constituency ON public.complaints(constituency_name);
CREATE INDEX IF NOT EXISTS idx_complaints_created   ON public.complaints(created_at DESC);

-- Add/verify updated_at column exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'complaints' AND column_name = 'updated_at') THEN
    ALTER TABLE public.complaints ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();
  END IF;
END;
$$;

-- Updated_at trigger for complaints
DROP TRIGGER IF EXISTS on_complaint_updated ON public.complaints;
CREATE TRIGGER on_complaint_updated
  BEFORE UPDATE ON public.complaints
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS for complaints
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Citizens can read their own complaints (cast auth.uid() to text for VARCHAR comparison)
DROP POLICY IF EXISTS "Users can read own complaints" ON public.complaints;
CREATE POLICY "Users can read own complaints"
  ON public.complaints
  FOR SELECT
  USING (auth.uid()::text = citizen_id);

-- Citizens can insert their own complaints
DROP POLICY IF EXISTS "Users can insert own complaints" ON public.complaints;
CREATE POLICY "Users can insert own complaints"
  ON public.complaints
  FOR INSERT
  WITH CHECK (auth.uid()::text = citizen_id);

-- Citizens can update their own complaints
DROP POLICY IF EXISTS "Users can update own complaints" ON public.complaints;
CREATE POLICY "Users can update own complaints"
  ON public.complaints
  FOR UPDATE
  USING (auth.uid()::text = citizen_id);

-- MPs can read all complaints (cast auth.uid() to text for VARCHAR comparison)
DROP POLICY IF EXISTS "MPs can read all complaints" ON public.complaints;
CREATE POLICY "MPs can read all complaints"
  ON public.complaints
  FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id::text = auth.uid()::text AND role = 'mp')
  );

-- 9. Voting items table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.voting_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT DEFAULT '',
  category      TEXT NOT NULL DEFAULT 'other',
  support_count INTEGER DEFAULT 0,
  total_votes   INTEGER DEFAULT 0,
  deadline      TIMESTAMPTZ,
  status        TEXT DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.voting_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read voting items" ON public.voting_items;
CREATE POLICY "Anyone can read voting items"
  ON public.voting_items
  FOR SELECT
  USING (true);

-- 10. Notifications table
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  message    TEXT DEFAULT '',
  type       TEXT DEFAULT 'system',
  read       BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications
  FOR SELECT
  USING (auth.uid() = user_id);

-- =============================================================================
-- END OF MIGRATION
-- =============================================================================
