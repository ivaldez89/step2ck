-- Flashcards Migration
-- Run this in Supabase SQL Editor
-- This creates tables for flashcards, spaced repetition, and review sessions

-- ============================================
-- 1. FLASHCARDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  schema_version VARCHAR(10) DEFAULT '1.0',

  -- Content
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  explanation TEXT,
  references TEXT[], -- Array of reference strings
  images TEXT[], -- Array of image URLs

  -- Metadata
  tags TEXT[] DEFAULT '{}',
  system VARCHAR(50) NOT NULL DEFAULT 'General',
  topic VARCHAR(100) NOT NULL DEFAULT 'General',
  difficulty VARCHAR(20) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_clinical_vignette BOOLEAN DEFAULT false,
  source VARCHAR(255),
  usmle_step INTEGER CHECK (usmle_step IN (1, 2, 3)),
  rotation VARCHAR(50),

  -- Concept-based learning
  concept_code VARCHAR(100),
  clinical_decision TEXT,
  qbank_uworld TEXT[],
  qbank_amboss TEXT[],
  related_concepts TEXT[],

  -- Spaced Repetition (FSRS algorithm)
  sr_state VARCHAR(20) DEFAULT 'new' CHECK (sr_state IN ('new', 'learning', 'review', 'relearning')),
  sr_interval REAL DEFAULT 0, -- days until next review
  sr_ease REAL DEFAULT 2.5, -- easiness factor
  sr_reps INTEGER DEFAULT 0, -- successful reviews count
  sr_lapses INTEGER DEFAULT 0, -- times forgotten
  sr_next_review TIMESTAMPTZ DEFAULT NOW(),
  sr_last_review TIMESTAMPTZ,
  sr_stability REAL DEFAULT 0, -- FSRS stability
  sr_difficulty REAL DEFAULT 0, -- FSRS difficulty (0-1)

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's flashcards
CREATE INDEX idx_flashcards_user ON flashcards(user_id);

-- Index for due cards (most important query)
CREATE INDEX idx_flashcards_due ON flashcards(user_id, sr_next_review)
  WHERE sr_state != 'new';

-- Index for filtering by system
CREATE INDEX idx_flashcards_system ON flashcards(user_id, system);

-- Index for filtering by state
CREATE INDEX idx_flashcards_state ON flashcards(user_id, sr_state);

-- Index for concept code lookup
CREATE INDEX idx_flashcards_concept ON flashcards(concept_code)
  WHERE concept_code IS NOT NULL;

-- Full-text search on content
CREATE INDEX idx_flashcards_search ON flashcards
  USING GIN (to_tsvector('english', front || ' ' || back));

-- ============================================
-- 2. REVIEW SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS review_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Session timing
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,

  -- Session stats
  cards_reviewed INTEGER DEFAULT 0,
  cards_correct INTEGER DEFAULT 0,
  cards_failed INTEGER DEFAULT 0,
  total_time_ms INTEGER DEFAULT 0, -- Total time spent in session

  -- Session metadata
  session_type VARCHAR(50) DEFAULT 'review', -- 'review', 'new', 'mixed', 'cram'
  deck_filter JSONB, -- Stores the filter settings used

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user's sessions
CREATE INDEX idx_review_sessions_user ON review_sessions(user_id, started_at DESC);

-- Index for sessions by date (for stats)
CREATE INDEX idx_review_sessions_date ON review_sessions(user_id, DATE(started_at));

-- ============================================
-- 3. REVIEW RECORDS TABLE (individual card reviews)
-- ============================================
CREATE TABLE IF NOT EXISTS review_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES review_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,

  -- Review data
  rating VARCHAR(10) NOT NULL CHECK (rating IN ('again', 'hard', 'good', 'easy')),
  reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  time_spent_ms INTEGER DEFAULT 0,

  -- State transition
  previous_state VARCHAR(20) NOT NULL,
  new_state VARCHAR(20) NOT NULL,

  -- Snapshot of SR values at review time (for analytics)
  sr_interval_before REAL,
  sr_interval_after REAL,
  sr_ease_before REAL,
  sr_ease_after REAL
);

-- Index for session's records
CREATE INDEX idx_review_records_session ON review_records(session_id);

-- Index for card's review history
CREATE INDEX idx_review_records_card ON review_records(card_id, reviewed_at DESC);

-- Index for user's reviews by date
CREATE INDEX idx_review_records_user_date ON review_records(user_id, DATE(reviewed_at));

