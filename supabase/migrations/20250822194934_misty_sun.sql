/*
  # Insert sample events data

  1. Sample Data
    - Insert events for the current month
    - Mix of aulas, rodas, and atividades
    - Realistic schedule for São Paulo location
*/

INSERT INTO events (title, description, event_date, event_time, event_type, week_number, location) VALUES 
('Roda: Minha história com a substância', 'Compartilhe sua jornada pessoal com o grupo', '2025-01-15', '19:00', 'roda', 1, 'São Paulo, SP'),
('Aula: Como o vício age no cérebro', 'Entenda os mecanismos neurológicos do vício', '2025-01-17', '20:00', 'aula', 1, 'São Paulo, SP'),
('Atividade: Diário de hábitos', 'Registre seus padrões de comportamento', '2025-01-20', '18:00', 'atividade', 1, 'São Paulo, SP'),
('Roda: O que me motiva a mudar?', 'Compartilhe suas motivações pessoais', '2025-01-22', '19:00', 'roda', 2, 'São Paulo, SP'),
('Aula: O impacto na saúde, família e vida', 'Explore os efeitos do tabagismo', '2025-01-24', '20:00', 'aula', 2, 'São Paulo, SP'),
('Atividade: Lista de motivos pessoais', 'Crie sua lista de motivações', '2025-01-27', '18:00', 'atividade', 2, 'São Paulo, SP'),
('Roda: Compartilhando técnicas que ajudam', 'Troque experiências sobre estratégias', '2025-01-29', '19:00', 'roda', 3, 'São Paulo, SP'),
('Aula: Estratégias para crises e fissuras', 'Aprenda técnicas para superar fissuras', '2025-01-31', '20:00', 'aula', 3, 'São Paulo, SP'),
('Atividade: Respiração diafragmática', 'Pratique técnicas de respiração', '2025-02-03', '18:00', 'atividade', 3, 'São Paulo, SP'),
('Roda: Vitórias da semana', 'Celebre suas conquistas', '2025-02-05', '19:00', 'roda', 4, 'São Paulo, SP'),
('Aula: Alimentação e sono como aliados', 'Aprenda sobre nutrição e descanso', '2025-02-07', '20:00', 'aula', 4, 'São Paulo, SP'),
('Atividade: Desafio 72h sem uso', 'Teste sua determinação', '2025-02-10', '18:00', 'atividade', 4, 'São Paulo, SP');