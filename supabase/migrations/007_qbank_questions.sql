-- ============================================
-- QBANK QUESTIONS MIGRATION
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. QUESTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Unique identifiers
  question_id TEXT UNIQUE NOT NULL,
  concept_id TEXT NOT NULL,

  -- Classification
  batch TEXT NOT NULL,
  system TEXT NOT NULL,

  -- Question content
  stem TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,

  -- Cognitive tagging
  cognitive_error TEXT,

  -- Metadata
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  source TEXT NOT NULL DEFAULT 'internal',
  tags TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'retired')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 2. INDEXES
-- ============================================
CREATE INDEX idx_questions_question_id ON questions(question_id);
CREATE INDEX idx_questions_concept_id ON questions(concept_id);
CREATE INDEX idx_questions_batch ON questions(batch);
CREATE INDEX idx_questions_system ON questions(system);
CREATE INDEX idx_questions_cognitive_error ON questions(cognitive_error) WHERE cognitive_error IS NOT NULL;
CREATE INDEX idx_questions_status ON questions(status);
CREATE INDEX idx_questions_tags ON questions USING GIN(tags);

-- ============================================
-- 3. UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_questions_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_questions_timestamp();

-- ============================================
-- 4. ROW LEVEL SECURITY
-- ============================================
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active questions only
CREATE POLICY "Authenticated users can read active questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (status = 'active');

-- No INSERT/UPDATE/DELETE for regular users
-- Service role bypasses RLS for admin operations

-- ============================================
-- 5. QUESTION ATTEMPTS TABLE (for tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,

  -- Response data
  selected_option TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent_ms INTEGER,

  -- Context
  source TEXT DEFAULT 'qbank' CHECK (source IN ('qbank', 'pcs')),
  pcs_slug TEXT,

  -- Cognitive tracking (copied from question for analytics)
  cognitive_error TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_attempts_user_id ON question_attempts(user_id);
CREATE INDEX idx_attempts_question_id ON question_attempts(question_id);
CREATE INDEX idx_attempts_cognitive_error ON question_attempts(cognitive_error) WHERE cognitive_error IS NOT NULL;
CREATE INDEX idx_attempts_created_at ON question_attempts(created_at);
CREATE INDEX idx_attempts_user_correct ON question_attempts(user_id, is_correct);

-- RLS for question_attempts
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own attempts"
  ON question_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts"
  ON question_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- DONE! Table structure complete.
-- ============================================