-- ============================================
-- 4. STUDY STREAKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS study_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Current streak
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,

  -- Stats
  total_study_days INTEGER DEFAULT 0,
  total_cards_reviewed INTEGER DEFAULT 0,
  total_study_time_ms BIGINT DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for streak lookup
CREATE INDEX idx_study_streaks_user ON study_streaks(user_id);

-- ============================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_streaks ENABLE ROW LEVEL SECURITY;

-- FLASHCARDS POLICIES

-- Users can only see their own flashcards
CREATE POLICY "Users can view own flashcards"
  ON flashcards FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create their own flashcards
CREATE POLICY "Users can create own flashcards"
  ON flashcards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own flashcards
CREATE POLICY "Users can update own flashcards"
  ON flashcards FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own flashcards
CREATE POLICY "Users can delete own flashcards"
  ON flashcards FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- REVIEW SESSIONS POLICIES

CREATE POLICY "Users can view own review sessions"
  ON review_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own review sessions"
  ON review_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own review sessions"
  ON review_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- REVIEW RECORDS POLICIES

CREATE POLICY "Users can view own review records"
  ON review_records FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own review records"
  ON review_records FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- STUDY STREAKS POLICIES

CREATE POLICY "Users can view own streaks"
  ON study_streaks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own streaks"
  ON study_streaks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own streaks"
  ON study_streaks FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================
-- 6. TRIGGERS FOR UPDATED_AT
-- ============================================

-- Flashcards updated_at trigger
CREATE TRIGGER update_flashcards_timestamp
  BEFORE UPDATE ON flashcards
  FOR EACH ROW
  EXECUTE FUNCTION update_study_session_timestamp(); -- Reuse existing function

-- Study streaks updated_at trigger
CREATE TRIGGER update_study_streaks_timestamp
  BEFORE UPDATE ON study_streaks
  FOR EACH ROW
  EXECUTE FUNCTION update_study_session_timestamp();

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Function to get user's study stats
CREATE OR REPLACE FUNCTION get_user_study_stats(p_user_id UUID)
RETURNS TABLE (
  total_cards BIGINT,
  new_cards BIGINT,
  learning_cards BIGINT,
  review_cards BIGINT,
  due_today BIGINT,
  total_reviews BIGINT,
  average_ease REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_cards,
    COUNT(*) FILTER (WHERE sr_state = 'new')::BIGINT as new_cards,
    COUNT(*) FILTER (WHERE sr_state IN ('learning', 'relearning'))::BIGINT as learning_cards,
    COUNT(*) FILTER (WHERE sr_state = 'review')::BIGINT as review_cards,
    COUNT(*) FILTER (WHERE sr_next_review <= NOW())::BIGINT as due_today,
    SUM(sr_reps)::BIGINT as total_reviews,
    AVG(sr_ease)::REAL as average_ease
  FROM flashcards
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update streak after study session
CREATE OR REPLACE FUNCTION update_study_streak(p_user_id UUID, p_cards_reviewed INTEGER, p_time_ms INTEGER)
RETURNS void AS $$
DECLARE
  v_last_date DATE;
  v_today DATE := CURRENT_DATE;
  v_current_streak INTEGER;
BEGIN
  -- Get or create streak record
  INSERT INTO study_streaks (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Get current values
  SELECT last_study_date, current_streak
  INTO v_last_date, v_current_streak
  FROM study_streaks
  WHERE user_id = p_user_id;

  -- Update streak based on last study date
  IF v_last_date IS NULL OR v_last_date < v_today - 1 THEN
    -- Streak broken or first time
    v_current_streak := 1;
  ELSIF v_last_date = v_today - 1 THEN
    -- Continuing streak
    v_current_streak := v_current_streak + 1;
  END IF;
  -- If v_last_date = v_today, streak stays the same

  -- Update the record
  UPDATE study_streaks
  SET
    current_streak = v_current_streak,
    longest_streak = GREATEST(longest_streak, v_current_streak),
    last_study_date = v_today,
    total_study_days = total_study_days + CASE WHEN v_last_date != v_today THEN 1 ELSE 0 END,
    total_cards_reviewed = total_cards_reviewed + p_cards_reviewed,
    total_study_time_ms = total_study_time_ms + p_time_ms,
    updated_at = NOW()
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. REALTIME (Optional - enable if needed)
-- ============================================

-- Uncomment if you want realtime updates for flashcards
-- ALTER PUBLICATION supabase_realtime ADD TABLE flashcards;

-- ============================================
-- DONE! Run this SQL in Supabase SQL Editor
-- ============================================
