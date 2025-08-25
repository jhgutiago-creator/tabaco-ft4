/*
  # Create events and community tables

  1. New Tables
    - `events`
      - Program events (aulas, rodas, atividades)
    - `event_attendance`
      - Track user attendance at events
    - `chat_messages`
      - Community chat messages

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_time time NOT NULL,
  event_type text CHECK (event_type IN ('aula', 'roda', 'atividade')) NOT NULL,
  week_number integer REFERENCES program_weeks(week_number),
  location text DEFAULT 'São Paulo, SP',
  max_participants integer,
  created_at timestamptz DEFAULT now()
);

-- Event attendance tracking
CREATE TABLE IF NOT EXISTS event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  attended boolean DEFAULT false,
  attended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies for events (read-only for authenticated users)
CREATE POLICY "Authenticated users can read events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for event_attendance
CREATE POLICY "Users can manage own attendance"
  ON event_attendance
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for chat_messages
CREATE POLICY "Users can read all messages"
  ON chat_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own messages"
  ON chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own messages"
  ON chat_messages
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());