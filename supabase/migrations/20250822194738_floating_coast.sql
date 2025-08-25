/*
  # Create anamnese and smoking history tables

  1. New Tables
    - `anamnese_tabagismo`
      - Complete smoking history and health information
      - Links to user_profiles
    - `anamnese_saude`
      - Health conditions and medications
    - `anamnese_motivacao`
      - Motivation and psychological aspects
    - `anamnese_fagerstrom`
      - Fagerström test results

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Histórico de Tabagismo
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

-- Histórico de Saúde
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

-- Motivação e Aspectos Psicológicos
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

-- Teste Fagerström
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

-- Enable RLS
ALTER TABLE anamnese_tabagismo ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_motivacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE anamnese_fagerstrom ENABLE ROW LEVEL SECURITY;

-- Policies for anamnese_tabagismo
CREATE POLICY "Users can manage own smoking history"
  ON anamnese_tabagismo
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for anamnese_saude
CREATE POLICY "Users can manage own health data"
  ON anamnese_saude
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for anamnese_motivacao
CREATE POLICY "Users can manage own motivation data"
  ON anamnese_motivacao
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Policies for anamnese_fagerstrom
CREATE POLICY "Users can manage own fagerstrom data"
  ON anamnese_fagerstrom
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());