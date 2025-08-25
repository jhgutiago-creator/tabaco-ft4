/*
  # Create program tracking and user progress tables

  1. New Tables
    - `program_weeks`
      - Static data for all 12 weeks of the program
    - `user_progress`
      - Track user progress through weeks
    - `daily_reports`
      - Daily symptom and diary reports
    - `user_stats`
      - User statistics and achievements

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Program weeks (static data)
CREATE TABLE IF NOT EXISTS program_weeks (
  id integer PRIMARY KEY,
  week_number integer UNIQUE NOT NULL,
  title text NOT NULL,
  theme text NOT NULL,
  lesson text NOT NULL,
  circle text NOT NULL,
  activity text NOT NULL,
  checkin text NOT NULL,
  task_title text NOT NULL,
  task_description text NOT NULL,
  tips text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User progress through program
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  week_number integer REFERENCES program_weeks(week_number),
  completed boolean DEFAULT false,
  completed_at timestamptz,
  current_week boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_number)
);

-- Daily reports (symptoms and diary)
CREATE TABLE IF NOT EXISTS daily_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  report_date date DEFAULT CURRENT_DATE,
  symptoms text[] DEFAULT '{}',
  diary_text text,
  mood_level integer CHECK (mood_level >= 1 AND mood_level <= 10),
  craving_level integer CHECK (craving_level >= 1 AND craving_level <= 10),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, report_date)
);

-- User statistics and achievements
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  quit_date date,
  days_smoke_free integer DEFAULT 0,
  money_saved decimal(10,2) DEFAULT 0,
  cigarettes_not_smoked integer DEFAULT 0,
  aulas_assistidas integer DEFAULT 0,
  rodas_participadas integer DEFAULT 0,
  atividades_concluidas integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE program_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Policies for program_weeks (read-only for all authenticated users)
CREATE POLICY "Authenticated users can read program weeks"
  ON program_weeks
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for user_progress
CREATE POLICY "Users can manage own progress"
  ON user_progress
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for daily_reports
CREATE POLICY "Users can manage own daily reports"
  ON daily_reports
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for user_stats
CREATE POLICY "Users can manage own stats"
  ON user_stats
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());