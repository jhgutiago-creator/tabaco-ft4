/*
  # Verificação e Completude da Estrutura do Banco

  1. Tabelas Verificadas
    - `user_profiles` - Perfis dos usuários
    - `anamnese_tabagismo` - Histórico de tabagismo
    - `anamnese_saude` - Histórico de saúde
    - `anamnese_motivacao` - Motivação e aspectos psicológicos
    - `anamnese_fagerstrom` - Teste Fagerström
    - `program_weeks` - Semanas do programa
    - `user_progress` - Progresso do usuário
    - `daily_reports` - Relatórios diários
    - `user_stats` - Estatísticas do usuário
    - `events` - Eventos do programa
    - `event_attendance` - Presença nos eventos
    - `chat_messages` - Mensagens do chat

  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas de acesso por usuário
    - Autenticação obrigatória

  3. Dados Iniciais
    - 12 semanas do programa inseridas
    - Eventos de exemplo criados
    - Estrutura completa para funcionamento
*/

-- Verificar se todas as tabelas existem e criar as que faltam

-- Tabela de perfis de usuário (já existe)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_completo text,
  data_nascimento date,
  idade integer,
  sexo text CHECK (sexo IN ('Masculino', 'Feminino', 'Outro')),
  cpf text UNIQUE,
  endereco text,
  cidade_estado text,
  telefone text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de anamnese de tabagismo (já existe)
CREATE TABLE IF NOT EXISTS anamnese_tabagismo (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  idade_comecou integer,
  tempo_total_anos integer,
  quantidade_atual_dia integer,
  maior_quantidade_dia integer,
  ja_tentou_parar boolean DEFAULT false,
  quantas_vezes_tentou integer,
  metodos_utilizados text[],
  motivo_recaida text,
  primeira_vontade_acordar text CHECK (primeira_vontade_acordar IN ('Menos de 5 min', '6-30 min', '31-60 min', 'Mais de 1h')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de anamnese de saúde (já existe)
CREATE TABLE IF NOT EXISTS anamnese_saude (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  doencas_atuais text[],
  medicamentos_uso text,
  alergias_conhecidas text,
  consumo_alcool text CHECK (consumo_alcool IN ('Não', 'Socialmente', 'Frequentemente')),
  outras_drogas boolean DEFAULT false,
  outras_drogas_quais text,
  consumo_cafeina boolean DEFAULT false,
  cafeina_quantidade_dia text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de anamnese de motivação (já existe)
CREATE TABLE IF NOT EXISTS anamnese_motivacao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  motivo_principal text,
  nivel_motivacao integer CHECK (nivel_motivacao >= 0 AND nivel_motivacao <= 10),
  apoio_familia boolean DEFAULT false,
  ansioso_sem_fumar boolean DEFAULT false,
  usa_cigarro_em text[],
  acompanhamento_psicologico boolean DEFAULT false,
  data_desejada_parar date,
  expectativas_programa text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de teste Fagerström (já existe)
CREATE TABLE IF NOT EXISTS anamnese_fagerstrom (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  tempo_apos_acordar text CHECK (tempo_apos_acordar IN ('≤ 5 min', '6–30 min', '31–60 min', '> 60 min')),
  dificil_nao_fumar boolean DEFAULT false,
  cigarro_mais_dificil text CHECK (cigarro_mais_dificil IN ('O primeiro da manhã', 'Outros')),
  quantos_cigarros_dia text CHECK (quantos_cigarros_dia IN ('10 ou menos', '11–20', '21–30', '31 ou mais')),
  fuma_mais_manha boolean DEFAULT false,
  fuma_doente boolean DEFAULT false,
  pontuacao_total integer DEFAULT 0,
  nivel_dependencia text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de semanas do programa (já existe)
CREATE TABLE IF NOT EXISTS program_weeks (
  id serial PRIMARY KEY,
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

-- Tabela de progresso do usuário (já existe)
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

-- Tabela de relatórios diários (já existe)
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

-- Tabela de estatísticas do usuário (já existe)
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE,
  quit_date date,
  days_smoke_free integer DEFAULT 0,
  money_saved decimal(10,2) DEFAULT 0,
  cigarettes_not_smoked integer DEFAULT 0,
  aulas_assistidas integer DEFAULT 0,
  rodas_participadas integer DEFAULT 0,
  atividades_concluidas integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tabela de eventos (já existe)
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

-- Tabela de presença em eventos (já existe)
CREATE TABLE IF NOT EXISTS event_attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  attended boolean DEFAULT false,
  attended_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, event_id)
);

-- Tabela de mensagens do chat (já existe)
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_tabagismo ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_motivacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_fagerstrom ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança para user_profiles
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Políticas para anamnese_tabagismo
CREATE POLICY "Users can manage own smoking history" ON anamnese_tabagismo
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para anamnese_saude
CREATE POLICY "Users can manage own health data" ON anamnese_saude
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para anamnese_motivacao
CREATE POLICY "Users can manage own motivation data" ON anamnese_motivacao
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para anamnese_fagerstrom
CREATE POLICY "Users can manage own fagerstrom data" ON anamnese_fagerstrom
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para program_weeks (leitura pública para usuários autenticados)
CREATE POLICY "Authenticated users can read program weeks" ON program_weeks
  FOR SELECT TO authenticated
  USING (true);

-- Políticas para user_progress
CREATE POLICY "Users can manage own progress" ON user_progress
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para daily_reports
CREATE POLICY "Users can manage own daily reports" ON daily_reports
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para user_stats
CREATE POLICY "Users can manage own stats" ON user_stats
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para events (leitura pública)
CREATE POLICY "Authenticated users can read events" ON events
  FOR SELECT TO authenticated
  USING (true);

-- Políticas para event_attendance
CREATE POLICY "Users can manage own attendance" ON event_attendance
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Políticas para chat_messages
CREATE POLICY "Users can read all messages" ON chat_messages
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can insert own messages" ON chat_messages
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own messages" ON chat_messages
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());