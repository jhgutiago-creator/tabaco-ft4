export interface UserProfile {
  id: string;
  nome_completo?: string;
  data_nascimento?: string;
  idade?: number;
  sexo?: 'Masculino' | 'Feminino' | 'Outro';
  cpf?: string;
  endereco?: string;
  cidade_estado?: string;
  telefone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface AnamneseTabagismo {
  id: string;
  user_id: string;
  idade_comecou?: number;
  tempo_total_anos?: number;
  quantidade_atual_dia?: number;
  maior_quantidade_dia?: number;
  ja_tentou_parar: boolean;
  quantas_vezes_tentou?: number;
  metodos_utilizados?: string[];
  motivo_recaida?: string;
  primeira_vontade_acordar?: 'Menos de 5 min' | '6-30 min' | '31-60 min' | 'Mais de 1h';
  created_at: string;
  updated_at: string;
}

export interface AnamneseSaude {
  id: string;
  user_id: string;
  doencas_atuais?: string[];
  medicamentos_uso?: string;
  alergias_conhecidas?: string;
  consumo_alcool?: 'Não' | 'Socialmente' | 'Frequentemente';
  outras_drogas: boolean;
  outras_drogas_quais?: string;
  consumo_cafeina: boolean;
  cafeina_quantidade_dia?: string;
  created_at: string;
  updated_at: string;
}

export interface AnamneseMotivacao {
  id: string;
  user_id: string;
  motivo_principal?: string;
  nivel_motivacao?: number;
  apoio_familia: boolean;
  ansioso_sem_fumar: boolean;
  usa_cigarro_em?: string[];
  acompanhamento_psicologico: boolean;
  data_desejada_parar?: string;
  expectativas_programa?: string;
  created_at: string;
  updated_at: string;
}

export interface AnamneseFagerstrom {
  id: string;
  user_id: string;
  tempo_apos_acordar?: '≤ 5 min' | '6–30 min' | '31–60 min' | '> 60 min';
  dificil_nao_fumar: boolean;
  cigarro_mais_dificil?: 'O primeiro da manhã' | 'Outros';
  quantos_cigarros_dia?: '10 ou menos' | '11–20' | '21–30' | '31 ou mais';
  fuma_mais_manha: boolean;
  fuma_doente: boolean;
  pontuacao_total: number;
  nivel_dependencia?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgramWeek {
  id: number;
  week_number: number;
  title: string;
  theme: string;
  lesson: string;
  circle: string;
  activity: string;
  checkin: string;
  task_title: string;
  task_description: string;
  tips: string[];
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  week_number: number;
  completed: boolean;
  completed_at?: string;
  current_week: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyReport {
  id: string;
  user_id: string;
  report_date: string;
  symptoms: string[];
  diary_text?: string;
  mood_level?: number;
  craving_level?: number;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  quit_date?: string;
  days_smoke_free: number;
  money_saved: number;
  cigarettes_not_smoked: number;
  aulas_assistidas: number;
  rodas_participadas: number;
  atividades_concluidas: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time: string;
  event_type: 'aula' | 'roda' | 'atividade';
  week_number?: number;
  location: string;
  max_participants?: number;
  created_at: string;
}

export interface EventAttendance {
  id: string;
  user_id: string;
  event_id: string;
  attended: boolean;
  attended_at?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
  user_profiles?: UserProfile;
}